
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

    // Use the correct MCA dataset ID for company information
    const mcaDatasetId = '6176ee09-3d56-4a3b-8115-21841576b2f6'
    const searchUrl = `https://api.data.gov.in/resource/${mcaDatasetId}?api-key=${apiKey}&format=json&filters[company_name]=${encodeURIComponent(searchQuery)}&limit=10`
    
    console.log(`Making request to: ${searchUrl}`)
    
    const searchResponse = await fetch(searchUrl)
    
    if (!searchResponse.ok) {
      console.error(`Search API error: ${searchResponse.status} ${searchResponse.statusText}`)
      const errorText = await searchResponse.text()
      console.error(`Error response body: ${errorText}`)
      return new Response(
        JSON.stringify({ error: `API request failed: ${searchResponse.statusText}` }),
        { status: searchResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const searchData = await searchResponse.json()
    console.log('Search response:', JSON.stringify(searchData, null, 2))

    // Check if we have records in the response
    if (!searchData.records || searchData.records.length === 0) {
      // Try alternative search approaches
      console.log('No records found with company_name filter, trying alternative search...')
      
      // Try searching with a more flexible approach
      const alternativeUrl = `https://api.data.gov.in/resource/${mcaDatasetId}?api-key=${apiKey}&format=json&q=${encodeURIComponent(searchQuery)}&limit=10`
      console.log(`Trying alternative search: ${alternativeUrl}`)
      
      const altResponse = await fetch(alternativeUrl)
      if (altResponse.ok) {
        const altData = await altResponse.json()
        console.log('Alternative search response:', JSON.stringify(altData, null, 2))
        
        if (altData.records && altData.records.length > 0) {
          const companyRecord = altData.records[0]
          
          // Transform the API data to match our interface
          const corporateData = {
            identity: {
              companyName: companyRecord.company_name || companyRecord.COMPANY_NAME || searchQuery,
              cin: companyRecord.cin || companyRecord.CIN || 'N/A',
              registrationNumber: companyRecord.registration_number || companyRecord.REGISTRATION_NUMBER || 'N/A',
              dateOfIncorporation: companyRecord.date_of_incorporation || companyRecord.DATE_OF_INCORPORATION || 'N/A',
              rocCode: companyRecord.roc_code || companyRecord.ROC_CODE || 'N/A',
              status: companyRecord.company_status || companyRecord.COMPANY_STATUS || 'Unknown',
              classification: companyRecord.company_class || companyRecord.COMPANY_CLASS || 'N/A',
              category: companyRecord.company_category || companyRecord.COMPANY_CATEGORY || 'N/A'
            },
            financial: {
              authorizedCapital: parseFloat(companyRecord.authorized_cap || companyRecord.AUTHORIZED_CAP || '0') || 0,
              paidUpCapital: parseFloat(companyRecord.paidup_capital || companyRecord.PAIDUP_CAPITAL || '0') || 0,
              netWorth: 0,
              totalAssets: 0,
              totalLiabilities: 0,
              revenue: 0,
              charges: []
            },
            directors: [],
            compliance: {
              lastFilingDate: companyRecord.latest_return_date || companyRecord.LATEST_RETURN_DATE || 'N/A',
              annualReturnStatus: (companyRecord.latest_return_date || companyRecord.LATEST_RETURN_DATE) ? 'Filed' : 'Unknown',
              filings: []
            },
            contact: {
              registeredAddress: [
                companyRecord.registered_office_address || companyRecord.REGISTERED_OFFICE_ADDRESS,
                companyRecord.state || companyRecord.STATE,
                companyRecord.pincode || companyRecord.PINCODE
              ].filter(Boolean).join(', ') || 'N/A',
              email: companyRecord.email || companyRecord.EMAIL || 'N/A',
              website: companyRecord.website || companyRecord.WEBSITE || 'N/A',
              phone: companyRecord.phone || companyRecord.PHONE || 'N/A'
            }
          }

          console.log('Transformed corporate data:', corporateData)

          return new Response(
            JSON.stringify(corporateData),
            { 
              status: 200, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
      }
      
      // If still no results, return a structured error
      return new Response(
        JSON.stringify({ 
          error: 'No company found with that name or CIN',
          suggestion: 'Try searching with the exact company name or CIN number'
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const companyRecord = searchData.records[0]
    
    // Transform the API data to match our interface
    const corporateData = {
      identity: {
        companyName: companyRecord.company_name || companyRecord.COMPANY_NAME || searchQuery,
        cin: companyRecord.cin || companyRecord.CIN || 'N/A',
        registrationNumber: companyRecord.registration_number || companyRecord.REGISTRATION_NUMBER || 'N/A',
        dateOfIncorporation: companyRecord.date_of_incorporation || companyRecord.DATE_OF_INCORPORATION || 'N/A',
        rocCode: companyRecord.roc_code || companyRecord.ROC_CODE || 'N/A',
        status: companyRecord.company_status || companyRecord.COMPANY_STATUS || 'Unknown',
        classification: companyRecord.company_class || companyRecord.COMPANY_CLASS || 'N/A',
        category: companyRecord.company_category || companyRecord.COMPANY_CATEGORY || 'N/A'
      },
      financial: {
        authorizedCapital: parseFloat(companyRecord.authorized_cap || companyRecord.AUTHORIZED_CAP || '0') || 0,
        paidUpCapital: parseFloat(companyRecord.paidup_capital || companyRecord.PAIDUP_CAPITAL || '0') || 0,
        netWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        revenue: 0,
        charges: []
      },
      directors: [],
      compliance: {
        lastFilingDate: companyRecord.latest_return_date || companyRecord.LATEST_RETURN_DATE || 'N/A',
        annualReturnStatus: (companyRecord.latest_return_date || companyRecord.LATEST_RETURN_DATE) ? 'Filed' : 'Unknown',
        filings: []
      },
      contact: {
        registeredAddress: [
          companyRecord.registered_office_address || companyRecord.REGISTERED_OFFICE_ADDRESS,
          companyRecord.state || companyRecord.STATE,
          companyRecord.pincode || companyRecord.PINCODE
        ].filter(Boolean).join(', ') || 'N/A',
        email: companyRecord.email || companyRecord.EMAIL || 'N/A',
        website: companyRecord.website || companyRecord.WEBSITE || 'N/A',
        phone: companyRecord.phone || companyRecord.PHONE || 'N/A'
      }
    }

    console.log('Transformed corporate data:', corporateData)

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
