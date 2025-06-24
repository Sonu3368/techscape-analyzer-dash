import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { FileInput } from '@/components/FileInput';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap } from 'lucide-react';

export const InputPanel = ({ onAnalyze, isLoading, onFileUpload }) => {
  const [urls, setUrls] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(false);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(false);
  const [searchMode, setSearchMode] = useState('full');
  const [customPatterns, setCustomPatterns] = useState([]);
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
    competitorUrls: []
  });

  const handleUrlChange = (e) => {
    const inputUrls = e.target.value.split(',').map(url => url.trim()).filter(url => url !== '');
    setUrls(inputUrls);
  };

  const handleAnalyze = () => {
    if (urls.length === 0) {
      toast({
        title: "No URLs provided",
        description: "Please enter at least one URL to analyze.",
      });
      return;
    }

    onAnalyze(urls, {
      deepSearch: deepSearchEnabled,
      aiAnalysis: aiAnalysisEnabled,
      searchMode: searchMode,
      customPatterns: customPatterns,
      deepSearchOptions: deepSearchOptions,
      performanceAnalysis: performanceAnalysisEnabled,
      performanceOptions: performanceOptions
    });
  };

  const handleAddPattern = () => {
    setCustomPatterns(prevPatterns => [...prevPatterns, { key: '', pattern: '' }]);
  };

  const handlePatternChange = (index, field, value) => {
    const updatedPatterns = [...customPatterns];
    updatedPatterns[index][field] = value;
    setCustomPatterns(updatedPatterns);
  };

  const handleRemovePattern = (index) => {
    const updatedPatterns = [...customPatterns];
    updatedPatterns.splice(index, 1);
    setCustomPatterns(updatedPatterns);
  };

  const handleDeepSearchOptionChange = (option, value) => {
    setDeepSearchOptions(prev => ({ ...prev, [option]: value }));
  };

  const handlePerformanceOptionChange = (option, value) => {
    setPerformanceOptions(prev => ({ ...prev, [option]: value }));
  };

  const handleCompetitorUrlChange = (index, value) => {
    const updatedUrls = [...performanceOptions.competitorUrls];
    updatedUrls[index] = value;
    setPerformanceOptions(prev => ({
      ...prev,
      competitorUrls: updatedUrls
    }));
  };

  const handleAddCompetitorUrl = () => {
    setPerformanceOptions(prev => ({
      ...prev,
      competitorUrls: [...prev.competitorUrls, '']
    }));
  };

  const handleRemoveCompetitorUrl = (index) => {
    const updatedUrls = [...performanceOptions.competitorUrls];
    updatedUrls.splice(index, 1);
    setPerformanceOptions(prev => ({
      ...prev,
      competitorUrls: updatedUrls
    }));
  };

  const renderBasicOptions = () => (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="deep-search">Enable Deep Search</Label>
        <Switch
          id="deep-search"
          checked={deepSearchEnabled}
          onCheckedChange={setDeepSearchEnabled}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="ai-analysis">Enable AI Analysis</Label>
        <Switch
          id="ai-analysis"
          checked={aiAnalysisEnabled}
          onCheckedChange={setAiAnalysisEnabled}
        />
      </div>

      <div>
        <Label htmlFor="search-mode" className="block text-sm font-medium leading-6 text-gray-900">
          Search Mode
        </Label>
        <div className="mt-2">
          <select
            id="search-mode"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value)}
          >
            <option value="full">Full</option>
            <option value="fast">Fast</option>
            <option value="light">Light</option>
          </select>
        </div>
      </div>
    </>
  );

  const renderAdvancedOptions = () => (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="analyze-comments" className="flex items-center space-x-2">
          <Checkbox
            id="analyze-comments"
            checked={deepSearchOptions.analyzeHtmlComments}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('analyzeHtmlComments', checked)}
          />
          <span>Analyze HTML Comments</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="analyze-meta" className="flex items-center space-x-2">
          <Checkbox
            id="analyze-meta"
            checked={deepSearchOptions.analyzeMetaTags}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('analyzeMetaTags', checked)}
          />
          <span>Analyze Meta Tags</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="detect-custom" className="flex items-center space-x-2">
          <Checkbox
            id="detect-custom"
            checked={deepSearchOptions.detectCustomElements}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('detectCustomElements', checked)}
          />
          <span>Detect Custom Elements</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="analyze-files" className="flex items-center space-x-2">
          <Checkbox
            id="analyze-files"
            checked={deepSearchOptions.analyzeFilePaths}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('analyzeFilePaths', checked)}
          />
          <span>Analyze File Paths</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="ai-pattern-detection" className="flex items-center space-x-2">
          <Checkbox
            id="ai-pattern-detection"
            checked={deepSearchOptions.aiPatternDetection}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('aiPatternDetection', checked)}
          />
          <span>AI Pattern Detection</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="analyze-css" className="flex items-center space-x-2">
          <Checkbox
            id="analyze-css"
            checked={deepSearchOptions.analyzeCssClasses}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('analyzeCssClasses', checked)}
          />
          <span>Analyze CSS Classes</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="analyze-inline-scripts" className="flex items-center space-x-2">
          <Checkbox
            id="analyze-inline-scripts"
            checked={deepSearchOptions.analyzeInlineScripts}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('analyzeInlineScripts', checked)}
          />
          <span>Analyze Inline Scripts</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="analyze-http-headers" className="flex items-center space-x-2">
          <Checkbox
            id="analyze-http-headers"
            checked={deepSearchOptions.analyzeHttpHeaders}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('analyzeHttpHeaders', checked)}
          />
          <span>Analyze HTTP Headers</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="analyze-cookie-patterns" className="flex items-center space-x-2">
          <Checkbox
            id="analyze-cookie-patterns"
            checked={deepSearchOptions.analyzeCookiePatterns}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('analyzeCookiePatterns', checked)}
          />
          <span>Analyze Cookie Patterns</span>
        </Label>
      </div>

      <div>
        <Label htmlFor="detect-behavioral-patterns" className="flex items-center space-x-2">
          <Checkbox
            id="detect-behavioral-patterns"
            checked={deepSearchOptions.detectBehavioralPatterns}
            onCheckedChange={(checked) => handleDeepSearchOptionChange('detectBehavioralPatterns', checked)}
          />
          <span>Detect Behavioral Patterns</span>
        </Label>
      </div>
    </div>
  );

  const renderPatternsTab = () => (
    <>
      <Button type="button" variant="secondary" size="sm" onClick={handleAddPattern}>
        Add Custom Pattern
      </Button>
      
      {customPatterns.map((pattern, index) => (
        <div key={index} className="flex items-center space-x-4">
          <div className="flex-1">
            <Label htmlFor={`pattern-key-${index}`}>Key</Label>
            <Input
              type="text"
              id={`pattern-key-${index}`}
              value={pattern.key}
              onChange={(e) => handlePatternChange(index, 'key', e.target.value)}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor={`pattern-pattern-${index}`}>Pattern</Label>
            <Input
              type="text"
              id={`pattern-pattern-${index}`}
              value={pattern.pattern}
              onChange={(e) => handlePatternChange(index, 'pattern', e.target.value)}
            />
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => handleRemovePattern(index)}>
            Remove
          </Button>
        </div>
      ))}
    </>
  );

  const renderPerformanceTab = () => (
    <>
      <div className="flex items-center justify-between">
        <Label htmlFor="performance-analysis">Enable Performance Analysis</Label>
        <Switch
          id="performance-analysis"
          checked={performanceAnalysisEnabled}
          onCheckedChange={setPerformanceAnalysisEnabled}
        />
      </div>

      {performanceAnalysisEnabled && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="core-web-vitals" className="flex items-center space-x-2">
                <Checkbox
                  id="core-web-vitals"
                  checked={performanceOptions.coreWebVitals}
                  onCheckedChange={(checked) => handlePerformanceOptionChange('coreWebVitals', checked)}
                />
                <span>Core Web Vitals</span>
              </Label>
            </div>

            <div>
              <Label htmlFor="network-analysis" className="flex items-center space-x-2">
                <Checkbox
                  id="network-analysis"
                  checked={performanceOptions.networkAnalysis}
                  onCheckedChange={(checked) => handlePerformanceOptionChange('networkAnalysis', checked)}
                />
                <span>Network Analysis</span>
              </Label>
            </div>

            <div>
              <Label htmlFor="accessibility-check" className="flex items-center space-x-2">
                <Checkbox
                  id="accessibility-check"
                  checked={performanceOptions.accessibilityCheck}
                  onCheckedChange={(checked) => handlePerformanceOptionChange('accessibilityCheck', checked)}
                />
                <span>Accessibility Check</span>
              </Label>
            </div>

            <div>
              <Label htmlFor="seo-analysis" className="flex items-center space-x-2">
                <Checkbox
                  id="seo-analysis"
                  checked={performanceOptions.seoAnalysis}
                  onCheckedChange={(checked) => handlePerformanceOptionChange('seoAnalysis', checked)}
                />
                <span>SEO Analysis</span>
              </Label>
            </div>

            <div>
              <Label htmlFor="code-quality-check" className="flex items-center space-x-2">
                <Checkbox
                  id="code-quality-check"
                  checked={performanceOptions.codeQualityCheck}
                  onCheckedChange={(checked) => handlePerformanceOptionChange('codeQualityCheck', checked)}
                />
                <span>Code Quality Check</span>
              </Label>
            </div>

            <div>
              <Label htmlFor="competitor-analysis" className="flex items-center space-x-2">
                <Checkbox
                  id="competitor-analysis"
                  checked={performanceOptions.competitorAnalysis}
                  onCheckedChange={(checked) => handlePerformanceOptionChange('competitorAnalysis', checked)}
                />
                <span>Competitor Analysis</span>
              </Label>
            </div>
          </div>

          {performanceOptions.competitorAnalysis && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Competitor URLs:</p>
              {performanceOptions.competitorUrls.map((url, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="url"
                    placeholder="https://competitor.com"
                    value={url}
                    onChange={(e) => handleCompetitorUrlChange(index, e.target.value)}
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCompetitorUrl(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" size="sm" onClick={handleAddCompetitorUrl}>
                Add Competitor URL
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-2xl font-bold mb-6">Website Technology Analyzer</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="urls" className="text-base font-medium mb-2 block">
            Website URLs (comma-separated)
          </Label>
          <Input
            id="urls"
            placeholder="https://example.com, https://another-site.com"
            onChange={handleUrlChange}
            className="text-base"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            {renderBasicOptions()}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            {renderAdvancedOptions()}
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            {renderPatternsTab()}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            {renderPerformanceTab()}
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-4">
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Websites'}
          </Button>
          
          <FileInput onFileSelect={onFileUpload} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
};
