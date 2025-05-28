
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  TreeMap
} from 'recharts';
import { 
  GitBranch, 
  BarChart3, 
  Radar as RadarIcon, 
  Grid3X3,
  TrendingUp
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

interface TechStackVisualizationProps {
  results: AnalysisResult[];
}

export const TechStackVisualization: React.FC<TechStackVisualizationProps> = ({ results }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Prepare data for visualizations
  const visualizationData = React.useMemo(() => {
    const completedResults = results.filter(r => r.status === 'completed');
    
    // Category distribution
    const categoryData: Record<string, number> = {};
    const technologyData: Record<string, { count: number; category: string; avgConfidence: number; totalConfidence: number }> = {};
    const detectionMethodData: Record<string, number> = {};
    
    completedResults.forEach(result => {
      result.technologies.forEach(tech => {
        // Category count
        categoryData[tech.category] = (categoryData[tech.category] || 0) + 1;
        
        // Technology count and confidence
        if (!technologyData[tech.name]) {
          technologyData[tech.name] = {
            count: 0,
            category: tech.category,
            avgConfidence: 0,
            totalConfidence: 0
          };
        }
        technologyData[tech.name].count++;
        technologyData[tech.name].totalConfidence += tech.confidence;
        technologyData[tech.name].avgConfidence = technologyData[tech.name].totalConfidence / technologyData[tech.name].count;
        
        // Detection method count
        detectionMethodData[tech.detectionMethod] = (detectionMethodData[tech.detectionMethod] || 0) + 1;
      });
    });

    // Convert to chart-friendly formats
    const categoryChartData = Object.entries(categoryData)
      .map(([category, count]) => ({ category, count, percentage: (count / Object.values(categoryData).reduce((a, b) => a + b, 0)) * 100 }))
      .sort((a, b) => b.count - a.count);

    const technologyChartData = Object.entries(technologyData)
      .map(([name, data]) => ({ 
        name, 
        count: data.count, 
        category: data.category,
        confidence: Math.round(data.avgConfidence * 100),
        size: data.count * data.avgConfidence // For treemap
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20); // Top 20 technologies

    const detectionMethodChartData = Object.entries(detectionMethodData)
      .map(([method, count]) => ({ 
        method, 
        count, 
        percentage: (count / Object.values(detectionMethodData).reduce((a, b) => a + b, 0)) * 100 
      }));

    return {
      categoryChartData,
      technologyChartData,
      detectionMethodChartData,
      totalTechnologies: Object.keys(technologyData).length,
      totalCategories: Object.keys(categoryData).length,
      totalDetections: Object.values(categoryData).reduce((a, b) => a + b, 0)
    };
  }, [results]);

  // Color schemes
  const categoryColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  const detectionMethodColors: Record<string, string> = {
    'Pattern Matching': '#3B82F6',
    'Deep Pattern': '#10B981',
    'AI Analysis': '#8B5CF6',
    'Comment Analysis': '#F59E0B',
    'File Path Analysis': '#EF4444',
    'Meta Tag Analysis': '#06B6D4',
    'CSS Class Analysis': '#84CC16',
    'Cookie Analysis': '#F97316'
  };

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{visualizationData.totalDetections}</p>
                <p className="text-sm text-gray-600">Total Detections</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Grid3X3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{visualizationData.totalTechnologies}</p>
                <p className="text-sm text-gray-600">Unique Technologies</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <GitBranch className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{visualizationData.totalCategories}</p>
                <p className="text-sm text-gray-600">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualization Tabs */}
      <Tabs defaultValue="categories" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="technologies" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Technologies
          </TabsTrigger>
          <TabsTrigger value="methods" className="flex items-center gap-2">
            <RadarIcon className="w-4 h-4" />
            Detection Methods
          </TabsTrigger>
          <TabsTrigger value="ecosystem" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Ecosystem
          </TabsTrigger>
        </TabsList>

        {/* Category Distribution */}
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Technology Categories Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={visualizationData.categoryChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="category" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visualizationData.categoryChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ category, percentage }) => `${category}: ${percentage.toFixed(1)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        fontSize={10}
                      >
                        {visualizationData.categoryChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Technologies */}
        <TabsContent value="technologies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Top Technologies by Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visualizationData.technologyChartData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} fontSize={12} />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'count' ? 'Usage Count' : name]}
                      labelFormatter={(label) => `Technology: ${label}`}
                    />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detection Methods Radar */}
        <TabsContent value="methods">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RadarIcon className="w-5 h-5 text-purple-600" />
                Detection Method Effectiveness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Radar Chart */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={visualizationData.detectionMethodChartData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="method" fontSize={10} />
                      <PolarRadiusAxis />
                      <Radar 
                        name="Detections" 
                        dataKey="count" 
                        stroke="#8B5CF6" 
                        fill="#8B5CF6" 
                        fillOpacity={0.3} 
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Method Statistics */}
                <div className="space-y-3">
                  {visualizationData.detectionMethodChartData
                    .sort((a, b) => b.count - a.count)
                    .map((method, index) => (
                    <div key={method.method} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: detectionMethodColors[method.method] || '#6B7280' }}
                        />
                        <span className="font-medium text-sm">{method.method}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{method.count} detections</Badge>
                        <span className="text-sm text-gray-500">
                          {method.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technology Ecosystem TreeMap */}
        <TabsContent value="ecosystem">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-600" />
                Technology Ecosystem Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <TreeMap
                    data={visualizationData.technologyChartData}
                    dataKey="size"
                    aspectRatio={4/3}
                    stroke="#fff"
                    fill="#3B82F6"
                  />
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>Size represents usage frequency weighted by detection confidence. Larger blocks indicate more prevalent and reliably detected technologies.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
