
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Globe, Search, BarChart, Building, TrendingUp, FileText, CreditCard } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/analyzer');
    } else {
      navigate('/auth/signup');
    }
  };

  const handleAnalyzer = () => {
    if (user) {
      navigate('/analyzer');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">TechAnalyzer Pro</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/analyzer')}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Dashboard
                  </Button>
                  <UserMenu />
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate('/auth/login')}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => navigate('/auth/signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Discover Website Technologies & 
            <span className="text-blue-600"> GST Analytics</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Analyze any website's technology stack instantly and manage your GST compliance with our comprehensive dashboard. 
            Get detailed insights, corporate data, and ensure tax compliance in one powerful platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              <Search className="mr-2 h-5 w-5" />
              Start Analysis
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleAnalyzer}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg"
            >
              <BarChart className="mr-2 h-5 w-5" />
              View Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Powerful Features for Modern Businesses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Technology Analysis */}
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Tech Analysis</h3>
            <p className="text-gray-600">
              Discover frameworks, CMS, analytics tools, and hosting providers used by any website.
            </p>
          </div>

          {/* Corporate Intelligence */}
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Corporate Data</h3>
            <p className="text-gray-600">
              Access comprehensive company information, financial data, and compliance records.
            </p>
          </div>

          {/* GST Compliance */}
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">GST Analytics</h3>
            <p className="text-gray-600">
              Complete GST compliance management with ITC reconciliation and filing status tracking.
            </p>
          </div>

          {/* Analytics & Insights */}
          <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
            <p className="text-gray-600">
              Get actionable insights on vendor compliance, working capital impact, and tax optimization.
            </p>
          </div>
        </div>
      </div>

      {/* GST Dashboard Preview */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive GST Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our integrated GST analytics provide everything you need for complete tax compliance and business insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Return Filing Status</h3>
              <p className="text-gray-600">Track GSTR-1, GSTR-3B, and annual return filing status with automated reminders</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">ITC Management</h3>
              <p className="text-gray-600">Reconcile input tax credit with vendor compliance monitoring and dispute tracking</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Business Analytics</h3>
              <p className="text-gray-600">Analyze working capital impact, vendor risks, and compliance health scores</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              onClick={handleAnalyzer}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              Explore GST Analytics
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; 2024 TechAnalyzer Pro. All rights reserved.</p>
          <p className="mt-2">
            <a href="#" className="hover:text-blue-600">Terms of Service</a> | <a href="#" className="hover:text-blue-600">Privacy Policy</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
