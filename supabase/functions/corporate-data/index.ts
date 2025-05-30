
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { searchQuery } = await req.json()
    
    if (!searchQuery) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const apiKey = Deno.env.get('DATA_GOV_IN_API_KEY')
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Searching for corporate data: ${searchQuery}`)

    // Try multiple MCA datasets for company information
    const mcaDatasets = [
      '95b4c13f-4bfa-4411-8b21-fea67ca8159a', // MCA Company Master Data
      'b5a8b1d5-a669-4fed-8e22-9ee51bc3a69c', // MCA Annual Return Data  
      'f436b404-52e1-462b-9b4f-f64c0e96398e'  // MCA Company Details
    ]

    let companyData = null
    let foundDataset = null

    // Try each dataset until we find company data
    for (const datasetId of mcaDatasets) {
      try {
        console.log(`Trying dataset: ${datasetId}`)
        
        // Try exact company name search first
        let searchUrl = `https://api.data.gov.in/resource/${datasetId}?api-key=${apiKey}&format=json&filters[company_name]=${encodeURIComponent(searchQuery)}&limit=10`
        console.log(`Making request to: ${searchUrl}`)
        
        let response = await fetch(searchUrl)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`Dataset ${datasetId} response:`, JSON.stringify(data, null, 2))
          
          if (data.records && data.records.length > 0) {
            companyData = data.records[0]
            foundDataset = datasetId
            console.log('Found company data in dataset:', datasetId)
            break
          }
        }

        // If no exact match, try partial search
        searchUrl = `https://api.data.gov.in/resource/${datasetId}?api-key=${apiKey}&format=json&q=${encodeURIComponent(searchQuery)}&limit=10`
        console.log(`Trying partial search: ${searchUrl}`)
        
        response = await fetch(searchUrl)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`Partial search response for ${datasetId}:`, JSON.stringify(data, null, 2))
          
          if (data.records && data.records.length > 0) {
            // Look for the closest match
            const exactMatch = data.records.find(record => 
              (record.company_name || record.COMPANY_NAME || '').toLowerCase().includes(searchQuery.toLowerCase())
            )
            
            if (exactMatch) {
              companyData = exactMatch
              foundDataset = datasetId
              console.log('Found partial match in dataset:', datasetId)
              break
            }
          }
        }
      } catch (error) {
        console.error(`Error with dataset ${datasetId}:`, error)
        continue
      }
    }

    // If no data found in MCA datasets, try a general search
    if (!companyData) {
      console.log('No data found in MCA datasets, trying general search...')
      
      const generalSearchUrl = `https://api.data.gov.in/catalog.json?q=${encodeURIComponent(searchQuery)}&format=json&limit=10`
      console.log(`General search: ${generalSearchUrl}`)
      
      try {
        const generalResponse = await fetch(generalSearchUrl)
        if (generalResponse.ok) {
          const generalData = await generalResponse.json()
          console.log('General search results:', JSON.stringify(generalData, null, 2))
        }
      } catch (error) {
        console.error('General search error:', error)
      }

      return new Response(
        JSON.stringify({ 
          error: 'No company found with that name or CIN',
          suggestion: 'Please try searching with the exact company name as registered with MCA, or use the CIN number',
          searchedQuery: searchQuery,
          availableDatasets: mcaDatasets
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Transform the found data
    const corporateData = {
      identity: {
        companyName: companyData.company_name || companyData.COMPANY_NAME || companyData.name || searchQuery,
        cin: companyData.cin || companyData.CIN || companyData.corporate_identification_number || 'N/A',
        registrationNumber: companyData.registration_number || companyData.REGISTRATION_NUMBER || companyData.llpin || 'N/A',
        dateOfIncorporation: companyData.date_of_incorporation || companyData.DATE_OF_INCORPORATION || companyData.incorporation_date || 'N/A',
        rocCode: companyData.roc_code || companyData.ROC_CODE || companyData.roc || 'N/A',
        status: companyData.company_status || companyData.COMPANY_STATUS || companyData.status || 'Unknown',
        classification: companyData.company_class || companyData.COMPANY_CLASS || companyData.classification || 'N/A',
        category: companyData.company_category || companyData.COMPANY_CATEGORY || companyData.category || 'N/A'
      },
      financial: {
        authorizedCapital: parseFloat(companyData.authorized_cap || companyData.AUTHORIZED_CAP || companyData.authorized_capital || '0') || 0,
        paidUpCapital: parseFloat(companyData.paidup_capital || companyData.PAIDUP_CAPITAL || companyData.paid_up_capital || '0') || 0,
        netWorth: parseFloat(companyData.net_worth || companyData.NET_WORTH || '0') || 0,
        totalAssets: parseFloat(companyData.total_assets || companyData.TOTAL_ASSETS || '0') || 0,
        totalLiabilities: parseFloat(companyData.total_liabilities || companyData.TOTAL_LIABILITIES || '0') || 0,
        revenue: parseFloat(companyData.revenue || companyData.REVENUE || companyData.turnover || '0') || 0,
        charges: []
      },
      directors: [],
      compliance: {
        lastFilingDate: companyData.latest_return_date || companyData.LATEST_RETURN_DATE || companyData.last_agm_date || 'N/A',
        annualReturnStatus: (companyData.latest_return_date || companyData.LATEST_RETURN_DATE || companyData.last_agm_date) ? 'Filed' : 'Unknown',
        filings: []
      },
      contact: {
        registeredAddress: [
          companyData.registered_office_address || companyData.REGISTERED_OFFICE_ADDRESS || companyData.address,
          companyData.state || companyData.STATE,
          companyData.pincode || companyData.PINCODE || companyData.pin_code
        ].filter(Boolean).join(', ') || 'N/A',
        email: companyData.email || companyData.EMAIL || 'N/A',
        website: companyData.website || companyData.WEBSITE || 'N/A',
        phone: companyData.phone || companyData.PHONE || companyData.telephone || 'N/A'
      },
      metadata: {
        datasetUsed: foundDataset,
        searchQuery: searchQuery,
        rawData: companyData
      }
    }

    console.log('Final transformed corporate data:', JSON.stringify(corporateData, null, 2))

    return new Response(
      JSON.stringify(corporateData),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error fetching corporate data:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch corporate data',
        details: error.message
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
