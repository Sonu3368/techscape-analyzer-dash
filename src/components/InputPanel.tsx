
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Upload, Play, RotateCcw, FileText, Zap, Brain } from 'lucide-react';

interface InputPanelProps {
  urlInput: string;
  setUrlInput: (value: string) => void;
  deepSearchEnabled: boolean;
  setDeepSearchEnabled: (value: boolean) => void;
  aiAnalysisEnabled: boolean;
  setAiAnalysisEnabled: (value: boolean) => void;
  onStartAnalysis: (urls: string[]) => void;
  onClearAll: () => void;
  isProcessing: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({
  urlInput,
  setUrlInput,
  deepSearchEnabled,
  setDeepSearchEnabled,
  aiAnalysisEnabled,
  setAiAnalysisEnabled,
  onStartAnalysis,
  onClearAll,
  isProcessing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateUrls = (urls: string[]): string[] => {
    const urlPattern = /^https?:\/\/.+/i;
    return urls.filter(url => {
      const trimmed = url.trim();
      return trimmed && urlPattern.test(trimmed);
    });
  };

  const parseUrls = (text: string): string[] => {
    return text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      let urls: string[] = [];

      if (file.name.endsWith('.csv')) {
        // Parse CSV - assume URLs are in first column
        urls = content
          .split('\n')
          .map(line => line.split(',')[0]?.trim())
          .filter(url => url && url.length > 0);
      } else {
        // Parse as plain text
        urls = parseUrls(content);
      }

      setUrlInput(urls.join('\n'));
      toast({
        title: "File Uploaded",
        description: `Loaded ${urls.length} URLs from ${file.name}`,
      });
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const handleStartAnalysis = () => {
    const urls = parseUrls(urlInput);
    const validUrls = validateUrls(urls);

    if (validUrls.length === 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter at least one valid URL starting with http:// or https://",
        variant: "destructive",
      });
      return;
    }

    if (validUrls.length > 1000) {
      toast({
        title: "Too Many URLs",
        description: "Please limit your input to 1000 URLs or fewer",
        variant: "destructive",
      });
      return;
    }

    if (validUrls.length < urls.length) {
      toast({
        title: "Some URLs Filtered",
        description: `${urls.length - validUrls.length} invalid URLs were removed`,
      });
    }

    onStartAnalysis(validUrls);
  };

  const urlCount = parseUrls(urlInput).length;
  const validUrlCount = validateUrls(parseUrls(urlInput)).length;

  return (
    <Card className="border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          URL Input & Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-3">
          <Label htmlFor="url-input" className="text-sm font-medium">
            Website URLs
          </Label>
          <Textarea
            id="url-input"
            placeholder="Enter URLs (one per line):&#10;https://example.com&#10;https://github.com&#10;https://stackoverflow.com"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="min-h-[120px] font-mono text-sm"
            disabled={isProcessing}
          />
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-2">
              {urlCount > 0 && (
                <Badge variant={validUrlCount === urlCount ? "default" : "destructive"}>
                  {validUrlCount} valid of {urlCount} URLs
                </Badge>
              )}
              {urlCount > 1000 && (
                <Badge variant="destructive">
                  Limit: 1000 URLs
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Or Upload File</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isProcessing}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV or TXT File
          </Button>
        </div>

        {/* Analysis Options */}
        <div className="space-y-4 pt-4 border-t">
          <Label className="text-sm font-medium">Analysis Options</Label>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600" />
              <Label htmlFor="deep-search" className="text-sm">
                Deep Search
              </Label>
            </div>
            <Switch
              id="deep-search"
              checked={deepSearchEnabled}
              onCheckedChange={setDeepSearchEnabled}
              disabled={isProcessing}
            />
          </div>
          <p className="text-xs text-gray-500 ml-6">
            Analyze file paths, HTML attributes, comments, and CSS classes
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-600" />
              <Label htmlFor="ai-analysis" className="text-sm">
                AI Analysis
              </Label>
            </div>
            <Switch
              id="ai-analysis"
              checked={aiAnalysisEnabled}
              onCheckedChange={setAiAnalysisEnabled}
              disabled={isProcessing}
            />
          </div>
          <p className="text-xs text-gray-500 ml-6">
            GPT-4 powered contextual analysis and recommendations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleStartAnalysis}
            disabled={isProcessing || urlCount === 0 || validUrlCount === 0}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Play className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Start Analysis'}
          </Button>
          <Button
            variant="outline"
            onClick={onClearAll}
            disabled={isProcessing}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
