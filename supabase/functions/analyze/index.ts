
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AnalysisRequest {
  urls: string[];
  deepSearchEnabled: boolean;
  aiAnalysisEnabled: boolean;
}

interface DetectedTechnology {
  name: string;
  category: string;
  version?: string;
  confidence: number;
  detectionMethod: string;
  patterns: string[];
}

interface AnalysisResult {
  url: string;
  status: 'completed' | 'failed';
  error?: string;
  technologies: DetectedTechnology[];
  metadata: {
    title?: string;
    description?: string;
    responseTime: number;
  };
  aiAnalysis?: {
    summary: string;
    additionalTechnologies: DetectedTechnology[];
    patterns: string[];
    recommendations: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const { urls, deepSearchEnabled, aiAnalysisEnabled }: AnalysisRequest = await req.json();

      console.log('Starting analysis for URLs:', urls);

      // Create a new scan job
      const jobId = crypto.randomUUID();
      const totalUrls = urls.length;
      
      // Process URLs and create mock results for demonstration
      const results: AnalysisResult[] = [];
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`Processing URL ${i + 1}/${totalUrls}: ${url}`);
        
        try {
          // Mock analysis - in a real implementation, you'd fetch and analyze the URL
          const technologies: DetectedTechnology[] = [
            {
              name: "React",
              category: "Frontend Framework",
              version: "18.0",
              confidence: 0.95,
              detectionMethod: "Pattern Matching",
              patterns: ["react", "jsx"]
            },
            {
              name: "Tailwind CSS",
              category: "CSS Framework",
              confidence: 0.8,
              detectionMethod: "CSS Class Analysis",
              patterns: ["bg-", "text-", "flex"]
            }
          ];

          const result: AnalysisResult = {
            url,
            status: 'completed',
            technologies,
            metadata: {
              title: `Website ${i + 1}`,
              description: `Analysis of ${url}`,
              responseTime: Math.floor(Math.random() * 1000) + 200
            }
          };

          if (aiAnalysisEnabled) {
            result.aiAnalysis = {
              summary: "Modern React application with Tailwind CSS styling",
              additionalTechnologies: [],
              patterns: ["Modern frontend stack", "Component-based architecture"],
              recommendations: ["Consider implementing lazy loading", "Optimize bundle size"]
            };
          }

          results.push(result);

          // Store individual scan result
          await supabase.from('website_scans').insert({
            url,
            status: 'completed',
            technologies: technologies,
            response_time: result.metadata.responseTime
          });

        } catch (error) {
          console.error(`Error processing URL ${url}:`, error);
          results.push({
            url,
            status: 'failed',
            error: error.message,
            technologies: [],
            metadata: {
              responseTime: 0
            }
          });

          await supabase.from('website_scans').insert({
            url,
            status: 'failed',
            error_message: error.message,
            response_time: 0
          });
        }
      }

      return new Response(
        JSON.stringify({
          jobId,
          totalUrls,
          status: 'completed',
          processedUrls: totalUrls,
          results
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response('Method not allowed', { 
      headers: corsHeaders, 
      status: 405 
    });

  } catch (error) {
    console.error('Error in analyze function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})
