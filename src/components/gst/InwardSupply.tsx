
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export const InwardSupply = () => {
  const purchaseSummary = {
    totalPurchases: 1875420,
    totalTax: 337576,
    totalITC: 337576,
    totalVendors: 45,
    compliantVendors: 38,
    nonCompliantVendors: 7
  };

  const vendors = [
    {
      name: "ABC Electronics Ltd",
      gstin: "27AABCS1681N1ZY",
      totalPurchases: 456780,
      totalTax: 82220,
      itcAvailable: 82220,
      filingStatus: "Regular",
      lastFiling: "10 Jan 2025",
      riskLevel: "Low",
      invoices: 24
    },
    {
      name: "XYZ Components",
      gstin: "33AAXYZ5678P1ZA",
      totalPurchases: 387650,
      totalTax: 69777,
      itcAvailable: 61527,
      filingStatus: "Delayed",
      lastFiling: "05 Jan 2025",
      riskLevel: "Medium",
      invoices: 18
    },
    {
      name: "Tech Solutions Pvt Ltd",
      gstin: "29AABCT1234L1ZX",
      totalPurchases: 298540,
      totalTax: 53737,
      itcAvailable: 53737,
      filingStatus: "Regular",
      lastFiling: "09 Jan 2025",
      riskLevel: "Low",
      invoices: 15
    },
    {
      name: "Digital Systems Inc",
      gstin: "07AABDS9876Q1ZZ",
      totalPurchases: 245680,
      totalTax: 44222,
      itcAvailable: 0,
      filingStatus: "Non-Filing",
      lastFiling: "Never",
      riskLevel: "High",
      invoices: 12
    }
  ];

  const purchaseRegister = [
    {
      date: "20 Jan 2025",
      vendor: "ABC Electronics Ltd",
      gstin: "27AABCS1681N1ZY",
      invoice: "INV-ABC-001",
      taxableValue: 45680,
      cgst: 4112,
      sgst: 4112,
      igst: 0,
      totalTax: 8224,
      itcStatus: "Available"
    },
    {
      date: "19 Jan 2025",
      vendor: "XYZ Components",
      gstin: "33AAXYZ5678P1ZA",
      invoice: "INV-XYZ-045",
      taxableValue: 38765,
      cgst: 0,
      sgst: 0,
      igst: 6978,
      totalTax: 6978,
      itcStatus: "Disputed"
    },
    {
      date: "18 Jan 2025",
      vendor: "Tech Solutions Pvt Ltd",
      gstin: "29AABCT1234L1ZX",
      invoice: "INV-TS-098",
      taxableValue: 29854,
      cgst: 2687,
      sgst: 2687,
      igst: 0,
      totalTax: 5374,
      itcStatus: "Available"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Purchase Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(purchaseSummary.totalPurchases / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">{purchaseSummary.totalVendors} vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tax Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{(purchaseSummary.totalTax / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Input tax on purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">ITC Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(purchaseSummary.totalITC / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">From compliant vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vendor Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {Math.round((purchaseSummary.compliantVendors / purchaseSummary.totalVendors) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {purchaseSummary.compliantVendors}/{purchaseSummary.totalVendors} vendors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Compliance Dashboard</CardTitle>
          <CardDescription>
            Monitor vendor GST filing status and ITC risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{purchaseSummary.compliantVendors}</div>
              <div className="text-sm text-gray-600">Compliant Vendors</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {purchaseSummary.totalVendors - purchaseSummary.compliantVendors - purchaseSummary.nonCompliantVendors}
              </div>
              <div className="text-sm text-gray-600">At Risk Vendors</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{purchaseSummary.nonCompliantVendors}</div>
              <div className="text-sm text-gray-600">Non-Compliant</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor-wise Purchase & ITC Analysis</CardTitle>
          <CardDescription>
            Detailed vendor performance and compliance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Total Purchases</TableHead>
                <TableHead>Total Tax</TableHead>
                <TableHead>ITC Available</TableHead>
                <TableHead>Filing Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Last Filing</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell className="font-mono text-sm">{vendor.gstin}</TableCell>
                  <TableCell>₹{vendor.totalPurchases.toLocaleString()}</TableCell>
                  <TableCell>₹{vendor.totalTax.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">
                    ₹{vendor.itcAvailable.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {vendor.filingStatus === "Regular" ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : vendor.filingStatus === "Delayed" ? (
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">{vendor.filingStatus}</span>
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

      {/* Purchase Register */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Register</CardTitle>
          <CardDescription>
            Detailed view of inward invoices with GST breakdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Taxable Value</TableHead>
                <TableHead>CGST</TableHead>
                <TableHead>SGST</TableHead>
                <TableHead>IGST</TableHead>
                <TableHead>Total Tax</TableHead>
                <TableHead>ITC Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseRegister.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell className="font-medium">{purchase.vendor}</TableCell>
                  <TableCell className="font-mono text-sm">{purchase.gstin}</TableCell>
                  <TableCell>{purchase.invoice}</TableCell>
                  <TableCell>₹{purchase.taxableValue.toLocaleString()}</TableCell>
                  <TableCell>₹{purchase.cgst.toLocaleString()}</TableCell>
                  <TableCell>₹{purchase.sgst.toLocaleString()}</TableCell>
                  <TableCell>₹{purchase.igst.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{purchase.totalTax.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={purchase.itcStatus === "Available" ? "default" : "destructive"}>
                      {purchase.itcStatus}
                    </Badge>
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
