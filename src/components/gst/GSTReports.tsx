
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, Mail } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export const GSTReports = () => {
  const [selectedReport, setSelectedReport] = useState("");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const predefinedReports = [
    {
      name: "GST Summary Report",
      description: "Complete overview of GST liability, ITC, and compliance status",
      frequency: "Monthly",
      lastGenerated: "20 Jan 2025",
      format: "PDF, Excel",
      status: "Available"
    },
    {
      name: "ITC Reconciliation Report",
      description: "Detailed comparison between GSTR-2A/2B and GSTR-3B",
      frequency: "Monthly",
      lastGenerated: "18 Jan 2025",
      format: "Excel",
      status: "Available"
    },
    {
      name: "Vendor Compliance Report",
      description: "Analysis of vendor GST filing patterns and risk assessment",
      frequency: "Quarterly",
      lastGenerated: "15 Jan 2025",
      format: "PDF, Excel",
      status: "Available"
    },
    {
      name: "HSN/SAC Summary Report",
      description: "Product/service wise sales and tax analysis",
      frequency: "Monthly",
      lastGenerated: "20 Jan 2025",
      format: "Excel",
      status: "Available"
    },
    {
      name: "State-wise Sales Report",
      description: "Geographical distribution of sales with IGST/CGST breakdown",
      frequency: "Monthly",
      lastGenerated: "20 Jan 2025",
      format: "PDF, Excel",
      status: "Available"
    },
    {
      name: "Working Capital Impact Report",
      description: "Analysis of ITC impact on working capital and cash flow",
      frequency: "Quarterly",
      lastGenerated: "01 Jan 2025",
      format: "PDF",
      status: "Generating"
    }
  ];

  const customReports = [
    {
      name: "Customer GST Compliance Analysis",
      description: "Individual customer compliance tracking and risk assessment",
      parameters: ["Customer", "Period", "Risk Level"],
      estimatedTime: "2-3 minutes"
    },
    {
      name: "Monthly Filing Checklist",
      description: "Pre-filing validation report with discrepancy highlights",
      parameters: ["Month", "Return Type"],
      estimatedTime: "1-2 minutes"
    },
    {
      name: "ITC Aging Report",
      description: "Analysis of ITC by age buckets and utilization patterns",
      parameters: ["Period", "Aging Buckets"],
      estimatedTime: "3-4 minutes"
    },
    {
      name: "Tax Rate Analysis",
      description: "Product/service wise effective tax rate analysis",
      parameters: ["HSN/SAC", "Period", "Tax Slab"],
      estimatedTime: "2-3 minutes"
    }
  ];

  const scheduledReports = [
    {
      name: "Monthly GST Dashboard",
      frequency: "Monthly",
      nextRun: "01 Feb 2025",
      recipients: "finance@company.com, gst@company.com",
      format: "PDF",
      status: "Active"
    },
    {
      name: "Weekly ITC Summary",
      frequency: "Weekly",
      nextRun: "27 Jan 2025",
      recipients: "accounts@company.com",
      format: "Excel",
      status: "Active"
    },
    {
      name: "Quarterly Compliance Report",
      frequency: "Quarterly",
      nextRun: "01 Apr 2025",
      recipients: "cfo@company.com, compliance@company.com",
      format: "PDF",
      status: "Active"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
          <CardDescription>Generate instant reports for specific periods and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gst-summary">GST Summary</SelectItem>
                <SelectItem value="itc-reconciliation">ITC Reconciliation</SelectItem>
                <SelectItem value="vendor-compliance">Vendor Compliance</SelectItem>
                <SelectItem value="hsn-summary">HSN/SAC Summary</SelectItem>
                <SelectItem value="statewise-sales">State-wise Sales</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "dd MMM yyyy") : "From Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "dd MMM yyyy") : "To Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predefined Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Standard Reports</CardTitle>
          <CardDescription>Pre-configured reports for common GST compliance needs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {predefinedReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-gray-600">{report.description}</div>
                  </TableCell>
                  <TableCell>{report.frequency}</TableCell>
                  <TableCell>{report.lastGenerated}</TableCell>
                  <TableCell>{report.format}</TableCell>
                  <TableCell>
                    <Badge variant={report.status === "Available" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Custom Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Reports</CardTitle>
          <CardDescription>Build customized reports with specific parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {customReports.map((report, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold">{report.name}</h4>
                  <Badge variant="outline">{report.estimatedTime}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Parameters:</div>
                  <div className="flex flex-wrap gap-1">
                    {report.parameters.map((param, i) => (
                      <span key={i} className="inline-block bg-gray-100 text-xs px-2 py-1 rounded">
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Configure & Generate
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>Automated report generation and distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell>{report.frequency}</TableCell>
                  <TableCell>{report.nextRun}</TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-gray-600 truncate">{report.recipients}</div>
                  </TableCell>
                  <TableCell>{report.format}</TableCell>
                  <TableCell>
                    <Badge variant="default">{report.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Run Now
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-4">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Create New Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Export Options</CardTitle>
          <CardDescription>Export multiple datasets for external analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <Download className="h-8 w-8 mb-2 text-blue-600" />
              <div className="text-center">
                <div className="font-medium">Complete GST Data</div>
                <div className="text-sm text-gray-600">All transactions & returns</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <Download className="h-8 w-8 mb-2 text-green-600" />
              <div className="text-center">
                <div className="font-medium">ITC Analysis Data</div>
                <div className="text-sm text-gray-600">Input tax credit details</div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
              <Download className="h-8 w-8 mb-2 text-purple-600" />
              <div className="text-center">
                <div className="font-medium">Compliance Metrics</div>
                <div className="text-sm text-gray-600">Health scores & KPIs</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
