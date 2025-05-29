
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  Code,
  Server,
  Shield,
  Palette,
  Cloud,
  CreditCard,
  ShoppingCart,
  Zap,
  Database,
  Globe
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

interface TechnologyCategoriesDetailedProps {
  results: AnalysisResult[];
}

export const TechnologyCategoriesDetailed: React.FC<TechnologyCategoriesDetailedProps> = ({ results }) => {
  // Process results to group technologies by category
  const categorizedTechnologies = React.useMemo(() => {
    const categories: Record<string, DetectedTechnology[]> = {};
    
    const completedResults = results.filter(r => r.status === 'completed');
    
    completedResults.forEach(result => {
      result.technologies.forEach(tech => {
        if (!categories[tech.category]) {
          categories[tech.category] = [];
        }
        
        // Only add if not already present (avoid duplicates)
        const exists = categories[tech.category].some(existing => existing.name === tech.name);
        if (!exists) {
          categories[tech.category].push(tech);
        }
      });
    });

    return categories;
  }, [results]);

  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'CSS Frameworks': <Palette className="w-5 h-5" />,
      'Analytics & Tracking': <BarChart3 className="w-5 h-5" />,
      'Frontend Frameworks': <Code className="w-5 h-5" />,
      'Widgets': <Zap className="w-5 h-5" />,
      'eCommerce Platforms': <ShoppingCart className="w-5 h-5" />,
      'Payment Gateways': <CreditCard className="w-5 h-5" />,
      'Security Technologies': <Shield className="w-5 h-5" />,
      'Backend Frameworks': <Server className="w-5 h-5" />,
      'Content Delivery Networks': <Cloud className="w-5 h-5" />,
      'Content Management': <Database className="w-5 h-5" />,
      'JavaScript Libraries': <Code className="w-5 h-5" />,
      'Web Servers': <Server className="w-5 h-5" />
    };
    return iconMap[category] || <Globe className="w-5 h-5" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      'CSS Frameworks': 'bg-green-50 border-green-200',
      'Analytics & Tracking': 'bg-green-50 border-green-200',
      'Frontend Frameworks': 'bg-blue-50 border-blue-200',
      'Widgets': 'bg-purple-50 border-purple-200',
      'eCommerce Platforms': 'bg-green-50 border-green-200',
      'Payment Gateways': 'bg-yellow-50 border-yellow-200',
      'Security Technologies': 'bg-orange-50 border-orange-200',
      'Backend Frameworks': 'bg-blue-50 border-blue-200',
      'Content Delivery Networks': 'bg-purple-50 border-purple-200',
      'Content Management': 'bg-pink-50 border-pink-200',
      'JavaScript Libraries': 'bg-red-50 border-red-200',
      'Web Servers': 'bg-gray-50 border-gray-200'
    };
    return colorMap[category] || 'bg-gray-50 border-gray-200';
  };

  const totalCategories = Object.keys(categorizedTechnologies).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Technology Categories Detected</h1>
        <p className="text-gray-600">Comprehensive analysis across {totalCategories} technology categories</p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categorizedTechnologies).map(([category, technologies]) => (
          <Card key={category} className={`${getCategoryColor(category)} hover:shadow-lg transition-shadow`}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                {getCategoryIcon(category)}
                <span>{category}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {technologies.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{tech.name}</span>
                      {tech.version && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          v{tech.version}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">1 site</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="text-center pt-6 border-t">
        <p className="text-gray-600">
          Found <span className="font-semibold text-gray-900">{Object.values(categorizedTechnologies).flat().length}</span> unique technologies 
          across <span className="font-semibold text-gray-900">{totalCategories}</span> categories
        </p>
      </div>
    </div>
  );
};
