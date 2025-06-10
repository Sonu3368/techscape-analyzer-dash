
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronDown, 
  ChevronRight, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Globe,
  Code,
  Image,
  Network,
  Accessibility,
  TrendingUp,
  Clock,
  Eye,
  Activity
} from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number | string;
  score: number; // 0-100
  severity: 'critical' | 'warning' | 'good';
  description: string;
  recommendation?: string;
  codeExample?: {
    bad: string;
    good: string;
  };
}

interface PerformanceSection {
  title: string;
  icon: React.ReactNode;
  metrics: PerformanceMetric[];
  insights: string[];
}

interface PerformanceAnalysisResult {
  url: string;
  overallScore: number;
  executiveSummary: {
    criticalIssues: string[];
    topRecommendations: string[];
  };
  sections: {
    network: PerformanceSection;
    html: PerformanceSection;
    css: PerformanceSection;
    javascript: PerformanceSection;
    accessibility: PerformanceSection;
    seo: PerformanceSection;
  };
  coreWebVitals: {
    lcp: PerformanceMetric;
    cls: PerformanceMetric;
    inp: PerformanceMetric;
  };
}

interface PerformanceAnalysisPanelProps {
  result: PerformanceAnalysisResult;
}

export const PerformanceAnalysisPanel: React.FC<PerformanceAnalysisPanelProps> = ({ result }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['summary']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const renderMetric = (metric: PerformanceMetric) => (
    <div key={metric.name} className="p-4 border rounded-lg">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getSeverityIcon(metric.severity)}
          <span className="font-medium">{metric.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${getScoreColor(metric.score)}`}>
            {metric.score}/100
          </span>
          <div className="w-16 h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-full rounded-full ${getScoreBg(metric.score)}`}
              style={{ width: `${metric.score}%` }}
            />
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
      
      {typeof metric.value === 'number' ? (
        <div className="text-lg font-semibold text-gray-900 mb-2">
          {metric.value.toFixed(2)}ms
        </div>
      ) : (
        <div className="text-lg font-semibold text-gray-900 mb-2">
          {metric.value}
        </div>
      )}

      {metric.recommendation && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-800 font-medium mb-2">Recommendation:</p>
          <p className="text-sm text-blue-700">{metric.recommendation}</p>
        </div>
      )}

      {metric.codeExample && (
        <div className="mt-3 space-y-2">
          <div className="p-2 bg-red-50 border border-red-200 rounded">
            <p className="text-xs text-red-600 font-medium mb-1">❌ Bad Example:</p>
            <code className="text-xs text-red-800 font-mono">{metric.codeExample.bad}</code>
          </div>
          <div className="p-2 bg-green-50 border border-green-200 rounded">
            <p className="text-xs text-green-600 font-medium mb-1">✅ Good Example:</p>
            <code className="text-xs text-green-800 font-mono">{metric.codeExample.good}</code>
          </div>
        </div>
      )}
    </div>
  );

  const renderSection = (sectionKey: string, section: PerformanceSection) => (
    <Card key={sectionKey} className="border-gray-200">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <CardHeader 
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => toggleSection(sectionKey)}
          >
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {expandedSections.has(sectionKey) ? 
                  <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                }
                {section.icon}
                <span>{section.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {section.metrics.length} metrics
                </Badge>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-500">Avg: </span>
                  <span className={`font-medium ${getScoreColor(
                    Math.round(section.metrics.reduce((sum, m) => sum + m.score, 0) / section.metrics.length)
                  )}`}>
                    {Math.round(section.metrics.reduce((sum, m) => sum + m.score, 0) / section.metrics.length)}/100
                  </span>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {section.insights.length > 0 && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-medium text-purple-900 mb-2">Key Insights:</h5>
                  <ul className="space-y-1">
                    {section.insights.map((insight, index) => (
                      <li key={index} className="text-sm text-purple-800 flex items-start gap-2">
                        <span className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid gap-4">
                {section.metrics.map(renderMetric)}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Overall Score & Summary */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <Collapsible>
          <CollapsibleTrigger asChild>
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleSection('summary')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {expandedSections.has('summary') ? 
                    <ChevronDown className="h-5 w-5 text-blue-600" /> : 
                    <ChevronRight className="h-5 w-5 text-blue-600" />
                  }
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Performance Analysis Summary</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.overallScore}/100
                    </div>
                    <div className="text-sm text-blue-500">Overall Score</div>
                  </div>
                  <div className="w-20 h-20 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-gray-200"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.overallScore / 100)}`}
                        className={getScoreColor(result.overallScore).replace('text-', 'text-')}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Critical Issues ({result.executiveSummary.criticalIssues.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.executiveSummary.criticalIssues.map((issue, index) => (
                      <li key={index} className="text-sm text-red-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Top Recommendations ({result.executiveSummary.topRecommendations.length})
                  </h4>
                  <ul className="space-y-2">
                    {result.executiveSummary.topRecommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-green-600 flex items-start gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Core Web Vitals */}
              <div className="mt-6 p-4 bg-white border rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Core Web Vitals
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(result.coreWebVitals).map(([key, vital]) => (
                    <div key={key} className="text-center p-3 border rounded">
                      <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                        {key.toUpperCase()}
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(vital.score)}`}>
                        {typeof vital.value === 'number' ? `${vital.value.toFixed(2)}ms` : vital.value}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Score: {vital.score}/100
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Detailed Sections */}
      {renderSection('network', result.sections.network)}
      {renderSection('html', result.sections.html)}
      {renderSection('css', result.sections.css)}
      {renderSection('javascript', result.sections.javascript)}
      {renderSection('accessibility', result.sections.accessibility)}
      {renderSection('seo', result.sections.seo)}
    </div>
  );
};
