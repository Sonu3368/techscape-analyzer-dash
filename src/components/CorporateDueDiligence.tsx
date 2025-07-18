
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Building2, 
  FileText, 
  Users, 
  DollarSign, 
  MapPin,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CorporateData {
  identity: {
    companyName: string;
    cin: string;
    registrationNumber: string;
    dateOfIncorporation: string;
    rocCode: string;
    status: 'Active' | 'Dormant' | 'Struck Off' | 'Unknown';
    classification: string;
    category: string;
  };
  financial: {
    authorizedCapital: number;
    paidUpCapital: number;
    netWorth: number;
    totalAssets: number;
    totalLiabilities: number;
    revenue: number;
    charges: Array<{
      id: string;
      amount: number;
      chargeHolder: string;
      dateCreated: string;
      status: string;
    }>;
  };
  directors: Array<{
    name: string;
    din: string;
    designation: string;
    appointmentDate: string;
    status: 'Current' | 'Ceased';
    otherCompanies: number;
  }>;
  compliance: {
    lastFilingDate: string;
    annualReturnStatus: 'Filed' | 'Pending' | 'Overdue' | 'Unknown';
    filings: Array<{
      type: string;
      date: string;
      status: string;
    }>;
  };
  contact: {
    registeredAddress: string;
    email: string;
    website: string;
    phone: string;
  };
}

export const CorporateDueDiligence = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [corporateData, setCorporateData] = useState<CorporateData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a company name or CIN to search",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setCorporateData(null); // Clear previous data
    
    try {
      console.log('Searching for:', searchQuery);
      
      const { data, error: functionError } = await supabase.functions.invoke('corporate-data', {
        body: { searchQuery: searchQuery.trim() }
      });

      if (functionError) {
        console.error('Function error:', functionError);
        setError('Failed to search corporate data. Please try again.');
        toast({
          title: "Search Failed",
          description: "Failed to search corporate data. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Check if the response contains an error (company not found, etc.)
      if (!data || data.error) {
        const errorMessage = data?.message || data?.error || 'Company not found';
        setError(errorMessage);
        toast({
          title: "Company Not Found",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Ensure we have valid corporate data before setting it
      if (data.identity && data.identity.companyName) {
        setCorporateData(data);
        toast({
          title: "Company Found",
          description: `Successfully loaded data for ${data.identity.companyName}`,
        });
      } else {
        setError('Invalid data received from search');
        toast({
          title: "Invalid Data",
          description: "The search returned invalid data. Please try again.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch corporate data';
      setError(errorMessage);
      toast({
        title: "Search Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'filed':
      case 'current':
      case 'satisfied':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'outstanding':
      case 'unknown':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dormant':
      case 'overdue':
      case 'ceased':
      case 'struck off':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Corporate Due Diligence</h1>
        <p className="text-gray-600">
          Real-time corporate intelligence powered by data.gov.in
        </p>
      </div>

      {/* Search Section */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Company Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter Company Name or CIN (e.g., RELIANCE INDUSTRIES LIMITED)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
              disabled={isSearching}
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  Search
                  <Search className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search by company name or CIN to access real corporate data from MCA records
          </p>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Search Error</span>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {corporateData && (
        <div className="space-y-6">
          {/* Company Overview */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-green-600" />
                {corporateData.identity.companyName}
                <Badge className={getStatusColor(corporateData.identity.status)}>
                  {corporateData.identity.status}
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">{corporateData.identity.cin}</p>
            </CardHeader>
          </Card>

          {/* Detailed Information Tabs */}
          <Tabs defaultValue="identity" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="directors">Directors</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            {/* Corporate Identity Tab */}
            <TabsContent value="identity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Corporate Identity & Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Company Name</label>
                      <p className="text-gray-900">{corporateData.identity.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">CIN</label>
                      <p className="text-gray-900 font-mono">{corporateData.identity.cin}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Registration Number</label>
                      <p className="text-gray-900">{corporateData.identity.registrationNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Date of Incorporation</label>
                      <p className="text-gray-900">{corporateData.identity.dateOfIncorporation}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">ROC Code</label>
                      <p className="text-gray-900">{corporateData.identity.rocCode}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Company Status</label>
                      <Badge className={getStatusColor(corporateData.identity.status)}>
                        {corporateData.identity.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Classification</label>
                      <p className="text-gray-900">{corporateData.identity.classification}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Category</label>
                      <p className="text-gray-900">{corporateData.identity.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Overview Tab */}
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Financial Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Authorized Capital</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(corporateData.financial.authorizedCapital)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Paid-up Capital</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(corporateData.financial.paidUpCapital)}
                      </p>
                    </div>
                  </div>
                  
                  {corporateData.financial.authorizedCapital === 0 && corporateData.financial.paidUpCapital === 0 && (
                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <AlertTriangle className="h-4 w-4 inline mr-2" />
                        Financial data may not be available in the basic MCA dataset. 
                        Additional financial details would require separate API calls or premium data access.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Directors Tab */}
            <TabsContent value="directors">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Directorship & Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <AlertTriangle className="h-4 w-4 inline mr-2" />
                      Director information requires additional API calls to the MCA director dataset. 
                      This would be implemented as a separate function for detailed directorship data.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Compliance Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Last Filing Date</p>
                      <p className="font-semibold">{corporateData.compliance.lastFilingDate}</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Annual Return Status</p>
                      <Badge className={getStatusColor(corporateData.compliance.annualReturnStatus)}>
                        {corporateData.compliance.annualReturnStatus}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Contact & Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Registered Office Address</label>
                    <p className="text-gray-900 mt-1">{corporateData.contact.registeredAddress}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Email</label>
                      <p className="text-gray-900 mt-1">{corporateData.contact.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Phone</label>
                      <p className="text-gray-900 mt-1">{corporateData.contact.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700">Website</label>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-gray-900">{corporateData.contact.website}</p>
                      {corporateData.contact.website !== 'N/A' && (
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Instructions */}
      {!corporateData && !error && (
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center text-gray-600">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Real Corporate Intelligence Search</h3>
              <p className="mb-4">
                Enter a company name or CIN to access real-time corporate data from MCA records:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Corporate Identity</p>
                    <p className="text-sm">CIN, registration details, status</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Financial Overview</p>
                    <p className="text-sm">Authorized and paid-up capital</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Compliance Status</p>
                    <p className="text-sm">Filing dates and return status</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Information</p>
                    <p className="text-sm">Registered address and contact details</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
