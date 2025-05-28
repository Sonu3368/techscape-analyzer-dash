
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface AnalysisJob {
  id: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalUrls: number;
  processedUrls: number;
  results: any[];
  createdAt: string;
  completedAt?: string;
}

interface ProgressBarProps {
  job: AnalysisJob;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ job }) => {
  const progressPercentage = job.totalUrls > 0 ? (job.processedUrls / job.totalUrls) * 100 : 0;
  
  // Calculate ETA if processing
  const calculateETA = () => {
    if (job.status !== 'processing' || job.processedUrls === 0) return null;
    
    const startTime = new Date(job.createdAt).getTime();
    const currentTime = Date.now();
    const elapsedTime = currentTime - startTime;
    const avgTimePerUrl = elapsedTime / job.processedUrls;
    const remainingUrls = job.totalUrls - job.processedUrls;
    const estimatedRemainingTime = remainingUrls * avgTimePerUrl;
    
    const minutes = Math.ceil(estimatedRemainingTime / (1000 * 60));
    return minutes;
  };

  const eta = calculateETA();
  const completedCount = job.results?.filter(r => r.status === 'completed').length || 0;
  const failedCount = job.results?.filter(r => r.status === 'failed').length || 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Progress: {job.processedUrls} / {job.totalUrls} URLs
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Status Information */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${
            job.status === 'processing' ? 'bg-blue-500 animate-pulse' :
            job.status === 'completed' ? 'bg-green-500' :
            job.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
          }`} />
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </Badge>

        {completedCount > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-600" />
            {completedCount} completed
          </Badge>
        )}

        {failedCount > 0 && (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {failedCount} failed
          </Badge>
        )}

        {eta && job.status === 'processing' && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            ~{eta}m remaining
          </Badge>
        )}
      </div>

      {/* Processing Details */}
      {job.status === 'processing' && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            Analyzing websites using pattern matching, deep source inspection, and AI inference...
          </p>
        </div>
      )}

      {job.status === 'completed' && (
        <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Analysis completed successfully! Check the results below.
          </p>
        </div>
      )}
    </div>
  );
};
