
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

interface SocialMediaIntegration {
  platform: string;
  type: 'icon' | 'share_button' | 'embedded_feed' | 'social_login' | 'comment_system' | 'widget' | 'pixel' | 'tracking';
  confidence: number;
  evidence: string[];
  urls?: string[];
}

interface SocialMediaAnalysis {
  integrations: SocialMediaIntegration[];
  totalPlatforms: number;
  engagementFeatures: string[];
  socialLoginOptions: string[];
}

// Social media detection patterns
const SOCIAL_MEDIA_PATTERNS = {
  facebook: {
    scripts: [
      'connect.facebook.net',
      'facebook.com/tr',
      'fbevents.js',
      'facebook.net/en_US/fbds.js'
    ],
    selectors: [
      'a[href*="facebook.com"]',
      '.fb-like',
      '.fb-share',
      '.fb-comments',
      '[class*="facebook"]'
    ],
    pixels: ['fbq(', 'facebook-pixel', 'FB_PIXEL_ID'],
    widgets: ['fb-like-box', 'fb-page', 'fb-comments']
  },
  google: {
    scripts: [
      'googletagmanager.com',
      'google-analytics.com',
      'googlesyndication.com',
      'youtube.com/iframe_api'
    ],
    selectors: [
      'iframe[src*="youtube.com"]',
      'a[href*="youtube.com"]',
      'a[href*="plus.google.com"]'
    ],
    pixels: ['gtag(', 'ga(', 'google-analytics'],
    widgets: ['youtube-player', 'g-plusone']
  },
  twitter: {
    scripts: [
      'platform.twitter.com',
      'syndication.twitter.com',
      'twitter.com/widgets.js'
    ],
    selectors: [
      'a[href*="twitter.com"]',
      'a[href*="x.com"]',
      '.twitter-tweet',
      '[class*="twitter"]'
    ],
    pixels: ['twq(', 'twitter-pixel'],
    widgets: ['twitter-timeline', 'twitter-tweet']
  },
  linkedin: {
    scripts: [
      'platform.linkedin.com',
      'linkedin.com/analytics',
      'snap.licdn.com'
    ],
    selectors: [
      'a[href*="linkedin.com"]',
      '.linkedin-share',
      '[class*="linkedin"]'
    ],
    pixels: ['_linkedin_partner_id', 'linkedin-insight'],
    widgets: ['linkedin-share']
  },
  instagram: {
    scripts: [
      'instagram.com/embed.js',
      'platform.instagram.com'
    ],
    selectors: [
      'a[href*="instagram.com"]',
      'blockquote[class*="instagram"]',
      '[class*="instagram"]'
    ],
    pixels: [],
    widgets: ['instagram-media']
  },
  tiktok: {
    scripts: [
      'tiktok.com/embed.js',
      'analytics.tiktok.com'
    ],
    selectors: [
      'a[href*="tiktok.com"]',
      'blockquote[class*="tiktok"]'
    ],
    pixels: ['ttq(', 'tiktok-pixel'],
    widgets: ['tiktok-embed']
  },
  pinterest: {
    scripts: [
      'assets.pinterest.com',
      'pinterest.com/v3/pidgets'
    ],
    selectors: [
      'a[href*="pinterest.com"]',
      '[data-pin-do]',
      '.pin-it'
    ],
    pixels: [],
    widgets: ['pinterest-pin']
  }
};

function analyzeSocialMedia(htmlContent: string, scripts: string[]): SocialMediaAnalysis {
  const integrations: SocialMediaIntegration[] = [];
  const engagementFeatures: string[] = [];
  const socialLoginOptions: string[] = [];

  // Analyze each platform
  Object.entries(SOCIAL_MEDIA_PATTERNS).forEach(([platform, patterns]) => {
    const platformIntegrations = detectPlatformIntegrations(platform, patterns, htmlContent, scripts);
    integrations.push(...platformIntegrations);
  });

  // Detect social sharing features
  const shareButtons = htmlContent.match(/share|social-share|addthis|sharethis/gi);
  if (shareButtons) {
    engagementFeatures.push(`Social sharing buttons (${shareButtons.length} found)`);
  }

  // Detect social login
  const loginPatterns = htmlContent.match(/facebook.*login|google.*login|twitter.*login|linkedin.*login/gi);
  if (loginPatterns) {
    loginPatterns.forEach(pattern => {
      if (pattern.toLowerCase().includes('facebook')) socialLoginOptions.push('Facebook Login');
      if (pattern.toLowerCase().includes('google')) socialLoginOptions.push('Google Login');
      if (pattern.toLowerCase().includes('twitter')) socialLoginOptions.push('Twitter Login');
      if (pattern.toLowerCase().includes('linkedin')) socialLoginOptions.push('LinkedIn Login');
    });
  }

  return {
    integrations,
    totalPlatforms: new Set(integrations.map(i => i.platform)).size,
    engagementFeatures: [...new Set(engagementFeatures)],
    socialLoginOptions: [...new Set(socialLoginOptions)]
  };
}

function detectPlatformIntegrations(platform: string, patterns: any, htmlContent: string, scripts: string[]): SocialMediaIntegration[] {
  const integrations: SocialMediaIntegration[] = [];

  // Check for tracking pixels
  patterns.pixels.forEach((pixelPattern: string) => {
    if (htmlContent.includes(pixelPattern)) {
      integrations.push({
        platform,
        type: 'pixel',
        confidence: 0.9,
        evidence: [`Tracking pixel detected: ${pixelPattern}`]
      });
    }
  });

  // Check for scripts
  patterns.scripts.forEach((scriptPattern: string) => {
    const foundScripts = scripts.filter(script => script.includes(scriptPattern));
    if (foundScripts.length > 0) {
      integrations.push({
        platform,
        type: 'tracking',
        confidence: 0.95,
        evidence: [`Script integration: ${foundScripts.join(', ')}`]
      });
    }
  });

  // Check for widgets and embeds
  patterns.widgets.forEach((widget: string) => {
    if (htmlContent.includes(widget)) {
      integrations.push({
        platform,
        type: 'widget',
        confidence: 0.85,
        evidence: [`Widget detected: ${widget}`]
      });
    }
  });

  // Check for social links and buttons
  patterns.selectors.forEach((selector: string) => {
    const regex = new RegExp(selector.replace(/\[|\]/g, ''), 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      integrations.push({
        platform,
        type: 'share_button',
        confidence: 0.7,
        evidence: [`Social elements found: ${matches.length} matches`]
      });
    }
  });

  return integrations;
}

// Technology detection patterns
const TECHNOLOGY_PATTERNS = {
  'React': {
    category: 'Frontend Frameworks',
    patterns: [
      'react',
      '__REACT_DEVTOOLS_GLOBAL_HOOK__',
      'ReactDOM',
      'data-reactroot'
    ]
  },
  'Vue.js': {
    category: 'Frontend Frameworks', 
    patterns: [
      'Vue',
      'vue.js',
      'v-if',
      'v-for',
      '__VUE__'
    ]
  },
  'Angular': {
    category: 'Frontend Frameworks',
    patterns: [
      'angular',
      'ng-app',
      'ng-controller',
      'angular.module'
    ]
  },
  'jQuery': {
    category: 'JavaScript Libraries',
    patterns: [
      'jquery',
      'jQuery',
      '$.',
      'jquery.min.js'
    ]
  },
  'Bootstrap': {
    category: 'CSS Frameworks',
    patterns: [
      'bootstrap',
      'btn-primary',
      'container-fluid',
      'bootstrap.min.css'
    ]
  },
  'Tailwind CSS': {
    category: 'CSS Frameworks',
    patterns: [
      'tailwindcss',
      'tailwind.min.css',
      'tw-',
      'prose'
    ]
  },
  'Next.js': {
    category: 'Frontend Frameworks',
    patterns: [
      '__NEXT_DATA__',
      '_next/static',
      'next.js',
      '__next'
    ]
  },
  'Nuxt.js': {
    category: 'Frontend Frameworks',
    patterns: [
      '__NUXT__',
      'nuxt.js',
      '_nuxt/'
    ]
  },
  'WordPress': {
    category: 'Content Management',
    patterns: [
      'wp-content',
      'wp-includes',
      'wordpress',
      'wp-json'
    ]
  },
  'Shopify': {
    category: 'E-commerce',
    patterns: [
      'shopify',
      'myshopify.com',
      'Shopify.theme',
      'shop.js'
    ]
  },
  'Google Analytics': {
    category: 'Analytics & Tracking',
    patterns: [
      'google-analytics',
      'googletagmanager',
      'gtag(',
      'ga('
    ]
  },
  'Cloudflare': {
    category: 'CDN',
    patterns: [
      'cloudflare',
      'cf-ray',
      'cdnjs.cloudflare.com'
    ]
  }
};

function detectTechnologies(htmlContent: string, scripts: string[], headers: Record<string, string>): DetectedTechnology[] {
  const technologies: DetectedTechnology[] = [];

  Object.entries(TECHNOLOGY_PATTERNS).forEach(([techName, config]) => {
    const foundPatterns: string[] = [];
    let confidence = 0;

    config.patterns.forEach(pattern => {
      if (htmlContent.toLowerCase().includes(pattern.toLowerCase())) {
        foundPatterns.push(pattern);
        confidence += 0.3;
      }
      
      if (scripts.some(script => script.toLowerCase().includes(pattern.toLowerCase()))) {
        foundPatterns.push(`Script: ${pattern}`);
        confidence += 0.4;
      }
    });

    // Check headers for technology indicators
    Object.entries(headers).forEach(([key, value]) => {
      config.patterns.forEach(pattern => {
        if (value.toLowerCase().includes(pattern.toLowerCase())) {
          foundPatterns.push(`Header: ${key}`);
          confidence += 0.3;
        }
      });
    });

    if (foundPatterns.length > 0) {
      technologies.push({
        name: techName,
        category: config.category,
        confidence: Math.min(confidence, 1.0),
        detectionMethod: 'Pattern Matching',
        patterns: foundPatterns
      });
    }
  });

  return technologies;
}

async function fetchWebsiteData(url: string) {
  try {
    console.log(`Fetching data for: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const htmlContent = await response.text();
    const headers = Object.fromEntries(response.headers.entries());
    
    // Extract scripts from HTML
    const scriptMatches = htmlContent.match(/<script[^>]*src="([^"]*)"[^>]*>/gi) || [];
    const scripts = scriptMatches.map(match => {
      const srcMatch = match.match(/src="([^"]*)"/);
      return srcMatch ? srcMatch[1] : '';
    }).filter(Boolean);

    // Extract inline scripts
    const inlineScriptMatches = htmlContent.match(/<script[^>]*>(.*?)<\/script>/gis) || [];
    const inlineScripts = inlineScriptMatches.map(match => 
      match.replace(/<\/?script[^>]*>/gi, '')
    );

    // Extract metadata
    const titleMatch = htmlContent.match(/<title[^>]*>(.*?)<\/title>/i);
    const descriptionMatch = htmlContent.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);

    const allScriptContent = scripts.concat(inlineScripts).join(' ');

    return {
      htmlContent,
      scripts: scripts.concat(inlineScripts),
      headers,
      metadata: {
        title: titleMatch ? titleMatch[1].trim() : undefined,
        description: descriptionMatch ? descriptionMatch[1].trim() : undefined
      },
      allScriptContent
    };
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { urls, deepSearchEnabled, aiAnalysisEnabled } = await req.json();
    console.log('Analyzing URLs:', urls);

    const results = [];

    for (const url of urls) {
      const startTime = Date.now();
      
      try {
        const websiteData = await fetchWebsiteData(url);
        const responseTime = Date.now() - startTime;

        // Detect technologies
        const technologies = detectTechnologies(
          websiteData.htmlContent,
          websiteData.scripts,
          websiteData.headers
        );

        // Analyze social media integrations
        const socialMediaAnalysis = analyzeSocialMedia(
          websiteData.htmlContent,
          websiteData.scripts
        );

        console.log(`Found ${technologies.length} technologies and ${socialMediaAnalysis.integrations.length} social media integrations for ${url}`);

        results.push({
          url,
          status: 'completed',
          technologies,
          socialMediaAnalysis,
          metadata: {
            title: websiteData.metadata.title,
            description: websiteData.metadata.description,
            responseTime
          },
          htmlContent: websiteData.htmlContent.substring(0, 10000), // Limit size
          scripts: websiteData.scripts.slice(0, 20), // Limit array size
          links: [] // Could extract links if needed
        });

      } catch (error) {
        console.error(`Error analyzing ${url}:`, error);
        results.push({
          url,
          status: 'failed',
          error: error.message,
          technologies: [],
          socialMediaAnalysis: {
            integrations: [],
            totalPlatforms: 0,
            engagementFeatures: [],
            socialLoginOptions: []
          },
          metadata: { responseTime: Date.now() - startTime }
        });
      }
    }

    return new Response(
      JSON.stringify({
        jobId: Date.now(),
        status: 'completed',
        totalUrls: urls.length,
        processedUrls: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in analyze function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
