
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

// Enhanced technology detection patterns with deep search capabilities
const ENHANCED_TECHNOLOGY_PATTERNS = {
  'React': {
    category: 'Frontend Frameworks',
    patterns: {
      scripts: ['react', 'react-dom', 'react.min.js', 'react.production.min.js'],
      html: ['data-reactroot', '__REACT_DEVTOOLS_GLOBAL_HOOK__', 'ReactDOM'],
      headers: ['x-powered-by.*react'],
      meta: ['generator.*react'],
      files: ['_next/static', 'react-scripts'],
      css: ['react-', 'jsx-'],
      comments: ['React', 'ReactJS', 'Created with React']
    },
    versionPatterns: [
      'react@([\\d\\.]+)',
      'react.*?([\\d\\.]+)',
      '"react".*?"([\\d\\.]+)"'
    ]
  },
  'Vue.js': {
    category: 'Frontend Frameworks',
    patterns: {
      scripts: ['vue.js', 'vue.min.js', 'vue@', 'vuejs'],
      html: ['v-if', 'v-for', 'v-model', '__VUE__', 'Vue\\.', 'new Vue'],
      headers: ['x-powered-by.*vue'],
      meta: ['generator.*vue'],
      files: ['vue-', '.vue'],
      css: ['vue-', 'v-'],
      comments: ['Vue', 'VueJS', 'Built with Vue']
    },
    versionPatterns: [
      'vue@([\\d\\.]+)',
      'Vue.*?([\\d\\.]+)',
      '"vue".*?"([\\d\\.]+)"'
    ]
  },
  'Angular': {
    category: 'Frontend Frameworks',
    patterns: {
      scripts: ['angular', '@angular', 'angular.min.js'],
      html: ['ng-app', 'ng-controller', 'ng-', 'angular.module', '\\[ng-'],
      headers: ['x-powered-by.*angular'],
      meta: ['generator.*angular'],
      files: ['angular-', '@angular/'],
      css: ['ng-', 'angular-'],
      comments: ['Angular', 'AngularJS']
    },
    versionPatterns: [
      'angular@([\\d\\.]+)',
      '"@angular/core".*?"([\\d\\.]+)"'
    ]
  },
  'jQuery': {
    category: 'JavaScript Libraries',
    patterns: {
      scripts: ['jquery', 'jquery.min.js', 'jquery-'],
      html: ['jQuery', '\\$\\.', '\\$\\(\\)\\.', 'window\\.jQuery'],
      headers: [],
      meta: [],
      files: ['jquery-', 'js/jquery'],
      css: ['jquery-ui'],
      comments: ['jQuery', 'Powered by jQuery']
    },
    versionPatterns: [
      'jquery@([\\d\\.]+)',
      'jquery.*?([\\d\\.]+)',
      'jQuery.*?v([\\d\\.]+)'
    ]
  },
  'Bootstrap': {
    category: 'CSS Frameworks',
    patterns: {
      scripts: ['bootstrap.js', 'bootstrap.min.js'],
      html: ['btn-primary', 'container', 'row', 'col-', 'navbar', 'card'],
      headers: [],
      meta: [],
      files: ['bootstrap', 'css/bootstrap'],
      css: ['bootstrap', 'btn-', 'col-', 'navbar-'],
      comments: ['Bootstrap', 'Twitter Bootstrap']
    },
    versionPatterns: [
      'bootstrap@([\\d\\.]+)',
      'Bootstrap.*?v([\\d\\.]+)'
    ]
  },
  'Tailwind CSS': {
    category: 'CSS Frameworks',
    patterns: {
      scripts: ['tailwindcss'],
      html: ['tw-', 'prose', 'container mx-auto', 'flex items-center'],
      headers: [],
      meta: [],
      files: ['tailwind', 'tailwindcss'],
      css: ['tailwind', '@tailwind', 'tw-'],
      comments: ['Tailwind', 'TailwindCSS']
    },
    versionPatterns: [
      'tailwindcss@([\\d\\.]+)'
    ]
  },
  'Next.js': {
    category: 'Frontend Frameworks',
    patterns: {
      scripts: ['_next/static', 'next.js'],
      html: ['__NEXT_DATA__', '__next', 'Next\\.js'],
      headers: ['x-powered-by.*next'],
      meta: ['generator.*next'],
      files: ['_next/', '.next/'],
      css: [],
      comments: ['Next.js', 'Built with Next']
    },
    versionPatterns: [
      'next@([\\d\\.]+)',
      '"next".*?"([\\d\\.]+)"'
    ]
  },
  'Nuxt.js': {
    category: 'Frontend Frameworks',
    patterns: {
      scripts: ['_nuxt/', 'nuxt.js'],
      html: ['__NUXT__', 'window\\.__NUXT__'],
      headers: ['x-powered-by.*nuxt'],
      meta: ['generator.*nuxt'],
      files: ['_nuxt/', '.nuxt/'],
      css: [],
      comments: ['Nuxt', 'NuxtJS']
    },
    versionPatterns: [
      'nuxt@([\\d\\.]+)'
    ]
  },
  'WordPress': {
    category: 'Content Management',
    patterns: {
      scripts: ['wp-content', 'wp-includes', 'wp-admin'],
      html: ['wp-content', 'wp-includes', 'wordpress', 'wp-json'],
      headers: ['x-powered-by.*wordpress', 'link.*wp-json'],
      meta: ['generator.*wordpress'],
      files: ['wp-content/', 'wp-includes/', 'wp-admin/'],
      css: ['wp-', 'wordpress'],
      comments: ['WordPress', 'wp-']
    },
    versionPatterns: [
      'WordPress ([\\d\\.]+)',
      'wp-includes.*?ver=([\\d\\.]+)'
    ]
  },
  'Shopify': {
    category: 'E-commerce',
    patterns: {
      scripts: ['shopify', 'shop.js', 'Shopify\\.'],
      html: ['myshopify.com', 'Shopify\\.theme', 'shopify-section'],
      headers: ['server.*shopify'],
      meta: ['generator.*shopify'],
      files: ['shopify/', 'cdn.shopify.com'],
      css: ['shopify-', 'section-'],
      comments: ['Shopify', 'Powered by Shopify']
    },
    versionPatterns: []
  },
  'WooCommerce': {
    category: 'E-commerce',
    patterns: {
      scripts: ['woocommerce', 'wc-'],
      html: ['woocommerce', 'wc-', 'shop_table'],
      headers: [],
      meta: ['generator.*woocommerce'],
      files: ['woocommerce/', 'wc-'],
      css: ['woocommerce', 'wc-'],
      comments: ['WooCommerce']
    },
    versionPatterns: [
      'WooCommerce ([\\d\\.]+)'
    ]
  },
  'Magento': {
    category: 'E-commerce',
    patterns: {
      scripts: ['mage/', 'magento'],
      html: ['mage/', 'magento', 'Mage\\.'],
      headers: [],
      meta: ['generator.*magento'],
      files: ['skin/frontend/', 'js/mage/'],
      css: ['magento', 'mage-'],
      comments: ['Magento']
    },
    versionPatterns: []
  },
  'Google Analytics': {
    category: 'Analytics & Tracking',
    patterns: {
      scripts: ['google-analytics', 'googletagmanager', 'gtag\\(', 'ga\\('],
      html: ['gtag\\(', 'ga\\(', 'google-analytics'],
      headers: [],
      meta: [],
      files: ['gtm.js', 'analytics.js'],
      css: [],
      comments: ['Google Analytics', 'GA']
    },
    versionPatterns: []
  },
  'Google Tag Manager': {
    category: 'Analytics & Tracking',
    patterns: {
      scripts: ['googletagmanager.com', 'gtm.js'],
      html: ['GTM-', 'googletagmanager'],
      headers: [],
      meta: [],
      files: [],
      css: [],
      comments: ['Google Tag Manager', 'GTM']
    },
    versionPatterns: []
  },
  'Cloudflare': {
    category: 'CDN',
    patterns: {
      scripts: ['cdnjs.cloudflare.com'],
      html: [],
      headers: ['cf-ray', 'server.*cloudflare'],
      meta: [],
      files: ['cdnjs.cloudflare.com'],
      css: [],
      comments: ['Cloudflare']
    },
    versionPatterns: []
  },
  'Font Awesome': {
    category: 'Icon Libraries',
    patterns: {
      scripts: ['fontawesome', 'font-awesome'],
      html: ['fa-', 'fas ', 'far ', 'fab '],
      headers: [],
      meta: [],
      files: ['fontawesome', 'font-awesome'],
      css: ['fa-', 'font-awesome'],
      comments: ['Font Awesome']
    },
    versionPatterns: [
      'fontawesome.*?([\\d\\.]+)'
    ]
  },
  'Stripe': {
    category: 'Payment Processing',
    patterns: {
      scripts: ['stripe.com', 'stripe.js'],
      html: ['Stripe\\(', 'stripe-'],
      headers: [],
      meta: [],
      files: [],
      css: ['stripe-'],
      comments: ['Stripe']
    },
    versionPatterns: []
  },
  'PayPal': {
    category: 'Payment Processing',
    patterns: {
      scripts: ['paypal.com', 'paypal.js'],
      html: ['paypal-', 'PayPal'],
      headers: [],
      meta: [],
      files: [],
      css: ['paypal-'],
      comments: ['PayPal']
    },
    versionPatterns: []
  },
  'Drupal': {
    category: 'Content Management',
    patterns: {
      scripts: ['drupal'],
      html: ['drupal', 'Drupal\\.'],
      headers: ['x-powered-by.*drupal', 'x-drupal-'],
      meta: ['generator.*drupal'],
      files: ['sites/default/', 'modules/'],
      css: ['drupal'],
      comments: ['Drupal']
    },
    versionPatterns: [
      'Drupal ([\\d\\.]+)'
    ]
  },
  'Joomla': {
    category: 'Content Management',
    patterns: {
      scripts: ['joomla'],
      html: ['joomla', 'Joomla!'],
      headers: [],
      meta: ['generator.*joomla'],
      files: ['components/', 'modules/'],
      css: ['joomla'],
      comments: ['Joomla']
    },
    versionPatterns: [
      'Joomla! ([\\d\\.]+)'
    ]
  },
  'Material-UI': {
    category: 'UI Frameworks',
    patterns: {
      scripts: ['material-ui', '@mui/'],
      html: ['MuiButton', 'MuiGrid', 'makeStyles'],
      headers: [],
      meta: [],
      files: [],
      css: ['Mui', 'makeStyles'],
      comments: ['Material-UI', 'MUI']
    },
    versionPatterns: [
      '@mui/core.*?([\\d\\.]+)'
    ]
  },
  'Ant Design': {
    category: 'UI Frameworks',
    patterns: {
      scripts: ['antd'],
      html: ['ant-', 'antd'],
      headers: [],
      meta: [],
      files: [],
      css: ['ant-', 'antd'],
      comments: ['Ant Design']
    },
    versionPatterns: [
      'antd.*?([\\d\\.]+)'
    ]
  }
};

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
      'a\\[href\\*="facebook.com"\\]',
      '\\.fb-like',
      '\\.fb-share',
      '\\.fb-comments',
      '\\[class\\*="facebook"\\]'
    ],
    pixels: ['fbq\\(', 'facebook-pixel', 'FB_PIXEL_ID'],
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
      'iframe\\[src\\*="youtube.com"\\]',
      'a\\[href\\*="youtube.com"\\]',
      'a\\[href\\*="plus.google.com"\\]'
    ],
    pixels: ['gtag\\(', 'ga\\(', 'google-analytics'],
    widgets: ['youtube-player', 'g-plusone']
  },
  twitter: {
    scripts: [
      'platform.twitter.com',
      'syndication.twitter.com',
      'twitter.com/widgets.js'
    ],
    selectors: [
      'a\\[href\\*="twitter.com"\\]',
      'a\\[href\\*="x.com"\\]',
      '\\.twitter-tweet',
      '\\[class\\*="twitter"\\]'
    ],
    pixels: ['twq\\(', 'twitter-pixel'],
    widgets: ['twitter-timeline', 'twitter-tweet']
  },
  linkedin: {
    scripts: [
      'platform.linkedin.com',
      'linkedin.com/analytics',
      'snap.licdn.com'
    ],
    selectors: [
      'a\\[href\\*="linkedin.com"\\]',
      '\\.linkedin-share',
      '\\[class\\*="linkedin"\\]'
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
      'a\\[href\\*="instagram.com"\\]',
      'blockquote\\[class\\*="instagram"\\]',
      '\\[class\\*="instagram"\\]'
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
      'a\\[href\\*="tiktok.com"\\]',
      'blockquote\\[class\\*="tiktok"\\]'
    ],
    pixels: ['ttq\\(', 'tiktok-pixel'],
    widgets: ['tiktok-embed']
  },
  pinterest: {
    scripts: [
      'assets.pinterest.com',
      'pinterest.com/v3/pidgets'
    ],
    selectors: [
      'a\\[href\\*="pinterest.com"\\]',
      '\\[data-pin-do\\]',
      '\\.pin-it'
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
    if (htmlContent.includes(pixelPattern.replace(/\\/g, ''))) {
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
    const regex = new RegExp(selector.replace(/\\\\/g, '\\'), 'gi');
    try {
      const matches = htmlContent.match(regex);
      if (matches) {
        integrations.push({
          platform,
          type: 'share_button',
          confidence: 0.7,
          evidence: [`Social elements found: ${matches.length} matches`]
        });
      }
    } catch (error) {
      console.log(`Regex error for ${selector}:`, error);
    }
  });

  return integrations;
}

function detectTechnologies(
  htmlContent: string, 
  scripts: string[], 
  headers: Record<string, string>,
  deepSearchEnabled: boolean = true
): DetectedTechnology[] {
  const technologies: DetectedTechnology[] = [];

  Object.entries(ENHANCED_TECHNOLOGY_PATTERNS).forEach(([techName, config]) => {
    const foundPatterns: string[] = [];
    let confidence = 0;
    let detectionMethod = 'Pattern Matching';

    // HTML content detection
    config.patterns.html.forEach(pattern => {
      try {
        const regex = new RegExp(pattern, 'gi');
        if (regex.test(htmlContent)) {
          foundPatterns.push(`HTML: ${pattern}`);
          confidence += 0.3;
        }
      } catch (error) {
        console.log(`HTML regex error for ${pattern}:`, error);
      }
    });

    // Script detection
    config.patterns.scripts.forEach(pattern => {
      const foundScripts = scripts.filter(script => 
        script.toLowerCase().includes(pattern.toLowerCase())
      );
      if (foundScripts.length > 0) {
        foundPatterns.push(`Scripts: ${pattern}`);
        confidence += 0.4;
        detectionMethod = 'Script Analysis';
      }
    });

    // Headers detection
    if (deepSearchEnabled) {
      config.patterns.headers.forEach(pattern => {
        Object.entries(headers).forEach(([key, value]) => {
          try {
            const regex = new RegExp(pattern, 'gi');
            if (regex.test(`${key}: ${value}`)) {
              foundPatterns.push(`Header: ${key}`);
              confidence += 0.3;
              detectionMethod = 'Deep Pattern';
            }
          } catch (error) {
            console.log(`Header regex error for ${pattern}:`, error);
          }
        });
      });

      // Meta tags detection
      config.patterns.meta.forEach(pattern => {
        try {
          const regex = new RegExp(`<meta[^>]*${pattern}[^>]*>`, 'gi');
          if (regex.test(htmlContent)) {
            foundPatterns.push(`Meta: ${pattern}`);
            confidence += 0.25;
            detectionMethod = 'Deep Pattern';
          }
        } catch (error) {
          console.log(`Meta regex error for ${pattern}:`, error);
        }
      });

      // CSS detection
      config.patterns.css.forEach(pattern => {
        try {
          const cssRegex = new RegExp(`class="[^"]*${pattern}[^"]*"`, 'gi');
          if (cssRegex.test(htmlContent)) {
            foundPatterns.push(`CSS: ${pattern}`);
            confidence += 0.2;
            detectionMethod = 'Deep Pattern';
          }
        } catch (error) {
          console.log(`CSS regex error for ${pattern}:`, error);
        }
      });

      // Comments detection
      config.patterns.comments.forEach(pattern => {
        try {
          const commentRegex = new RegExp(`<!--[^>]*${pattern}[^>]*-->`, 'gi');
          if (commentRegex.test(htmlContent)) {
            foundPatterns.push(`Comment: ${pattern}`);
            confidence += 0.15;
            detectionMethod = 'Deep Pattern';
          }
        } catch (error) {
          console.log(`Comment regex error for ${pattern}:`, error);
        }
      });

      // File path detection
      config.patterns.files.forEach(pattern => {
        scripts.forEach(script => {
          if (script.includes(pattern)) {
            foundPatterns.push(`File: ${pattern}`);
            confidence += 0.25;
            detectionMethod = 'Deep Pattern';
          }
        });
      });
    }

    // Version detection
    let version;
    if (config.versionPatterns) {
      for (const versionPattern of config.versionPatterns) {
        try {
          const regex = new RegExp(versionPattern, 'gi');
          const match = htmlContent.match(regex) || scripts.join(' ').match(regex);
          if (match && match[1]) {
            version = match[1];
            confidence += 0.1;
            break;
          }
        } catch (error) {
          console.log(`Version regex error for ${versionPattern}:`, error);
        }
      }
    }

    if (foundPatterns.length > 0) {
      technologies.push({
        name: techName,
        category: config.category,
        version,
        confidence: Math.min(confidence, 1.0),
        detectionMethod,
        patterns: foundPatterns
      });
    }
  });

  return technologies.sort((a, b) => b.confidence - a.confidence);
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

    return {
      htmlContent,
      scripts: scripts.concat(inlineScripts),
      headers,
      metadata: {
        title: titleMatch ? titleMatch[1].trim() : undefined,
        description: descriptionMatch ? descriptionMatch[1].trim() : undefined
      }
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
    console.log('Deep search enabled:', deepSearchEnabled);

    const results = [];

    for (const url of urls) {
      const startTime = Date.now();
      
      try {
        const websiteData = await fetchWebsiteData(url);
        const responseTime = Date.now() - startTime;

        // Detect technologies with enhanced patterns and deep search
        const technologies = detectTechnologies(
          websiteData.htmlContent,
          websiteData.scripts,
          websiteData.headers,
          deepSearchEnabled
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
