
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
  };
}

// Enhanced technology detection patterns
const TECH_PATTERNS = {
  // Frontend Frameworks
  'React': {
    patterns: [/react/i, /_react/i, /react-dom/i, /ReactDOM/i, /data-reactid/i, /data-reactroot/i],
    category: 'Frontend Framework',
    files: ['/static/js/', '/assets/', '/_next/', '/react'],
    headers: ['x-react'],
    meta: ['generator'],
    elements: ['<div id="root">', '<div id="react-root">'],
    cssClasses: ['react-', 'jsx-'],
  },
  'Vue.js': {
    patterns: [/vue\.js/i, /vue@/i, /__vue/i, /Vue\(/i, /v-if/i, /v-for/i, /v-model/i],
    category: 'Frontend Framework',
    files: ['/js/vue', '/dist/vue'],
    headers: ['x-vue'],
    elements: ['<div id="app">', 'v-if', 'v-for'],
    cssClasses: ['v-'],
  },
  'Angular': {
    patterns: [/angular/i, /ng-/i, /@angular/i, /AngularJS/i],
    category: 'Frontend Framework',
    files: ['/angular', '/ng-'],
    headers: ['x-angular'],
    elements: ['<app-root>', 'ng-app', 'ng-controller'],
    cssClasses: ['ng-'],
  },
  'Next.js': {
    patterns: [/next\.js/i, /_next/i, /nextjs/i, /__NEXT_DATA__/i],
    category: 'Frontend Framework',
    files: ['/_next/static/', '/_next/'],
    headers: ['x-nextjs'],
    elements: ['<script id="__NEXT_DATA__">'],
  },
  'Nuxt.js': {
    patterns: [/nuxt/i, /_nuxt/i, /__NUXT__/i],
    category: 'Frontend Framework',
    files: ['/_nuxt/'],
    elements: ['<div id="__nuxt">'],
  },
  
  // CSS Frameworks
  'Bootstrap': {
    patterns: [/bootstrap/i, /btn-/i, /col-/i, /container-fluid/i],
    category: 'CSS Framework',
    files: ['/bootstrap', '/css/bootstrap'],
    cssClasses: ['container', 'row', 'col-', 'btn-', 'navbar'],
  },
  'Tailwind CSS': {
    patterns: [/tailwind/i, /bg-\w+/i, /text-\w+/i, /flex/i, /grid/i],
    category: 'CSS Framework',
    files: ['/tailwind'],
    cssClasses: ['bg-', 'text-', 'p-', 'm-', 'w-', 'h-'],
  },
  'Bulma': {
    patterns: [/bulma/i, /is-\w+/i, /has-\w+/i],
    category: 'CSS Framework',
    cssClasses: ['is-', 'has-', 'column', 'columns'],
  },
  
  // JavaScript Libraries
  'jQuery': {
    patterns: [/jquery/i, /\$\(/i, /jQuery/i],
    category: 'JavaScript Library',
    files: ['/jquery', '/js/jquery'],
  },
  'Lodash': {
    patterns: [/lodash/i, /_\./i],
    category: 'JavaScript Library',
  },
  
  // Backend Technologies
  'Node.js': {
    patterns: [/node\.js/i, /nodejs/i],
    category: 'Backend Runtime',
    headers: ['x-powered-by'],
  },
  'Express': {
    patterns: [/express/i],
    category: 'Backend Framework',
    headers: ['x-powered-by'],
  },
  'Django': {
    patterns: [/django/i, /csrftoken/i],
    category: 'Backend Framework',
    headers: ['x-django'],
    cookies: ['csrftoken', 'sessionid'],
  },
  'Laravel': {
    patterns: [/laravel/i, /laravel_session/i],
    category: 'Backend Framework',
    cookies: ['laravel_session'],
  },
  'ASP.NET': {
    patterns: [/asp\.net/i, /aspnet/i, /__VIEWSTATE/i],
    category: 'Backend Framework',
    headers: ['x-powered-by'],
    elements: ['__VIEWSTATE', '__EVENTVALIDATION'],
  },
  'PHP': {
    patterns: [/php/i, /\.php/i],
    category: 'Backend Language',
    headers: ['x-powered-by'],
    cookies: ['PHPSESSID'],
  },
  
  // CMS
  'WordPress': {
    patterns: [/wp-content/i, /wp-includes/i, /wordpress/i, /wp-admin/i],
    category: 'Content Management System',
    files: ['/wp-content/', '/wp-includes/'],
    meta: ['generator'],
  },
  'Drupal': {
    patterns: [/drupal/i, /sites\/default/i, /sites\/all/i],
    category: 'Content Management System',
    meta: ['generator'],
  },
  'Joomla': {
    patterns: [/joomla/i, /administrator\/index\.php/i],
    category: 'Content Management System',
    meta: ['generator'],
  },
  
  // CDN & Services
  'Cloudflare': {
    patterns: [/cloudflare/i],
    category: 'CDN',
    headers: ['cf-ray', 'server'],
  },
  'Amazon CloudFront': {
    patterns: [/cloudfront/i],
    category: 'CDN',
    headers: ['x-amz-cf-id'],
  },
  
  // Analytics
  'Google Analytics': {
    patterns: [/google-analytics/i, /gtag/i, /ga\(/i, /googletagmanager/i],
    category: 'Analytics',
  },
  'Google Tag Manager': {
    patterns: [/googletagmanager/i, /gtm\.js/i],
    category: 'Analytics',
  },
  
  // Databases (from error messages or exposed info)
  'MongoDB': {
    patterns: [/mongodb/i, /mongo/i],
    category: 'Database',
  },
  'PostgreSQL': {
    patterns: [/postgresql/i, /postgres/i],
    category: 'Database',
  },
  'MySQL': {
    patterns: [/mysql/i],
    category: 'Database',
  },
  'Redis': {
    patterns: [/redis/i],
    category: 'Database',
  },
  'Supabase': {
    patterns: [/supabase/i, /supabase\.co/i],
    category: 'Backend Service',
  },
};

async function fetchWebsiteData(url: string, searchMode: string) {
  const startTime = Date.now();
  
  try {
    // Ensure URL has protocol
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

  // Detect from HTML content
  for (const [techName, techData] of Object.entries(TECH_PATTERNS)) {
    let confidence = 0;
    const detectedPatterns: string[] = [];
    
    // Check patterns in HTML
    for (const pattern of techData.patterns) {
      if (pattern.test(html)) {
        confidence += 0.3;
        detectedPatterns.push(pattern.toString());
      }
    }
    
    // Check file paths
    if (techData.files) {
      for (const file of techData.files) {
        if (htmlLower.includes(file.toLowerCase())) {
          confidence += 0.25;
          detectedPatterns.push(`file: ${file}`);
        }
      }
    }
    
    // Check headers
    if (techData.headers) {
      for (const header of techData.headers) {
        if (headers[header] || headers[header.toLowerCase()]) {
          confidence += 0.4;
          detectedPatterns.push(`header: ${header}`);
        }
      }
    }

    // Check CSS classes
    if (techData.cssClasses) {
      for (const cssClass of techData.cssClasses) {
        const classRegex = new RegExp(`class="[^"]*${cssClass}`, 'i');
        if (classRegex.test(html)) {
          confidence += 0.2;
          detectedPatterns.push(`CSS class: ${cssClass}`);
        }
      }
    }

    // Check HTML elements
    if (techData.elements) {
      for (const element of techData.elements) {
        if (htmlLower.includes(element.toLowerCase())) {
          confidence += 0.3;
          detectedPatterns.push(`HTML element: ${element}`);
        }
      }
    }

    // Check cookies in Set-Cookie headers
    if (techData.cookies) {
      const setCookieHeader = headers['set-cookie'] || headers['Set-Cookie'] || '';
      for (const cookie of techData.cookies) {
        if (setCookieHeader.includes(cookie)) {
          confidence += 0.3;
          detectedPatterns.push(`cookie: ${cookie}`);
        }
      }
    }
    
    // Advanced detection for specific technologies
    if (options.analyzeMetaTags && techData.meta) {
      const metaRegex = /<meta[^>]*name=['"](generator|application-name)['"]/gi;
      const metaMatches = html.match(metaRegex);
      if (metaMatches) {
        for (const match of metaMatches) {
          if (match.toLowerCase().includes(techName.toLowerCase())) {
            confidence += 0.4;
            detectedPatterns.push('meta tag');
          }
        }
      }
    }
    
    if (confidence > 0.2) {
      technologies.push({
        name: techName,
        category: techData.category,
        confidence: Math.min(confidence, 1),
        detectionMethod: confidence > 0.7 ? 'High Confidence Detection' : 'Pattern Matching',
        patterns: detectedPatterns,
      });
    }
  }

  // Check custom patterns
  for (const pattern of customPatterns) {
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
  }

  return technologies;
}

function performDeepAnalysis(html: string, options: any) {
  const findings: DetectedTechnology[] = [];
  
  if (options.analyzeHtmlComments) {
    const commentRegex = /<!--(.*?)-->/gs;
    const comments = html.match(commentRegex) || [];
    
    for (const comment of comments) {
      const commentText = comment.toLowerCase();
      
      // Check for framework indicators in comments
      if (commentText.includes('react')) {
        findings.push({
          name: 'React',
          category: 'Frontend Framework',
          confidence: 0.6,
          detectionMethod: 'HTML Comment Analysis',
          patterns: ['HTML comments'],
        });
      }
      
      if (commentText.includes('wordpress') || commentText.includes('wp')) {
        findings.push({
          name: 'WordPress',
          category: 'Content Management System',
          confidence: 0.7,
          detectionMethod: 'HTML Comment Analysis',
          patterns: ['HTML comments'],
        });
      }

      if (commentText.includes('angular')) {
        findings.push({
          name: 'Angular',
          category: 'Frontend Framework',
          confidence: 0.6,
          detectionMethod: 'HTML Comment Analysis',
          patterns: ['HTML comments'],
        });
      }

      if (commentText.includes('vue')) {
        findings.push({
          name: 'Vue.js',
          category: 'Frontend Framework',
          confidence: 0.6,
          detectionMethod: 'HTML Comment Analysis',
          patterns: ['HTML comments'],
        });
      }
    }
  }
  
  if (options.detectCustomElements) {
    // Look for custom HTML elements that might indicate frameworks
    const customElementRegex = /<([a-z]+-[a-z-]+)/gi;
    const customElements = html.match(customElementRegex) || [];
    
    if (customElements.length > 0) {
      findings.push({
        name: 'Web Components',
        category: 'Frontend Technology',
        confidence: 0.5,
        detectionMethod: 'Custom Element Detection',
        patterns: customElements.slice(0, 3),
      });
    }

    // Check for specific framework elements
    if (html.includes('<app-root>') || html.includes('ng-app')) {
      findings.push({
        name: 'Angular',
        category: 'Frontend Framework',
        confidence: 0.8,
        detectionMethod: 'Custom Element Detection',
        patterns: ['<app-root>', 'ng-app'],
      });
    }
  }
  
  if (options.analyzeFilePaths) {
    // Extract script and link sources
    const scriptRegex = /<script[^>]*src=['"](.*?)['"]/gi;
    const linkRegex = /<link[^>]*href=['"](.*?)['"]/gi;
    
    const scripts = Array.from(html.matchAll(scriptRegex)).map(match => match[1]);
    const links = Array.from(html.matchAll(linkRegex)).map(match => match[1]);
    
    const allPaths = [...scripts, ...links];
    
    // Analyze paths for technology indicators
    for (const path of allPaths) {
      if (path.includes('webpack')) {
        findings.push({
          name: 'Webpack',
          category: 'Build Tool',
          confidence: 0.8,
          detectionMethod: 'File Path Analysis',
          patterns: [path],
        });
      }
      
      if (path.includes('vite')) {
        findings.push({
          name: 'Vite',
          category: 'Build Tool',
          confidence: 0.8,
          detectionMethod: 'File Path Analysis',
          patterns: [path],
        });
      }

      if (path.includes('parcel')) {
        findings.push({
          name: 'Parcel',
          category: 'Build Tool',
          confidence: 0.8,
          detectionMethod: 'File Path Analysis',
          patterns: [path],
        });
      }

      // Check for CMS-specific paths
      if (path.includes('/wp-content/themes/')) {
        findings.push({
          name: 'WordPress',
          category: 'Content Management System',
          confidence: 0.9,
          detectionMethod: 'File Path Analysis',
          patterns: [path],
        });
      }

      if (path.includes('/app/controllers/') || path.includes('/assets/')) {
        findings.push({
          name: 'Ruby on Rails',
          category: 'Backend Framework',
          confidence: 0.7,
          detectionMethod: 'File Path Analysis',
          patterns: [path],
        });
      }
    }
  }
  
  return findings;
}

async function generateAIPatterns(html: string, url: string, existingTechnologies: DetectedTechnology[]) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('OpenAI API key not found, skipping AI pattern generation');
    return [];
  }

  try {
    const truncatedHtml = html.slice(0, 6000);
    const existingTechNames = existingTechnologies.map(t => t.name).join(', ');
    
    const prompt = `Analyze this website HTML and generate specific search patterns that could help detect additional technologies:

URL: ${url}
HTML Sample: ${truncatedHtml}
Already detected: ${existingTechNames}

Based on the HTML structure, file references, CSS classes, and JavaScript patterns, suggest 10-15 specific search patterns (regex-friendly strings) that could help identify additional technologies, frameworks, or tools not yet detected.

Focus on:
1. Unique CSS class prefixes or naming conventions
2. Specific JavaScript function names or variables
3. Unique HTML attributes or data attributes
4. File path patterns
5. Meta tag values
6. Comments patterns
7. Inline script patterns

Return only a JSON array of strings (the patterns), nothing else.`;

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
            content: 'You are a web technology expert. Generate specific search patterns to detect web technologies. Return only valid JSON arrays.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    try {
      const patterns = JSON.parse(content);
      return Array.isArray(patterns) ? patterns : [];
    } catch {
      // Try to extract patterns from non-JSON response
      const patternMatches = content.match(/"([^"]+)"/g);
      return patternMatches ? patternMatches.map((p: string) => p.replace(/"/g, '')) : [];
    }
  } catch (error) {
    console.error('AI pattern generation error:', error);
    return [];
  }
}

async function performAIAnalysis(html: string, url: string, technologies: DetectedTechnology[]) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAIApiKey) {
    console.log('OpenAI API key not found, skipping AI analysis');
    return null;
  }

  try {
    // Truncate HTML for AI analysis (to stay within token limits)
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
      // If JSON parsing fails, return a basic structure
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
        },
        customPatterns = []
      } = requestData;

      console.log('Starting enhanced analysis for URLs:', urls);
      console.log('Search mode:', searchMode);
      console.log('Deep search enabled:', deepSearchEnabled);
      console.log('AI analysis enabled:', aiAnalysisEnabled);
      console.log('AI pattern detection:', deepSearchOptions.aiPatternDetection);

      const jobId = crypto.randomUUID();
      const results: AnalysisResult[] = [];
      
      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        console.log(`Processing URL ${i + 1}/${urls.length}: ${url}`);
        
        try {
          // Fetch website data
          const websiteData = await fetchWebsiteData(url, searchMode);
          
          // Detect technologies with enhanced patterns
          let technologies = detectTechnologies(
            websiteData.html, 
            websiteData.headers, 
            deepSearchOptions,
            customPatterns
          );
          
          // Perform deep analysis if enabled
          if (deepSearchEnabled) {
            const deepFindings = performDeepAnalysis(websiteData.html, deepSearchOptions);
            technologies = [...technologies, ...deepFindings];
          }

          // Generate AI patterns if enabled
          let aiGeneratedPatterns: string[] = [];
          if (deepSearchOptions.aiPatternDetection && aiAnalysisEnabled) {
            console.log('Generating AI patterns for:', url);
            aiGeneratedPatterns = await generateAIPatterns(websiteData.html, url, technologies);
            
            // Use AI-generated patterns for additional detection
            for (const pattern of aiGeneratedPatterns) {
              try {
                const regex = new RegExp(pattern, 'i');
                if (regex.test(websiteData.html)) {
                  technologies.push({
                    name: `AI-Detected: ${pattern}`,
                    category: 'AI Pattern Detection',
                    confidence: 0.7,
                    detectionMethod: 'AI-Generated Pattern',
                    patterns: [pattern],
                  });
                }
              } catch (error) {
                console.log('Invalid regex pattern generated:', pattern);
              }
            }
          }
          
          // Remove duplicates and sort by confidence
          const uniqueTechs = technologies.reduce((acc, tech) => {
            const existing = acc.find(t => t.name === tech.name);
            if (!existing || existing.confidence < tech.confidence) {
              acc = acc.filter(t => t.name !== tech.name);
              acc.push(tech);
            }
            return acc;
          }, [] as DetectedTechnology[]);
          
          uniqueTechs.sort((a, b) => b.confidence - a.confidence);

          // Extract metadata
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

          // Perform AI analysis if enabled
          if (aiAnalysisEnabled) {
            console.log('Performing enhanced AI analysis for:', url);
            const aiResult = await performAIAnalysis(websiteData.html, url, uniqueTechs);
            if (aiResult) {
              result.aiAnalysis = {
                ...aiResult,
                aiGeneratedPatterns: aiGeneratedPatterns,
              };
            }
          }

          results.push(result);

          // Store in database
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

          await supabase.from('website_scans').insert({
            url,
            status: 'failed',
            error_message: error.message,
            response_time: 0,
          });
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
