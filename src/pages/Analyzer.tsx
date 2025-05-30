
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

const Analyzer = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('analyzer');

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
              <InputPanel />
              <ResultsPanel />
            </div>
            <TechStackVisualization />
          </TabsContent>

          {/* Technology Ecosystem Tab */}
          <TabsContent value="ecosystem" className="space-y-6">
            <TechEcosystemDashboard />
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
