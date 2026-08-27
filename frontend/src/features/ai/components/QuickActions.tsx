import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, Wheat, Truck, ShoppingCart, BarChart3, FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { label: 'View Harvest', icon: Scissors, color: 'text-warning', route: ROUTES.FARM },
    { label: 'View Yield', icon: Wheat, color: 'text-primary', route: ROUTES.FARM },
    { label: 'View Market', icon: BarChart3, color: 'text-orange-400', route: ROUTES.MARKET },
    { label: 'View Supply', icon: Truck, color: 'text-blue-400', route: ROUTES.MARKET },
    { label: 'View Demand', icon: ShoppingCart, color: 'text-pink-400', route: ROUTES.MARKET },
    { label: 'Generate Report', icon: FileText, color: 'text-secondary', route: ROUTES.REPORTS },
  ];

  return (
    <Card className="glass">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Button 
                key={i} 
                variant="outline" 
                className="w-full justify-start h-auto py-3 px-4 bg-surface hover:bg-surface/80 border-border group"
                onClick={() => navigate(action.route)}
              >
                <div className="flex items-center w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${action.color}`} />
                    <span className="text-sm font-medium text-text-primary">{action.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
