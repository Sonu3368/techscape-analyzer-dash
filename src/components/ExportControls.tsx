
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Download, 
  Copy, 
  FileText, 
  Database,
  CheckCircle,
  Loader2
} from 'lucide-react';

interface ExportControlsProps {
  jobId: number;
}

export const ExportControls: React.FC<ExportControlsProps> = ({ jobId }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const handleExport = async (format: 'csv' | 'json') => {
    setIsExporting(format);
    try {
      const response = await fetch(`/api/analyze/${jobId}/export/${format}`);
      if (!response.ok) throw new Error('Export failed');

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `techstack-analysis-${jobId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Successful",
        description: `Analysis results downloaded as ${format.toUpperCase()}`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export results: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const handleCopyToClipboard = async () => {
    setIsCopying(true);
    try {
      const response = await fetch(`/api/analyze/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch job data');

      const jobData = await response.json();
      const jsonString = JSON.stringify(jobData, null, 2);
      
      await navigator.clipboard.writeText(jsonString);
      
      toast({
        title: "Copied to Clipboard",
        description: "Analysis results copied as JSON",
      });
    } catch (error) {
      toast({
        title: "Copy Failed", 
        description: `Failed to copy results: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600" />
            Export Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* CSV Export */}
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">CSV Format</h4>
                  <p className="text-sm text-gray-600">Spreadsheet-compatible format</p>
                </div>
              </div>
              <Button
                onClick={() => handleExport('csv')}
                disabled={isExporting === 'csv'}
                className="w-full"
                variant="outline"
              >
                {isExporting === 'csv' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV
                  </>
                )}
              </Button>
              <div className="mt-2 space-y-1">
                <Badge variant="secondary" className="text-xs">
                  Excel Compatible
                </Badge>
                <p className="text-xs text-gray-500">
                  Includes URL, technology name, category, version, confidence, and detection method
                </p>
              </div>
            </div>

            {/* JSON Export */}
            <div className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded">
                  <Database className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">JSON Format</h4>
                  <p className="text-sm text-gray-600">Machine-readable structured data</p>
                </div>
              </div>
              <Button
                onClick={() => handleExport('json')}
                disabled={isExporting === 'json'}
                className="w-full"
                variant="outline"
              >
                {isExporting === 'json' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download JSON
                  </>
                )}
              </Button>
              <div className="mt-2 space-y-1">
                <Badge variant="secondary" className="text-xs">
                  API Compatible
                </Badge>
                <p className="text-xs text-gray-500">
                  Complete analysis data including AI insights, patterns, and metadata
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5 text-gray-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              onClick={handleCopyToClipboard}
              disabled={isCopying}
              variant="outline"
              className="flex-1"
            >
              {isCopying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Copying...
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>
            
            <Button
              onClick={() => window.open(`/api/analyze/${jobId}`, '_blank')}
              variant="outline"
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              View Raw JSON
            </Button>
          </div>

          {/* Export Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">Export Information</p>
                <ul className="text-blue-700 space-y-1 text-xs">
                  <li>• CSV exports include all detected technologies with confidence scores</li>
                  <li>• JSON exports contain complete analysis data including AI insights</li>
                  <li>• Data can be imported into spreadsheets, databases, or other tools</li>
                  <li>• Clipboard copy provides instant access to JSON data</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
