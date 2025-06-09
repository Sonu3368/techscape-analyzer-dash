import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Share2, 
  MessageCircle, 
  LogIn, 
  ExternalLink,
  Users,
  Heart,
  Eye
} from 'lucide-react';
import { SocialMediaAnalysis, SocialMediaIntegration } from '@/utils/socialMediaDetection';

interface SocialMediaAnalysisProps {
  analysis: SocialMediaAnalysis;
  url: string;
}

export const SocialMediaAnalysisComponent: React.FC<SocialMediaAnalysisProps> = ({ 
  analysis, 
  url 
}) => {
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
      default:
        return 'Integration';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      facebook: 'bg-blue-600',
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

  const groupedIntegrations = analysis.integrations.reduce((acc, integration) => {
    if (!acc[integration.platform]) {
      acc[integration.platform] = [];
    }
    acc[integration.platform].push(integration);
    return acc;
  }, {} as Record<string, SocialMediaIntegration[]>);

  return (
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
              <div className="text-2xl font-bold text-blue-600">{analysis.totalPlatforms}</div>
              <div className="text-sm text-gray-600">Platforms Detected</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analysis.integrations.length}</div>
              <div className="text-sm text-gray-600">Total Integrations</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analysis.engagementFeatures.length}</div>
              <div className="text-sm text-gray-600">Engagement Features</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Integrations */}
      {Object.keys(groupedIntegrations).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Platform Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(groupedIntegrations).map(([platform, integrations]) => (
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
                          <span className={`text-sm ${getConfidenceColor(integration.confidence)}`}>
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

                  {/* Show URLs if available */}
                  {integrations.some(i => i.urls && i.urls.length > 0) && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="text-sm font-medium text-gray-700 mb-2">Profile Links:</div>
                      <div className="flex flex-wrap gap-2">
                        {integrations
                          .filter(i => i.urls && i.urls.length > 0)
                          .flatMap(i => i.urls!)
                          .slice(0, 3)
                          .map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                            >
                              {url.length > 40 ? `${url.substring(0, 40)}...` : url}
                            </a>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Features */}
      {analysis.engagementFeatures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Engagement Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.engagementFeatures.map((feature, index) => (
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
      {analysis.socialLoginOptions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-green-600" />
              Social Login Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.socialLoginOptions.map((option, index) => (
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
      {analysis.integrations.length === 0 && (
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
  );
};