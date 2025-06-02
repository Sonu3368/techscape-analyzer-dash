
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download } from "lucide-react";
import { useState } from "react";

export const OutwardSupply = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("december-2024");

  const salesSummary = {
    totalTaxable: 2545680,
    totalExempt: 145230,
    totalTax: 458242,
    totalInvoices: 156,
    igstSales: 856420,
    cgstSgstSales: 1689260
  };

  const hsnSummary = [
    { hsn: "8517", description: "Electrical Equipment", taxableValue: 856420, taxRate: 18, taxAmount: 154156, invoices: 45 },
    { hsn: "8471", description: "Computer Hardware", taxableValue: 645230, taxRate: 18, taxAmount: 116141, invoices: 32 },
    { hsn: "9984", description: "Software Services", taxableValue: 523680, taxRate: 18, taxAmount: 104262, invoices: 28 },
    { hsn: "8544", description: "Cables & Accessories", taxableValue: 320450, taxRate: 18, taxAmount: 57681, invoices: 25 },
    { hsn: "9983", description: "Consulting Services", taxableValue: 199900, taxRate: 18, taxAmount: 35982, invoices: 26 }
  ];

  const statewiseSales = [
    { state: "Maharashtra", taxableValue: 856420, igst: 0, cgst: 77078, sgst: 77078, totalTax: 154156 },
    { state: "Karnataka", taxableValue: 645230, igst: 116141, cgst: 0, sgst: 0, totalTax: 116141 },
    { state: "Tamil Nadu", taxableValue: 523680, igst: 94262, cgst: 0, sgst: 0, totalTax: 94262 },
    { state: "Gujarat", taxableValue: 320450, igst: 57681, cgst: 0, sgst: 0, totalTax: 57681 },
    { state: "Delhi", taxableValue: 199900, igst: 35982, cgst: 0, sgst: 0, totalTax: 35982 }
  ];

  const customers = [
    { 
      name: "TechCorp Solutions",
      gstin: "27AABCS1681N1ZY",
      totalSales: 456780,
      totalTax: 82220,
      invoices: 12,
      compliance: "Good",
      lastInvoice: "15 Jan 2025"
    },
    {
      name: "Digital Enterprises Ltd",
      gstin: "29AABDE1234L1ZX",
      totalSales: 387650,
      totalTax: 69777,
      invoices: 8,
      compliance: "Excellent",
      lastInvoice: "18 Jan 2025"
    },
    {
      name: "Innovation Systems",
      gstin: "33AABIS5678P1ZA",
      totalSales: 298540,
      totalTax: 53737,
      invoices: 15,
      compliance: "Average",
      lastInvoice: "20 Jan 2025"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Outward Supply Analysis</CardTitle>
          <CardDescription>Sales analysis and GST compliance tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search customers, invoices, GSTIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="december-2024">December 2024</SelectItem>
                <SelectItem value="november-2024">November 2024</SelectItem>
                <SelectItem value="october-2024">October 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Taxable Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(salesSummary.totalTaxable / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">{salesSummary.totalInvoices} invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Tax Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(salesSummary.totalTax / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">18% average rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inter-state Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{(salesSummary.igstSales / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">IGST applicable</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Intra-state Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{(salesSummary.cgstSgstSales / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">CGST + SGST</p>
          </CardContent>
        </Card>
      </div>

      {/* HSN/SAC Summary */}
      <Card>
        <CardHeader>
          <CardTitle>HSN/SAC Code Summary</CardTitle>
          <CardDescription>Product/service wise sales breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>HSN/SAC Code</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Taxable Value</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Invoices</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hsnSummary.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.hsn}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>₹{item.taxableValue.toLocaleString()}</TableCell>
                  <TableCell>{item.taxRate}%</TableCell>
                  <TableCell>₹{item.taxAmount.toLocaleString()}</TableCell>
                  <TableCell>{item.invoices}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* State-wise Sales */}
      <Card>
        <CardHeader>
          <CardTitle>State-wise Sales Distribution</CardTitle>
          <CardDescription>Geographical sales analysis with tax breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>State</TableHead>
                <TableHead>Taxable Value</TableHead>
                <TableHead>IGST</TableHead>
                <TableHead>CGST</TableHead>
                <TableHead>SGST</TableHead>
                <TableHead>Total Tax</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statewiseSales.map((state, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{state.state}</TableCell>
                  <TableCell>₹{state.taxableValue.toLocaleString()}</TableCell>
                  <TableCell>₹{state.igst.toLocaleString()}</TableCell>
                  <TableCell>₹{state.cgst.toLocaleString()}</TableCell>
                  <TableCell>₹{state.sgst.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">₹{state.totalTax.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
          <CardDescription>Customer-wise sales and compliance analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Total Tax</TableHead>
                <TableHead>Invoices</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Last Invoice</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell className="font-mono text-sm">{customer.gstin}</TableCell>
                  <TableCell>₹{customer.totalSales.toLocaleString()}</TableCell>
                  <TableCell>₹{customer.totalTax.toLocaleString()}</TableCell>
                  <TableCell>{customer.invoices}</TableCell>
                  <TableCell>
                    <Badge variant={
                      customer.compliance === "Excellent" ? "default" :
                      customer.compliance === "Good" ? "secondary" : "destructive"
                    }>
                      {customer.compliance}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.lastInvoice}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
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
