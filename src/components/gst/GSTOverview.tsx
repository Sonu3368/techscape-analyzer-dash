
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";

export const GSTOverview = () => {
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

  const alerts = [
    { type: "warning", message: "GSTR-3B filing due in 3 days" },
    { type: "info", message: "₹45,200 ITC discrepancy found in vendor XYZ" },
    { type: "success", message: "All e-invoices generated successfully this month" }
  ];

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filing Status */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Filing Status</CardTitle>
            <CardDescription>Current status of your GST returns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filingStatus.map((filing, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
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

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
            <CardDescription>Important items requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />}
                  {alert.type === "info" && <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />}
                  {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm">{alert.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
