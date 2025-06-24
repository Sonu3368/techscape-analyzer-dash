
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Globe, Search, BarChart3, Building2 } from 'lucide-react';
import { InputPanel } from '@/components/InputPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { TechStackVisualization } from '@/components/TechStackVisualization';
import { TechEcosystemDashboard } from '@/components/TechEcosystemDashboard';
import { CorporateDueDiligence } from '@/components/CorporateDueDiligence';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DetectedTechnology {
  name: string;
  category: string;
  version?: string;
  confidence: number;
  detectionMethod: string;
  patterns: string[];
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

interface AnalysisJob {
  id: number;
  status: string;
  totalUrls: number;
  processedUrls: number;
  results: AnalysisResult[];
}

const Analyzer = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analyzer');
  
  // State for analysis functionality
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJob, setCurrentJob] = useState<AnalysisJob>({
    id: 1,
    status: 'idle',
    totalUrls: 0,
    processedUrls: 0,
    results: []
  });

  const handleAnalyze = async (analysisRequest: any) => {
    setIsProcessing(true);
    
    // Create a new job
    const newJob: AnalysisJob = {
      id: Date.now(),
      status: 'processing',
      totalUrls: analysisRequest.urls.length,
      processedUrls: 0,
      results: []
    };
    
    setCurrentJob(newJob);
    
    try {
      console.log('Starting real website analysis for URLs:', analysisRequest.urls);
      console.log('Analysis options:', analysisRequest);

      // Call the real Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('analyze', {
        body: {
          urls: analysisRequest.urls,
          deepSearchEnabled: analysisRequest.deepSearchEnabled,
          aiAnalysisEnabled: analysisRequest.aiAnalysisEnabled,
          searchMode: analysisRequest.searchMode || 'full',
          deepSearchOptions: analysisRequest.deepSearchOptions || {
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
          },
          customPatterns: analysisRequest.customPatterns || []
        }
      });

      if (error) {
        console.error('Analysis error:', error);
        toast({
          title: "Analysis Failed",
          description: error.message || "Failed to analyze websites. Please try again.",
          variant: "destructive",
        });
        
        setCurrentJob(prev => ({
          ...prev,
          status: 'failed'
        }));
        return;
      }

      console.log('Analysis completed successfully:', data);
      
      // Update job with real results
      setCurrentJob({
        id: data.jobId || Date.now(),
        status: data.status || 'completed',
        totalUrls: data.totalUrls || analysisRequest.urls.length,
        processedUrls: data.processedUrls || analysisRequest.urls.length,
        results: data.results || []
      });

      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${data.results?.length || 0} websites with real technology detection.`,
      });

    } catch (error) {
      console.error('Error calling analyze function:', error);
      toast({
        title: "Analysis Error",
        description: "An unexpected error occurred during analysis. Please try again.",
        variant: "destructive",
      });
      
      setCurrentJob(prev => ({
        ...prev,
        status: 'failed'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (file: File) => {
    // Handle file upload logic here
    console.log('File uploaded:', file.name);
    toast({
      title: "File Uploaded",
      description: `File ${file.name} has been uploaded successfully.`,
    });
  };

  const handleDemoAnalyze = () => {
    // Handle demo analysis
    const demoUrls = ['https://example.com', 'https://github.com'];
    const demoRequest = {
      urls: demoUrls,
      deepSearchEnabled: true,
      aiAnalysisEnabled: true,
      searchMode: 'full',
      deepSearchOptions: {
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
      },
      customPatterns: []
    };
    
    handleAnalyze(demoRequest);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">TechStack Analyzer</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              Pro Dashboard - Real Data
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-gray-700 hover:text-blue-600"
            >
              Home
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Website Technology Analyzer
          </h1>
          <p className="text-gray-600">
            Analyze real technology stacks from live websites, explore corporate intelligence, and gain competitive insights.
          </p>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mb-6">
            <TabsTrigger value="analyzer" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Tech Analyzer
            </TabsTrigger>
            <TabsTrigger value="ecosystem" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Tech Ecosystem
            </TabsTrigger>
            <TabsTrigger value="corporate" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Corporate Intel
            </TabsTrigger>
          </TabsList>

          {/* Technology Analyzer Tab */}
          <TabsContent value="analyzer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InputPanel
                onAnalyze={handleAnalyze}
                isLoading={isProcessing}
                onFileUpload={handleFileUpload}
              />
              <ResultsPanel job={currentJob} />
            </div>
            <TechStackVisualization results={currentJob.results} />
          </TabsContent>

          {/* Technology Ecosystem Tab */}
          <TabsContent value="ecosystem" className="space-y-6">
            <TechEcosystemDashboard results={currentJob.results} />
          </TabsContent>

          {/* Corporate Due Diligence Tab */}
          <TabsContent value="corporate" className="space-y-6">
            <CorporateDueDiligence />
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">∞</div>
              <p className="text-sm text-gray-600">Unlimited Real Analysis</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <p className="text-sm text-gray-600">Live Data Available</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">AI</div>
              <p className="text-sm text-gray-600">Enhanced Detection</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">Pro</div>
              <p className="text-sm text-gray-600">Deep Tech Analysis</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
