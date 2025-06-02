
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";

export const GSTAnalytics = () => {
  const monthlyTrends = [
    { month: "Aug", revenue: 2156000, gstCollected: 388080, itcClaimed: 285420 },
    { month: "Sep", revenue: 2287000, gstCollected: 411660, itcClaimed: 298750 },
    { month: "Oct", revenue: 2098000, gstCollected: 377640, itcClaimed: 312680 },
    { month: "Nov", revenue: 2412000, gstCollected: 434160, itcClaimed: 325890 },
    { month: "Dec", revenue: 2545000, gstCollected: 458100, itcClaimed: 337576 }
  ];

  const statewiseData = [
    { state: "Maharashtra", value: 856420, percentage: 33.6 },
    { state: "Karnataka", value: 645230, percentage: 25.4 },
    { state: "Tamil Nadu", value: 523680, percentage: 20.6 },
    { state: "Gujarat", value: 320450, percentage: 12.6 },
    { state: "Others", value: 199900, percentage: 7.8 }
  ];

  const workingCapitalAnalysis = {
    itcStuck: 125680,
    averageRealizationDays: 45,
    workingCapitalImpact: 15.2,
    itcUtilizationRate: 87.5
  };

  const complianceMetrics = {
    healthScore: 85,
    filingCompliance: 98.5,
    itcReconciliation: 85.2,
    vendorCompliance: 75.8,
    dataQuality: 92.1
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "#2563eb",
    },
    gstCollected: {
      label: "GST Collected",
      color: "#16a34a",
    },
    itcClaimed: {
      label: "ITC Claimed",
      color: "#dc2626",
    },
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Working Capital Impact</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{(workingCapitalAnalysis.itcStuck / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">ITC stuck in disputes</p>
            <div className="text-sm text-orange-600 mt-1">
              {workingCapitalAnalysis.workingCapitalImpact}% of working capital
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ITC Realization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{workingCapitalAnalysis.averageRealizationDays} days</div>
            <p className="text-xs text-muted-foreground">Average ITC utilization time</p>
            <div className="text-sm text-green-600 mt-1">
              {workingCapitalAnalysis.itcUtilizationRate}% utilization rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendor Risk</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">7</div>
            <p className="text-xs text-muted-foreground">High-risk vendors</p>
            <div className="text-sm text-red-600 mt-1">
              ₹89K ITC at risk
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Health</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{complianceMetrics.healthScore}%</div>
            <p className="text-xs text-muted-foreground">Overall GST health score</p>
            <div className="text-sm text-green-600 mt-1">
              Excellent performance
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue and Tax Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Tax Trend Analysis</CardTitle>
          <CardDescription>
            Month-over-month analysis of revenue growth vs GST collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" name="Revenue" />
                <Bar dataKey="gstCollected" fill="var(--color-gstCollected)" name="GST Collected" />
                <Bar dataKey="itcClaimed" fill="var(--color-itcClaimed)" name="ITC Claimed" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Geographical Sales Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Geographical Sales Distribution</CardTitle>
            <CardDescription>
              State-wise sales breakdown with tax implications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statewiseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ state, percentage }) => `${state} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statewiseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-medium">{data.state}</p>
                            <p className="text-sm">Value: ₹{data.value.toLocaleString()}</p>
                            <p className="text-sm">Share: {data.percentage}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Health Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Health Breakdown</CardTitle>
            <CardDescription>
              Detailed analysis of GST compliance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Filing Compliance</span>
                  <span className="font-medium">{complianceMetrics.filingCompliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${complianceMetrics.filingCompliance}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Data Quality</span>
                  <span className="font-medium">{complianceMetrics.dataQuality}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${complianceMetrics.dataQuality}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ITC Reconciliation</span>
                  <span className="font-medium">{complianceMetrics.itcReconciliation}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${complianceMetrics.itcReconciliation}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Vendor Compliance</span>
                  <span className="font-medium">{complianceMetrics.vendorCompliance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${complianceMetrics.vendorCompliance}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Key Insights</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Vendor compliance needs improvement (75.8%)</li>
                <li>• ITC reconciliation can be optimized (85.2%)</li>
                <li>• Excellent filing compliance record (98.5%)</li>
                <li>• Strong data quality maintenance (92.1%)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Working Capital Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Working Capital Impact Analysis</CardTitle>
          <CardDescription>
            How GST compliance affects your company's working capital
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600 mb-2">
                ₹{(workingCapitalAnalysis.itcStuck / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-600 mb-2">ITC Stuck in Disputes</div>
              <div className="text-xs text-red-600">
                {workingCapitalAnalysis.workingCapitalImpact}% of total working capital
              </div>
            </div>

            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {workingCapitalAnalysis.averageRealizationDays}
              </div>
              <div className="text-sm text-gray-600 mb-2">Days Average ITC Realization</div>
              <div className="text-xs text-orange-600">
                Industry average: 30-35 days
              </div>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {workingCapitalAnalysis.itcUtilizationRate}%
              </div>
              <div className="text-sm text-gray-600 mb-2">ITC Utilization Rate</div>
              <div className="text-xs text-green-600">
                Above industry benchmark
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Recommendations</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>• Follow up with 7 high-risk vendors to reduce ITC at risk</li>
              <li>• Implement automated vendor compliance monitoring</li>
              <li>• Optimize ITC utilization to reduce realization time to 35 days</li>
              <li>• Consider factoring for stuck ITC to improve cash flow</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
