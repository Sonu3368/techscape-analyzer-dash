import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  Globe, 
  Code, 
  Zap,
  Brain,
  Tag,
  Clock,
  Users,
  Share2,
  MessageCircle,
  LogIn,
  ExternalLink,
  Heart,
  Eye
} from 'lucide-react';

interface SocialMediaIntegration {
  platform: string;
  type: 'icon' | 'share_button' | 'embedded_feed' | 'social_login' | 'comment_system' | 'widget' | 'pixel' | 'tracking';
  confidence: number;
  evidence: string[];
  urls?: string[];
}

interface SocialMediaAnalysis {
  integrations: SocialMediaIntegration[];
  totalPlatforms: number;
  engagementFeatures: string[];
  socialLoginOptions: string[];
}

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
  socialMediaAnalysis?: SocialMediaAnalysis;
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
  htmlContent?: string;
  scripts?: string[];
  links?: string[];
}

interface AnalysisJob {
  id: number;
  status: string;
  totalUrls: number;
  processedUrls: number;
  results: AnalysisResult[];
}

interface ResultsPanelProps {
  job: AnalysisJob;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ job }) => {
  const [expandedUrls, setExpandedUrls] = useState<Set<string>>(new Set());

  const toggleExpanded = (url: string) => {
    const newExpanded = new Set(expandedUrls);
    if (newExpanded.has(url)) {
      newExpanded.delete(url);
    } else {
      newExpanded.add(url);
    }
    setExpandedUrls(newExpanded);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'ai analysis':
        return <Brain className="w-3 h-3" />;
      case 'deep pattern':
        return <Zap className="w-3 h-3" />;
      case 'pattern matching':
        return <Code className="w-3 h-3" />;
      default:
        return <Tag className="w-3 h-3" />;
    }
  };

  const getIntegrationIcon = (type: SocialMediaIntegration['type']) => {
    switch (type) {
      case 'share_button':
        return <Share2 className="w-4 h-4" />;
      case 'comment_system':
        return <MessageCircle className="w-4 h-4" />;
      case 'social_login':
        return <LogIn className="w-4 h-4" />;
      case 'embedded_feed':
        return <Eye className="w-4 h-4" />;
      case 'widget':
        return <Users className="w-4 h-4" />;
      case 'pixel':
        return <Zap className="w-4 h-4" />;
      case 'tracking':
        return <Brain className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getIntegrationTypeLabel = (type: SocialMediaIntegration['type']) => {
    switch (type) {
      case 'icon':
        return 'Social Icon';
      case 'share_button':
        return 'Share Button';
      case 'embedded_feed':
        return 'Embedded Feed';
      case 'social_login':
        return 'Social Login';
      case 'comment_system':
        return 'Comment System';
      case 'widget':
        return 'Social Widget';
      case 'pixel':
        return 'Tracking Pixel';
      case 'tracking':
        return 'Analytics Script';
      default:
        return 'Integration';
    }
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-600',
      google: 'bg-red-500',
      twitter: 'bg-sky-500',
      instagram: 'bg-pink-500',
      linkedin: 'bg-blue-700',
      youtube: 'bg-red-600',
      tiktok: 'bg-black',
      pinterest: 'bg-red-500',
      whatsapp: 'bg-green-500',
      telegram: 'bg-blue-500',
      discord: 'bg-indigo-600'
    };
    return colors[platform.toLowerCase()] || 'bg-gray-500';
  };

  const categoryColors: Record<string, string> = {
    'Frontend Frameworks': 'bg-blue-100 text-blue-800 border-blue-300',
    'Backend Languages': 'bg-green-100 text-green-800 border-green-300',
    'Content Management': 'bg-purple-100 text-purple-800 border-purple-300',
    'Analytics & Tracking': 'bg-orange-100 text-orange-800 border-orange-300',
    'CDN': 'bg-gray-100 text-gray-800 border-gray-300',
    'Web Servers': 'bg-red-100 text-red-800 border-red-300',
    'JavaScript Libraries': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'CSS Frameworks': 'bg-indigo-100 text-indigo-800 border-indigo-300',
    'E-commerce': 'bg-emerald-100 text-emerald-800 border-emerald-300',
  };

  return (
    <div className="space-y-4">
      {job.results.map((result, index) => (
        <Card key={result.url} className="border-gray-200 hover:shadow-md transition-shadow">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleExpanded(result.url)}
              >
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {expandedUrls.has(result.url) ? 
                      <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    }
                    <Globe className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium truncate max-w-md">
                      {result.url}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.status === 'completed' ? (
                      <>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {result.technologies.length} techs
                        </Badge>
                        {result.socialMediaAnalysis && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {result.socialMediaAnalysis.totalPlatforms} social
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {result.metadata.responseTime}ms
                        </Badge>
                      </>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Failed
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0">
                {result.status === 'failed' ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 font-medium">Analysis Failed</p>
                    <p className="text-red-600 text-sm mt-1">{result.error}</p>
                  </div>
                ) : (
                  <Tabs defaultValue="technologies" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="technologies">Technologies</TabsTrigger>
                      <TabsTrigger value="social">Social Media</TabsTrigger>
                      <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="technologies" className="space-y-6 mt-4">
                      {/* Website Metadata */}
                      {result.metadata.title && (
                        <div className="p-4 bg-gray-50 rounded-lg border">
                          <h4 className="font-medium text-gray-900 mb-2">{result.metadata.title}</h4>
                          {result.metadata.description && (
                            <p className="text-sm text-gray-600">{result.metadata.description}</p>
                          )}
                        </div>
                      )}

                      {/* Detected Technologies */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Code className="w-4 h-4" />
                          Detected Technologies ({result.technologies.length})
                        </h4>
                        
                        <div className="grid gap-3">
                          {result.technologies.map((tech, techIndex) => (
                            <div key={techIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">{tech.name}</span>
                                  {tech.version && (
                                    <Badge variant="outline" className="text-xs">
                                      v{tech.version}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    {getMethodIcon(tech.detectionMethod)}
                                    <span className="text-xs text-gray-500">{tech.detectionMethod}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${getConfidenceColor(tech.confidence)}`} />
                                    <span className="text-xs text-gray-500">
                                      {Math.round(tech.confidence * 100)}%
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="outline" 
                                  className={categoryColors[tech.category] || 'bg-gray-100 text-gray-800'}
                                >
                                  {tech.category}
                                </Badge>
                                
                                {tech.patterns.length > 0 && (
                                  <div className="text-xs text-gray-500">
                                    Patterns: {tech.patterns.slice(0, 2).join(', ')}
                                    {tech.patterns.length > 2 && ` +${tech.patterns.length - 2} more`}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="social" className="mt-4">
                      {result.socialMediaAnalysis ? (
                        <div className="space-y-6">
                          {/* Overview */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                Social Media Integration Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">{result.socialMediaAnalysis.totalPlatforms}</div>
                                  <div className="text-sm text-gray-600">Platforms Detected</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                  <div className="text-2xl font-bold text-green-600">{result.socialMediaAnalysis.integrations.length}</div>
                                  <div className="text-sm text-gray-600">Total Integrations</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-600">{result.socialMediaAnalysis.engagementFeatures.length}</div>
                                  <div className="text-sm text-gray-600">Engagement Features</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Platform Integrations */}
                          {result.socialMediaAnalysis.integrations.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle>Platform Integrations</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {/* Group integrations by platform */}
                                  {Object.entries(
                                    result.socialMediaAnalysis.integrations.reduce((acc, integration) => {
                                      if (!acc[integration.platform]) {
                                        acc[integration.platform] = [];
                                      }
                                      acc[integration.platform].push(integration);
                                      return acc;
                                    }, {} as Record<string, SocialMediaIntegration[]>)
                                  ).map(([platform, integrations]) => (
                                    <div key={platform} className="border rounded-lg p-4">
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                          <div className={`w-3 h-3 rounded-full ${getPlatformColor(platform)}`} />
                                          <span className="font-semibold capitalize">{platform}</span>
                                          <Badge variant="secondary">{integrations.length} integrations</Badge>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {integrations.map((integration, index) => (
                                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                            <div className="flex items-center gap-2">
                                              {getIntegrationIcon(integration.type)}
                                              <span className="text-sm font-medium">
                                                {getIntegrationTypeLabel(integration.type)}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              <span className={`text-sm ${integration.confidence >= 0.8 ? 'text-green-600' : integration.confidence >= 0.6 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {Math.round(integration.confidence * 100)}%
                                              </span>
                                              <Progress 
                                                value={integration.confidence * 100} 
                                                className="w-16 h-2"
                                              />
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      {/* Show evidence */}
                                      <div className="mt-3 pt-3 border-t">
                                        <div className="text-sm font-medium text-gray-700 mb-2">Evidence:</div>
                                        <div className="flex flex-wrap gap-2">
                                          {integrations
                                            .flatMap(i => i.evidence)
                                            .slice(0, 3)
                                            .map((evidence, index) => (
                                              <span
                                                key={index}
                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                                              >
                                                {evidence.length > 40 ? `${evidence.substring(0, 40)}...` : evidence}
                                              </span>
                                            ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Engagement Features */}
                          {result.socialMediaAnalysis.engagementFeatures.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Heart className="w-5 h-5 text-pink-600" />
                                  Engagement Features
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {result.socialMediaAnalysis.engagementFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-pink-50 rounded">
                                      <Share2 className="w-4 h-4 text-pink-600" />
                                      <span className="text-sm">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Social Login Options */}
                          {result.socialMediaAnalysis.socialLoginOptions.length > 0 && (
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <LogIn className="w-5 h-5 text-green-600" />
                                  Social Login Options
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {result.socialMediaAnalysis.socialLoginOptions.map((option, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-green-50 rounded">
                                      <LogIn className="w-4 h-4 text-green-600" />
                                      <span className="text-sm">{option}</span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* No Integrations Found */}
                          {result.socialMediaAnalysis.integrations.length === 0 && (
                            <Card>
                              <CardContent className="pt-6">
                                <div className="text-center py-8">
                                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Social Media Integrations Found</h3>
                                  <p className="text-gray-500">
                                    This website doesn't appear to have any detectable social media integrations.
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No social media analysis available for this result</p>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="ai-analysis" className="mt-4">
                      {/* AI Analysis Results */}
                      {result.aiAnalysis ? (
                        <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-600" />
                            AI Analysis
                          </h4>
                          
                          {/* AI Summary */}
                          <div className="p-3 bg-white rounded border">
                            <h5 className="font-medium text-gray-900 mb-2">Summary</h5>
                            <p className="text-sm text-gray-700">{result.aiAnalysis.summary}</p>
                          </div>

                          {/* Additional Technologies */}
                          {result.aiAnalysis.additionalTechnologies.length > 0 && (
                            <div className="p-3 bg-white rounded border">
                              <h5 className="font-medium text-gray-900 mb-2">
                                Additional Technologies ({result.aiAnalysis.additionalTechnologies.length})
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {result.aiAnalysis.additionalTechnologies.map((tech, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tech.name} ({Math.round(tech.confidence * 100)}%)
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Patterns */}
                          {result.aiAnalysis.patterns.length > 0 && (
                            <div className="p-3 bg-white rounded border">
                              <h5 className="font-medium text-gray-900 mb-2">Observed Patterns</h5>
                              <ul className="space-y-1">
                                {result.aiAnalysis.patterns.map((pattern, index) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                                    {pattern}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recommendations */}
                          {result.aiAnalysis.recommendations.length > 0 && (
                            <div className="p-3 bg-white rounded border">
                              <h5 className="font-medium text-gray-900 mb-2">Recommendations</h5>
                              <ul className="space-y-1">
                                {result.aiAnalysis.recommendations.map((rec, index) => (
                                  <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                    <span className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                                    {rec}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No AI analysis available for this result</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};
