
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

    // Search for company using MCA data from data.gov.in
    const searchUrl = `https://api.data.gov.in/resource/6176ee09-3d56-4a3b-8115-21841576b2f6?api-key=${apiKey}&format=json&filters[COMPANY_NAME]=${encodeURIComponent(searchQuery)}&limit=1`
    
    console.log(`Making request to: ${searchUrl}`)
    
    const searchResponse = await fetch(searchUrl)
    
    if (!searchResponse.ok) {
      console.error(`Search API error: ${searchResponse.status} ${searchResponse.statusText}`)
      return new Response(
        JSON.stringify({ error: `API request failed: ${searchResponse.statusText}` }),
        { status: searchResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const searchData = await searchResponse.json()
    console.log('Search response:', searchData)

    if (!searchData.records || searchData.records.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No company found with that name or CIN' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const companyRecord = searchData.records[0]
    
    // Transform the API data to match our interface
    const corporateData = {
      identity: {
        companyName: companyRecord.COMPANY_NAME || 'N/A',
        cin: companyRecord.CORPORATE_IDENTIFICATION_NUMBER || 'N/A',
        registrationNumber: companyRecord.REGISTRATION_NUMBER || 'N/A',
        dateOfIncorporation: companyRecord.DATE_OF_REGISTRATION || 'N/A',
        rocCode: companyRecord.ROC_CODE || 'N/A',
        status: companyRecord.COMPANY_STATUS || 'Unknown',
        classification: companyRecord.COMPANY_CLASS || 'N/A',
        category: companyRecord.COMPANY_CATEGORY || 'N/A'
      },
      financial: {
        authorizedCapital: parseFloat(companyRecord.AUTHORIZED_CAP) || 0,
        paidUpCapital: parseFloat(companyRecord.PAIDUP_CAPITAL) || 0,
        netWorth: 0, // Not available in basic MCA data
        totalAssets: 0, // Not available in basic MCA data
        totalLiabilities: 0, // Not available in basic MCA data
        revenue: 0, // Not available in basic MCA data
        charges: [] // Would need separate API call for charges data
      },
      directors: [], // Would need separate API call for directors data
      compliance: {
        lastFilingDate: companyRecord.LATEST_RETURN_DATE || 'N/A',
        annualReturnStatus: companyRecord.LATEST_RETURN_DATE ? 'Filed' : 'Unknown',
        filings: [] // Would need separate API call for filing history
      },
      contact: {
        registeredAddress: [
          companyRecord.REGISTERED_OFFICE_ADDRESS,
          companyRecord.REGISTRED_OFFICE_ADDRESS, // API sometimes has typo
          companyRecord.STATE,
          companyRecord.PINCODE
        ].filter(Boolean).join(', ') || 'N/A',
        email: companyRecord.EMAIL || 'N/A',
        website: companyRecord.WEBSITE || 'N/A',
        phone: companyRecord.PHONE || 'N/A'
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
      JSON.stringify({ error: 'Failed to fetch corporate data' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
