
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useDemoLimit } from '@/hooks/useDemoLimit';
import { Zap, Crown } from 'lucide-react';

export const DemoCounter = () => {
  const { user } = useAuth();
  const { remainingDemoSearches, isDemoLimitReached } = useDemoLimit();

  if (user) {
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
        <Crown className="h-3 w-3 mr-1" />
        Unlimited
      </Badge>
    );
  }

  if (isDemoLimitReached) {
    return (
      <Badge variant="destructive">
        <Zap className="h-3 w-3 mr-1" />
        Demo Limit Reached
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-blue-200 text-blue-700">
      <Zap className="h-3 w-3 mr-1" />
      {remainingDemoSearches} free searches left
    </Badge>
  );
};
