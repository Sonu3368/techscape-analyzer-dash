
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Search, 
  TrendingUp, 
  Activity, 
  BarChart3, 
  Shield,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AnalyticsData {
  totalUsers: number;
  demoSearches: number;
  paidUsers: number;
  conversionRate: number;
  popularTechnologies: Array<{ name: string; count: number }>;
  dailySearches: Array<{ date: string; count: number }>;
}

export const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin (in a real app, this would check user role)
    if (!user) {
      navigate('/admin/login');
      return;
    }

    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Mock data for demo purposes
      // In a real app, this would call your admin analytics API endpoints
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setAnalyticsData({
        totalUsers: 1247,
        demoSearches: 3892,
        paidUsers: 186,
        conversionRate: 14.9,
        popularTechnologies: [
          { name: 'React', count: 892 },
          { name: 'Next.js', count: 654 },
          { name: 'WordPress', count: 543 },
          { name: 'Vue.js', count: 321 },
          { name: 'Angular', count: 287 },
        ],
        dailySearches: [
          { date: '2024-01-01', count: 45 },
          { date: '2024-01-02', count: 52 },
          { date: '2024-01-03', count: 38 },
          { date: '2024-01-04', count: 67 },
          { date: '2024-01-05', count: 73 },
        ],
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!analyticsData && isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-600 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">Admin Dashboard</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-red-600 text-white">
              Administrator
            </Badge>
            <Button variant="ghost" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData?.totalUsers.toLocaleString()}
                  </div>
                  <div className="text-slate-400">Total Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Search className="h-8 w-8 text-green-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData?.demoSearches.toLocaleString()}
                  </div>
                  <div className="text-slate-400">Demo Searches</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-purple-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData?.paidUsers.toLocaleString()}
                  </div>
                  <div className="text-slate-400">Paid Users</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-orange-400" />
                <div>
                  <div className="text-2xl font-bold text-white">
                    {analyticsData?.conversionRate}%
                  </div>
                  <div className="text-slate-400">Conversion Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Daily Search Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analyticsData?.dailySearches.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-400">{day.date}</span>
                      <span className="text-white font-medium">{day.count} searches</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">User Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Free Users</span>
                    <span className="text-white font-medium">
                      {((analyticsData?.totalUsers || 0) - (analyticsData?.paidUsers || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Premium Users</span>
                    <span className="text-white font-medium">
                      {analyticsData?.paidUsers.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Conversion Rate</span>
                    <span className="text-green-400 font-medium">
                      {analyticsData?.conversionRate}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="technologies" className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Popular Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData?.popularTechnologies.map((tech, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-300">{tech.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ 
                              width: `${(tech.count / (analyticsData?.popularTechnologies[0]?.count || 1)) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-white font-medium w-12 text-right">
                          {tech.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="bg-slate-700 hover:bg-slate-600"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
};
