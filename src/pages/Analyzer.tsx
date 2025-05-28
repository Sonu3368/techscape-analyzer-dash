import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { InputPanel } from '@/components/InputPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { TechStackVisualization } from '@/components/TechStackVisualization';
import { TechnologyCategories } from '@/components/TechnologyCategories';
import { ProgressBar } from '@/components/ProgressBar';
import { ExportControls } from '@/components/ExportControls';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Activity, Globe, Zap, Brain } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalysisJob {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalUrls: number;
  processedUrls: number;
  results: AnalysisResult[];
  createdAt: string;
  completedAt?: string;
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
  };
  aiAnalysis?: {
    summary: string;
    additionalTechnologies: DetectedTechnology[];
    patterns: string[];
    recommendations: string[];
  };
}

interface DetectedTechnology {
  name: string;
  category: string;
  version?: string;
  confidence: number;
  detectionMethod: string;
  patterns: string[];
}

const Analyzer = () => {
  const [urlInput, setUrlInput] = useState('');
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(true);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [currentJob, setCurrentJob] = useState<AnalysisJob | null>(null);
  const queryClient = useQueryClient();

  // Mutation for starting analysis using Supabase Edge Function
  const startAnalysisMutation = useMutation({
    mutationFn: async (data: { urls: string[]; options: any }) => {
      console.log('Starting real analysis with data:', data);
      
      const { data: result, error } = await supabase.functions.invoke('analyze', {
        body: {
          urls: data.urls,
          deepSearchEnabled: data.options.deepSearchEnabled,
          aiAnalysisEnabled: data.options.aiAnalysisEnabled,
          searchMode: data.options.searchMode,
          deepSearchOptions: data.options.deepSearchOptions,
          customPatterns: data.options.customPatterns,
        },
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message);
      }

      return result;
    },
    onSuccess: (data) => {
      console.log('Real analysis completed:', data);
      
      // Create a mock job object from the response
      const mockJob: AnalysisJob = {
        id: parseInt(data.jobId),
        status: 'completed',
        totalUrls: data.totalUrls,
        processedUrls: data.processedUrls,
        results: data.results,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };

      setCurrentJobId(mockJob.id);
      setCurrentJob(mockJob);
      
      toast({
        title: "Analysis Completed",
        description: `Successfully analyzed ${data.totalUrls} URLs with real data.`,
      });
    },
    onError: (error) => {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartAnalysis = (urls: string[], options: any) => {
    startAnalysisMutation.mutate({
      urls,
      options,
    });
  };

  const handleClearAll = () => {
    setUrlInput('');
    setCurrentJobId(null);
    setCurrentJob(null);
    queryClient.removeQueries({ queryKey: ['analysisJob'] });
    toast({
      title: "Cleared",
      description: "All data has been cleared",
    });
  };

  const isProcessing = startAnalysisMutation.isPending;
  const hasResults = currentJob?.status === 'completed' && currentJob.results?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              TechStack Analyzer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time website technology detection using live data fetching, 
            deep source analysis, and AI-powered insights
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Live Data Fetching</h3>
              </div>
              <p className="text-sm text-gray-600">
                Real-time analysis of website HTML, headers, and source code
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-indigo-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Deep Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Advanced pattern detection, file analysis, and custom technology patterns
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Insights</h3>
              </div>
              <p className="text-sm text-gray-600">
                GPT-4 powered contextual analysis and technology recommendations
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <InputPanel
              urlInput={urlInput}
              setUrlInput={setUrlInput}
              deepSearchEnabled={deepSearchEnabled}
              setDeepSearchEnabled={setDeepSearchEnabled}
              aiAnalysisEnabled={aiAnalysisEnabled}
              setAiAnalysisEnabled={setAiAnalysisEnabled}
              onStartAnalysis={handleStartAnalysis}
              onClearAll={handleClearAll}
              isProcessing={isProcessing}
            />
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            {isProcessing && (
              <Card className="mb-6 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Analysis in Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Processing your URLs...
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {hasResults && currentJob && (
              <Tabs defaultValue="results" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="visualization">Charts</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="results" className="space-y-6">
                  <ResultsPanel job={currentJob} />
                </TabsContent>

                <TabsContent value="categories" className="space-y-6">
                  <TechnologyCategories results={currentJob.results} />
                </TabsContent>

                <TabsContent value="visualization" className="space-y-6">
                  <TechStackVisualization results={currentJob.results} />
                </TabsContent>

                <TabsContent value="export" className="space-y-6">
                  <ExportControls jobId={currentJob.id} />
                </TabsContent>
              </Tabs>
            )}

            {!currentJob && !isProcessing && (
              <Card className="border-gray-200">
                <CardContent className="pt-12 pb-12 text-center">
                  <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    Ready to Analyze
                  </h3>
                  <p className="text-gray-500">
                    Enter website URLs in the input panel to begin comprehensive technology detection
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
