
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// In-memory store for demo usage by IP (in production, use Redis or database)
const demoUsage = new Map<string, { count: number, lastReset: number }>();
const DEMO_LIMIT = 5;
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const now = Date.now();
    
    // Get or initialize usage for this IP
    let usage = demoUsage.get(clientIP);
    if (!usage || (now - usage.lastReset) > RESET_INTERVAL) {
      usage = { count: 0, lastReset: now };
      demoUsage.set(clientIP, usage);
    }

    // Check if limit is exceeded
    if (usage.count >= DEMO_LIMIT) {
      return new Response(
        JSON.stringify({ 
          error: 'Demo limit reached', 
          message: 'You have reached your 5 free demo searches. Please sign up or log in to continue.' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { url, clientDemoSearchCount } = await req.json()

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Increment usage count
    usage.count++;
    demoUsage.set(clientIP, usage);

    // Simulate basic website analysis (replace with actual implementation)
    const analysis = {
      url,
      technologies: [
        { name: 'React', category: 'JavaScript Frameworks', confidence: 95, version: '18.x' },
        { name: 'Webpack', category: 'Module Bundlers', confidence: 90 },
        { name: 'Nginx', category: 'Web Servers', confidence: 85 }
      ],
      responseTime: Math.floor(Math.random() * 2000) + 500,
      status: 'completed',
      scanDate: new Date().toISOString(),
      serverDemoCount: usage.count,
      remainingDemoSearches: Math.max(0, DEMO_LIMIT - usage.count)
    };

    return new Response(
      JSON.stringify(analysis),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Demo analyze error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
