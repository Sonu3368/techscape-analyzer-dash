
// Social Media Technology Detection Module

export interface SocialMediaTechnology {
  platform: string;
  category: 'tracking' | 'widget' | 'embed' | 'sharing' | 'analytics' | 'authentication';
  integrationMethod: 'script' | 'iframe' | 'meta' | 'sdk' | 'pixel' | 'api' | 'css';
  confidence: number;
  evidence: string[];
  version?: string;
}

export class SocialMediaDetector {
  private static readonly SOCIAL_MEDIA_PATTERNS = {
    // Facebook Technologies
    facebook: {
      patterns: [
        'connect.facebook.net',
        'fb-root',
        'facebook-jssdk',
        'FB.init',
        'fbq(',
        'facebook.com/tr',
        '_fbp',
        'fb:',
        'og:',
        'facebook.com/plugins',
        'fb-like',
        'fb-share-button',
        'fb-comments',
        'fb-page'
      ],
      detection: {
        pixel: ['fbq(', 'facebook.com/tr', '_fbp'],
        sdk: ['connect.facebook.net/en_US/sdk.js', 'FB.init', 'facebook-jssdk'],
        widgets: ['fb-like', 'fb-share-button', 'fb-comments', 'fb-page', 'facebook.com/plugins'],
        meta: ['og:', 'fb:', 'property="og:', 'property="fb:'],
        tracking: ['fbevents.js', 'fbq(', '_fbp', '_fbc']
      }
    },

    // Google/YouTube
    google: {
      patterns: [
        'google-analytics.com',
        'googletagmanager.com',
        'gtag(',
        'ga(',
        'youtube.com/embed',
        'googlesyndication.com',
        'plus.google.com',
        'apis.google.com',
        'gstatic.com',
        'google.com/recaptcha',
        'youtube-nocookie.com'
      ],
      detection: {
        analytics: ['google-analytics.com', 'gtag(', 'ga(', 'googletagmanager.com'],
        embed: ['youtube.com/embed', 'youtube-nocookie.com/embed'],
        apis: ['apis.google.com', 'gstatic.com'],
        ads: ['googlesyndication.com', 'googleadservices.com'],
        recaptcha: ['google.com/recaptcha', 'recaptcha']
      }
    },

    // Twitter/X
    twitter: {
      patterns: [
        'platform.twitter.com',
        'twitter.com/intent',
        'twitter:',
        'twttr.',
        'tweet-button',
        'twitter-timeline',
        'twitter-share',
        'syndication.twitter.com',
        'x.com'
      ],
      detection: {
        widgets: ['platform.twitter.com/widgets.js', 'twitter-timeline', 'tweet-button'],
        sharing: ['twitter.com/intent', 'twitter-share'],
        meta: ['twitter:', 'name="twitter:'],
        embed: ['syndication.twitter.com', 'twitter.com/']
      }
    },

    // LinkedIn
    linkedin: {
      patterns: [
        'platform.linkedin.com',
        'linkedin.com/in/',
        'snap.licdn.com',
        '_linkedin_partner_id',
        'linkedin_insight_id',
        'IN.init',
        'linkedin-share',
        'platform.linkedin.com/badges'
      ],
      detection: {
        insight: ['snap.licdn.com', '_linkedin_partner_id', 'linkedin_insight_id'],
        widgets: ['platform.linkedin.com', 'IN.init', 'linkedin-share'],
        badges: ['platform.linkedin.com/badges'],
        tracking: ['snap.licdn.com/li.lms-analytics']
      }
    },

    // Instagram
    instagram: {
      patterns: [
        'instagram.com/embed',
        'instagram.com/p/',
        'cdninstagram.com',
        'ig-embed',
        'instagram-media',
        'instgrm.Embeds'
      ],
      detection: {
        embed: ['instagram.com/embed', 'instagram.com/p/', 'ig-embed', 'instagram-media'],
        sdk: ['cdninstagram.com', 'instgrm.Embeds']
      }
    },

    // TikTok
    tiktok: {
      patterns: [
        'tiktok.com/embed',
        'analytics.tiktok.com',
        'ttq.load',
        'ttq.track',
        '_ttp',
        'tiktok-embed',
        'tiktok.com/oembed'
      ],
      detection: {
        pixel: ['analytics.tiktok.com', 'ttq.load', 'ttq.track', '_ttp'],
        embed: ['tiktok.com/embed', 'tiktok-embed', 'tiktok.com/oembed']
      }
    },

    // Pinterest
    pinterest: {
      patterns: [
        'pinterest.com/js',
        'pinimg.com',
        'pinterest.com/pin',
        'data-pin-do',
        'pinterest-tag',
        'PinUtils'
      ],
      detection: {
        widgets: ['pinterest.com/js', 'data-pin-do', 'PinUtils'],
        pin: ['pinterest.com/pin', 'pinimg.com'],
        tag: ['pinterest-tag', 's.pinimg.com/ct/core.js']
      }
    },

    // Snapchat
    snapchat: {
      patterns: [
        'sc-static.net',
        'snapchat.com/pixel',
        'snaptr(',
        '_scid'
      ],
      detection: {
        pixel: ['sc-static.net', 'snapchat.com/pixel', 'snaptr(', '_scid']
      }
    },

    // WhatsApp
    whatsapp: {
      patterns: [
        'wa.me/',
        'whatsapp.com/send',
        'whatsapp-share',
        'api.whatsapp.com'
      ],
      detection: {
        sharing: ['wa.me/', 'whatsapp.com/send', 'whatsapp-share', 'api.whatsapp.com']
      }
    },

    // Reddit
    reddit: {
      patterns: [
        'reddit.com/static',
        'redd.it',
        'reddit-embed',
        'redditmedia.com'
      ],
      detection: {
        embed: ['reddit.com/static', 'reddit-embed', 'redditmedia.com'],
        sharing: ['redd.it']
      }
    },

    // Discord
    discord: {
      patterns: [
        'discord.com/widget',
        'discord.gg/',
        'discordapp.com',
        'discord-widget'
      ],
      detection: {
        widget: ['discord.com/widget', 'discord-widget'],
        invite: ['discord.gg/', 'discordapp.com']
      }
    },

    // Telegram
    telegram: {
      patterns: [
        't.me/',
        'telegram.me',
        'telegram-share',
        'telegram.org/js'
      ],
      detection: {
        sharing: ['t.me/', 'telegram.me', 'telegram-share'],
        widget: ['telegram.org/js']
      }
    }
  };

  public static detectSocialMedia(
    html: string,
    scripts: string[],
    stylesheets: string[],
    headers: Record<string, string>,
    cookies: string[]
  ): SocialMediaTechnology[] {
    const detectedTechnologies: SocialMediaTechnology[] = [];
    const content = html.toLowerCase();

    // Combine all content for analysis
    const allContent = [
      content,
      ...scripts.map(s => s.toLowerCase()),
      ...stylesheets.map(s => s.toLowerCase()),
      Object.values(headers).join(' ').toLowerCase(),
      cookies.join(' ').toLowerCase()
    ].join(' ');

    for (const [platform, config] of Object.entries(this.SOCIAL_MEDIA_PATTERNS)) {
      const platformTechs = this.detectPlatformTechnologies(
        platform,
        config,
        allContent,
        html,
        scripts,
        headers
      );
      detectedTechnologies.push(...platformTechs);
    }

    return detectedTechnologies;
  }

  private static detectPlatformTechnologies(
    platform: string,
    config: any,
    allContent: string,
    html: string,
    scripts: string[],
    headers: Record<string, string>
  ): SocialMediaTechnology[] {
    const technologies: SocialMediaTechnology[] = [];
    const evidence: string[] = [];
    let foundPatterns = 0;

    // Check for general patterns
    for (const pattern of config.patterns) {
      if (allContent.includes(pattern.toLowerCase())) {
        evidence.push(`Found pattern: ${pattern}`);
        foundPatterns++;
      }
    }

    if (foundPatterns === 0) return technologies;

    // Detect specific integration types
    for (const [integrationType, patterns] of Object.entries(config.detection)) {
      const integrationEvidence: string[] = [];
      let integrationFound = false;

      for (const pattern of patterns as string[]) {
        if (allContent.includes(pattern.toLowerCase())) {
          integrationEvidence.push(`${integrationType}: ${pattern}`);
          integrationFound = true;
        }
      }

      if (integrationFound) {
        const integrationMethod = this.determineIntegrationMethod(
          integrationType,
          integrationEvidence,
          html,
          scripts
        );

        const category = this.determineCategory(integrationType);
        const confidence = this.calculateConfidence(integrationEvidence.length, foundPatterns);

        technologies.push({
          platform: this.getPlatformDisplayName(platform),
          category,
          integrationMethod,
          confidence,
          evidence: integrationEvidence,
          version: this.extractVersion(allContent, platform)
        });
      }
    }

    // If no specific integrations found but patterns exist, create general detection
    if (technologies.length === 0 && foundPatterns > 0) {
      technologies.push({
        platform: this.getPlatformDisplayName(platform),
        category: 'widget',
        integrationMethod: 'script',
        confidence: Math.min(foundPatterns * 0.3, 0.9),
        evidence: evidence.slice(0, 3)
      });
    }

    return technologies;
  }

  private static determineIntegrationMethod(
    integrationType: string,
    evidence: string[],
    html: string,
    scripts: string[]
  ): SocialMediaTechnology['integrationMethod'] {
    const evidenceText = evidence.join(' ').toLowerCase();

    if (integrationType === 'pixel' || integrationType === 'tracking') return 'pixel';
    if (integrationType === 'meta') return 'meta';
    if (integrationType === 'embed' && html.includes('<iframe')) return 'iframe';
    if (integrationType === 'sdk' || scripts.some(s => evidenceText.includes(s.toLowerCase()))) return 'sdk';
    if (integrationType === 'api') return 'api';
    if (evidenceText.includes('css') || evidenceText.includes('style')) return 'css';
    
    return 'script';
  }

  private static determineCategory(integrationType: string): SocialMediaTechnology['category'] {
    const categoryMap: Record<string, SocialMediaTechnology['category']> = {
      pixel: 'tracking',
      tracking: 'tracking',
      analytics: 'analytics',
      insight: 'tracking',
      embed: 'embed',
      widget: 'widget',
      sharing: 'sharing',
      sdk: 'widget',
      meta: 'sharing',
      badges: 'widget',
      pin: 'sharing',
      tag: 'tracking'
    };

    return categoryMap[integrationType] || 'widget';
  }

  private static calculateConfidence(evidenceCount: number, patternCount: number): number {
    const baseConfidence = Math.min(evidenceCount * 0.2 + patternCount * 0.1, 0.95);
    return Math.max(baseConfidence, 0.3);
  }

  private static getPlatformDisplayName(platform: string): string {
    const displayNames: Record<string, string> = {
      facebook: 'Facebook',
      google: 'Google/YouTube',
      twitter: 'Twitter/X',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
      tiktok: 'TikTok',
      pinterest: 'Pinterest',
      snapchat: 'Snapchat',
      whatsapp: 'WhatsApp',
      reddit: 'Reddit',
      discord: 'Discord',
      telegram: 'Telegram'
    };

    return displayNames[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
  }

  private static extractVersion(content: string, platform: string): string | undefined {
    const versionPatterns: Record<string, RegExp[]> = {
      facebook: [/sdk\.js\?version=v([\d.]+)/i, /appId.*version.*?v([\d.]+)/i],
      google: [/gtag\/js\?id=.*?v([\d.]+)/i, /analytics\.js.*?v([\d.]+)/i],
      twitter: [/widgets\.js.*?v([\d.]+)/i]
    };

    const patterns = versionPatterns[platform];
    if (!patterns) return undefined;

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) return match[1];
    }

    return undefined;
  }
}
