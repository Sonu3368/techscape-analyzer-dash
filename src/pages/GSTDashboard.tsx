
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GSTOverview } from "@/components/gst/GSTOverview";
import { GSTReturns } from "@/components/gst/GSTReturns";
import { ITCManagement } from "@/components/gst/ITCManagement";
import { OutwardSupply } from "@/components/gst/OutwardSupply";
import { InwardSupply } from "@/components/gst/InwardSupply";
import { GSTLedger } from "@/components/gst/GSTLedger";
import { GSTAnalytics } from "@/components/gst/GSTAnalytics";
import { GSTReports } from "@/components/gst/GSTReports";

const GSTDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GST Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive GST compliance and analytics platform
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8 bg-white border">
            <TabsTrigger value="overview" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="returns" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">Returns</span>
            </TabsTrigger>
            <TabsTrigger value="itc" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">ITC</span>
            </TabsTrigger>
            <TabsTrigger value="outward" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">Outward</span>
            </TabsTrigger>
            <TabsTrigger value="inward" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">Inward</span>
            </TabsTrigger>
            <TabsTrigger value="ledger" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">Ledger</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex flex-col items-center p-3">
              <span className="text-sm font-medium">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <GSTOverview />
          </TabsContent>

          <TabsContent value="returns" className="space-y-6">
            <GSTReturns />
          </TabsContent>

          <TabsContent value="itc" className="space-y-6">
            <ITCManagement />
          </TabsContent>

          <TabsContent value="outward" className="space-y-6">
            <OutwardSupply />
          </TabsContent>

          <TabsContent value="inward" className="space-y-6">
            <InwardSupply />
          </TabsContent>

          <TabsContent value="ledger" className="space-y-6">
            <GSTLedger />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <GSTAnalytics />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <GSTReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GSTDashboard;
