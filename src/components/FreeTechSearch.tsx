import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, ExternalLink, AlertTriangle } from 'lucide-react';
import { DemoCounter } from '@/components/DemoCounter';
import { useDemoLimit } from '@/hooks/useDemoLimit';
import { useAuth } from '@/hooks/useAuth';

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
  remainingDemoSearches: number;
}

export const FreeTechSearch = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { user } = useAuth();
  const { isDemoLimitReached, remainingDemoSearches, incrementDemoCount } = useDemoLimit();

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

    if (!user && isDemoLimitReached) {
      toast({
        title: "Demo Limit Reached",
        description: "Please sign up or log in to continue analyzing websites",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // For authenticated users, we would call a different endpoint
      if (user) {
        toast({
          title: "Redirecting",
          description: "Please use the full analyzer for unlimited searches",
        });
        setIsAnalyzing(false);
        return;
      }

      // Call the demo analysis endpoint
      const response = await fetch('https://ffgbpdfpgicgucmpqdsn.supabase.co/functions/v1/demo-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: trimmedUrl,
          clientDemoSearchCount: remainingDemoSearches 
        }),
      });

      if (!response.ok) {
        if (response.status === 403) {
          const errorData = await response.json();
          toast({
            title: "Demo Limit Reached",
            description: errorData.message || "Please sign up or log in to continue",
            variant: "destructive",
          });
          return;
        }

        // Get detailed error information
        let errorMessage = `Server Error (${response.status} ${response.statusText})`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage += `: ${errorData.message}`;
          }
        } catch (e) {
          // If we can't parse the error response, just use the status info
          console.error('Error parsing error response:', e);
        }

        console.error('Analysis error details:', {
          status: response.status,
          statusText: response.statusText,
          url: trimmedUrl
        });

        toast({
          title: "Analysis Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const result = await response.json();
      setAnalysisResult(result);
      
      // Increment demo count for unauthenticated users
      incrementDemoCount();
      
      toast({
        title: "Analysis Complete",
        description: `Found ${result.technologies.length} technologies`,
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

  if (user) {
    return (
      <Card className="border-green-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Unlimited Access
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              You have unlimited access! Use the full analyzer for comprehensive technology analysis.
            </p>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <a href="/analyzer">Go to Full Analyzer</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Free Technology Search
            </CardTitle>
            <DemoCounter />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="demo-url">Website URL</Label>
            <div className="flex gap-2">
              <Input
                id="demo-url"
                placeholder="https://example.com"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={isAnalyzing || isDemoLimitReached}
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
                className="flex-1"
              />
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || isDemoLimitReached || !urlInput.trim()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {remainingDemoSearches <= 2 && remainingDemoSearches > 0 && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Only {remainingDemoSearches} free searches remaining. 
                <a href="/auth/signup" className="font-medium underline ml-1">Sign up</a> for unlimited access!
              </p>
            </div>
          )}

          {isDemoLimitReached && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-red-800 mb-2">Demo Limit Reached</h3>
              <p className="text-sm text-red-800 mb-4">
                You've used all 5 free technology searches. Sign up or log in for unlimited access!
              </p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" asChild>
                  <a href="/auth/signup">Sign Up Free</a>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href="/auth/login">Log In</a>
                </Button>
              </div>
            </div>
          )}
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
                <span>•</span>
                <span>{analysisResult.remainingDemoSearches} searches remaining</span>
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

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800 text-center">
                  Want more detailed analysis and unlimited searches? 
                  <a href="/auth/signup" className="font-medium underline ml-1">Sign up for free!</a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};