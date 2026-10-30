import { LandParcel } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { AreaBadge, GpsStatusBadge, HealthBadge } from './ui/badges';
import { Droplets, Mountain } from 'lucide-react';

interface ParcelCardProps {
  parcel: LandParcel;
}

export function ParcelCard({ parcel }: ParcelCardProps) {
  return (
    <Card className="glass shadow-none bg-background/50 hover:bg-background/80 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-text-primary">{parcel.name}</h4>
          {parcel.area !== null && parcel.area !== undefined && <AreaBadge area={parcel.area} />}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {parcel.currentCrop ? (
            <div className="flex items-center gap-1 text-sm text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
              {parcel.currentCrop}{parcel.cropVariety ? ` (${parcel.cropVariety})` : ''}
            </div>
          ) : (
            <div className="text-sm text-text-secondary italic">Fallow</div>
          )}
          <HealthBadge status={parcel.healthStatus} />
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-between text-sm text-text-secondary">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1" title="Soil Type">
              <Mountain className="w-4 h-4 text-secondary" />
              {parcel.soilType}
            </div>
            <div className="flex items-center gap-1" title="Irrigation Type">
              <Droplets className="w-4 h-4 text-info" />
              {parcel.irrigationType}
            </div>
          </div>
          <GpsStatusBadge available={!!parcel.gpsCoordinates} />
        </div>
      </CardContent>
    </Card>
  );
}
