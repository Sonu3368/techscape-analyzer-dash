
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, 
  Building2, 
  FileText, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface CorporateData {
  identity: {
    companyName: string;
    cin: string;
    registrationNumber: string;
    dateOfIncorporation: string;
    rocCode: string;
    status: 'Active' | 'Dormant' | 'Struck Off';
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
    annualReturnStatus: 'Filed' | 'Pending' | 'Overdue';
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

  // Mock data for demonstration
  const mockCorporateData: CorporateData = {
    identity: {
      companyName: 'Tech Innovations Private Limited',
      cin: 'U72900KA2015PTC123456',
      registrationNumber: 'ROC-BANGALORE-123456',
      dateOfIncorporation: '2015-03-15',
      rocCode: 'ROC-BANGALORE',
      status: 'Active',
      classification: 'Private Company',
      category: 'Company Limited by Shares'
    },
    financial: {
      authorizedCapital: 10000000,
      paidUpCapital: 8500000,
      netWorth: 15000000,
      totalAssets: 25000000,
      totalLiabilities: 10000000,
      revenue: 50000000,
      charges: [
        {
          id: 'CHG001',
          amount: 5000000,
          chargeHolder: 'State Bank of India',
          dateCreated: '2020-06-15',
          status: 'Satisfied'
        },
        {
          id: 'CHG002',
          amount: 3000000,
          chargeHolder: 'HDFC Bank Limited',
          dateCreated: '2022-01-10',
          status: 'Outstanding'
        }
      ]
    },
    directors: [
      {
        name: 'Rajesh Kumar Sharma',
        din: 'DIN-12345678',
        designation: 'Managing Director',
        appointmentDate: '2015-03-15',
        status: 'Current',
        otherCompanies: 3
      },
      {
        name: 'Priya Patel',
        din: 'DIN-87654321',
        designation: 'Executive Director',
        appointmentDate: '2018-07-20',
        status: 'Current',
        otherCompanies: 1
      },
      {
        name: 'Amit Singh',
        din: 'DIN-11223344',
        designation: 'Non-Executive Director',
        appointmentDate: '2016-01-10',
        status: 'Ceased',
        otherCompanies: 0
      }
    ],
    compliance: {
      lastFilingDate: '2024-03-31',
      annualReturnStatus: 'Filed',
      filings: [
        { type: 'Annual Return (MGT-7)', date: '2024-03-31', status: 'Filed' },
        { type: 'Financial Statement (AOC-4)', date: '2024-03-31', status: 'Filed' },
        { type: 'Board Resolution', date: '2024-02-15', status: 'Filed' },
        { type: 'Change in Directors (DIR-12)', date: '2023-12-10', status: 'Filed' }
      ]
    },
    contact: {
      registeredAddress: '#123, Tech Park, Outer Ring Road, Bangalore, Karnataka - 560037',
      email: 'info@techinnovations.com',
      website: 'www.techinnovations.com',
      phone: '+91-80-12345678'
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setCorporateData(mockCorporateData);
      setIsSearching(false);
    }, 1500);
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
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'dormant':
      case 'overdue':
      case 'ceased':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
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
          Comprehensive corporate intelligence for informed decision making
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
              placeholder="Enter Company Name or CIN (e.g., U72900KA2015PTC123456)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchQuery.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? 'Searching...' : 'Search'}
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Search by company name, CIN, or registration number to access comprehensive corporate data
          </p>
        </CardContent>
      </Card>

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
                      <p className="text-gray-900">{new Date(corporateData.identity.dateOfIncorporation).toLocaleDateString()}</p>
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
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Financial Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm text-gray-600">Net Worth</p>
                        <p className="text-xl font-bold text-purple-600">
                          {formatCurrency(corporateData.financial.netWorth)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Assets</p>
                        <p className="text-xl font-bold text-orange-600">
                          {formatCurrency(corporateData.financial.totalAssets)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-gray-600">Total Liabilities</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatCurrency(corporateData.financial.totalLiabilities)}
                        </p>
                      </div>
                      <div className="text-center p-4 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-gray-600">Annual Revenue</p>
                        <p className="text-xl font-bold text-indigo-600">
                          {formatCurrency(corporateData.financial.revenue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Charges/Mortgages */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Charges & Mortgages
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {corporateData.financial.charges.map((charge, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">{charge.chargeHolder}</p>
                            <p className="text-sm text-gray-600">Created: {new Date(charge.dateCreated).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(charge.amount)}</p>
                            <Badge className={getStatusColor(charge.status)}>
                              {charge.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                  <div className="space-y-4">
                    {corporateData.directors.map((director, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{director.name}</h3>
                              <Badge className={getStatusColor(director.status)}>
                                {director.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <p><span className="font-medium">DIN:</span> {director.din}</p>
                              <p><span className="font-medium">Designation:</span> {director.designation}</p>
                              <p><span className="font-medium">Appointment Date:</span> {new Date(director.appointmentDate).toLocaleDateString()}</p>
                              <p><span className="font-medium">Other Companies:</span> {director.otherCompanies}</p>
                            </div>
                          </div>
                          {director.otherCompanies > 0 && (
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Network
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Compliance Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Last Filing Date</p>
                        <p className="font-semibold">{new Date(corporateData.compliance.lastFilingDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Annual Return Status</p>
                        <Badge className={getStatusColor(corporateData.compliance.annualReturnStatus)}>
                          {corporateData.compliance.annualReturnStatus}
                        </Badge>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Total Filings</p>
                        <p className="font-semibold">{corporateData.compliance.filings.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Filing History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {corporateData.compliance.filings.map((filing, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">{filing.type}</p>
                            <p className="text-sm text-gray-600">{new Date(filing.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(filing.status)}>
                              {filing.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Instructions */}
      {!corporateData && (
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="text-center text-gray-600">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Start Your Corporate Intelligence Search</h3>
              <p className="mb-4">
                Enter a company name or CIN to access comprehensive corporate data including:
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
                    <p className="text-sm">Capital structure, charges, mortgages</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Directorship Network</p>
                    <p className="text-sm">Current & past directors, DIN details</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Compliance History</p>
                    <p className="text-sm">Filing status, annual returns</p>
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
