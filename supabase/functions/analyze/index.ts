
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
  searchMode: 'basic' | 'advanced' | 'full';
  deepSearchOptions: {
    analyzeHtmlComments: boolean;
    analyzeMetaTags: boolean;
    detectCustomElements: boolean;
    analyzeFilePaths: boolean;
    aiPatternDetection: boolean;
    analyzeCssClasses: boolean;
    analyzeInlineScripts: boolean;
    analyzeHttpHeaders: boolean;
    analyzeCookiePatterns: boolean;
    detectBehavioralPatterns: boolean;
  };
  customPatterns: string[];
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
    statusCode?: number;
    headers?: Record<string, string>;
    ssl?: {
      issuer?: string;
      validFrom?: string;
      validTo?: string;
    };
  };
  aiAnalysis?: {
    summary: string;
    additionalTechnologies: DetectedTechnology[];
    patterns: string[];
    recommendations: string[];
    aiGeneratedPatterns: string[];
    strategicAnalysis?: {
      executiveSummary: string;
      technologyProfile: string;
      competitiveLandscape: string;
      strategicOpportunities: string;
      analysisLimitations: string;
    };
  };
}

// Enhanced technology detection patterns
const TECH_PATTERNS = {
  // Frontend Frameworks
  'React': {
    patterns: [/react/i, /_react/i, /react-dom/i, /ReactDOM/i, /data-reactid/i, /data-reactroot/i],
    category: 'Frontend Framework',
    files: ['/static/js/', '/assets/', '/_next/', '/react', 'react.min.js', 'react.js'],
    headers: ['x-react'],
    meta: ['generator'],
    elements: ['<div id="root">', '<div id="react-root">', 'data-reactroot'],
    cssClasses: ['react-', 'jsx-'],
    comments: ['react', 'jsx', 'facebook'],
    inlineScripts: ['React.createElement', 'ReactDOM.render'],
    cookies: ['react-session'],
  },
  'Vue.js': {
    patterns: [/vue\.js/i, /vue@/i, /__vue/i, /Vue\(/i, /v-if/i, /v-for/i, /v-model/i],
    category: 'Frontend Framework',
    files: ['/js/vue', '/dist/vue', 'vue.min.js', 'vue.js'],
    headers: ['x-vue'],
    elements: ['<div id="app">', 'v-if', 'v-for', 'v-model', ':class', '@click'],
    cssClasses: ['v-', 'vue-'],
    comments: ['vue', 'evan you'],
    inlineScripts: ['new Vue(', 'Vue.component'],
  },
  'Angular': {
    patterns: [/angular/i, /ng-/i, /@angular/i, /AngularJS/i],
    category: 'Frontend Framework',
    files: ['/angular', '/ng-', 'angular.min.js', 'angular.js'],
    headers: ['x-angular'],
    elements: ['<app-root>', 'ng-app', 'ng-controller', 'ng-repeat', '\\[ngFor\\]', '\\*ngIf'],
    cssClasses: ['ng-', 'angular-'],
    comments: ['angular', 'google'],
    inlineScripts: ['angular.module', 'ng-app'],
  },
  'Next.js': {
    patterns: [/next\.js/i, /_next/i, /nextjs/i, /__NEXT_DATA__/i],
    category: 'Frontend Framework',
    files: ['/_next/static/', '/_next/', '_next'],
    headers: ['x-nextjs', 'x-powered-by'],
    elements: ['<script id="__NEXT_DATA__">', '__NEXT_DATA__'],
    comments: ['next.js', 'vercel'],
  },
  // CSS Frameworks
  'Bootstrap': {
    patterns: [/bootstrap/i, /btn-/i, /col-/i, /container-fluid/i],
    category: 'CSS Framework',
    files: ['/bootstrap', '/css/bootstrap', 'bootstrap.min.css', 'bootstrap.css'],
    cssClasses: ['container', 'row', 'col-', 'btn-', 'navbar', 'card', 'form-control'],
    comments: ['bootstrap', 'twitter bootstrap'],
  },
  'Tailwind CSS': {
    patterns: [/tailwind/i, /bg-\w+/i, /text-\w+/i, /flex/i, /grid/i],
    category: 'CSS Framework',
    files: ['/tailwind', 'tailwind.css'],
    cssClasses: ['bg-', 'text-', 'p-', 'm-', 'w-', 'h-', 'flex', 'grid', 'space-', 'divide-'],
    comments: ['tailwind', 'tailwindcss'],
  },
  // JavaScript Libraries
  'jQuery': {
    patterns: [/jquery/i, /\$\(/i, /jQuery/i],
    category: 'JavaScript Library',
    files: ['/jquery', '/js/jquery', 'jquery.min.js', 'jquery.js'],
    inlineScripts: ['$(document)', 'jQuery(', '$.ajax'],
    comments: ['jquery', 'john resig'],
  },
  // Backend Technologies
  'Node.js': {
    patterns: [/node\.js/i, /nodejs/i],
    category: 'Backend Runtime',
    headers: ['x-powered-by'],
    cookies: ['connect.sid', 'express-session'],
    comments: ['node.js', 'nodejs'],
  },
  'Django': {
    patterns: [/django/i, /csrftoken/i],
    category: 'Backend Framework',
    headers: ['x-django'],
    cookies: ['csrftoken', 'sessionid', 'django_language'],
    comments: ['django'],
  },
  'WordPress': {
    patterns: [/wp-content/i, /wp-includes/i, /wordpress/i, /wp-admin/i],
    category: 'Content Management System',
    files: ['/wp-content/', '/wp-includes/', '/wp-admin/'],
    meta: ['generator'],
    elements: ['wp-', 'wordpress'],
    cssClasses: ['wp-', 'wordpress'],
    comments: ['wordpress', 'wp'],
    inlineScripts: ['wp-admin', 'wordpress'],
  },
  // Analytics
  'Google Analytics': {
    patterns: [/google-analytics/i, /gtag/i, /ga\(/i, /googletagmanager/i],
    category: 'Analytics',
    files: ['google-analytics.com', 'googletagmanager.com'],
    inlineScripts: ['gtag(', 'ga(', 'GoogleAnalyticsObject'],
    comments: ['google analytics', 'gtag'],
  },
};

async function fetchWebsiteData(url: string, searchMode: string) {
  const startTime = Date.now();
  
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TechStack-Analyzer/1.0 (Website Technology Scanner)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      redirect: 'follow',
    });

    const responseTime = Date.now() - startTime;
    const html = await response.text();
    const headers: Record<string, string> = {};
    
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      html,
      headers,
      statusCode: response.status,
      responseTime,
      finalUrl: response.url,
    };
  } catch (error) {
    throw new Error(`Failed to fetch website: ${error.message}`);
  }
}

function detectTechnologies(html: string, headers: Record<string, string>, options: any, customPatterns: string[] = []) {
  const technologies: DetectedTechnology[] = [];
  const htmlLower = html.toLowerCase();

  // Detect from HTML content with enhanced methods
  for (const [techName, techData] of Object.entries(TECH_PATTERNS)) {
    let confidence = 0;
    const detectedPatterns: string[] = [];
    
    // Basic pattern detection in HTML
    for (const pattern of techData.patterns) {
      if (pattern.test(html)) {
        confidence += 0.3;
        detectedPatterns.push(`HTML pattern: ${pattern.toString()}`);
      }
    }
    
    // Enhanced file path detection
    if (techData.files) {
      for (const file of techData.files) {
        if (htmlLower.includes(file.toLowerCase())) {
          confidence += 0.25;
          detectedPatterns.push(`File path: ${file}`);
        }
      }
    }
    
    // HTTP headers analysis
    if (techData.headers && options.analyzeHttpHeaders) {
      for (const header of techData.headers) {
        const headerValue = headers[header] || headers[header.toLowerCase()];
        if (headerValue) {
          confidence += 0.4;
          detectedPatterns.push(`HTTP header: ${header} = ${headerValue}`);
        }
      }
    }

    // Enhanced CSS class detection
    if (techData.cssClasses && options.analyzeCssClasses) {
      for (const cssClass of techData.cssClasses) {
        const classRegex = new RegExp(`class=["'][^"']*${cssClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
        if (classRegex.test(html)) {
          confidence += 0.2;
          detectedPatterns.push(`CSS class: ${cssClass}`);
        }
      }
    }

    // Add technology if confidence threshold is met
    if (confidence > 0.2) {
      technologies.push({
        name: techName,
        category: techData.category,
        version: techData.version,
        confidence: Math.min(confidence, 1),
        detectionMethod: confidence > 0.7 ? 'High Confidence Detection' : 'Pattern Matching',
        patterns: detectedPatterns,
      });
    }
  }

  // Check custom patterns
  for (const pattern of customPatterns) {
    try {
      const regex = new RegExp(pattern, 'i');
      if (regex.test(html)) {
        technologies.push({
          name: `Custom Pattern: ${pattern}`,
          category: 'Custom Detection',
          confidence: 0.8,
          detectionMethod: 'Custom Pattern',
          patterns: [pattern],
        });
      }
    } catch (error) {
      console.log('Invalid custom pattern:', pattern);
    }
  }

  return technologies;
}

async function performStrategicAIAnalysis(urls: string[], allResults: any[]) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('OpenAI API key not found, skipping strategic AI analysis');
    return null;
  }

  try {
    const primaryTarget = urls[0];
    const competitors = urls.slice(1, 3); // Take up to 2 competitors
    
    // Prepare data for analysis
    const primaryResult = allResults[0];
    const competitorResults = allResults.slice(1, 3);
    
    const prompt = `Execute a strategic technology and competitive analysis. The primary target is "${primaryTarget}". ${competitors.length > 0 ? `The direct competitors for benchmarking are ${competitors.map(url => `"${url}"`).join(' and ')}.` : ''}

The final output should be a concise executive report. Follow these phases meticulously:

**Phase 1: Deep Technical Audit of Primary Target**
Primary Target Data:
- URL: ${primaryTarget}
- Technologies Detected: ${primaryResult?.technologies?.map(t => `${t.name} (${t.category}, confidence: ${t.confidence})`).join(', ') || 'None detected'}
- HTML Sample: ${primaryResult?.html?.slice(0, 3000) || 'Not available'}

1. **Social & Marketing Tech:**
   * Identify all advertising pixels and analytics tags (Facebook, Google Ads, LinkedIn, TikTok, etc.).
   * Detect any marketing automation or CRM scripts (HubSpot, Intercom, etc.).
   * Find social media widgets, embeds, and sharing plugins.

2. **Core Technology Stack:**
   * Identify the CMS (e.g., WordPress, Shopify, Drupal) via meta tags or file paths.
   * Identify front-end frameworks and libraries (React, Vue, jQuery, Bootstrap).

3. **SEO & Structured Data:**
   * Specifically search for structured data scripts (e.g., \`<script type="application/ld+json">\`).
   * Report what schemas are being used (e.g., \`Organization\`, \`Service\`, \`Product\`, \`FAQPage\`).
   * Analyze the meta title, description, and heading structure (H1, H2) for SEO focus.

**Phase 2: Competitive Technology Benchmark**
${competitors.length > 0 ? `
Competitor Data:
${competitorResults.map((result, index) => `
- Competitor ${index + 1}: ${competitors[index]}
- Technologies: ${result?.technologies?.map(t => `${t.name} (${t.category})`).join(', ') || 'None detected'}
`).join('')}

1. **Identify Key Differentiators:** For each competitor, focus on identifying their:
   * Primary social media pixels and analytics tools.
   * CMS or platform, if identifiable.
   * Any obvious, high-impact technology the primary target lacks.
` : 'No competitors provided for analysis.'}

**Phase 3: Synthesis & Strategic Inference**
1. **User Journey Mapping:** Based on the tech found on the primary target's site, infer their strategy.
2. **Competitive Gap Analysis:** Create analysis comparing technologies across the websites.
3. **Hypothesize & Infer:** Form reasonable hypotheses about missing technologies.

**Phase 4: Actionable Recommendations & Reporting**
Provide a comprehensive report with these exact sections:

**A. Executive Summary:** A brief overview of key findings and top recommendation.
**B. Primary Target Technology Profile:** (Social, Core Stack, SEO)
**C. Competitive Landscape:** (Gap analysis)
**D. Strategic Opportunities & Recommendations:** (3-5 detailed, actionable suggestions)
**E. Analysis Limitations:** (Explicitly state any limitations)

Respond in JSON format with:
{
  "executiveSummary": "brief overview with key findings",
  "technologyProfile": "detailed analysis of primary target",
  "competitiveLandscape": "competitive analysis and gaps",
  "strategicOpportunities": "actionable recommendations",
  "analysisLimitations": "limitations and assumptions"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior technology strategist and competitive intelligence expert. Provide comprehensive strategic analysis in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      // If JSON parsing fails, return a basic structure
      return {
        executiveSummary: "Strategic analysis completed with limited data parsing",
        technologyProfile: content.slice(0, 500),
        competitiveLandscape: "Analysis completed but data parsing encountered issues",
        strategicOpportunities: "Please review raw analysis for recommendations",
        analysisLimitations: "JSON parsing failed - raw analysis available"
      };
    }
  } catch (error) {
    console.error('Strategic AI analysis error:', error);
    return null;
  }
}

async function performAIAnalysis(html: string, url: string, technologies: DetectedTechnology[]) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('OpenAI API key not found, skipping AI analysis');
    return null;
  }

  try {
    const truncatedHtml = html.slice(0, 8000);
    
    const prompt = `Analyze this website HTML and provide comprehensive insights about the technologies used:

URL: ${url}
HTML Sample: ${truncatedHtml}

Currently detected technologies: ${technologies.map(t => t.name).join(', ')}

Please provide a detailed analysis including:
1. A comprehensive summary of the website's tech stack and architecture
2. Any additional technologies you can identify that weren't detected (with confidence scores 0-1)
3. Architecture patterns and design approaches you observe
4. Performance and security recommendations
5. Modern web development practices being used or missing

Respond in JSON format with: 
{
  "summary": "detailed summary",
  "additionalTechnologies": [{"name": "tech", "category": "category", "confidence": 0.8}],
  "patterns": ["pattern1", "pattern2"],
  "recommendations": ["rec1", "rec2"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a senior web technology expert and architect. Analyze websites comprehensively and provide detailed technical insights in valid JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      return {
        summary: content,
        additionalTechnologies: [],
        patterns: [],
        recommendations: [],
      };
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
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
      const requestData: AnalysisRequest = await req.json();
      const { 
        urls, 
        deepSearchEnabled, 
        aiAnalysisEnabled, 
        searchMode = 'full',
        deepSearchOptions = {
          analyzeHtmlComments: true,
          analyzeMetaTags: true,
          detectCustomElements: true,
          analyzeFilePaths: true,
          aiPatternDetection: true,
          analyzeCssClasses: true,
          analyzeInlineScripts: true,
          analyzeHttpHeaders: true,
          analyzeCookiePatterns: true,
          detectBehavioralPatterns: true,
        },
        customPatterns = []
      } = requestData;

      console.log('Starting enhanced deep analysis for URLs:', urls);

      const jobId = crypto.randomUUID();
      const results: AnalysisResult[] = [];
      const allWebsiteData: any[] = [];
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`Processing URL ${i + 1}/${urls.length}: ${url}`);
        
        try {
          const websiteData = await fetchWebsiteData(url, searchMode);
          allWebsiteData.push({ url, ...websiteData });
          
          let technologies = detectTechnologies(
            websiteData.html, 
            websiteData.headers, 
            deepSearchOptions,
            customPatterns
          );
          
          const uniqueTechs = technologies.reduce((acc, tech) => {
            const existing = acc.find(t => t.name === tech.name);
            if (!existing || existing.confidence < tech.confidence) {
              acc = acc.filter(t => t.name !== tech.name);
              acc.push(tech);
            }
            return acc;
          }, [] as DetectedTechnology[]);
          
          uniqueTechs.sort((a, b) => b.confidence - a.confidence);

          const titleMatch = websiteData.html.match(/<title[^>]*>([^<]+)<\/title>/i);
          const descMatch = websiteData.html.match(/<meta[^>]*name=['"](description|Description)['"]*[^>]*content=['"](.*?)['"]/i);
          
          const result: AnalysisResult = {
            url: websiteData.finalUrl || url,
            status: 'completed',
            technologies: uniqueTechs,
            metadata: {
              title: titleMatch ? titleMatch[1].trim() : undefined,
              description: descMatch ? descMatch[2].trim() : undefined,
              responseTime: websiteData.responseTime,
              statusCode: websiteData.statusCode,
              headers: websiteData.headers,
            }
          };

          if (aiAnalysisEnabled) {
            console.log('Performing enhanced AI analysis for:', url);
            const aiResult = await performAIAnalysis(websiteData.html, url, uniqueTechs);
            if (aiResult) {
              result.aiAnalysis = {
                ...aiResult,
                aiGeneratedPatterns: [],
              };
            }
          }

          results.push(result);

          await supabase.from('website_scans').insert({
            url: result.url,
            status: 'completed',
            technologies: result.technologies,
            response_time: result.metadata.responseTime,
            status_code: result.metadata.statusCode,
          });

        } catch (error) {
          console.error(`Error processing URL ${url}:`, error);
          
          const failedResult: AnalysisResult = {
            url,
            status: 'failed',
            error: error.message,
            technologies: [],
            metadata: {
              responseTime: 0
            }
          };
          
          results.push(failedResult);
        }
      }

      // Perform strategic analysis if AI is enabled and we have results
      if (aiAnalysisEnabled && results.length > 0) {
        console.log('Performing strategic competitive analysis...');
        const strategicAnalysis = await performStrategicAIAnalysis(urls, allWebsiteData);
        
        if (strategicAnalysis && results[0].aiAnalysis) {
          results[0].aiAnalysis.strategicAnalysis = strategicAnalysis;
        }
      }

      return new Response(
        JSON.stringify({
          jobId,
          totalUrls: urls.length,
          status: 'completed',
          processedUrls: urls.length,
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
