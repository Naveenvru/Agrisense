import { useEffect } from 'react';
import { Farm, LandParcel } from '../types';
import { Button } from '@/components/ui/button';
import { X, Map, CloudSun, BrainCircuit, Bug, TrendingUp, Trash2 } from 'lucide-react';
import { AccordionSection } from './ui/AccordionSection';
import { ParcelCard } from './ParcelCard';
import { CropCycleManager } from './CropCycleManager';
import { EmptyState } from './ui/EmptyState';
import { FarmParcelBoundaryEditor } from './FarmParcelBoundaryEditor';
import { getAccountPreferencesFromStorage } from '@/features/settings/services/account-preferences';
import { ROUTES } from '@/config/routes';
import { Link } from 'react-router-dom';

interface FarmDetailsDrawerProps {
  farm: Farm | null;
  parcels: LandParcel[];
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  detailsError?: string;
  onDelete: (farm: Farm) => void;
  onParcelUpdated: () => void;
}

export function FarmDetailsDrawer({ farm, parcels, isOpen, onClose, isLoading, detailsError, onDelete, onParcelUpdated }: FarmDetailsDrawerProps) {
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
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-text-primary tracking-tight">
            {isLoading ? 'Loading...' : farm?.name || 'Farm Details'}
          </h2>
          {!isLoading && farm && <Button variant="ghost" size="sm" aria-label="Delete farm parcel" onClick={() => onDelete(farm)} className="h-8 w-8 p-0 rounded-full text-error hover:bg-error/10"><Trash2 className="h-4 w-4" /></Button>}
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0 rounded-full hover:bg-hover">
            <X className="w-5 h-5 text-text-secondary hover:text-text-primary" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-surface/30">
          {detailsError && <div role="alert" className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-sm text-text-primary">{detailsError}</div>}
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
              <AccordionSection title="Farm Information" defaultOpen>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-secondary mb-1">Owner</p>
                    <p className="font-medium text-text-primary">{farm.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary mb-1">Location</p>
                    <p className="font-medium text-text-primary">{farm.location}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary mb-1">Total Area</p>
                    <p className="font-medium text-text-primary">{farm.totalArea} {getAccountPreferencesFromStorage().units === 'imperial' ? 'acres' : 'ha'}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary mb-1">Last Updated</p>
                    <p className="font-medium text-text-primary">{new Date(farm.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </AccordionSection>

              {/* Land Parcels */}
              <AccordionSection title={`Land Parcels (${parcels.length})`} defaultOpen>
                {parcels.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {parcels.map(parcel => (
                      <ParcelCard key={parcel.id} parcel={parcel} />
                    ))}
                  </div>
                ) : (
                  <EmptyState icon={Map} title="No Parcels" description="This farm has no associated land parcels." />
                )}
              </AccordionSection>

              {/* Crop rotation, calendar, and manually reported conditions */}
              <AccordionSection title="Crop cycles & field conditions" defaultOpen>
                <CropCycleManager parcelId={farm.id} farmName={farm.name} onChanged={onParcelUpdated} />
              </AccordionSection>

              {/* Existing parcel weather integration */}
              <AccordionSection title="Weather Intelligence">
                <Link to={ROUTES.WEATHER} className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-4 text-sm text-text-primary hover:border-primary/40"><CloudSun className="h-5 w-5 text-info" />Open live and stored weather for geolocated farm parcels</Link>
              </AccordionSection>

              {/* Disease Detection Placeholder */}
              <AccordionSection title="Disease Detection">
                <div className="glass rounded-xl p-6 border border-border bg-background/50 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-3 bg-destructive/10 rounded-full">
                    <Bug className="w-6 h-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Vegetation index is not a disease diagnosis</p>
                    <p className="text-sm text-text-secondary mt-1">Review Sentinel-2 vegetation observations separately; low NDVI alone does not identify pests or crop disease.</p>
                  </div>
                </div>
              </AccordionSection>
              
              {/* Yield Prediction Placeholder */}
              <AccordionSection title="Yield Prediction">
                <div className="glass rounded-xl p-6 border border-border bg-background/50 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-3 bg-success/10 rounded-full">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">Harvest Forecasting</p>
                    <p className="text-sm text-text-secondary mt-1">Advanced yield modeling is currently in training phase.</p>
                  </div>
                </div>
              </AccordionSection>
              
              {/* AI Recommendation Placeholder */}
              <AccordionSection title="AI Recommendations">
                <div className="glass rounded-xl p-6 border border-primary/20 bg-primary/5 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <BrainCircuit className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">AgriSense AI Analysis</p>
                    <p className="text-sm text-text-secondary mt-1">Recommendations will appear here after AI analysis.</p>
                  </div>
                </div>
              </AccordionSection>

              <AccordionSection title="Farm boundary and centroid" defaultOpen>
                <FarmParcelBoundaryEditor farm={farm} onUpdated={onParcelUpdated} />
              </AccordionSection>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
