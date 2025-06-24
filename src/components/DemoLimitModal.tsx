
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Zap, Users, Crown, ArrowRight } from 'lucide-react';

interface DemoLimitModalProps {
  open: boolean;
  onClose: () => void;
}

export const DemoLimitModal = ({ open, onClose }: DemoLimitModalProps) => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth/signup');
    onClose();
  };

  const handleLogin = () => {
    navigate('/auth/login');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center">
            <Zap className="h-6 w-6 text-blue-600 mx-auto" />
            Demo Limit Reached
          </DialogTitle>
          <DialogDescription className="text-center">
            You've used all 5 free demo searches! Sign up or log in to continue analyzing websites without limits.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Unlimited Access</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Unlimited website analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Advanced AI-powered insights
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Export and save results
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  Priority support
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleSignUp}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Users className="h-4 w-4 mr-2" />
              Sign Up Free
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleLogin}
              className="w-full"
            >
              Already have an account? Log In
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
