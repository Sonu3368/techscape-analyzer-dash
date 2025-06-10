
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

    // Use filters in the API call to improve search results
    const cleanQuery = searchQuery.trim().toUpperCase()
    let searchUrl = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&limit=1000`
    
    // If it looks like a CIN, add CIN filter
    if (cleanQuery.match(/^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/)) {
      searchUrl += `&filters[CIN]=${encodeURIComponent(cleanQuery)}`
    } else {
      // For company names, add a filter (though API might not support exact matching)
      searchUrl += `&filters[CompanyName]=${encodeURIComponent(cleanQuery)}`
    }
    
    console.log(`Making request to: ${searchUrl}`)
    
    const response = await fetch(searchUrl)
    
    if (!response.ok) {
      console.error(`API request failed with status: ${response.status}`)
      const errorText = await response.text()
      console.error(`API error response: ${errorText}`)
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    console.log('API response received, total records:', data.total || data.records?.length || 0)

    let companyData = null
    
    if (data.records && data.records.length > 0) {
      // Enhanced search logic with better matching
      const match = data.records.find(record => {
        const companyName = (record.CompanyName || '').toUpperCase()
        const cin = (record.CIN || '').toUpperCase()
        const query = cleanQuery
        
        // Exact CIN match
        if (cin === query) return true
        
        // Exact company name match
        if (companyName === query) return true
        
        // Partial company name match (contains)
        if (companyName.includes(query) || query.includes(companyName)) return true
        
        return false
      })
      
      if (match) {
        companyData = match
        console.log('Found matching company:', companyData.CompanyName, companyData.CIN)
      } else {
        console.log('No exact match found, checking first few results:')
        data.records.slice(0, 3).forEach((record, index) => {
          console.log(`Record ${index + 1}: ${record.CompanyName} (${record.CIN})`)
        })
      }
    }

    if (!companyData) {
      console.log('No matching company found')
      return new Response(
        JSON.stringify({ 
          error: 'Company not found',
          message: `No company found matching "${searchQuery}". Please check the company name or CIN and try again.`,
          suggestions: data.records?.slice(0, 3).map(r => ({ 
            name: r.CompanyName, 
            cin: r.CIN 
          })) || []
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
      directors: [], // Directors data requires separate MCA API calls - see note below
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
        rawData: companyData,
        directorsNote: "Directors data requires separate API calls to MCA director datasets or paid MCA services"
      }
    }

    console.log('Returning corporate data for:', corporateData.identity.companyName)

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
        details: error.message,
        message: 'There was an error processing your request. Please try again.'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
