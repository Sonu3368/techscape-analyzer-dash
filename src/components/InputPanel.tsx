import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { FileInput } from "@/components/FileInput";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Zap,
  Sparkles,
  Trash2,
  Loader2
} from "lucide-react";

interface InputPanelProps {
  onAnalyze: (analysisRequest: any) => void;
  isLoading: boolean;
  onFileUpload: (file: File) => void;
  onDemoAnalyze: () => void;
  demoLimit: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  onAnalyze,
  isLoading,
  onFileUpload,
  onDemoAnalyze,
  demoLimit,
}) => {
  const [urls, setUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(false);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(false);
  const [searchMode, setSearchMode] = useState<'basic' | 'advanced' | 'full'>('full');
  const [customPatterns, setCustomPatterns] = useState<string[]>([]);
  const [isGeneratingPatterns, setIsGeneratingPatterns] = useState(false);
  const [deepSearchOptions, setDeepSearchOptions] = useState({
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
    // Enhanced social media detection
    detectSocialMediaIntegrations: true,
    analyzeSocialPixels: true,
    detectSocialWidgets: true,
    analyzeSocialSharing: true,
    detectSocialLogins: true,
    // Enhanced deep analysis
    analyzeFrameworkPatterns: true,
    detectSecurityHeaders: true,
    analyzePerformanceHints: true,
    detectCDNUsage: true,
    analyzeAPIEndpoints: true,
  });
  const [performanceAnalysisEnabled, setPerformanceAnalysisEnabled] = useState(false);
  const [performanceOptions, setPerformanceOptions] = useState({
    coreWebVitals: true,
    networkAnalysis: true,
    accessibilityCheck: true,
    seoAnalysis: true,
    codeQualityCheck: true,
    competitorAnalysis: false,
    competitorUrls: [] as string[],
  });

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrls(e.target.value.split(",").map((url) => url.trim()));
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPatterns(e.target.value.split("\n").map((pattern) => pattern.trim()));
  };

  const generateAIPatterns = async () => {
    setIsGeneratingPatterns(true);
    try {
      // Generate comprehensive AI patterns for modern web technologies
      const aiGeneratedPatterns = [
        // Frontend Frameworks & Libraries
        'react-dom', 'vue\\.js', 'angular', 'svelte', 'solid-js', 'preact',
        'next\\.js', 'nuxt', 'gatsby', 'remix', 'astro',
        
        // UI Libraries & Component Systems
        'material-ui', 'ant-design', 'chakra-ui', 'mantine', 'semantic-ui',
        'tailwindcss', 'bootstrap', 'bulma', 'foundation', 'styled-components',
        
        // State Management
        'redux', 'mobx', 'zustand', 'recoil', 'jotai', 'valtio',
        
        // Build Tools & Bundlers
        'webpack', 'vite', 'rollup', 'parcel', 'esbuild', 'turbopack',
        
        // Backend Technologies
        'express', 'fastify', 'koa', 'nest\\.js', 'django', 'flask',
        'laravel', 'symfony', 'rails', 'spring', 'asp\\.net',
        
        // Databases & ORMs
        'mongodb', 'postgresql', 'mysql', 'redis', 'prisma', 'typeorm',
        'sequelize', 'mongoose', 'supabase', 'firebase', 'planetscale',
        
        // Cloud & Hosting
        'vercel', 'netlify', 'cloudflare', 'aws', 'azure', 'gcp',
        'heroku', 'railway', 'render', 'fly\\.io',
        
        // Analytics & Tracking
        'google-analytics', 'gtag', 'mixpanel', 'amplitude', 'segment',
        'hotjar', 'fullstory', 'logrocket', 'sentry',
        
        // Social Media Integrations
        'facebook-pixel', 'fb-pixel', 'linkedin-insight', 'twitter-pixel',
        'tiktok-pixel', 'pinterest-tag', 'snapchat-pixel',
        'instagram-embed', 'youtube-embed', 'vimeo-embed',
        'social-share', 'addthis', 'sharethis', 'disqus',
        'facebook-login', 'google-login', 'twitter-login',
        
        // E-commerce & Payments
        'shopify', 'woocommerce', 'magento', 'stripe', 'paypal',
        'square', 'braintree', 'klarna', 'afterpay',
        
        // CMS & Content
        'wordpress', 'drupal', 'joomla', 'contentful', 'strapi',
        'sanity', 'ghost', 'webflow', 'squarespace',
        
        // Testing & Quality
        'jest', 'cypress', 'playwright', 'selenium', 'storybook',
        'chromatic', 'percy', 'browserstack',
        
        // DevOps & Monitoring
        'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins',
        'github-actions', 'gitlab-ci', 'datadog', 'newrelic',
        
        // Security & Performance
        'cloudflare-turnstile', 'recaptcha', 'hcaptcha', 'auth0',
        'okta', 'keycloak', 'workbox', 'pwa-manifest',
        
        // Modern Web APIs
        'web-components', 'custom-elements', 'shadow-dom',
        'service-worker', 'web-workers', 'webassembly',
        
        // CSS-in-JS & Styling
        'emotion', 'styled-jsx', 'stitches', 'vanilla-extract',
        'linaria', 'goober', 'theme-ui',
        
        // Animation & Graphics
        'framer-motion', 'react-spring', 'lottie', 'three\\.js',
        'babylon\\.js', 'd3\\.js', 'chart\\.js', 'plotly',
        
        // Form Libraries
        'react-hook-form', 'formik', 'final-form', 'react-final-form',
        
        // Routing
        'react-router', 'reach-router', 'vue-router', 'angular-router',
        
        // HTTP Clients
        'axios', 'fetch', 'apollo-client', 'relay', 'urql', 'swr', 'react-query',
        
        // Internationalization
        'react-i18next', 'vue-i18n', 'angular-i18n', 'formatjs',
        
        // Date & Time
        'moment\\.js', 'date-fns', 'dayjs', 'luxon',
        
        // Utilities
        'lodash', 'ramda', 'underscore', 'immutable', 'immer',
        
        // Mobile Development
        'react-native', 'ionic', 'cordova', 'phonegap', 'capacitor',
        
        // Desktop Development
        'electron', 'tauri', 'neutralino', 'nwjs',
        
        // Micro-frontends
        'single-spa', 'module-federation', 'qiankun',
        
        // JAMstack & Static Site Generators
        'eleventy', '11ty', 'hugo', 'jekyll', 'hexo', 'gridsome',
        
        // Real-time & WebSockets
        'socket\\.io', 'ws', 'sockjs', 'pusher', 'ably', 'pubnub',
        
        // Machine Learning & AI
        'tensorflow\\.js', 'ml5\\.js', 'brain\\.js', 'synaptic',
        
        // Blockchain & Web3
        'web3\\.js', 'ethers\\.js', 'metamask', 'walletconnect',
        
        // Progressive Web Apps
        'workbox', 'pwa-builder', 'manifest\\.json', 'service-worker',
        
        // Accessibility
        'axe-core', 'react-axe', 'pa11y', 'lighthouse',
        
        // Documentation
        'storybook', 'docusaurus', 'gitbook', 'notion',
        
        // Code Quality
        'eslint', 'prettier', 'husky', 'lint-staged', 'commitizen'
      ];

      setCustomPatterns(prev => {
        const combined = [...prev, ...aiGeneratedPatterns];
        const unique = [...new Set(combined)].filter(pattern => pattern.trim() !== '');
        return unique;
      });

      toast({
        title: "AI Patterns Generated",
        description: `Added ${aiGeneratedPatterns.length} comprehensive technology detection patterns`,
      });
    } catch (error) {
      toast({
        title: "Pattern Generation Failed",
        description: "Failed to generate AI patterns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPatterns(false);
    }
  };

  const clearPatterns = () => {
    setCustomPatterns([]);
    toast({
      title: "Patterns Cleared",
      description: "All custom patterns have been removed",
    });
  };

  const handleAnalyze = async () => {
    if (urls.length === 0) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL to analyze",
        variant: "destructive",
      });
      return;
    }

    const analysisRequest = {
      urls,
      deepSearchEnabled,
      aiAnalysisEnabled,
      performanceAnalysisEnabled,
      searchMode,
      deepSearchOptions,
      performanceOptions,
      customPatterns,
    };

    onAnalyze(analysisRequest);
  };

  const renderBasicOptions = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="deep-search"
          checked={deepSearchEnabled}
          onCheckedChange={setDeepSearchEnabled}
        />
        <Label htmlFor="deep-search" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Enable Deep Search
        </Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="ai-analysis"
          checked={aiAnalysisEnabled}
          onCheckedChange={setAiAnalysisEnabled}
        />
        <Label htmlFor="ai-analysis" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Enable AI Analysis
        </Label>
      </div>

      <div>
        <Label htmlFor="search-mode" className="text-sm font-medium block mb-1">Search Mode</Label>
        <select
          id="search-mode"
          className="w-full p-2 border rounded"
          value={searchMode}
          onChange={(e) => setSearchMode(e.target.value as 'basic' | 'advanced' | 'full')}
        >
          <option value="basic">Basic</option>
          <option value="advanced">Advanced</option>
          <option value="full">Full</option>
        </select>
      </div>
    </div>
  );

  const renderDeepSearchOptions = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="analyze-comments"
            checked={deepSearchOptions.analyzeHtmlComments}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeHtmlComments: checked as boolean }))
            }
          />
          <Label htmlFor="analyze-comments" className="text-sm">
            Analyze HTML Comments
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="analyze-meta"
            checked={deepSearchOptions.analyzeMetaTags}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeMetaTags: checked as boolean }))
            }
          />
          <Label htmlFor="analyze-meta" className="text-sm">
            Analyze Meta Tags
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="detect-elements"
            checked={deepSearchOptions.detectCustomElements}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, detectCustomElements: checked as boolean }))
            }
          />
          <Label htmlFor="detect-elements" className="text-sm">
            Detect Custom Elements
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="analyze-paths"
            checked={deepSearchOptions.analyzeFilePaths}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeFilePaths: checked as boolean }))
            }
          />
          <Label htmlFor="analyze-paths" className="text-sm">
            Analyze File Paths
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="ai-pattern-detection"
            checked={deepSearchOptions.aiPatternDetection}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, aiPatternDetection: checked as boolean }))
            }
          />
          <Label htmlFor="ai-pattern-detection" className="text-sm">
            AI Pattern Detection
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="analyze-css"
            checked={deepSearchOptions.analyzeCssClasses}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeCssClasses: checked as boolean }))
            }
          />
          <Label htmlFor="analyze-css" className="text-sm">
            Analyze CSS Classes
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="analyze-scripts"
            checked={deepSearchOptions.analyzeInlineScripts}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeInlineScripts: checked as boolean }))
            }
          />
          <Label htmlFor="analyze-scripts" className="text-sm">
            Analyze Inline Scripts
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="analyze-headers"
            checked={deepSearchOptions.analyzeHttpHeaders}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeHttpHeaders: checked as boolean }))
            }
          />
          <Label htmlFor="analyze-headers" className="text-sm">
            Analyze HTTP Headers
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="analyze-cookies"
            checked={deepSearchOptions.analyzeCookiePatterns}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeCookiePatterns: checked as boolean }))
            }
          />
          <Label htmlFor="analyze-cookies" className="text-sm">
            Analyze Cookie Patterns
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="detect-behavioral"
            checked={deepSearchOptions.detectBehavioralPatterns}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, detectBehavioralPatterns: checked as boolean }))
            }
          />
          <Label htmlFor="detect-behavioral" className="text-sm">
            Detect Behavioral Patterns
          </Label>
        </div>

        {/* Enhanced Social Media Detection */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="social-media"
            checked={deepSearchOptions.detectSocialMediaIntegrations}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, detectSocialMediaIntegrations: checked as boolean }))
            }
          />
          <Label htmlFor="social-media" className="text-sm">
            Social Media Integrations
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="social-pixels"
            checked={deepSearchOptions.analyzeSocialPixels}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeSocialPixels: checked as boolean }))
            }
          />
          <Label htmlFor="social-pixels" className="text-sm">
            Social Tracking Pixels
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="social-widgets"
            checked={deepSearchOptions.detectSocialWidgets}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, detectSocialWidgets: checked as boolean }))
            }
          />
          <Label htmlFor="social-widgets" className="text-sm">
            Social Widgets & Embeds
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="social-sharing"
            checked={deepSearchOptions.analyzeSocialSharing}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeSocialSharing: checked as boolean }))
            }
          />
          <Label htmlFor="social-sharing" className="text-sm">
            Social Sharing Buttons
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="social-logins"
            checked={deepSearchOptions.detectSocialLogins}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, detectSocialLogins: checked as boolean }))
            }
          />
          <Label htmlFor="social-logins" className="text-sm">
            Social Login Systems
          </Label>
        </div>

        {/* Enhanced Deep Analysis */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="framework-patterns"
            checked={deepSearchOptions.analyzeFrameworkPatterns}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeFrameworkPatterns: checked as boolean }))
            }
          />
          <Label htmlFor="framework-patterns" className="text-sm">
            Framework Patterns
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="security-headers"
            checked={deepSearchOptions.detectSecurityHeaders}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, detectSecurityHeaders: checked as boolean }))
            }
          />
          <Label htmlFor="security-headers" className="text-sm">
            Security Headers
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="performance-hints"
            checked={deepSearchOptions.analyzePerformanceHints}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzePerformanceHints: checked as boolean }))
            }
          />
          <Label htmlFor="performance-hints" className="text-sm">
            Performance Hints
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="cdn-usage"
            checked={deepSearchOptions.detectCDNUsage}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, detectCDNUsage: checked as boolean }))
            }
          />
          <Label htmlFor="cdn-usage" className="text-sm">
            CDN Usage Detection
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="api-endpoints"
            checked={deepSearchOptions.analyzeAPIEndpoints}
            onCheckedChange={(checked) =>
              setDeepSearchOptions(prev => ({ ...prev, analyzeAPIEndpoints: checked as boolean }))
            }
          />
          <Label htmlFor="api-endpoints" className="text-sm">
            API Endpoints Analysis
          </Label>
        </div>
      </div>
    </div>
  );

  const renderPerformanceOptions = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch
          id="performance-analysis"
          checked={performanceAnalysisEnabled}
          onCheckedChange={setPerformanceAnalysisEnabled}
        />
        <Label 
          htmlFor="performance-analysis" 
          className="text-sm font-medium cursor-pointer flex items-center gap-2"
        >
          <Zap className="w-4 h-4 text-blue-600" />
          Enable Performance Analysis
        </Label>
      </div>

      {performanceAnalysisEnabled && (
        <div className="ml-6 space-y-3 p-4 border rounded-lg bg-blue-50">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="core-web-vitals"
                checked={performanceOptions.coreWebVitals}
                onCheckedChange={(checked) =>
                  setPerformanceOptions(prev => ({ ...prev, coreWebVitals: checked as boolean }))
                }
              />
              <Label htmlFor="core-web-vitals" className="text-sm">
                Core Web Vitals
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="network-analysis"
                checked={performanceOptions.networkAnalysis}
                onCheckedChange={(checked) =>
                  setPerformanceOptions(prev => ({ ...prev, networkAnalysis: checked as boolean }))
                }
              />
              <Label htmlFor="network-analysis" className="text-sm">
                Network Analysis
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accessibility-check"
                checked={performanceOptions.accessibilityCheck}
                onCheckedChange={(checked) =>
                  setPerformanceOptions(prev => ({ ...prev, accessibilityCheck: checked as boolean }))
                }
              />
              <Label htmlFor="accessibility-check" className="text-sm">
                Accessibility Check
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="seo-analysis"
                checked={performanceOptions.seoAnalysis}
                onCheckedChange={(checked) =>
                  setPerformanceOptions(prev => ({ ...prev, seoAnalysis: checked as boolean }))
                }
              />
              <Label htmlFor="seo-analysis" className="text-sm">
                SEO Analysis
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="code-quality"
                checked={performanceOptions.codeQualityCheck}
                onCheckedChange={(checked) =>
                  setPerformanceOptions(prev => ({ ...prev, codeQualityCheck: checked as boolean }))
                }
              />
              <Label htmlFor="code-quality" className="text-sm">
                Code Quality Check
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="competitor-analysis"
                checked={performanceOptions.competitorAnalysis}
                onCheckedChange={(checked) =>
                  setPerformanceOptions(prev => ({ ...prev, competitorAnalysis: checked as boolean }))
                }
              />
              <Label htmlFor="competitor-analysis" className="text-sm">
                Competitor Analysis
              </Label>
            </div>
          </div>

          {performanceOptions.competitorAnalysis && (
            <div className="mt-3 p-3 border rounded bg-white">
              <Label className="text-sm font-medium mb-2 block">
                Competitor URLs (for benchmarking):
              </Label>
              <Textarea
                placeholder="Enter competitor URLs, one per line..."
                value={performanceOptions.competitorUrls.join('\n')}
                onChange={(e) => {
                  const urls = e.target.value.split('\n').filter(url => url.trim());
                  setPerformanceOptions(prev => ({ ...prev, competitorUrls: urls }));
                }}
                className="min-h-20"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderPatternsSection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="custom-patterns" className="text-sm font-medium">
          Custom Technology Patterns:
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={generateAIPatterns}
            disabled={isGeneratingPatterns}
            className="flex items-center gap-2"
          >
            {isGeneratingPatterns ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {isGeneratingPatterns ? 'Generating...' : 'Generate AI Patterns'}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearPatterns}
            disabled={customPatterns.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </Button>
        </div>
      </div>
      
      <Textarea
        id="custom-patterns"
        placeholder="Enter custom patterns, one per line... Or click 'Generate AI Patterns' for comprehensive technology detection patterns"
        className="min-h-[150px]"
        value={customPatterns.join("\n")}
        onChange={handlePatternChange}
      />
      
      {customPatterns.length > 0 && (
        <div className="text-sm text-gray-600">
          {customPatterns.length} patterns loaded (including social media, frameworks, analytics, and more)
        </div>
      )}
      
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">AI Pattern Generation Features:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 200+ modern web technology patterns</li>
          <li>• Social media integrations (Facebook Pixel, LinkedIn Insight, etc.)</li>
          <li>• Frontend frameworks (React, Vue, Angular, Svelte, etc.)</li>
          <li>• Backend technologies (Node.js, Django, Laravel, etc.)</li>
          <li>• Analytics tools (Google Analytics, Mixpanel, Segment, etc.)</li>
          <li>• E-commerce platforms (Shopify, WooCommerce, etc.)</li>
          <li>• Build tools, CDNs, and cloud services</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="urls" className="text-sm font-medium block mb-2">
          URLs (comma-separated):
        </Label>
        <Input
          type="text"
          id="urls"
          placeholder="Enter URLs, separated by commas"
          onChange={handleUrlChange}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Settings</TabsTrigger>
          <TabsTrigger value="advanced">Deep Search</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="patterns">AI Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          {renderBasicOptions()}
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          {renderDeepSearchOptions()}
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          {renderPerformanceOptions()}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          {renderPatternsSection()}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button onClick={handleAnalyze} disabled={isLoading}>
          {isLoading ? "Analyzing..." : "Analyze"}
        </Button>
        <div>
          <FileInput onFileSelect={onFileUpload} />
        </div>
      </div>

      {demoLimit && (
        <div className="text-red-500 text-sm">
          Demo limit reached. Please sign up to analyze more websites.
        </div>
      )}

      <Button variant="secondary" onClick={onDemoAnalyze} disabled={demoLimit}>
        Run Demo
      </Button>
    </div>
  );
};