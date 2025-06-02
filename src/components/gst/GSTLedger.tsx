
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

export const GSTLedger = () => {
  const ledgerSummary = {
    outputTax: 458242,
    inputTaxCredit: 337576,
    netLiability: 120666,
    paidAmount: 95550,
    pendingPayment: 25116
  };

  const gstLiabilityBreakdown = [
    { type: "CGST", liability: 60333, paid: 47775, pending: 12558 },
    { type: "SGST", liability: 60333, paid: 47775, pending: 12558 },
    { type: "IGST", liability: 0, paid: 0, pending: 0 },
    { type: "CESS", liability: 0, paid: 0, pending: 0 }
  ];

  const paymentHistory = [
    {
      date: "20 Dec 2024",
      period: "November 2024",
      challan: "CHL-001-2024",
      cgst: 42500,
      sgst: 42500,
      igst: 15200,
      cess: 0,
      total: 100200,
      status: "Paid"
    },
    {
      date: "20 Nov 2024",
      period: "October 2024",
      challan: "CHL-002-2024",
      cgst: 38750,
      sgst: 38750,
      igst: 12800,
      cess: 0,
      total: 90300,
      status: "Paid"
    },
    {
      date: "21 Oct 2024",
      period: "September 2024",
      challan: "CHL-003-2024",
      cgst: 35200,
      sgst: 35200,
      igst: 18600,
      cess: 0,
      total: 89000,
      status: "Paid"
    }
  ];

  const itcLedger = [
    {
      date: "20 Jan 2025",
      description: "ITC Claimed - December 2024",
      type: "Credit",
      cgst: 45620,
      sgst: 45620,
      igst: 125450,
      total: 216690,
      balance: 854320
    },
    {
      date: "18 Jan 2025",
      description: "ITC Utilized - Tax Payment",
      type: "Debit",
      cgst: 47775,
      sgst: 47775,
      igst: 0,
      total: 95550,
      balance: 637630
    },
    {
      date: "15 Jan 2025",
      description: "ITC Reversal - Exempted Supply",
      type: "Debit",
      cgst: 2400,
      sgst: 2400,
      igst: 0,
      total: 4800,
      balance: 733180
    }
  ];

  return (
    <div className="space-y-6">
      {/* GST Liability Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Output Tax</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">₹{(ledgerSummary.outputTax / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Tax on sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Input Tax Credit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{(ledgerSummary.inputTaxCredit / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">ITC claimed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Net Liability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{(ledgerSummary.netLiability / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">After ITC adjustment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Amount Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">₹{(ledgerSummary.paidAmount / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Cash payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₹{(ledgerSummary.pendingPayment / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Outstanding liability</p>
          </CardContent>
        </Card>
      </div>

      {/* Tax-wise Liability Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>GST Liability Breakdown</CardTitle>
          <CardDescription>Tax-wise liability, payments, and pending amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gstLiabilityBreakdown.map((tax, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-16 text-center">
                    <div className="font-bold text-lg">{tax.type}</div>
                  </div>
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-6 text-sm">
                      <div>
                        <div className="text-gray-600">Liability</div>
                        <div className="font-semibold">₹{tax.liability.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Paid</div>
                        <div className="font-semibold text-green-600">₹{tax.paid.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Pending</div>
                        <div className="font-semibold text-red-600">₹{tax.pending.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-32">
                  <Progress 
                    value={tax.liability > 0 ? (tax.paid / tax.liability) * 100 : 0} 
                    className="h-2" 
                  />
                  <div className="text-xs text-center mt-1">
                    {tax.liability > 0 ? Math.round((tax.paid / tax.liability) * 100) : 0}% Paid
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ledger Details */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger Details</CardTitle>
          <CardDescription>Detailed transaction history and balances</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="payments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payments">Payment History</TabsTrigger>
              <TabsTrigger value="itc">ITC Ledger</TabsTrigger>
            </TabsList>
            
            <TabsContent value="payments" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Challan No.</TableHead>
                    <TableHead>CGST</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>IGST</TableHead>
                    <TableHead>CESS</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment, index) => (
                    <TableRow key={index}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.period}</TableCell>
                      <TableCell className="font-mono text-sm">{payment.challan}</TableCell>
                      <TableCell>₹{payment.cgst.toLocaleString()}</TableCell>
                      <TableCell>₹{payment.sgst.toLocaleString()}</TableCell>
                      <TableCell>₹{payment.igst.toLocaleString()}</TableCell>
                      <TableCell>₹{payment.cess.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">₹{payment.total.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="default">{payment.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="itc" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>CGST</TableHead>
                    <TableHead>SGST</TableHead>
                    <TableHead>IGST</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itcLedger.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>{entry.date}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>
                        <Badge variant={entry.type === "Credit" ? "default" : "secondary"}>
                          {entry.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={entry.type === "Credit" ? "text-green-600" : "text-red-600"}>
                        {entry.type === "Credit" ? "+" : "-"}₹{entry.cgst.toLocaleString()}
                      </TableCell>
                      <TableCell className={entry.type === "Credit" ? "text-green-600" : "text-red-600"}>
                        {entry.type === "Credit" ? "+" : "-"}₹{entry.sgst.toLocaleString()}
                      </TableCell>
                      <TableCell className={entry.type === "Credit" ? "text-green-600" : "text-red-600"}>
                        {entry.type === "Credit" ? "+" : "-"}₹{entry.igst.toLocaleString()}
                      </TableCell>
                      <TableCell className={`font-medium ${entry.type === "Credit" ? "text-green-600" : "text-red-600"}`}>
                        {entry.type === "Credit" ? "+" : "-"}₹{entry.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-medium">₹{entry.balance.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
