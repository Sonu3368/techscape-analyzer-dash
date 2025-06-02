
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  FileText,
  CreditCard,
  BarChart3,
  Users,
  Building,
  Calendar,
  Download
} from "lucide-react";

export const GSTDashboardTab = () => {
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const gstHealthScore = 85;
  
  const keyMetrics = [
    {
      title: "Total Tax Liability",
      value: "₹12,45,680",
      change: "+8.5%",
      trend: "up",
      description: "Current month"
    },
    {
      title: "ITC Available",
      value: "₹8,75,240",
      change: "+12.3%",
      trend: "up",
      description: "Pending utilization"
    },
    {
      title: "Net Tax Payable",
      value: "₹3,70,440",
      change: "-5.2%",
      trend: "down",
      description: "After ITC adjustment"
    },
    {
      title: "Filing Compliance",
      value: "98.5%",
      change: "+2.1%",
      trend: "up",
      description: "Last 12 months"
    }
  ];

  const filingStatus = [
    { return: "GSTR-1", period: "Dec 2024", status: "Filed", dueDate: "11 Jan 2025" },
    { return: "GSTR-3B", period: "Dec 2024", status: "Pending", dueDate: "20 Jan 2025" },
    { return: "GSTR-9", period: "FY 2023-24", status: "Filed", dueDate: "31 Dec 2024" },
  ];

  const vendorData = [
    { gstin: "27AAACR5055K1ZY", name: "ABC Enterprises", compliance: "Excellent", itc: "₹2,45,000", risk: "Low" },
    { gstin: "19AABCU9603R1ZX", name: "XYZ Solutions", compliance: "Good", itc: "₹1,85,000", risk: "Medium" },
    { gstin: "29ABCDE1234F1Z5", name: "PQR Industries", compliance: "Poor", itc: "₹95,000", risk: "High" },
  ];

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    // Implement search functionality
  };

  return (
    <div className="space-y-6">
      {/* Global Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            GST Search & Analytics
          </CardTitle>
          <CardDescription>
            Search by GSTIN, PAN, or company name for comprehensive GST analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter GSTIN (e.g., 27AAACR5055K1ZY) or PAN (e.g., AAACR5055K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* GST Dashboard Tabs */}
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 mb-6 bg-white border">
          <TabsTrigger value="overview" className="flex flex-col items-center p-3">
            <BarChart3 className="h-4 w-4 mb-1" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="returns" className="flex flex-col items-center p-3">
            <FileText className="h-4 w-4 mb-1" />
            <span className="text-xs">Returns</span>
          </TabsTrigger>
          <TabsTrigger value="itc" className="flex flex-col items-center p-3">
            <CreditCard className="h-4 w-4 mb-1" />
            <span className="text-xs">ITC</span>
          </TabsTrigger>
          <TabsTrigger value="vendors" className="flex flex-col items-center p-3">
            <Users className="h-4 w-4 mb-1" />
            <span className="text-xs">Vendors</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex flex-col items-center p-3">
            <CheckCircle className="h-4 w-4 mb-1" />
            <span className="text-xs">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col items-center p-3">
            <TrendingUp className="h-4 w-4 mb-1" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* GST Health Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                GST Compliance Health Score
                <Badge variant={gstHealthScore >= 80 ? "default" : "destructive"}>
                  {gstHealthScore >= 80 ? "Excellent" : "Needs Attention"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Overall assessment of your GST compliance status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Progress value={gstHealthScore} className="h-3" />
                </div>
                <div className="text-2xl font-bold text-green-600">{gstHealthScore}%</div>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-green-600">Filing</div>
                  <div>98%</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-blue-600">ITC Reconciliation</div>
                  <div>85%</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-orange-600">Data Quality</div>
                  <div>92%</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">Vendor Compliance</div>
                  <div>75%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className={metric.trend === "up" ? "text-green-600" : "text-red-600"}>
                      {metric.change}
                    </span>
                    {metric.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Returns Tab */}
        <TabsContent value="returns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>GST Return Filing Status</CardTitle>
              <CardDescription>Track all your GST return filings and due dates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filingStatus.map((filing, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {filing.status === "Filed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      )}
                      <div>
                        <div className="font-medium">{filing.return}</div>
                        <div className="text-sm text-gray-600">{filing.period}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={filing.status === "Filed" ? "default" : "destructive"}>
                        {filing.status}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">Due: {filing.dueDate}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ITC Tab */}
        <TabsContent value="itc" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>ITC Summary</CardTitle>
                <CardDescription>Input Tax Credit overview and reconciliation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total ITC Available (2A/2B):</span>
                    <span className="font-semibold">₹8,75,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ITC Claimed (3B):</span>
                    <span className="font-semibold">₹8,45,150</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>ITC Discrepancy:</span>
                    <span className="font-semibold">₹30,090</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ITC Utilization Rate:</span>
                    <span className="font-semibold text-green-600">96.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ITC Reconciliation Actions</CardTitle>
                <CardDescription>Required actions for ITC optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">5 invoices missing in GSTR-2B</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">3 vendors haven't filed GSTR-1</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">₹45,200 ITC ready to claim</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Vendors Tab */}
        <TabsContent value="vendors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Compliance Analysis</CardTitle>
              <CardDescription>Track vendor GST compliance and its impact on your ITC</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>GSTIN</TableHead>
                    <TableHead>Vendor Name</TableHead>
                    <TableHead>Compliance</TableHead>
                    <TableHead>ITC Impact</TableHead>
                    <TableHead>Risk Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vendorData.map((vendor, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-sm">{vendor.gstin}</TableCell>
                      <TableCell>{vendor.name}</TableCell>
                      <TableCell>
                        <Badge variant={vendor.compliance === "Excellent" ? "default" : vendor.compliance === "Good" ? "secondary" : "destructive"}>
                          {vendor.compliance}
                        </Badge>
                      </TableCell>
                      <TableCell>{vendor.itc}</TableCell>
                      <TableCell>
                        <Badge variant={vendor.risk === "Low" ? "default" : vendor.risk === "Medium" ? "secondary" : "destructive"}>
                          {vendor.risk}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Health Check</CardTitle>
                <CardDescription>Overall compliance status and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span>Return Filing</span>
                    </div>
                    <span className="font-semibold text-green-600">98%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                      <span>E-invoice Compliance</span>
                    </div>
                    <span className="font-semibold text-blue-600">100%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span>Vendor Compliance</span>
                    </div>
                    <span className="font-semibold text-orange-600">75%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Actions</CardTitle>
                <CardDescription>Critical tasks and deadlines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2 border-l-4 border-red-500 bg-red-50">
                    <Calendar className="h-4 w-4 text-red-600" />
                    <span className="text-sm">GSTR-3B due in 3 days</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border-l-4 border-orange-500 bg-orange-50">
                    <FileText className="h-4 w-4 text-orange-600" />
                    <span className="text-sm">Review ITC discrepancies</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 border-l-4 border-blue-500 bg-blue-50">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Follow up with 3 vendors</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Working Capital Impact</CardTitle>
                <CardDescription>How GST affects your cash flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Average ITC Realization Time:</span>
                    <span className="font-semibold">45 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Working Capital Tied Up:</span>
                    <span className="font-semibold text-red-600">₹12,45,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Interest Cost:</span>
                    <span className="font-semibold text-red-600">₹15,560</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Potential Savings:</span>
                    <span className="font-semibold text-green-600">₹8,750/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Reports</CardTitle>
                <CardDescription>Download comprehensive GST reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    GST Liability Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    ITC Reconciliation Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Vendor Compliance Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Audit Trail Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
