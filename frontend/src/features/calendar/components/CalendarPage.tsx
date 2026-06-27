import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Crop Calendar" 
        description="Plan and track your farming activities throughout the season." 
        action={<Button className="gap-2"><CalendarDays className="w-4 h-4"/> Schedule Activity</Button>}
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="glass h-[600px] flex items-center justify-center">
             <div className="text-center text-text-secondary">
               <CalendarDays className="w-16 h-16 mx-auto mb-4 opacity-50" />
               <h3 className="text-xl font-heading font-medium text-text-primary mb-2">Interactive Calendar</h3>
               <p>The interactive seasonal calendar will be integrated here.</p>
             </div>
          </Card>
        </div>
        <div className="space-y-6">
          <h2 className="text-xl font-heading font-semibold">Upcoming</h2>
          <Card className="glass">
            <CardContent className="p-4 space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded bg-primary/20 flex flex-col items-center justify-center text-primary font-bold shrink-0">
                  <span className="text-xs uppercase">Oct</span>
                  <span>14</span>
                </div>
                <div>
                  <div className="font-medium">Harvest Wheat</div>
                  <div className="text-sm text-text-secondary">Field A</div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded bg-secondary/20 flex flex-col items-center justify-center text-secondary font-bold shrink-0">
                  <span className="text-xs uppercase">Oct</span>
                  <span>18</span>
                </div>
                <div>
                  <div className="font-medium">Irrigation</div>
                  <div className="text-sm text-text-secondary">Field B</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
