
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

    // Search by CIN if the query looks like a CIN, otherwise search by company name
    const searchUrl = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&limit=100`
    console.log(`Making request to: ${searchUrl}`)
    
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API response structure:', JSON.stringify(data, null, 2))

    let companyData = null
    
    if (data.records && data.records.length > 0) {
      // Search for the company in the returned records
      const match = data.records.find(record => {
        const companyName = record.CompanyName || ''
        const cin = record.CIN || ''
        const query = searchQuery.toLowerCase()
        
        return companyName.toLowerCase().includes(query) || 
               cin.toLowerCase() === query.toLowerCase()
      })
      
      if (match) {
        companyData = match
        console.log('Found matching company:', JSON.stringify(companyData, null, 2))
      }
    }

    if (!companyData) {
      console.log('No matching company found')
      return new Response(
        JSON.stringify({ 
          error: 'Company not found',
          message: `No company found matching "${searchQuery}"`
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Transform the data using correct field names from API response
    const corporateData = {
      identity: {
        companyName: companyData.CompanyName || 'N/A',
        cin: companyData.CIN || 'N/A',
        registrationNumber: companyData.LLPIN || 'N/A',
        dateOfIncorporation: companyData.CompanyRegistrationdate_date || 'N/A',
        rocCode: companyData.CompanyROCcode || 'N/A',
        status: companyData.CompanyStatus || 'N/A',
        classification: companyData.CompanyClass || 'N/A',
        category: companyData.CompanyCategory || 'N/A'
      },
      financial: {
        authorizedCapital: parseFloat(companyData.AuthorizedCapital || '0') || 0,
        paidUpCapital: parseFloat(companyData.PaidupCapital || '0') || 0,
        netWorth: 0, // Not available in this dataset
        totalAssets: 0, // Not available in this dataset
        totalLiabilities: 0, // Not available in this dataset
        revenue: 0, // Not available in this dataset
        charges: []
      },
      directors: [],
      compliance: {
        lastFilingDate: 'N/A', // Not available in this dataset
        annualReturnStatus: 'N/A', // Not available in this dataset
        filings: []
      },
      contact: {
        registeredAddress: companyData.Registered_Office_Address || 'N/A',
        email: 'N/A', // Not available in this dataset
        website: 'N/A', // Not available in this dataset
        phone: 'N/A' // Not available in this dataset
      },
      metadata: {
        datasetUsed: '4dbe5667-7b6b-41d7-82af-211562424d9a',
        searchQuery: searchQuery,
        totalRecords: data.total || data.records?.length || 0,
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
