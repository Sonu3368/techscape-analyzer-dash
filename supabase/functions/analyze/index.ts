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
  performanceAnalysisEnabled?: boolean;
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
  performanceOptions?: {
    coreWebVitals: boolean;
    networkAnalysis: boolean;
    accessibilityCheck: boolean;
    seoAnalysis: boolean;
    codeQualityCheck: boolean;
    competitorAnalysis: boolean;
    competitorUrls: string[];
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
  performanceAnalysis?: {
    overallScore: number;
    executiveSummary: {
      criticalIssues: string[];
      topRecommendations: string[];
    };
    coreWebVitals: {
      lcp: { value: number; score: number; severity: string; description: string; recommendation: string };
      cls: { value: string; score: number; severity: string; description: string; recommendation: string };
      inp: { value: number; score: number; severity: string; description: string; recommendation: string };
    };
    sections: {
      network: {
        title: string;
        metrics: { name: string; value: string; score: number; severity: string; description: string; recommendation: string; codeExample: { bad: string; good: string } }[];
        insights: string[];
      };
      html: { title: string; metrics: any[]; insights: any[] };
      css: { title: string; metrics: any[]; insights: any[] };
      javascript: { title: string; metrics: any[]; insights: any[] };
      accessibility: { title: string; metrics: any[]; insights: any[] };
      seo: { title: string; metrics: any[]; insights: any[] };
    };
  };
}

// Enhanced technology detection patterns with deeper analysis capabilities
const TECH_PATTERNS = {
  // Frontend Frameworks with enhanced detection
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
    elements: ['<app-root>', 'ng-app', 'ng-controller', 'ng-repeat', '[ngFor]', '*ngIf'],
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
  'Nuxt.js': {
    patterns: [/nuxt/i, /_nuxt/i, /__NUXT__/i],
    category: 'Frontend Framework',
    files: ['/_nuxt/', '_nuxt'],
    elements: ['<div id="__nuxt">', '__NUXT__'],
    comments: ['nuxt', 'nuxtjs'],
  },
  
  // CSS Frameworks with enhanced detection
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
  'Bulma': {
    patterns: [/bulma/i, /is-\w+/i, /has-\w+/i],
    category: 'CSS Framework',
    files: ['/bulma', 'bulma.css'],
    cssClasses: ['is-', 'has-', 'column', 'columns', 'button', 'field'],
    comments: ['bulma'],
  },
  'Foundation': {
    patterns: [/foundation/i, /zurb/i],
    category: 'CSS Framework',
    files: ['/foundation', 'foundation.css'],
    cssClasses: ['grid-x', 'cell', 'callout', 'reveal'],
    comments: ['foundation', 'zurb'],
  },
  
  // JavaScript Libraries with enhanced detection
  'jQuery': {
    patterns: [/jquery/i, /\$\(/i, /jQuery/i],
    category: 'JavaScript Library',
    files: ['/jquery', '/js/jquery', 'jquery.min.js', 'jquery.js'],
    inlineScripts: ['$(document)', 'jQuery(', '$.ajax'],
    comments: ['jquery', 'john resig'],
  },
  'Lodash': {
    patterns: [/lodash/i, /_\./i],
    category: 'JavaScript Library',
    files: ['lodash.min.js', 'lodash.js'],
    inlineScripts: ['_.map', '_.filter', '_.reduce'],
    comments: ['lodash'],
  },
  'D3.js': {
    patterns: [/d3\.js/i, /d3\./i],
    category: 'Data Visualization',
    files: ['d3.min.js', 'd3.js'],
    inlineScripts: ['d3.select', 'd3.scale'],
    comments: ['d3', 'data driven documents'],
  },
  
  // Backend Technologies with enhanced detection
  'Node.js': {
    patterns: [/node\.js/i, /nodejs/i],
    category: 'Backend Runtime',
    headers: ['x-powered-by'],
    cookies: ['connect.sid', 'express-session'],
    comments: ['node.js', 'nodejs'],
  },
  'Express': {
    patterns: [/express/i],
    category: 'Backend Framework',
    headers: ['x-powered-by'],
    cookies: ['connect.sid'],
    comments: ['express', 'expressjs'],
  },
  'Django': {
    patterns: [/django/i, /csrftoken/i],
    category: 'Backend Framework',
    headers: ['x-django'],
    cookies: ['csrftoken', 'sessionid', 'django_language'],
    comments: ['django'],
  },
  'Laravel': {
    patterns: [/laravel/i, /laravel_session/i],
    category: 'Backend Framework',
    cookies: ['laravel_session', 'XSRF-TOKEN'],
    comments: ['laravel'],
  },
  'ASP.NET': {
    patterns: [/asp\.net/i, /aspnet/i, /__VIEWSTATE/i],
    category: 'Backend Framework',
    headers: ['x-powered-by', 'x-aspnet-version'],
    elements: ['__VIEWSTATE', '__EVENTVALIDATION', 'aspNetHidden'],
    cookies: ['ASP.NET_SessionId'],
    comments: ['asp.net', 'microsoft'],
  },
  'PHP': {
    patterns: [/php/i, /\.php/i],
    category: 'Backend Language',
    headers: ['x-powered-by'],
    cookies: ['PHPSESSID'],
    comments: ['php'],
  },
  'Ruby on Rails': {
    patterns: [/rails/i, /ruby/i],
    category: 'Backend Framework',
    headers: ['x-powered-by'],
    cookies: ['_session_id'],
    files: ['/app/controllers/', '/assets/'],
    comments: ['rails', 'ruby on rails'],
  },
  
  // CMS with enhanced detection
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
  'Drupal': {
    patterns: [/drupal/i, /sites\/default/i, /sites\/all/i],
    category: 'Content Management System',
    files: ['/sites/default/', '/sites/all/'],
    meta: ['generator'],
    cssClasses: ['drupal'],
    comments: ['drupal'],
  },
  'Joomla': {
    patterns: [/joomla/i, /administrator\/index\.php/i],
    category: 'Content Management System',
    files: ['/administrator/', '/components/'],
    meta: ['generator'],
    comments: ['joomla'],
  },
  'Shopify': {
    patterns: [/shopify/i, /cdn\.shopify/i],
    category: 'E-commerce Platform',
    files: ['/cdn.shopify.com/', '/shopify/'],
    meta: ['generator'],
    comments: ['shopify'],
  },
  
  // CDN & Services with enhanced detection
  'Cloudflare': {
    patterns: [/cloudflare/i],
    category: 'CDN',
    headers: ['cf-ray', 'server', 'cf-cache-status'],
    comments: ['cloudflare'],
  },
  'Amazon CloudFront': {
    patterns: [/cloudfront/i],
    category: 'CDN',
    headers: ['x-amz-cf-id', 'x-cache'],
    files: ['cloudfront.net'],
    comments: ['cloudfront', 'amazon'],
  },
  'Google Cloud CDN': {
    patterns: [/gstatic/i, /googleapis/i],
    category: 'CDN',
    files: ['gstatic.com', 'googleapis.com'],
    comments: ['google', 'gstatic'],
  },
  
  // Analytics with enhanced detection
  'Google Analytics': {
    patterns: [/google-analytics/i, /gtag/i, /ga\(/i, /googletagmanager/i],
    category: 'Analytics',
    files: ['google-analytics.com', 'googletagmanager.com'],
    inlineScripts: ['gtag(', 'ga(', 'GoogleAnalyticsObject'],
    comments: ['google analytics', 'gtag'],
  },
  'Google Tag Manager': {
    patterns: [/googletagmanager/i, /gtm\.js/i],
    category: 'Analytics',
    files: ['googletagmanager.com'],
    elements: ['<!-- Google Tag Manager -->'],
    inlineScripts: ['dataLayer.push'],
    comments: ['google tag manager', 'gtm'],
  },
  'Adobe Analytics': {
    patterns: [/adobe analytics/i, /omniture/i, /s_code/i],
    category: 'Analytics',
    inlineScripts: ['s.t()', 's_code'],
    comments: ['adobe analytics', 'omniture'],
  },
  
  // Databases (from error messages or exposed info)
  'MongoDB': {
    patterns: [/mongodb/i, /mongo/i],
    category: 'Database',
    comments: ['mongodb', 'mongo'],
  },
  'PostgreSQL': {
    patterns: [/postgresql/i, /postgres/i],
    category: 'Database',
    comments: ['postgresql', 'postgres'],
  },
  'MySQL': {
    patterns: [/mysql/i],
    category: 'Database',
    comments: ['mysql'],
  },
  'Redis': {
    patterns: [/redis/i],
    category: 'Database',
    comments: ['redis'],
  },
  'Supabase': {
    patterns: [/supabase/i, /supabase\.co/i],
    category: 'Backend Service',
    files: ['supabase.co'],
    comments: ['supabase'],
  },
  'Firebase': {
    patterns: [/firebase/i, /firebaseapp/i],
    category: 'Backend Service',
    files: ['firebase', 'firebaseapp.com'],
    inlineScripts: ['firebase.initializeApp'],
    comments: ['firebase', 'google firebase'],
  },
  
  // Build Tools and Bundlers
  'Webpack': {
    patterns: [/webpack/i, /__webpack/i],
    category: 'Build Tool',
    files: ['webpack', '__webpack'],
    inlineScripts: ['__webpack_require__', 'webpackJsonp'],
    comments: ['webpack'],
  },
  'Vite': {
    patterns: [/vite/i, /@vite/i],
    category: 'Build Tool',
    files: ['/@vite/', '/vite/'],
    comments: ['vite'],
  },
  'Parcel': {
    patterns: [/parcel/i],
    category: 'Build Tool',
    comments: ['parcel'],
  },
  'Rollup': {
    patterns: [/rollup/i],
    category: 'Build Tool',
    comments: ['rollup'],
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
          
          // Extract version from headers if possible
          const versionMatch = headerValue.match(/(\d+\.\d+(?:\.\d+)?)/);
          if (versionMatch && !techData.version) {
            techData.version = versionMatch[1];
          }
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

    // HTML elements and attributes detection
    if (techData.elements && options.detectCustomElements) {
      for (const element of techData.elements) {
        if (htmlLower.includes(element.toLowerCase())) {
          confidence += 0.3;
          detectedPatterns.push(`HTML element: ${element}`);
        }
      }
    }

    // Cookie pattern detection
    if (techData.cookies && options.analyzeCookiePatterns) {
      const setCookieHeader = headers['set-cookie'] || headers['Set-Cookie'] || '';
      for (const cookie of techData.cookies) {
        if (setCookieHeader.includes(cookie)) {
          confidence += 0.3;
          detectedPatterns.push(`Cookie: ${cookie}`);
        }
      }
    }

    // HTML comments analysis
    if (techData.comments && options.analyzeHtmlComments) {
      for (const comment of techData.comments) {
        const commentRegex = new RegExp(`<!--[^>]*${comment}[^>]*-->`, 'gi');
        if (commentRegex.test(html)) {
          confidence += 0.25;
          detectedPatterns.push(`HTML comment: ${comment}`);
        }
      }
    }

    // Inline scripts analysis
    if (techData.inlineScripts && options.analyzeInlineScripts) {
      for (const script of techData.inlineScripts) {
        const scriptRegex = new RegExp(script.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        if (scriptRegex.test(html)) {
          confidence += 0.3;
          detectedPatterns.push(`Inline script: ${script}`);
        }
      }
    }
    
    // Meta tags analysis for generators and other indicators
    if (options.analyzeMetaTags && techData.meta) {
      const metaRegex = /<meta[^>]*name=['"](generator|application-name)['"]/gi;
      const metaMatches = html.match(metaRegex);
      if (metaMatches) {
        for (const match of metaMatches) {
          if (match.toLowerCase().includes(techName.toLowerCase())) {
            confidence += 0.4;
            detectedPatterns.push(`Meta tag: ${match}`);
            
            // Extract version from meta tags
            const versionMatch = match.match(/(\d+\.\d+(?:\.\d+)?)/);
            if (versionMatch) {
              techData.version = versionMatch[1];
            }
          }
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

function performDeepAnalysis(html: string, options: any) {
  const findings: DetectedTechnology[] = [];
  
  // Enhanced HTML comments analysis
  if (options.analyzeHtmlComments) {
    const commentRegex = /<!--(.*?)-->/gs;
    const comments = html.match(commentRegex) || [];
    
    for (const comment of comments) {
      const commentText = comment.toLowerCase();
      
      // Check for more framework indicators in comments
      const frameworkIndicators = {
        'React': ['react', 'jsx', 'facebook'],
        'Vue.js': ['vue', 'evan you'],
        'Angular': ['angular', 'google'],
        'WordPress': ['wordpress', 'wp'],
        'Drupal': ['drupal'],
        'Joomla': ['joomla'],
        'jQuery': ['jquery', 'john resig'],
        'Bootstrap': ['bootstrap', 'twitter'],
        'Tailwind CSS': ['tailwind'],
      };

      for (const [tech, indicators] of Object.entries(frameworkIndicators)) {
        for (const indicator of indicators) {
          if (commentText.includes(indicator)) {
            findings.push({
              name: tech,
              category: 'Frontend Framework',
              confidence: 0.6,
              detectionMethod: 'HTML Comment Analysis',
              patterns: [`Comment contains: ${indicator}`],
            });
            break;
          }
        }
      }
    }
  }
  
  // Enhanced custom elements detection
  if (options.detectCustomElements) {
    // Look for custom HTML elements
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

    // Framework-specific elements
    const frameworkElements = {
      'Angular': ['<app-root>', 'ng-app', '[ngFor]', '*ngIf', '(click)', '[class]'],
      'Vue.js': ['v-if', 'v-for', 'v-model', ':class', '@click'],
      'React': ['data-reactroot', 'data-reactid'],
    };

    for (const [framework, elements] of Object.entries(frameworkElements)) {
      for (const element of elements) {
        if (html.includes(element)) {
          findings.push({
            name: framework,
            category: 'Frontend Framework',
            confidence: 0.8,
            detectionMethod: 'Framework Element Detection',
            patterns: [element],
          });
          break;
        }
      }
    }
  }
  
  // Enhanced file path analysis
  if (options.analyzeFilePaths) {
    // Extract all script and link sources
    const scriptRegex = /<script[^>]*src=['"](.*?)['"]/gi;
    const linkRegex = /<link[^>]*href=['"](.*?)['"]/gi;
    
    const scripts = Array.from(html.matchAll(scriptRegex)).map(match => match[1]);
    const links = Array.from(html.matchAll(linkRegex)).map(match => match[1]);
    
    const allPaths = [...scripts, ...links];
    
    // Analyze paths for technology indicators
    const pathIndicators = {
      'Webpack': ['webpack', '__webpack', 'webpackJsonp'],
      'Vite': ['/@vite/', '/vite/', '@vite'],
      'Parcel': ['parcel'],
      'WordPress': ['/wp-content/themes/', '/wp-content/plugins/', '/wp-includes/'],
      'Ruby on Rails': ['/app/controllers/', '/assets/'],
      'Django': ['/static/admin/', '/django/'],
      'Laravel': ['/vendor/laravel/'],
      'Next.js': ['/_next/static/', '/_next/'],
      'Nuxt.js': ['/_nuxt/'],
      'Shopify': ['/cdn.shopify.com/', '/assets/'],
    };

    for (const [tech, indicators] of Object.entries(pathIndicators)) {
      for (const path of allPaths) {
        for (const indicator of indicators) {
          if (path.includes(indicator)) {
            findings.push({
              name: tech,
              category: tech.includes('Webpack') || tech.includes('Vite') || tech.includes('Parcel') 
                       ? 'Build Tool' : 
                       tech.includes('WordPress') || tech.includes('Shopify') 
                       ? 'Content Management System' : 'Backend Framework',
              confidence: 0.8,
              detectionMethod: 'File Path Analysis',
              patterns: [path],
            });
            break;
          }
        }
      }
    }
  }
  
  // Enhanced inline script analysis
  if (options.analyzeInlineScripts) {
    const scriptBlocks = html.match(/<script[^>]*>(.*?)<\/script>/gis) || [];
    
    for (const script of scriptBlocks) {
      const scriptContent = script.toLowerCase();
      
      const scriptIndicators = {
        'Google Analytics': ['gtag(', 'ga(', 'googleanalyticsobject'],
        'Google Tag Manager': ['datalayer.push', 'gtm.js'],
        'jQuery': ['$(document)', 'jquery(', '$.ajax'],
        'React': ['react.createelement', 'reactdom.render'],
        'Vue.js': ['new vue(', 'vue.component'],
        'Angular': ['angular.module', 'ng-app'],
        'D3.js': ['d3.select', 'd3.scale'],
        'Firebase': ['firebase.initializeapp'],
      };

      for (const [tech, indicators] of Object.entries(scriptIndicators)) {
        for (const indicator of indicators) {
          if (scriptContent.includes(indicator)) {
            findings.push({
              name: tech,
              category: tech.includes('Analytics') || tech.includes('Tag Manager') 
                       ? 'Analytics' : 
                       tech.includes('Firebase') 
                       ? 'Backend Service' : 'JavaScript Library',
              confidence: 0.7,
              detectionMethod: 'Inline Script Analysis',
              patterns: [indicator],
            });
            break;
          }
        }
      }
    }
  }
  
  return findings;
}

async function generateAIPatterns(html: string, url: string, existingTechnologies: DetectedTechnology[]) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!geminiApiKey && !openAIApiKey) {
    console.log('No AI API keys found, skipping AI pattern generation');
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

    // Try Gemini first if available
    if (geminiApiKey) {
      console.log('Using Gemini for AI pattern generation');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 500,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (content) {
          try {
            const patterns = JSON.parse(content);
            return Array.isArray(patterns) ? patterns : [];
          } catch {
            // Try to extract patterns from non-JSON response
            const patternMatches = content.match(/"([^"]+)"/g);
            return patternMatches ? patternMatches.map((p: string) => p.replace(/"/g, '')) : [];
          }
        }
      }
    }

    // Fallback to OpenAI if Gemini fails or is not available
    if (openAIApiKey) {
      console.log('Using OpenAI for AI pattern generation');
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

      if (response.ok) {
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
      }
    }

    return [];
  } catch (error) {
    console.error('AI pattern generation error:', error);
    return [];
  }
}

async function performAIAnalysis(html: string, url: string, technologies: DetectedTechnology[]) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!geminiApiKey && !openAIApiKey) {
    console.log('No AI API keys found, skipping AI analysis');
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

    // Try Gemini first if available
    if (geminiApiKey) {
      console.log('Using Gemini for AI analysis');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1500,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (content) {
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
        }
      }
    }

    // Fallback to OpenAI if Gemini fails or is not available
    if (openAIApiKey) {
      console.log('Using OpenAI for AI analysis');
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

      if (response.ok) {
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
      }
    }

    return null;
  } catch (error) {
    console.error('AI analysis error:', error);
    return null;
  }
}

async function performComprehensivePerformanceAnalysis(html: string, url: string, headers: Record<string, string>, options: any) {
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!geminiApiKey && !openAIApiKey) {
    console.log('No AI API keys found, skipping performance analysis');
    return null;
  }

  try {
    const truncatedHtml = html.slice(0, 12000); // Larger sample for performance analysis
    
    const competitorContext = options.competitorAnalysis && options.competitorUrls.length > 0 
      ? `\n\nCOMPETITOR ANALYSIS: Compare with these competitor URLs: ${options.competitorUrls.join(', ')}`
      : '';

    const prompt = `Act as a Senior Full-Stack Performance Engineer. Conduct a deep, multi-layered analysis of this website.

URL: ${url}
HTML Sample: ${truncatedHtml}
HTTP Headers: ${JSON.stringify(headers)}${competitorContext}

Your analysis must be comprehensive, mimicking browser developer tools investigation. Provide a structured report with:

### 1. Executive Summary & Prioritized Actions
- Top 3-5 critical issues impacting UX, performance, and SEO
- Brief problem explanation and recommended fixes

### 2. Deep Analysis

**A. Network & Performance Waterfall Analysis**
- Initial load and render-blocking resources
- Resource optimization (compression, modern formats, caching)
- Core Web Vitals inference (LCP, CLS, INP)
- Connection analysis (HTTP version, TTFB)

**B. HTML, SEO & Accessibility Analysis**
- Semantic structure evaluation
- SEO metadata assessment
- Accessibility gaps identification
- DOM complexity analysis

**C. CSS & Styling Analysis**
- Efficiency and redundancy check
- Render-blocking CSS identification
- Responsiveness implementation
- Animation performance analysis

**D. JavaScript & Interactivity Analysis**
- Bundle size and execution analysis
- Third-party script impact
- Modern practices evaluation
- Performance bottleneck identification

### 3. Actionable Recommendations & Code Examples
For each recommendation:
- Clear problem statement
- Concrete solution
- Code examples (bad vs good)

Respond in JSON format with this structure:
{
  "overallScore": 85,
  "executiveSummary": {
    "criticalIssues": ["Issue 1", "Issue 2"],
    "topRecommendations": ["Rec 1", "Rec 2"]
  },
  "coreWebVitals": {
    "lcp": {"value": 2500, "score": 75, "severity": "warning", "description": "...", "recommendation": "..."},
    "cls": {"value": "0.15", "score": 60, "severity": "warning", "description": "...", "recommendation": "..."},
    "inp": {"value": 150, "score": 80, "severity": "good", "description": "...", "recommendation": "..."}
  },
  "sections": {
    "network": {
      "title": "Network & Performance",
      "metrics": [
        {
          "name": "Resource Compression",
          "value": "Partial",
          "score": 70,
          "severity": "warning",
          "description": "...",
          "recommendation": "...",
          "codeExample": {"bad": "...", "good": "..."}
        }
      ],
      "insights": ["Insight 1", "Insight 2"]
    },
    "html": {"title": "HTML & SEO", "metrics": [...], "insights": [...]},
    "css": {"title": "CSS & Styling", "metrics": [...], "insights": [...]},
    "javascript": {"title": "JavaScript", "metrics": [...], "insights": [...]},
    "accessibility": {"title": "Accessibility", "metrics": [...], "insights": [...]},
    "seo": {"title": "SEO Analysis", "metrics": [...], "insights": [...]}
  }
}`;

    // Try Gemini first if available (using Gemini Pro for more complex analysis)
    if (geminiApiKey) {
      console.log('Using Gemini for performance analysis');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4000,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (content) {
          try {
            return JSON.parse(content);
          } catch {
            console.error('Failed to parse Gemini performance analysis JSON');
            return null;
          }
        }
      }
    }

    // Fallback to OpenAI if Gemini fails or is not available
    if (openAIApiKey) {
      console.log('Using OpenAI for performance analysis');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'You are a Senior Full-Stack Performance Engineer. Provide comprehensive website performance analysis in valid JSON format with detailed metrics, scores, and actionable recommendations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
          return JSON.parse(content);
        } catch {
          console.error('Failed to parse OpenAI performance analysis JSON');
          return null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Performance analysis error:', error);
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
        performanceAnalysisEnabled = false,
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
        performanceOptions = {
          coreWebVitals: true,
          networkAnalysis: true,
          accessibilityCheck: true,
          seoAnalysis: true,
          codeQualityCheck: true,
          competitorAnalysis: false,
          competitorUrls: [],
        },
        customPatterns = []
      } = requestData;

      console.log('Starting comprehensive analysis for URLs:', urls);
      console.log('AI Analysis enabled with Gemini + OpenAI support:', aiAnalysisEnabled);
      console.log('Performance analysis enabled:', performanceAnalysisEnabled);

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

          // Perform AI analysis if enabled (now with Gemini + OpenAI support)
          if (aiAnalysisEnabled) {
            console.log('Performing AI analysis with Gemini/OpenAI for:', url);
            const aiResult = await performAIAnalysis(websiteData.html, url, uniqueTechs);
            if (aiResult) {
              result.aiAnalysis = aiResult;
            }
          }

          // Perform comprehensive performance analysis if enabled
          if (performanceAnalysisEnabled) {
            console.log('Performing comprehensive performance analysis for:', url);
            const performanceResult = await performComprehensivePerformanceAnalysis(
              websiteData.html, 
              url, 
              websiteData.headers, 
              performanceOptions
            );
            if (performanceResult) {
              result.performanceAnalysis = performanceResult;
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
