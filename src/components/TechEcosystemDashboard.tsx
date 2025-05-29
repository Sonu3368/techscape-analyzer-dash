
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  BarChart3, 
  Eye,
  Server,
  Shield,
  Code,
  Zap,
  Globe,
  Palette,
  CreditCard,
  ShoppingCart,
  Database,
  Cloud
} from 'lucide-react';

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
  technologies: DetectedTechnology[];
}

interface TechEcosystemDashboardProps {
  results: AnalysisResult[];
}

export const TechEcosystemDashboard: React.FC<TechEcosystemDashboardProps> = ({ results }) => {
  const [activeTab, setActiveTab] = useState('ecosystem');

  // Process results to get category statistics
  const categoryStats = React.useMemo(() => {
    const stats: Record<string, {
      count: number;
      avgConfidence: number;
      totalConfidence: number;
      technologies: string[];
    }> = {};

    const detectionMethods: Record<string, {
      count: number;
      avgConfidence: number;
      totalConfidence: number;
    }> = {};

    const completedResults = results.filter(r => r.status === 'completed');
    
    completedResults.forEach(result => {
      result.technologies.forEach(tech => {
        // Category stats
        if (!stats[tech.category]) {
          stats[tech.category] = {
            count: 0,
            avgConfidence: 0,
            totalConfidence: 0,
            technologies: []
          };
        }
        
        stats[tech.category].count++;
        stats[tech.category].totalConfidence += tech.confidence;
        stats[tech.category].avgConfidence = stats[tech.category].totalConfidence / stats[tech.category].count;
        
        if (!stats[tech.category].technologies.includes(tech.name)) {
          stats[tech.category].technologies.push(tech.name);
        }

        // Detection method stats
        if (!detectionMethods[tech.detectionMethod]) {
          detectionMethods[tech.detectionMethod] = {
            count: 0,
            avgConfidence: 0,
            totalConfidence: 0
          };
        }
        
        detectionMethods[tech.detectionMethod].count++;
        detectionMethods[tech.detectionMethod].totalConfidence += tech.confidence;
        detectionMethods[tech.detectionMethod].avgConfidence = detectionMethods[tech.detectionMethod].totalConfidence / detectionMethods[tech.detectionMethod].count;
      });
    });

    return { categoryStats: stats, detectionMethods };
  }, [results]);

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Analytics & Tracking': <BarChart3 className="w-6 h-6" />,
      'Frontend Frameworks': <Code className="w-6 h-6" />,
      'Backend Frameworks': <Server className="w-6 h-6" />,
      'CSS Frameworks': <Palette className="w-6 h-6" />,
      'Content Delivery Networks': <Cloud className="w-6 h-6" />,
      'Security Technologies': <Shield className="w-6 h-6" />,
      'Payment Gateways': <CreditCard className="w-6 h-6" />,
      'eCommerce Platforms': <ShoppingCart className="w-6 h-6" />,
      'Widgets': <Zap className="w-6 h-6" />,
      'Content Management': <Database className="w-6 h-6" />,
      'JavaScript Libraries': <Code className="w-6 h-6" />,
      'Web Servers': <Server className="w-6 h-6" />
    };
    return iconMap[category] || <Globe className="w-6 h-6" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'Analytics & Tracking': 'from-blue-400 to-blue-600',
      'Frontend Frameworks': 'from-green-400 to-green-600',
      'Backend Frameworks': 'from-cyan-400 to-cyan-600',
      'CSS Frameworks': 'from-purple-400 to-purple-600',
      'Content Delivery Networks': 'from-pink-400 to-pink-600',
      'Security Technologies': 'from-red-400 to-red-600',
      'Payment Gateways': 'from-orange-400 to-orange-600',
      'eCommerce Platforms': 'from-indigo-400 to-indigo-600',
      'Widgets': 'from-yellow-400 to-yellow-600',
      'Content Management': 'from-pink-400 to-pink-600',
      'JavaScript Libraries': 'from-red-400 to-red-600',
      'Web Servers': 'from-blue-400 to-blue-600'
    };
    return colorMap[category] || 'from-gray-400 to-gray-600';
  };

  const totalTechnologies = Object.values(categoryStats.categoryStats).reduce((sum, cat) => sum + cat.technologies.length, 0);
  const totalCategories = Object.keys(categoryStats.categoryStats).length;
  const avgConfidence = Object.values(categoryStats.categoryStats).reduce((sum, cat) => sum + cat.avgConfidence, 0) / totalCategories || 0;
  const websitesAnalyzed = results.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Technology Ecosystem</h1>
        <p className="text-gray-600">Interactive visualization of detected technologies across {websitesAnalyzed} website{websitesAnalyzed !== 1 ? 's' : ''}</p>
      </div>

      {/* Main Dashboard */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="ecosystem" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Tech Ecosystem
          </TabsTrigger>
          <TabsTrigger value="architecture" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Architecture Flow
          </TabsTrigger>
          <TabsTrigger value="detection" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Detection Analysis
          </TabsTrigger>
        </TabsList>

        {/* Tech Ecosystem View */}
        <TabsContent value="ecosystem" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(categoryStats.categoryStats).map(([category, stats]) => (
              <Card key={category} className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(category)} opacity-5`} />
                <CardContent className="pt-6 relative">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${getCategoryColor(category)} text-white`}>
                      {getCategoryIcon(category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{category}</h3>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {stats.technologies.length}
                          </Badge>
                          <span className="text-xs text-gray-500">technologies</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {Math.round(stats.avgConfidence * 100)}% avg confidence
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Architecture Flow View (Placeholder) */}
        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Architecture Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Architecture flow visualization coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detection Analysis View */}
        <TabsContent value="detection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detection Method Analysis</CardTitle>
              <p className="text-sm text-gray-600">How technologies were discovered</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categoryStats.detectionMethods).map(([method, stats]) => (
                  <div key={method} className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                        {stats.count}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-900 mb-1">{method}</h3>
                    <p className="text-sm text-gray-600">{Math.round(stats.avgConfidence * 100)}% avg</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalTechnologies}</div>
          <div className="text-sm text-gray-600">Total Technologies</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{totalCategories}</div>
          <div className="text-sm text-gray-600">Categories</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.round(avgConfidence * 100)}%</div>
          <div className="text-sm text-gray-600">Avg Confidence</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{websitesAnalyzed}</div>
          <div className="text-sm text-gray-600">Websites Analyzed</div>
        </div>
      </div>
    </div>
  );
};
