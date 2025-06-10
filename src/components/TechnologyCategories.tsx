
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Code, 
  Server, 
  Database, 
  BarChart3, 
  Globe, 
  Layers, 
  Palette,
  Zap
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

interface TechnologyCategoriesProps {
  results: AnalysisResult[];
}

export const TechnologyCategories: React.FC<TechnologyCategoriesProps> = ({ results }) => {
  // Process results to get category statistics
  const categoryStats = React.useMemo(() => {
    const stats: Record<string, {
      count: number;
      technologies: Map<string, { count: number; avgConfidence: number; totalConfidence: number }>;
      totalSites: number;
    }> = {};

    const completedResults = results.filter(r => r.status === 'completed');
    
    completedResults.forEach(result => {
      result.technologies.forEach(tech => {
        if (!stats[tech.category]) {
          stats[tech.category] = {
            count: 0,
            technologies: new Map(),
            totalSites: 0
          };
        }

        const categoryData = stats[tech.category];
        categoryData.count++;

        if (!categoryData.technologies.has(tech.name)) {
          categoryData.technologies.set(tech.name, {
            count: 0,
            avgConfidence: 0,
            totalConfidence: 0
          });
        }

        const techData = categoryData.technologies.get(tech.name)!;
        techData.count++;
        techData.totalConfidence += tech.confidence;
        techData.avgConfidence = techData.totalConfidence / techData.count;
      });
    });

    // Count unique sites per category
    Object.keys(stats).forEach(category => {
      const sitesWithCategory = new Set<string>();
      completedResults.forEach(result => {
        if (result.technologies.some(tech => tech.category === category)) {
          sitesWithCategory.add(result.url);
        }
      });
      stats[category].totalSites = sitesWithCategory.size;
    });

    return stats;
  }, [results]);

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Frontend Frameworks': <Code className="w-5 h-5 text-blue-600" />,
      'Backend Languages': <Server className="w-5 h-5 text-green-600" />,
      'Content Management': <Layers className="w-5 h-5 text-purple-600" />,
      'Analytics & Tracking': <BarChart3 className="w-5 h-5 text-orange-600" />,
      'CDN': <Globe className="w-5 h-5 text-gray-600" />,
      'Web Servers': <Server className="w-5 h-5 text-red-600" />,
      'JavaScript Libraries': <Zap className="w-5 h-5 text-yellow-600" />,
      'CSS Frameworks': <Palette className="w-5 h-5 text-indigo-600" />,
      'Database': <Database className="w-5 h-5 text-teal-600" />,
    };
    return iconMap[category] || <Code className="w-5 h-5 text-gray-600" />;
  };

  const sortedCategories = Object.entries(categoryStats)
    .sort(([, a], [, b]) => b.count - a.count);

  const totalSites = results.filter(r => r.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalSites}</p>
                <p className="text-sm text-gray-600">Sites Analyzed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{sortedCategories.length}</p>
                <p className="text-sm text-gray-600">Categories Found</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(categoryStats).reduce((sum, cat) => {
                    return sum + cat.technologies.size;
                  }, 0)}
                </p>
                <p className="text-sm text-gray-600">Unique Technologies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-6">
        {sortedCategories.map(([category, data]) => {
          const adoptionRate = totalSites > 0 ? (data.totalSites / totalSites) * 100 : 0;
          const topTechnologies = Array.from(data.technologies.entries())
            .sort(([, a], [, b]) => b.count - a.count)
            .slice(0, 5);

          return (
            <Card key={category} className="border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getCategoryIcon(category)}
                    <div>
                      <h3 className="text-lg font-semibold">{category}</h3>
                      <p className="text-sm text-gray-600">
                        {data.totalSites} of {totalSites} sites ({Math.round(adoptionRate)}% adoption)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-1">
                      {data.technologies.size} technologies
                    </Badge>
                    <div className="text-sm text-gray-500">
                      {data.count} total detections
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Adoption Rate Bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Category Adoption</span>
                      <span className="font-medium">{Math.round(adoptionRate)}%</span>
                    </div>
                    <Progress value={adoptionRate} className="h-2" />
                  </div>

                  {/* Top Technologies */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Top Technologies</h4>
                    <div className="space-y-2">
                      {topTechnologies.map(([techName, techData]) => {
                        const techAdoption = totalSites > 0 ? (techData.count / totalSites) * 100 : 0;
                        return (
                          <div key={techName} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{techName}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(techData.avgConfidence * 100)}% confidence
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {techData.count} sites
                              </span>
                              <div className="w-16">
                                <Progress value={techAdoption} className="h-1" />
                              </div>
                              <span className="text-xs text-gray-500 w-8">
                                {Math.round(techAdoption)}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
