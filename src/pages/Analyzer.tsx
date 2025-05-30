
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Globe, LogOut, User, Search, BarChart3, Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { UserMenu } from '@/components/UserMenu';
import { InputPanel } from '@/components/InputPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { TechStackVisualization } from '@/components/TechStackVisualization';
import { TechEcosystemDashboard } from '@/components/TechEcosystemDashboard';
import { CorporateDueDiligence } from '@/components/CorporateDueDiligence';

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
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('analyzer');
  
  // State for analysis functionality
  const [urlInput, setUrlInput] = useState('');
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(true);
  const [aiAnalysisEnabled, setAiAnalysisEnabled] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentJob, setCurrentJob] = useState<AnalysisJob>({
    id: 1,
    status: 'idle',
    totalUrls: 0,
    processedUrls: 0,
    results: []
  });

  const handleStartAnalysis = async (urls: string[], options: any) => {
    setIsProcessing(true);
    
    // Create a new job
    const newJob: AnalysisJob = {
      id: Date.now(),
      status: 'processing',
      totalUrls: urls.length,
      processedUrls: 0,
      results: []
    };
    
    setCurrentJob(newJob);
    
    // Simulate processing (replace with actual analysis logic)
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock result
      const result: AnalysisResult = {
        url,
        status: 'completed',
        technologies: [
          {
            name: 'React',
            category: 'Frontend Frameworks',
            version: '18.2.0',
            confidence: 0.95,
            detectionMethod: 'Pattern Matching',
            patterns: ['react', 'jsx']
          },
          {
            name: 'Tailwind CSS',
            category: 'CSS Frameworks',
            confidence: 0.88,
            detectionMethod: 'CSS Class Analysis',
            patterns: ['tw-', 'tailwind']
          }
        ],
        metadata: {
          title: `Website Analysis for ${url}`,
          description: 'Automated technology detection',
          responseTime: Math.floor(Math.random() * 2000) + 500
        }
      };
      
      // Update job progress
      setCurrentJob(prev => ({
        ...prev,
        processedUrls: i + 1,
        results: [...prev.results, result]
      }));
    }
    
    // Mark job as completed
    setCurrentJob(prev => ({
      ...prev,
      status: 'completed'
    }));
    
    setIsProcessing(false);
  };

  const handleClearAll = () => {
    setUrlInput('');
    setCurrentJob({
      id: Date.now(),
      status: 'idle',
      totalUrls: 0,
      processedUrls: 0,
      results: []
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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
              Pro Dashboard
            </Badge>
          </div>
          
          <div className="flex items-center gap-4">
            {user && <UserMenu />}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.user_metadata?.first_name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Analyze technology stacks, explore corporate intelligence, and gain competitive insights.
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
              <p className="text-sm text-gray-600">Unlimited Searches</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <p className="text-sm text-gray-600">Analysis Available</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">AI</div>
              <p className="text-sm text-gray-600">Powered Insights</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">Pro</div>
              <p className="text-sm text-gray-600">Premium Features</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
