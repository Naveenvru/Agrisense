import { WeatherImpactMatrixItem } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { CloudLightning, Sprout, ArrowRight } from 'lucide-react';

interface WeatherImpactMatrixProps {
  matrix: WeatherImpactMatrixItem[];
}

export function WeatherImpactMatrix({ matrix }: WeatherImpactMatrixProps) {
  return (
    <section>
      <h2 className="text-xl font-heading font-bold text-text-primary mb-4">Impact Matrix</h2>
      <Card className="glass overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left">
              <thead className="bg-background/50 text-text-secondary uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">Weather Parameter</th>
                  <th className="px-6 py-4 font-semibold">Crop Impact</th>
                  <th className="px-6 py-4 font-semibold">Farmer Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {matrix.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium text-text-primary">
                        <CloudLightning className="w-4 h-4 text-warning" />
                        {item.parameter}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-text-secondary font-medium">
                        <Sprout className="w-4 h-4" />
                        {item.crop}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-primary">
                        <ArrowRight className="w-4 h-4 opacity-50" />
                        {item.action}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
