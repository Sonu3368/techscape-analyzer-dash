
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileText, Download } from "lucide-react";

export const GSTReturns = () => {
  const returns = [
    {
      type: "GSTR-1",
      period: "December 2024",
      status: "Filed",
      filedDate: "10 Jan 2025",
      dueDate: "11 Jan 2025",
      taxableValue: "₹25,45,680",
      taxAmount: "₹4,58,242",
      invoices: 156
    },
    {
      type: "GSTR-3B",
      period: "December 2024",
      status: "Pending",
      filedDate: "-",
      dueDate: "20 Jan 2025",
      taxableValue: "₹25,45,680",
      taxAmount: "₹4,58,242",
      invoices: 156
    },
    {
      type: "GSTR-1",
      period: "November 2024",
      status: "Filed",
      filedDate: "10 Dec 2024",
      dueDate: "11 Dec 2024",
      taxableValue: "₹23,12,450",
      taxAmount: "₹4,16,241",
      invoices: 142
    }
  ];

  const comparisonData = {
    gstr1: {
      taxableValue: "₹25,45,680",
      taxAmount: "₹4,58,242",
      invoices: 156
    },
    gstr3b: {
      taxableValue: "₹25,45,680",
      taxAmount: "₹4,58,242",
      liability: "₹3,70,440"
    },
    difference: {
      taxableValue: "₹0",
      taxAmount: "₹0",
      status: "Matched"
    }
  };

  return (
    <div className="space-y-6">
      {/* Filing Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">This Month</CardTitle>
            <CardDescription>December 2024 Summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">GSTR-1</span>
                <Badge variant="default">Filed</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">GSTR-3B</span>
                <Badge variant="destructive">Pending</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">IFF</span>
                <Badge variant="secondary">N/A</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Outward Supplies</CardTitle>
            <CardDescription>GSTR-1 Data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">₹25,45,680</div>
              <div className="text-sm text-gray-600">Taxable Value</div>
              <div className="text-lg font-semibold text-blue-600">₹4,58,242</div>
              <div className="text-sm text-gray-600">Total Tax</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Input Tax Credit</CardTitle>
            <CardDescription>GSTR-2A/2B Data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">₹8,75,240</div>
              <div className="text-sm text-gray-600">Available ITC</div>
              <div className="text-lg font-semibold text-green-600">₹8,75,240</div>
              <div className="text-sm text-gray-600">Claimed ITC</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GSTR-1 vs GSTR-3B Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>GSTR-1 vs GSTR-3B Comparison</CardTitle>
          <CardDescription>December 2024 - Outward Supplies Reconciliation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-blue-600">GSTR-1 (Outward Supplies)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Taxable Value:</span>
                  <span className="font-medium">{comparisonData.gstr1.taxableValue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span className="font-medium">{comparisonData.gstr1.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoices:</span>
                  <span className="font-medium">{comparisonData.gstr1.invoices}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-green-600">GSTR-3B (Summary Return)</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Taxable Value:</span>
                  <span className="font-medium">{comparisonData.gstr3b.taxableValue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span className="font-medium">{comparisonData.gstr3b.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Net Liability:</span>
                  <span className="font-medium">{comparisonData.gstr3b.liability}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-purple-600">Difference Analysis</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Taxable Value:</span>
                  <span className="font-medium text-green-600">{comparisonData.difference.taxableValue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span className="font-medium text-green-600">{comparisonData.difference.taxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="default">{comparisonData.difference.status}</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Returns History */}
      <Card>
        <CardHeader>
          <CardTitle>Filing History</CardTitle>
          <CardDescription>Complete history of GST return filings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Return Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Filed Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Taxable Value</TableHead>
                <TableHead>Tax Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {returns.map((returnItem, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{returnItem.type}</TableCell>
                  <TableCell>{returnItem.period}</TableCell>
                  <TableCell>
                    <Badge variant={returnItem.status === "Filed" ? "default" : "destructive"}>
                      {returnItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{returnItem.filedDate}</TableCell>
                  <TableCell>{returnItem.dueDate}</TableCell>
                  <TableCell>{returnItem.taxableValue}</TableCell>
                  <TableCell>{returnItem.taxAmount}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
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
