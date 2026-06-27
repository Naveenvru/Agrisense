import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and farm configurations." 
      />
      <div className="max-w-2xl space-y-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Full Name</label>
              <Input defaultValue="John Doe" className="bg-surface/50 border-border text-text-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Email Address</label>
              <Input defaultValue="john.doe@example.com" type="email" className="bg-surface/50 border-border text-text-primary" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-heading">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Measurement Unit</label>
              <select className="w-full bg-surface/50 border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary">
                <option>Metric (ha, °C, mm)</option>
                <option>Imperial (acres, °F, in)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
