import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_FARM_DATA } from '../mocks/farm.mock';
import { Leaf, Map, Droplets, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function FarmPage() {
  const { fields, inventory } = MOCK_FARM_DATA;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Farm" 
        description="Manage your fields, crops, and inventory." 
        action={<Button className="gap-2"><Plus className="w-4 h-4"/> Add Field</Button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">Active Fields</h2>
            <Button variant="outline" size="sm" className="gap-2"><Map className="w-4 h-4"/> Map View</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(field => (
              <Card key={field.id} className="glass">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{field.name}</CardTitle>
                    <Badge variant={field.status === 'Healthy' ? 'default' : 'destructive'} className={field.status === 'Healthy' ? 'bg-primary/20 text-primary hover:bg-primary/30' : 'bg-warning/20 text-warning hover:bg-warning/30 border-warning/50'}>
                      {field.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-heading font-bold mb-1">{field.area} ha</div>
                  <div className="flex items-center gap-2 text-text-secondary mb-4">
                    <Leaf className="w-4 h-4 text-primary" />
                    <span>Planted: {field.crop}</span>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-secondary" />
                      <span className="text-sm">{field.moisture}% Moisture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm">{field.ph} pH</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-heading font-semibold">Inventory</h2>
          <Card className="glass">
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {inventory.map((item, idx) => (
                  <div key={idx} className="p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-text-primary">{item.item}</div>
                      <div className="text-sm text-text-secondary">{item.quantity}</div>
                    </div>
                    <Badge variant="outline" className={item.status === 'Low' ? 'text-warning border-warning' : 'text-primary border-primary'}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
