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
  Zap
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
      <Label htmlFor="custom-patterns" className="text-sm font-medium block">
        Custom Patterns (one per line):
      </Label>
      <Textarea
        id="custom-patterns"
        placeholder="Enter custom patterns, one per line..."
        className="min-h-[100px]"
        value={customPatterns.join("\n")}
        onChange={handlePatternChange}
      />
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
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
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
