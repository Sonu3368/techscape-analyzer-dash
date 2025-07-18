
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

    const cleanQuery = searchQuery.trim().toUpperCase()
    
    // Try multiple search strategies
    let searchResults = null
    let totalRecords = 0
    
    // Strategy 1: Try exact CIN match first if it looks like a CIN
    if (cleanQuery.match(/^[A-Z]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/)) {
      console.log('Searching by CIN pattern')
      let searchUrl = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&limit=1000&filters[CIN]=${encodeURIComponent(cleanQuery)}`
      
      console.log(`Making CIN request to: ${searchUrl}`)
      const response = await fetch(searchUrl)
      
      if (response.ok) {
        const data = await response.json()
        searchResults = data
        totalRecords = data.total || data.records?.length || 0
        console.log(`CIN search returned ${totalRecords} records`)
      }
    }
    
    // Strategy 2: If no results, try company name search
    if (!searchResults || totalRecords === 0) {
      console.log('Trying company name search')
      let searchUrl = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&limit=1000`
      
      console.log(`Making company name request to: ${searchUrl}`)
      const response = await fetch(searchUrl)
      
      if (response.ok) {
        const data = await response.json()
        searchResults = data
        totalRecords = data.total || data.records?.length || 0
        console.log(`Company name search returned ${totalRecords} total records`)
        
        // Filter results manually if we got data
        if (data.records && data.records.length > 0) {
          const filteredRecords = data.records.filter(record => {
            const companyName = (record.CompanyName || '').toUpperCase()
            const cin = (record.CIN || '').toUpperCase()
            
            return companyName.includes(cleanQuery) || 
                   cin.includes(cleanQuery) || 
                   cleanQuery.includes(companyName.substring(0, Math.min(companyName.length, 10)))
          })
          
          console.log(`Filtered to ${filteredRecords.length} matching records`)
          searchResults.records = filteredRecords
          totalRecords = filteredRecords.length
        }
      }
    }
    
    // Strategy 3: If still no results, try broader search without filters
    if (!searchResults || totalRecords === 0) {
      console.log('Trying broader search without filters')
      let searchUrl = `https://api.data.gov.in/resource/4dbe5667-7b6b-41d7-82af-211562424d9a?api-key=${apiKey}&format=json&limit=100`
      
      console.log(`Making broader request to: ${searchUrl}`)
      const response = await fetch(searchUrl)
      
      if (response.ok) {
        const data = await response.json()
        console.log(`Broader search returned ${data.total || data.records?.length || 0} records`)
        
        if (data.records && data.records.length > 0) {
          // Show first few records as examples
          console.log('Sample records from API:')
          data.records.slice(0, 3).forEach((record, index) => {
            console.log(`Record ${index + 1}: ${record.CompanyName} (${record.CIN})`)
          })
          
          // Try fuzzy matching
          const fuzzyMatches = data.records.filter(record => {
            const companyName = (record.CompanyName || '').toUpperCase()
            const cin = (record.CIN || '').toUpperCase()
            const query = cleanQuery
            
            // More lenient matching
            return companyName.includes(query.substring(0, Math.min(query.length, 8))) ||
                   cin.includes(query.substring(0, Math.min(query.length, 8))) ||
                   query.includes(companyName.substring(0, Math.min(companyName.length, 8)))
          })
          
          if (fuzzyMatches.length > 0) {
            console.log(`Found ${fuzzyMatches.length} fuzzy matches`)
            searchResults = { ...data, records: fuzzyMatches }
            totalRecords = fuzzyMatches.length
          } else {
            searchResults = data
            totalRecords = data.records.length
          }
        }
      }
    }

    if (!searchResults) {
      console.log('API request failed')
      return new Response(
        JSON.stringify({ error: 'Failed to fetch data from API' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Final search results:', totalRecords, 'records')

    let companyData = null
    
    if (searchResults.records && searchResults.records.length > 0) {
      // Enhanced search logic with better matching
      const match = searchResults.records.find(record => {
        const companyName = (record.CompanyName || '').toUpperCase()
        const cin = (record.CIN || '').toUpperCase()
        const query = cleanQuery
        
        // Exact matches first
        if (cin === query || companyName === query) return true
        
        // Partial matches
        if (companyName.includes(query) || cin.includes(query)) return true
        
        // Reverse partial matches
        if (query.includes(companyName) || query.includes(cin)) return true
        
        return false
      })
      
      if (match) {
        companyData = match
        console.log('Found matching company:', companyData.CompanyName, companyData.CIN)
      } else {
        // If no exact match, take the first result as a suggestion
        companyData = searchResults.records[0]
        console.log('No exact match, using first result:', companyData.CompanyName, companyData.CIN)
      }
    }

    if (!companyData) {
      console.log('No matching company found')
      return new Response(
        JSON.stringify({ 
          error: 'Company not found',
          message: `No company found matching "${searchQuery}". Please check the company name or CIN and try again.`,
          suggestions: searchResults.records?.slice(0, 5).map(r => ({ 
            name: r.CompanyName, 
            cin: r.CIN 
          })) || [],
          debug: {
            totalRecordsInAPI: totalRecords,
            searchQuery: cleanQuery,
            sampleRecords: searchResults.records?.slice(0, 3).map(r => ({
              name: r.CompanyName,
              cin: r.CIN
            })) || []
          }
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
        netWorth: 0,
        totalAssets: 0,
        totalLiabilities: 0,
        revenue: 0,
        charges: []
      },
      directors: [],
      compliance: {
        lastFilingDate: 'N/A',
        annualReturnStatus: 'N/A',
        filings: []
      },
      contact: {
        registeredAddress: companyData.Registered_Office_Address || 'N/A',
        email: 'N/A',
        website: 'N/A',
        phone: 'N/A'
      },
      metadata: {
        datasetUsed: '4dbe5667-7b6b-41d7-82af-211562424d9a',
        searchQuery: searchQuery,
        totalRecords: totalRecords,
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
