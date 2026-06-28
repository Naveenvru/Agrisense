import { useEffect } from 'react';
import { Farm, LandParcel, CropSummary } from '../types';
import { Button } from '@/components/ui/button';
import { X, Map, CloudSun, BrainCircuit, Sprout } from 'lucide-react';
import { SectionContainer } from './ui/SectionContainer';
import { ParcelCard } from './ParcelCard';
import { CropSummaryCard } from './CropSummaryCard';
import { EmptyState } from './ui/EmptyState';

interface FarmDetailsDrawerProps {
  farm: Farm | null;
  parcels: LandParcel[];
  crops: CropSummary[];
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

export function FarmDetailsDrawer({ farm, parcels, crops, isOpen, onClose, isLoading }: FarmDetailsDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md md:max-w-xl h-full bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border bg-card">
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-text-primary">
            {isLoading ? 'Loading...' : farm?.name || 'Farm Details'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full">
            <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 custom-scrollbar">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="h-6 w-1/3 bg-muted rounded"></div>
                  <div className="h-24 bg-muted/50 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : !farm ? (
            <EmptyState icon={Map} title="Farm Not Found" description="The requested farm could not be loaded." />
          ) : (
            <>
              {/* Farm Information Section */}
              <SectionContainer title="Farm Information">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-secondary">Owner</p>
                    <p className="font-medium text-text-primary">{farm.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Location</p>
                    <p className="font-medium text-text-primary">{farm.location}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Total Area</p>
                    <p className="font-medium text-text-primary">{farm.totalArea} ha</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Last Updated</p>
                    <p className="font-medium text-text-primary">{new Date(farm.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </SectionContainer>

              {/* Land Parcels */}
              <SectionContainer title={`Land Parcels (${parcels.length})`}>
                {parcels.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {parcels.map(parcel => (
                      <ParcelCard key={parcel.id} parcel={parcel} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Map} title="No Parcels" description="This farm has no associated land parcels." />
                )}
              </SectionContainer>

              {/* Current Crops */}
              <SectionContainer title={`Current Crops (${crops.length})`}>
                {crops.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {crops.map(crop => (
                      <CropSummaryCard key={crop.id} crop={crop} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Sprout} title="No Crops" description="There are no active crops on this farm." />
                )}
              </SectionContainer>

              {/* Weather Summary Placeholder */}
              <SectionContainer title="Weather Intelligence">
                <div className="glass rounded-lg p-4 border border-border bg-background/50 flex flex-col items-center justify-center text-center space-y-2 py-8">
                  <CloudSun className="w-8 h-8 text-info/50" />
                  <p className="text-text-primary font-medium">Weather Data Coming Soon</p>
                  <p className="text-sm text-text-secondary">Integration with micro-climate sensors is pending.</p>
                </div>
              </SectionContainer>
              
              {/* AI Recommendation Placeholder */}
              <SectionContainer title="AI Recommendations">
                <div className="glass rounded-lg p-4 border border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-center space-y-2 py-8">
                  <BrainCircuit className="w-8 h-8 text-primary/50" />
                  <p className="text-text-primary font-medium">AgriSense AI Analysis</p>
                  <p className="text-sm text-text-secondary">Recommendations will appear here after AI analysis.</p>
                </div>
              </SectionContainer>

              {/* Map Placeholder */}
              <SectionContainer title="Farm Location Map">
                <div className="h-48 rounded-lg bg-muted flex flex-col items-center justify-center border border-dashed border-border text-text-secondary">
                  <Map className="w-8 h-8 mb-2 opacity-50" />
                  <p>Map Integration Pending</p>
                  <p className="text-xs">GPS: {farm.gpsCoordinates?.latitude}, {farm.gpsCoordinates?.longitude}</p>
                </div>
              </SectionContainer>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
