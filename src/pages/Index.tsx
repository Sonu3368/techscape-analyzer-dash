
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Activity, Zap, Brain, ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/analyzer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
              <Globe className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-6">
            TechStack Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover the technology stack of any website with our advanced analysis tool. 
            Get real-time insights powered by live data fetching, deep source analysis, and AI-powered detection.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6"
          >
            Start Analyzing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="h-8 w-8 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Live Data Fetching</h3>
              </div>
              <p className="text-sm text-gray-600">
                Real-time analysis of website HTML, headers, and source code with live network requests.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="h-8 w-8 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Deep Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Advanced pattern detection, file analysis, custom technology patterns, and source code inspection.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
                <h3 className="font-semibold text-gray-900">AI Insights</h3>
              </div>
              <p className="text-sm text-gray-600">
                GPT-4 powered contextual analysis and technology recommendations with smart detection.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-8 w-8 text-green-600" />
                <h3 className="font-semibold text-gray-900">Real Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Actual technology detection from live websites with comprehensive reporting and insights.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Powerful Analysis Capabilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Frontend Frameworks</h4>
                  <p className="text-sm text-gray-600">React, Vue.js, Angular, Next.js, Nuxt.js detection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">CSS Frameworks</h4>
                  <p className="text-sm text-gray-600">Bootstrap, Tailwind CSS, Bulma identification</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Backend Technologies</h4>
                  <p className="text-sm text-gray-600">Node.js, Express, Django, Laravel detection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Content Management</h4>
                  <p className="text-sm text-gray-600">WordPress, Drupal, and other CMS platforms</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">CDN & Services</h4>
                  <p className="text-sm text-gray-600">Cloudflare, Amazon CloudFront, and hosting services</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Analytics & Tracking</h4>
                  <p className="text-sm text-gray-600">Google Analytics, Tag Manager, and monitoring tools</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Database Technologies</h4>
                  <p className="text-sm text-gray-600">MongoDB, PostgreSQL, MySQL, Redis detection</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Custom Patterns</h4>
                  <p className="text-sm text-gray-600">Add your own technology patterns for detection</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Analyze Your First Website?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Start discovering the technology stack behind any website with our comprehensive analysis tool. 
                Get detailed insights in minutes with real data and AI-powered detection.
              </p>
              <Button 
                onClick={handleGetStarted}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
