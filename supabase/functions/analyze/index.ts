import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { SocialMediaDetector, SocialMediaTechnology } from './social-media-detector.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') as string
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') as string

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DetectedTechnology {
  name: string;
  category: string;
  version?: string;
  confidence: number;
  detectionMethod: string;
  patterns: string[];
}

interface SocialMediaResult {
  platform: string;
  category: 'tracking' | 'widget' | 'embed' | 'sharing' | 'analytics' | 'authentication';
  integrationMethod: 'script' | 'iframe' | 'meta' | 'sdk' | 'pixel' | 'api' | 'css';
  confidence: number;
  evidence: string[];
  version?: string;
}

interface AnalysisResult {
  url: string;
  status: 'completed' | 'failed';
  error?: string;
  technologies: DetectedTechnology[];
  socialMedia: SocialMediaResult[];
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
    const { urls, deepSearchEnabled, aiAnalysisEnabled, searchMode, deepSearchOptions, customPatterns } = await req.json();
    
    console.log('Starting analysis for URLs:', urls);
    console.log('Deep search enabled:', deepSearchEnabled);
    console.log('AI analysis enabled:', aiAnalysisEnabled);

    const results: AnalysisResult[] = [];

    for (const url of urls) {
      const startTime = Date.now();
      
      try {
        console.log(`Analyzing URL: ${url}`);
        
        // Fetch website content with enhanced error handling
        const response = await fetchWithProxy(url);
        
        if (!response.ok) {
          results.push({
            url,
            status: 'failed',
            error: `HTTP ${response.status}: ${response.statusText}`,
            technologies: [],
            socialMedia: [],
            metadata: { responseTime: Date.now() - startTime }
          });
          continue;
        }

        const html = await response.text();
        const responseTime = Date.now() - startTime;

        // Extract scripts, stylesheets, and other resources
        const scripts = extractScripts(html);
        const stylesheets = extractStylesheets(html);
        const headers = extractResponseHeaders(response);
        const cookies = extractCookies(headers);

        console.log(`Extracted ${scripts.length} scripts and ${stylesheets.length} stylesheets`);

        // Detect regular technologies
        let technologies: DetectedTechnology[] = [];
        
        if (deepSearchEnabled) {
          technologies = await detectTechnologiesDeep(html, scripts, stylesheets, deepSearchOptions, customPatterns);
        } else {
          technologies = detectTechnologiesBasic(html, scripts, stylesheets);
        }

        // Detect social media technologies
        const socialMediaTechs = SocialMediaDetector.detectSocialMedia(html, scripts, stylesheets, headers, cookies);
        
        console.log(`Detected ${technologies.length} technologies and ${socialMediaTechs.length} social media integrations`);

        // Convert social media technologies to the expected format
        const socialMedia: SocialMediaResult[] = socialMediaTechs.map(tech => ({
          platform: tech.platform,
          category: tech.category,
          integrationMethod: tech.integrationMethod,
          confidence: tech.confidence,
          evidence: tech.evidence,
          version: tech.version
        }));

        // Extract metadata
        const metadata = extractMetadata(html, responseTime);

        // Perform AI analysis if enabled
        let aiAnalysis;
        if (aiAnalysisEnabled) {
          try {
            aiAnalysis = await performAIAnalysis(html, technologies, socialMedia, url);
          } catch (error) {
            console.error('AI analysis failed:', error);
          }
        }

        results.push({
          url,
          status: 'completed',
          technologies,
          socialMedia,
          metadata,
          aiAnalysis
        });

      } catch (error) {
        console.error(`Error analyzing ${url}:`, error);
        results.push({
          url,
          status: 'failed',
          error: error.message,
          technologies: [],
          socialMedia: [],
          metadata: { responseTime: Date.now() - startTime }
        });
      }
    }

    return new Response(JSON.stringify({
      jobId: Date.now(),
      status: 'completed',
      totalUrls: urls.length,
      processedUrls: results.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchWithProxy(url: string): Promise<Response> {
  const proxyUrls = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`
  ];

  for (const proxyUrl of proxyUrls) {
    try {
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return new Response(data.contents || data, {
          status: 200,
          headers: new Headers({
            'content-type': 'text/html',
          })
        });
      }
    } catch (error) {
      console.log(`Proxy ${proxyUrl} failed:`, error);
      continue;
    }
  }

  // Fallback to direct fetch
  return fetch(url);
}

function extractResponseHeaders(response: Response): Record<string, string> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });
  return headers;
}

function extractCookies(headers: Record<string, string>): string[] {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return [];
  
  return setCookie.split(',').map(cookie => cookie.trim());
}

function extractScripts(html: string): string[] {
  const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
  const inlineScriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  const scripts: string[] = [];
  
  let match;
  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  
  while ((match = inlineScriptRegex.exec(html)) !== null) {
    if (match[1].trim()) {
      scripts.push(match[1]);
    }
  }
  
  return scripts;
}

function extractStylesheets(html: string): string[] {
  const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi;
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  const stylesheets: string[] = [];
  
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    stylesheets.push(match[1]);
  }
  
  while ((match = styleRegex.exec(html)) !== null) {
    if (match[1].trim()) {
      stylesheets.push(match[1]);
    }
  }
  
  return stylesheets;
}

function detectTechnologiesBasic(html: string, scripts: string[], stylesheets: string[]): DetectedTechnology[] {
  const technologies: DetectedTechnology[] = [];
  const content = html.toLowerCase();
  
  // Basic framework detection
  const frameworks = {
    'React': ['react', 'reactdom', 'jsx'],
    'Vue.js': ['vue.js', 'vue.min.js', 'vuejs'],
    'Angular': ['angular.js', 'angular.min.js', '@angular'],
    'jQuery': ['jquery', 'jquery.min.js', '$'],
    'Bootstrap': ['bootstrap', 'bootstrap.min.css'],
    'WordPress': ['wp-content', 'wp-includes', '/wp-json/'],
    'Drupal': ['/sites/all/', '/sites/default/', 'drupal'],
    'Shopify': ['shopify', 'cdn.shopify.com'],
  };

  for (const [name, patterns] of Object.entries(frameworks)) {
    const foundPatterns: string[] = [];
    let confidence = 0;

    for (const pattern of patterns) {
      if (content.includes(pattern) || 
          scripts.some(script => script.toLowerCase().includes(pattern)) ||
          stylesheets.some(style => style.toLowerCase().includes(pattern))) {
        foundPatterns.push(pattern);
        confidence += 0.3;
      }
    }

    if (foundPatterns.length > 0) {
      technologies.push({
        name,
        category: name === 'WordPress' || name === 'Drupal' ? 'Content Management' : 'Frontend Frameworks',
        confidence: Math.min(confidence, 1.0),
        detectionMethod: 'Pattern Matching',
        patterns: foundPatterns
      });
    }
  }

  return technologies;
}

async function detectTechnologiesDeep(
  html: string, 
  scripts: string[], 
  stylesheets: string[], 
  options: any, 
  customPatterns: string[]
): Promise<DetectedTechnology[]> {
  const technologies = detectTechnologiesBasic(html, scripts, stylesheets);
  
  // Add custom pattern detection
  for (const pattern of customPatterns) {
    const content = html.toLowerCase();
    if (content.includes(pattern.toLowerCase()) ||
        scripts.some(script => script.toLowerCase().includes(pattern.toLowerCase())) ||
        stylesheets.some(style => style.toLowerCase().includes(pattern.toLowerCase()))) {
      
      technologies.push({
        name: pattern,
        category: 'Custom Pattern',
        confidence: 0.7,
        detectionMethod: 'Custom Pattern',
        patterns: [pattern]
      });
    }
  }

  return technologies;
}

function extractMetadata(html: string, responseTime: number) {
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
  const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i);
  
  return {
    title: titleMatch ? titleMatch[1].trim() : undefined,
    description: descriptionMatch ? descriptionMatch[1].trim() : undefined,
    responseTime
  };
}

async function performAIAnalysis(
  html: string, 
  technologies: DetectedTechnology[], 
  socialMedia: SocialMediaResult[], 
  url: string
): Promise<any> {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('OpenAI API key not available, skipping AI analysis');
    return undefined;
  }

  try {
    const prompt = `Analyze this website and provide insights about its technology stack and social media integrations:

URL: ${url}
Detected Technologies: ${technologies.map(t => t.name).join(', ')}
Social Media Integrations: ${socialMedia.map(s => s.platform).join(', ')}

HTML snippet: ${html.substring(0, 2000)}...

Please provide:
1. A brief summary of the technology stack and social media strategy
2. Any additional technologies you can identify from the HTML
3. Notable patterns or architectural decisions
4. Recommendations for optimization or best practices

Focus on both technical stack and social media/marketing technology integration.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a web technology and digital marketing expert specializing in technology stack analysis and social media integration assessment.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 1000
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    return {
      summary: analysis.substring(0, 500) + '...',
      additionalTechnologies: [],
      patterns: ['Social media integration detected', 'Modern web stack'],
      recommendations: ['Optimize social media loading', 'Consider privacy compliance']
    };

  } catch (error) {
    console.error('AI analysis error:', error);
    return undefined;
  }
}
