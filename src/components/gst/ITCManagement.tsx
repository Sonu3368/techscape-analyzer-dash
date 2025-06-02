
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export const ITCManagement = () => {
  const itcSummary = {
    totalAvailable: 875240,
    totalClaimed: 875240,
    totalUtilized: 780450,
    pending: 94790,
    blocked: 25680,
    reconciliationScore: 85
  };

  const discrepancies = [
    {
      vendor: "ABC Electronics Ltd",
      gstin: "27AABCS1681N1ZY",
      invoice: "INV-2024-001",
      amount: 15420,
      type: "Missing in 2A",
      status: "Under Review",
      followUpDate: "25 Jan 2025"
    },
    {
      vendor: "XYZ Components",
      gstin: "33AAXYZ5678P1ZA",
      invoice: "INV-2024-002",
      amount: 8750,
      type: "Value Mismatch",
      status: "Vendor Contacted",
      followUpDate: "22 Jan 2025"
    },
    {
      vendor: "Tech Solutions Pvt Ltd",
      gstin: "29AABCT1234L1ZX",
      invoice: "INV-2024-003",
      amount: 12350,
      type: "GSTIN Mismatch",
      status: "Resolved",
      followUpDate: "-"
    }
  ];

  const vendorCompliance = [
    {
      vendor: "ABC Electronics Ltd",
      gstin: "27AABCS1681N1ZY",
      filingConsistency: 75,
      riskLevel: "Medium",
      itcAtRisk: 45620,
      lastFiling: "10 Jan 2025"
    },
    {
      vendor: "XYZ Components",
      gstin: "33AAXYZ5678P1ZA",
      filingConsistency: 90,
      riskLevel: "Low",
      itcAtRisk: 8750,
      lastFiling: "11 Jan 2025"
    },
    {
      vendor: "Tech Solutions Pvt Ltd",
      gstin: "29AABCT1234L1ZX",
      filingConsistency: 95,
      riskLevel: "Low",
      itcAtRisk: 0,
      lastFiling: "09 Jan 2025"
    }
  ];

  return (
    <div className="space-y-6">
      {/* ITC Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Available ITC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ₹{(itcSummary.totalAvailable / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">From GSTR-2A/2B</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Claimed ITC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{(itcSummary.totalClaimed / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">In GSTR-3B</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{(itcSummary.pending / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unutilized balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Blocked ITC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{(itcSummary.blocked / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ineligible/Disputed</p>
          </CardContent>
        </Card>
      </div>

      {/* ITC Reconciliation Score */}
      <Card>
        <CardHeader>
          <CardTitle>ITC Reconciliation Status</CardTitle>
          <CardDescription>
            Comparison between GSTR-2A/2B (Available) vs GSTR-3B (Claimed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Reconciliation Score</span>
              <span className="text-lg font-bold text-green-600">{itcSummary.reconciliationScore}%</span>
            </div>
            <Progress value={itcSummary.reconciliationScore} className="h-3" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  ₹{(itcSummary.totalAvailable / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Available (2A/2B)</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  ₹{(itcSummary.totalClaimed / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Claimed (3B)</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-600">
                  ₹{((itcSummary.totalAvailable - itcSummary.totalClaimed) / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-600">Difference</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ITC Discrepancies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ITC Discrepancies
            <Badge variant="destructive">{discrepancies.length}</Badge>
          </CardTitle>
          <CardDescription>
            Invoices with mismatches requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issue Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Follow-up Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {discrepancies.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.vendor}</TableCell>
                  <TableCell className="font-mono text-sm">{item.gstin}</TableCell>
                  <TableCell>{item.invoice}</TableCell>
                  <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.status === "Resolved" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Clock className="h-4 w-4 text-orange-600" />
                      )}
                      <span className="text-sm">{item.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.followUpDate}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vendor Compliance Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Compliance Risk Assessment</CardTitle>
          <CardDescription>
            Analysis of vendor GST filing consistency and ITC risk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Filing Consistency</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>ITC at Risk</TableHead>
                <TableHead>Last Filing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorCompliance.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{vendor.vendor}</TableCell>
                  <TableCell className="font-mono text-sm">{vendor.gstin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={vendor.filingConsistency} className="w-16 h-2" />
                      <span className="text-sm">{vendor.filingConsistency}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      vendor.riskLevel === "Low" ? "default" : 
                      vendor.riskLevel === "Medium" ? "secondary" : "destructive"
                    }>
                      {vendor.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-red-600 font-medium">
                    ₹{vendor.itcAtRisk.toLocaleString()}
                  </TableCell>
                  <TableCell>{vendor.lastFiling}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      Contact
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
