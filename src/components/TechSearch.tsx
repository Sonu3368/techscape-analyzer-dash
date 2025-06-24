
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Search, ExternalLink } from 'lucide-react';

interface TechResult {
  name: string;
  category: string;
  confidence: number;
  version?: string;
}

interface AnalysisResult {
  url: string;
  technologies: TechResult[];
  responseTime: number;
  status: string;
  scanDate: string;
}

export const TechSearch = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const validateUrl = (url: string): boolean => {
    const urlPattern = /^https?:\/\/.+/i;
    return urlPattern.test(url.trim());
  };

  const handleAnalyze = async () => {
    const trimmedUrl = urlInput.trim();
    
    if (!trimmedUrl) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!validateUrl(trimmedUrl)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulate analysis with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult: AnalysisResult = {
        url: trimmedUrl,
        technologies: [
          { name: 'React', category: 'JavaScript Frameworks', confidence: 95, version: '18.x' },
          { name: 'Webpack', category: 'Module Bundlers', confidence: 90 },
          { name: 'Nginx', category: 'Web Servers', confidence: 85 },
          { name: 'Google Analytics', category: 'Analytics', confidence: 88 },
          { name: 'Tailwind CSS', category: 'CSS Frameworks', confidence: 92 }
        ],
        responseTime: Math.floor(Math.random() * 2000) + 500,
        status: 'completed',
        scanDate: new Date().toISOString()
      };

      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete",
        description: `Found ${mockResult.technologies.length} technologies`,
      });

    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the website. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Technology Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Website URL</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isAnalyzing}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                className="flex-1"
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !urlInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analysisResult && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-green-600" />
              Analysis Results for {analysisResult.url}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Response Time: {analysisResult.responseTime}ms</span>
                <span>•</span>
                <span>Scanned: {new Date(analysisResult.scanDate).toLocaleString()}</span>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Technologies Detected:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisResult.technologies.map((tech, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{tech.name}</div>
                        <div className="text-sm text-gray-600">{tech.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{tech.confidence}%</div>
                        {tech.version && (
                          <div className="text-xs text-gray-500">v{tech.version}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
