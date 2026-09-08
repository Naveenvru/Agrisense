import { useState } from 'react';
import { X, MapPin, Navigation, Sprout, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FarmService } from '../services/FarmService';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
];

const SOIL_TYPES = [
  'Loam',
  'Black Soil',
  'Red Soil',
  'Clay',
  'Sandy',
  'Alluvial',
  'Silty',
];

const IRRIGATION_TYPES = [
  'Drip',
  'Sprinkler',
  'Canal',
  'Borewell',
  'Rainfed',
  'Flood',
];

export function AddFarmModal({ isOpen, onClose, onSuccess }: AddFarmModalProps) {
  const [parcelName, setParcelName] = useState('');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('');
  const [areaAcres, setAreaAcres] = useState('');
  const [soilType, setSoilType] = useState('Loam');
  const [irrigationType, setIrrigationType] = useState('Drip');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [isGettingGps, setIsGettingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser.');
      return;
    }

    setIsGettingGps(true);
    setErrorMsg(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6));
        setLongitude(position.coords.longitude.toFixed(6));
        setIsGettingGps(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setErrorMsg('Unable to retrieve GPS location. Please enter latitude/longitude manually.');
        setIsGettingGps(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parcelName.trim()) {
      setErrorMsg('Please enter a farm parcel name.');
      return;
    }

    const acres = parseFloat(areaAcres);
    if (isNaN(acres) || acres <= 0) {
      setErrorMsg('Please enter a valid area size in acres.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      await FarmService.createParcel({
        parcelName: parcelName.trim(),
        areaAcres: acres,
        soilType,
        irrigationType,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        additionalMetadata: {
          state: state.trim(),
          district: district.trim(),
        },
      });

      // Reset form
      setParcelName('');
      setDistrict('');
      setAreaAcres('');
      setLatitude('');
      setLongitude('');

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create farm parcel');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-xl w-full p-6 md:p-8 space-y-6 relative overflow-hidden my-8">
        {/* Background Subtle Gradient */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-text-primary hover:bg-muted/40 rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-text-primary">Add Farm Parcel</h2>
            <p className="text-sm text-text-secondary">
              Enter your farm location and parcel details to store in the database.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-error/10 border border-error/20 text-error-foreground text-sm font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Farm Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              Farm / Parcel Name *
            </label>
            <Input
              placeholder="e.g. Green Valley Plot A"
              value={parcelName}
              onChange={(e) => setParcelName(e.target.value)}
              className="rounded-xl"
              required
            />
          </div>

          {/* Location: State & District */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                State *
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                District / City
              </label>
              <Input
                placeholder="e.g. Bengaluru Rural"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Land Area & Soil Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                Total Area (Acres) *
              </label>
              <Input
                type="number"
                step="0.1"
                min="0.1"
                placeholder="e.g. 5.0"
                value={areaAcres}
                onChange={(e) => setAreaAcres(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
                Soil Type
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SOIL_TYPES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Irrigation Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1.5">
              Irrigation Type
            </label>
            <select
              value={irrigationType}
              onChange={(e) => setIrrigationType(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {IRRIGATION_TYPES.map((it) => (
                <option key={it} value={it}>
                  {it}
                </option>
              ))}
            </select>
          </div>

          {/* Geo Coordinates */}
          <div className="border border-border/60 rounded-xl p-4 bg-muted/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Geo Coordinates (Location)
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDetectLocation}
                disabled={isGettingGps}
                className="h-8 gap-1.5 text-xs rounded-lg"
              >
                {isGettingGps ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Navigation className="w-3.5 h-3.5 text-primary" />
                )}
                Use GPS Location
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-text-secondary mb-1">Latitude</label>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="e.g. 12.971598"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="rounded-lg h-9 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] text-text-secondary mb-1">Longitude</label>
                <Input
                  type="number"
                  step="0.000001"
                  placeholder="e.g. 77.594566"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="rounded-lg h-9 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl px-5"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl px-6 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Farm...
                </>
              ) : (
                'Save Farm Details'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
