export interface SocialMediaIntegration {
  platform: string;
  type: 'icon' | 'share_button' | 'embedded_feed' | 'social_login' | 'comment_system' | 'widget';
  confidence: number;
  evidence: string[];
  urls?: string[];
}

export interface SocialMediaAnalysis {
  integrations: SocialMediaIntegration[];
  totalPlatforms: number;
  engagementFeatures: string[];
  socialLoginOptions: string[];
}

// Social media platform patterns and indicators
const SOCIAL_MEDIA_PATTERNS = {
  facebook: {
    domains: ['facebook.com', 'fb.com', 'fb.me'],
    selectors: [
      'a[href*="facebook.com"]',
      '.facebook',
      '.fb-like',
      '.fb-share',
      '.fb-comments',
      '[class*="facebook"]',
      '[id*="facebook"]'
    ],
    scripts: [
      'connect.facebook.net',
      'facebook.com/tr',
      'fbevents.js'
    ],
    widgets: ['fb-like-box', 'fb-page', 'fb-comments'],
    icons: ['fa-facebook', 'facebook-f', 'facebook-square']
  },
  twitter: {
    domains: ['twitter.com', 't.co', 'x.com'],
    selectors: [
      'a[href*="twitter.com"]',
      'a[href*="x.com"]',
      '.twitter',
      '.tweet-button',
      '[class*="twitter"]',
      '[id*="twitter"]'
    ],
    scripts: [
      'platform.twitter.com',
      'syndication.twitter.com'
    ],
    widgets: ['twitter-timeline', 'twitter-tweet'],
    icons: ['fa-twitter', 'twitter-square']
  },
  instagram: {
    domains: ['instagram.com', 'instagr.am'],
    selectors: [
      'a[href*="instagram.com"]',
      '.instagram',
      '[class*="instagram"]',
      '[id*="instagram"]'
    ],
    scripts: ['instagram.com/embed.js'],
    widgets: ['instagram-media'],
    icons: ['fa-instagram', 'instagram-square']
  },
  linkedin: {
    domains: ['linkedin.com', 'lnkd.in'],
    selectors: [
      'a[href*="linkedin.com"]',
      '.linkedin',
      '.linkedin-share',
      '[class*="linkedin"]',
      '[id*="linkedin"]'
    ],
    scripts: ['platform.linkedin.com'],
    widgets: ['linkedin-share'],
    icons: ['fa-linkedin', 'linkedin-square']
  },
  youtube: {
    domains: ['youtube.com', 'youtu.be'],
    selectors: [
      'a[href*="youtube.com"]',
      'a[href*="youtu.be"]',
      '.youtube',
      'iframe[src*="youtube.com"]',
      '[class*="youtube"]'
    ],
    scripts: ['youtube.com/iframe_api'],
    widgets: ['youtube-player'],
    icons: ['fa-youtube', 'youtube-square']
  },
  tiktok: {
    domains: ['tiktok.com'],
    selectors: [
      'a[href*="tiktok.com"]',
      '.tiktok',
      '[class*="tiktok"]'
    ],
    scripts: ['tiktok.com/embed.js'],
    widgets: ['tiktok-embed'],
    icons: ['fa-tiktok']
  },
  pinterest: {
    domains: ['pinterest.com', 'pin.it'],
    selectors: [
      'a[href*="pinterest.com"]',
      '.pinterest',
      '.pin-it',
      '[class*="pinterest"]'
    ],
    scripts: ['assets.pinterest.com'],
    widgets: ['pinterest-pin'],
    icons: ['fa-pinterest', 'pinterest-square']
  },
  whatsapp: {
    domains: ['whatsapp.com', 'wa.me'],
    selectors: [
      'a[href*="whatsapp.com"]',
      'a[href*="wa.me"]',
      '.whatsapp',
      '[class*="whatsapp"]'
    ],
    scripts: [],
    widgets: ['whatsapp-share'],
    icons: ['fa-whatsapp', 'whatsapp-square']
  },
  telegram: {
    domains: ['telegram.org', 't.me'],
    selectors: [
      'a[href*="telegram.org"]',
      'a[href*="t.me"]',
      '.telegram',
      '[class*="telegram"]'
    ],
    scripts: [],
    widgets: ['telegram-share'],
    icons: ['fa-telegram']
  },
  discord: {
    domains: ['discord.com', 'discord.gg'],
    selectors: [
      'a[href*="discord.com"]',
      'a[href*="discord.gg"]',
      '.discord',
      '[class*="discord"]'
    ],
    scripts: [],
    widgets: ['discord-widget'],
    icons: ['fa-discord']
  }
};

// Common social sharing button patterns
const SHARE_BUTTON_PATTERNS = [
  '.share-button',
  '.social-share',
  '.share-icons',
  '.social-buttons',
  '[class*="share"]',
  '[class*="social"]',
  '.addthis',
  '.sharethis'
];

// Social login patterns
const SOCIAL_LOGIN_PATTERNS = [
  'button[class*="facebook"]',
  'button[class*="google"]',
  'button[class*="twitter"]',
  'button[class*="linkedin"]',
  '.social-login',
  '.oauth-button',
  '[data-provider]'
];

export function analyzeSocialMediaIntegrations(
  htmlContent: string,
  scripts: string[],
  links: string[]
): SocialMediaAnalysis {
  const integrations: SocialMediaIntegration[] = [];
  const engagementFeatures: string[] = [];
  const socialLoginOptions: string[] = [];

  // Create a DOM parser for HTML analysis
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  // Analyze each social media platform
  Object.entries(SOCIAL_MEDIA_PATTERNS).forEach(([platform, patterns]) => {
    const platformIntegrations = detectPlatformIntegrations(
      platform,
      patterns,
      doc,
      scripts,
      links
    );
    integrations.push(...platformIntegrations);
  });

  // Detect social sharing features
  const shareFeatures = detectSharingFeatures(doc);
  engagementFeatures.push(...shareFeatures);

  // Detect social login options
  const loginOptions = detectSocialLogin(doc);
  socialLoginOptions.push(...loginOptions);

  // Detect comment systems
  const commentSystems = detectCommentSystems(doc, scripts);
  integrations.push(...commentSystems);

  return {
    integrations,
    totalPlatforms: new Set(integrations.map(i => i.platform)).size,
    engagementFeatures,
    socialLoginOptions
  };
}

function detectPlatformIntegrations(
  platform: string,
  patterns: any,
  doc: Document,
  scripts: string[],
  links: string[]
): SocialMediaIntegration[] {
  const integrations: SocialMediaIntegration[] = [];
  const evidence: string[] = [];
  const urls: string[] = [];

  // Check for links and icons
  patterns.selectors.forEach((selector: string) => {
    const elements = doc.querySelectorAll(selector);
    if (elements.length > 0) {
      evidence.push(`Found ${elements.length} ${selector} elements`);
      
      elements.forEach((el: Element) => {
        const href = el.getAttribute('href');
        if (href && patterns.domains.some((domain: string) => href.includes(domain))) {
          urls.push(href);
        }
      });

      // Determine integration type based on context
      const integrationType = determineIntegrationType(selector, elements);
      
      integrations.push({
        platform,
        type: integrationType,
        confidence: calculateConfidence(elements.length, selector),
        evidence: [`${elements.length} ${selector} elements found`],
        urls: urls.length > 0 ? [...new Set(urls)] : undefined
      });
    }
  });

  // Check for scripts
  patterns.scripts.forEach((scriptPattern: string) => {
    const foundScripts = scripts.filter(script => script.includes(scriptPattern));
    if (foundScripts.length > 0) {
      evidence.push(`Found ${platform} scripts: ${foundScripts.join(', ')}`);
      
      integrations.push({
        platform,
        type: 'widget',
        confidence: 0.9,
        evidence: [`Script integration: ${foundScripts.join(', ')}`]
      });
    }
  });

  // Check for embedded widgets
  patterns.widgets.forEach((widget: string) => {
    const elements = doc.querySelectorAll(`[class*="${widget}"], [id*="${widget}"]`);
    if (elements.length > 0) {
      integrations.push({
        platform,
        type: 'embedded_feed',
        confidence: 0.95,
        evidence: [`Embedded widget: ${widget}`]
      });
    }
  });

  return integrations;
}

function determineIntegrationType(selector: string, elements: NodeListOf<Element>): SocialMediaIntegration['type'] {
  // Check if it's a share button
  if (selector.includes('share') || selector.includes('button')) {
    return 'share_button';
  }

  // Check if it's an embedded feed
  if (selector.includes('timeline') || selector.includes('feed') || selector.includes('embed')) {
    return 'embedded_feed';
  }

  // Check if it's a login button
  const hasLoginContext = Array.from(elements).some(el => {
    const text = el.textContent?.toLowerCase() || '';
    const classes = el.className.toLowerCase();
    return text.includes('login') || text.includes('sign in') || 
           classes.includes('login') || classes.includes('oauth');
  });

  if (hasLoginContext) {
    return 'social_login';
  }

  // Default to icon if it's a simple link
  return 'icon';
}

function calculateConfidence(elementCount: number, selector: string): number {
  let confidence = Math.min(0.5 + (elementCount * 0.1), 0.9);
  
  // Boost confidence for specific selectors
  if (selector.includes('share') || selector.includes('social')) {
    confidence += 0.1;
  }
  
  if (selector.includes('iframe') || selector.includes('embed')) {
    confidence += 0.2;
  }

  return Math.min(confidence, 1.0);
}

function detectSharingFeatures(doc: Document): string[] {
  const features: string[] = [];

  SHARE_BUTTON_PATTERNS.forEach(pattern => {
    const elements = doc.querySelectorAll(pattern);
    if (elements.length > 0) {
      features.push(`Social sharing buttons (${elements.length} found)`);
    }
  });

  // Check for specific sharing services
  const sharingServices = ['addthis', 'sharethis', 'shareaholic'];
  sharingServices.forEach(service => {
    const elements = doc.querySelectorAll(`[class*="${service}"], [id*="${service}"]`);
    if (elements.length > 0) {
      features.push(`${service} sharing integration`);
    }
  });

  return features;
}

function detectSocialLogin(doc: Document): string[] {
  const loginOptions: string[] = [];

  SOCIAL_LOGIN_PATTERNS.forEach(pattern => {
    const elements = doc.querySelectorAll(pattern);
    elements.forEach(el => {
      const text = el.textContent?.toLowerCase() || '';
      const classes = el.className.toLowerCase();
      
      if (text.includes('facebook') || classes.includes('facebook')) {
        loginOptions.push('Facebook Login');
      }
      if (text.includes('google') || classes.includes('google')) {
        loginOptions.push('Google Login');
      }
      if (text.includes('twitter') || classes.includes('twitter')) {
        loginOptions.push('Twitter Login');
      }
      if (text.includes('linkedin') || classes.includes('linkedin')) {
        loginOptions.push('LinkedIn Login');
      }
    });
  });

  return [...new Set(loginOptions)];
}

function detectCommentSystems(doc: Document, scripts: string[]): SocialMediaIntegration[] {
  const commentSystems: SocialMediaIntegration[] = [];

  // Facebook Comments
  if (doc.querySelector('.fb-comments') || scripts.some(s => s.includes('connect.facebook.net'))) {
    commentSystems.push({
      platform: 'Facebook',
      type: 'comment_system',
      confidence: 0.9,
      evidence: ['Facebook Comments integration detected']
    });
  }

  // Disqus
  if (doc.querySelector('#disqus_thread') || scripts.some(s => s.includes('disqus.com'))) {
    commentSystems.push({
      platform: 'Disqus',
      type: 'comment_system',
      confidence: 0.9,
      evidence: ['Disqus comment system detected']
    });
  }

  return commentSystems;
}