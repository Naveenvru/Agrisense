import { useEffect, useMemo, useState } from 'react';
import { Loader2, Sprout, X } from 'lucide-react';
import { FarmService } from '../services/FarmService';
import { FarmBoundaryMap, type FarmBoundary } from './FarmBoundaryMap';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];
const SOIL_TYPES = ['Unknown', 'Red soil', 'Black soil', 'Alluvial soil', 'Laterite soil', 'Sandy soil', 'Loamy soil', 'Clay soil', 'Other'];
const IRRIGATION_TYPES = ['Rainfed', 'Borewell', 'Open well', 'Canal', 'Drip', 'Sprinkler', 'Tank or pond', 'Mixed irrigation', 'Other'];
const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];
const steps = ['Farm details', 'Location & boundary', 'Land information', 'Review'];
type Point = [number, number];

function toBoundary(points: Point[]): FarmBoundary | undefined {
  if (points.length < 3) return undefined;
  const ring = points.map(([latitude, longitude]) => [longitude, latitude]);
  const [firstLng, firstLat] = ring[0];
  const [lastLng, lastLat] = ring[ring.length - 1];
  if (firstLng !== lastLng || firstLat !== lastLat) ring.push([firstLng, firstLat]);
  return { type: 'Polygon', coordinates: [ring] };
}

function TextInput({ label, value, onChange, type = 'text', placeholder, min, step }: {
  label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string; min?: string; step?: string;
}) {
  return <label className="block text-sm font-medium text-text-secondary">{label}<input type={type} value={value} min={min} step={step} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label>;
}

export function AddFarmModal({ isOpen, onClose, onSuccess }: AddFarmModalProps) {
  const [step, setStep] = useState(0);
  const [parcelName, setParcelName] = useState('');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('');
  const [taluk, setTaluk] = useState('');
  const [village, setVillage] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [description, setDescription] = useState('');
  const [manualArea, setManualArea] = useState('');
  const [areaBreakdown, setAreaBreakdown] = useState({ cultivableAcres: '', nonCultivableAcres: '', fallowAcres: '' });
  const [soilType, setSoilType] = useState('Unknown');
  const [soilOther, setSoilOther] = useState('');
  const [soilMeasurements, setSoilMeasurements] = useState({ ph: '', electricalConductivity: '', organicCarbon: '', nitrogen: '', phosphorus: '', potassium: '' });
  const [irrigationSources, setIrrigationSources] = useState<string[]>([]);
  const [waterResources, setWaterResources] = useState<string[]>([]);
  const [seasonalWater, setSeasonalWater] = useState('');
  const [ownershipStatus, setOwnershipStatus] = useState('');
  const [landRecordReference, setLandRecordReference] = useState('');
  const [terrain, setTerrain] = useState('');
  const [drainage, setDrainage] = useState('');
  const [waterlogging, setWaterlogging] = useState('');
  const [erosion, setErosion] = useState('');
  const [croppingPattern, setCroppingPattern] = useState('');
  const [previousCrops, setPreviousCrops] = useState('');
  const [farmingMethod, setFarmingMethod] = useState('');

  const [points, setPoints] = useState<Point[]>([]);
  const [center, setCenter] = useState<Point>(DEFAULT_CENTER);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationAccuracy, setLocationAccuracy] = useState<'boundary' | 'gps' | 'approximate'>('approximate');
  const [drawing, setDrawing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [boundaryConfirmed, setBoundaryConfirmed] = useState(false);
  const [areaPreview, setAreaPreview] = useState<{ areaSqm: number; areaAcres: number; areaHectares: number; centroid: { latitude: number; longitude: number } } | null>(null);
  const [areaPreviewError, setAreaPreviewError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const boundary = useMemo(() => boundaryConfirmed ? toBoundary(points) : undefined, [boundaryConfirmed, points]);
  const totalAcres = areaPreview?.areaAcres ?? (manualArea ? Number(manualArea) : undefined);

  useEffect(() => {
    if (!isOpen || !boundary) return;
    let stale = false;
    setAreaPreviewError('');
    const timer = window.setTimeout(() => {
      FarmService.previewBoundary(boundary).then((result) => { if (!stale) setAreaPreview(result); })
        .catch((error: any) => { if (!stale) { setAreaPreview(null); setAreaPreviewError(error.response?.data?.message || 'This boundary could not be measured. Check that it does not cross itself.'); } });
    }, 350);
    return () => { stale = true; window.clearTimeout(timer); };
  }, [isOpen, boundary]);

  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setBoundaryConfirmed(false);
      setPoints([]);
      setAreaPreview(null);
      setParcelName(''); setState('Karnataka'); setDistrict(''); setTaluk(''); setVillage(''); setPinCode(''); setDescription(''); setManualArea('');
      setAreaBreakdown({ cultivableAcres: '', nonCultivableAcres: '', fallowAcres: '' }); setSoilType('Unknown'); setSoilOther('');
      setSoilMeasurements({ ph: '', electricalConductivity: '', organicCarbon: '', nitrogen: '', phosphorus: '', potassium: '' });
      setIrrigationSources([]); setWaterResources([]); setSeasonalWater(''); setOwnershipStatus(''); setLandRecordReference('');
      setTerrain(''); setDrainage(''); setWaterlogging(''); setErosion(''); setCroppingPattern(''); setPreviousCrops(''); setFarmingMethod('');
      setCenter(DEFAULT_CENTER); setLatitude(''); setLongitude(''); setLocationAccuracy('approximate'); setDrawing(false); setEditing(false); setAreaPreviewError(''); setErrorMessage('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const warnOnExit = (event: BeforeUnloadEvent) => {
      if (parcelName || points.length || manualArea || description) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', warnOnExit);
    return () => window.removeEventListener('beforeunload', warnOnExit);
  }, [isOpen, parcelName, points.length, manualArea, description]);

  if (!isOpen) return null;

  const requestClose = () => {
    if ((parcelName || points.length || manualArea || description) && !window.confirm('Discard unsaved farm details?')) return;
    onClose();
  };

  const updateChoice = (current: string[], set: (next: string[]) => void, value: string) => {
    set(current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value]);
  };

  const addVertex = (point: Point) => {
    setPoints((current) => [...current, point]);
    if (drawing) setBoundaryConfirmed(false);
  };
  const moveVertex = (index: number, point: Point) => setPoints((current) => current.map((value, i) => i === index ? point : value));
  const removeVertex = (index: number) => setPoints((current) => {
    const next = current.filter((_, i) => i !== index);
    setBoundaryConfirmed((confirmed) => confirmed && next.length >= 3);
    return next;
  });
  const acceptGps = (point: Point) => {
    setLatitude(point[0].toFixed(6));
    setLongitude(point[1].toFixed(6));
    setCenter(point);
    setLocationAccuracy('gps');
  };
  const acceptSearch = (point: Point, label: string) => {
    setLatitude(point[0].toFixed(6));
    setLongitude(point[1].toFixed(6));
    setCenter(point);
    setLocationAccuracy('approximate');
    const addressParts = label.split(',').map((part) => part.trim());
    if (addressParts.length > 2 && !village) setVillage(addressParts[0]);
  };
  const acceptMapLocation = (point: Point) => {
    setLatitude(point[0].toFixed(6));
    setLongitude(point[1].toFixed(6));
    setCenter(point);
    setLocationAccuracy('approximate');
  };

  const saveFarm = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage('');
    if (!parcelName.trim()) { setErrorMessage('Enter a farm or parcel name.'); setStep(0); return; }
    if (points.length >= 3 && !boundaryConfirmed) { setErrorMessage('Finish drawing or clear the incomplete boundary before saving.'); setStep(1); return; }
    if (!boundary && (!latitude || !longitude)) { setErrorMessage('Draw a boundary or provide an approximate GPS/search location. A single point will be labelled approximate, not treated as a boundary.'); setStep(1); return; }

    const numericBreakdown = Object.fromEntries(Object.entries(areaBreakdown).filter(([, value]) => value !== '').map(([key, value]) => [key, Number(value)]));
    const summedBreakdown = Object.values(numericBreakdown).reduce((sum, value) => sum + Number(value), 0);
    if (totalAcres !== undefined && summedBreakdown > totalAcres + 0.0001) { setErrorMessage('The land-use areas cannot exceed the parcel total area.'); setStep(2); return; }
    if (boundaryConfirmed && points.length < 3) { setErrorMessage('A farm boundary needs at least three distinct vertices.'); setStep(1); return; }

    try {
      setIsSubmitting(true);
      const measurements = Object.fromEntries(Object.entries(soilMeasurements).filter(([, value]) => value !== '').map(([key, value]) => [key, Number(value)]));
      await FarmService.createParcel({
        parcelName: parcelName.trim(),
        areaAcres: manualArea ? Number(manualArea) : undefined,
        soilType: soilType === 'Other' ? soilOther.trim() || 'Other' : soilType,
        landType: ownershipStatus || undefined,
        irrigationType: irrigationSources.length ? irrigationSources.join(', ') : undefined,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        locationAccuracy: boundary ? 'boundary' : locationAccuracy,
        boundaryGeoJson: boundary,
        village: village.trim() || undefined,
        taluk: taluk.trim() || undefined,
        district: district.trim() || undefined,
        state: state.trim() || undefined,
        pinCode: pinCode.trim() || undefined,
        description: description.trim() || undefined,
        landProfile: {
          areaBreakdown: numericBreakdown,
          ownershipStatus: ownershipStatus || null,
          landRecordReference: landRecordReference.trim() || null,
          soil: { type: soilType === 'Other' ? soilOther.trim() : soilType, measurements, measurementSource: Object.keys(measurements).length ? 'farmer_entered_unverified' : null },
          irrigationSources,
          waterResources,
          seasonalWaterAvailability: seasonalWater || null,
          terrain: terrain || null,
          drainage: drainage.trim() || null,
          waterloggingObservations: waterlogging.trim() || null,
          soilErosionObservations: erosion.trim() || null,
          croppingPattern: croppingPattern.trim() || null,
          previousCrops: previousCrops.split(',').map((crop) => crop.trim()).filter(Boolean),
          farmingMethod: farmingMethod || null,
        },
        additionalMetadata: { district: district.trim(), state: state.trim(), village: village.trim(), taluk: taluk.trim(), pinCode: pinCode.trim() },
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || 'Could not save this farm parcel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleClass = (selected: boolean) => `rounded-lg border px-3 py-2 text-left text-xs font-medium ${selected ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-text-secondary'}`;

  return <div className="fixed inset-0 z-[1000] overflow-y-auto bg-background/85 p-3 backdrop-blur-sm sm:p-6">
    <div className="mx-auto my-2 max-w-5xl rounded-2xl border border-border bg-card p-5 shadow-2xl md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3"><div className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-primary"><Sprout className="h-6 w-6" /></div><div><h2 className="text-2xl font-bold text-text-primary">Register a farm parcel</h2><p className="text-sm text-text-secondary">Map the field or save an explicitly approximate location. Optional land details can be added now or later.</p></div></div>
        <button type="button" aria-label="Close farm registration" onClick={requestClose} disabled={isSubmitting} className="rounded-lg p-2 text-text-secondary hover:bg-surface"><X className="h-5 w-5" /></button>
      </div>
      <ol className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4">{steps.map((label, index) => <li key={label} aria-current={step === index ? 'step' : undefined} className={`rounded-lg border px-3 py-2 text-xs ${step === index ? 'border-primary bg-primary/10 font-semibold text-primary' : 'border-border text-text-secondary'}`}><span className="mr-2">{index + 1}.</span>{label}</li>)}</ol>
      {errorMessage && <div role="alert" className="mb-5 rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{errorMessage}</div>}

      <form onSubmit={(event) => void saveFarm(event)}>
        {step === 0 && <section className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Farm / parcel name *" value={parcelName} onChange={setParcelName} placeholder="e.g. North field" />
          <label className="block text-sm font-medium text-text-secondary">State<select value={state} onChange={(event) => setState(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary">{INDIAN_STATES.map((name) => <option key={name}>{name}</option>)}</select></label>
          <TextInput label="District" value={district} onChange={setDistrict} />
          <TextInput label="Taluk" value={taluk} onChange={setTaluk} />
          <TextInput label="Village" value={village} onChange={setVillage} />
          <TextInput label="PIN code" value={pinCode} onChange={setPinCode} />
          <TextInput label="Farmer-reported area (acres, optional)" value={manualArea} onChange={setManualArea} type="number" min="0" step="0.01" />
          <TextInput label="Land record reference (optional)" value={landRecordReference} onChange={setLandRecordReference} />
          <label className="block text-sm font-medium text-text-secondary sm:col-span-2">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label>
        </section>}

        {step === 1 && <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-semibold text-text-primary">Select the location and draw the field outline</h3><p className="text-xs text-text-secondary">{drawing ? `Boundary drawing is active: tap around the field to add vertices (${points.length} added).` : editing ? 'Boundary editing is active: tap the map to add a vertex, drag a vertex to move it, or double-click one to remove it.' : 'Map shows India until you choose a location. Tap once to set an approximate location, or use search/GPS. Choose Draw boundary to add outline points.'}</p></div><div className="flex flex-wrap gap-2">
            {!drawing && points.length === 0 && <button type="button" onClick={() => { setDrawing(true); setEditing(false); setBoundaryConfirmed(false); }} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground">Draw boundary</button>}
            {drawing && <button type="button" disabled={points.length < 3} onClick={() => { setDrawing(false); setEditing(true); setBoundaryConfirmed(true); setLocationAccuracy('boundary'); }} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">Finish boundary ({points.length} points)</button>}
            {!drawing && points.length > 0 && <button type="button" onClick={() => setEditing((current) => !current)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary">{editing ? 'Stop editing' : 'Edit vertices'}</button>}
            {points.length > 0 && <button type="button" onClick={() => { setPoints([]); setBoundaryConfirmed(false); setEditing(false); setAreaPreview(null); }} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary">Delete and redraw</button>}
          </div></div>
          <FarmBoundaryMap points={points} center={center} zoom={latitude && longitude ? 14 : 5} showCenterMarker={Boolean(latitude && longitude)} drawMode={drawing} editMode={editing && !drawing} onAddPoint={addVertex} onMapLocationSelected={acceptMapLocation} onMovePoint={moveVertex} onRemovePoint={removeVertex} onSearchResult={acceptSearch} onGpsPoint={acceptGps} showSearch />
          <div className="grid gap-3 sm:grid-cols-2"><TextInput label="Latitude (approximate point is allowed)" value={latitude} onChange={(value) => { setLatitude(value); setLocationAccuracy('approximate'); if (value && Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 90) setCenter([Number(value), center[1]]); }} type="number" step="any" placeholder="e.g. 12.9716" /><TextInput label="Longitude" value={longitude} onChange={(value) => { setLongitude(value); setLocationAccuracy('approximate'); if (value && Number.isFinite(Number(value)) && Math.abs(Number(value)) <= 180) setCenter([center[0], Number(value)]); }} type="number" step="any" placeholder="e.g. 77.5946" /></div>
          {latitude && longitude && <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-text-secondary"><span>Selected {locationAccuracy === 'gps' ? 'GPS' : 'approximate'} point: <strong className="text-text-primary">{latitude}, {longitude}</strong></span><button type="button" onClick={() => { setLatitude(''); setLongitude(''); setCenter(DEFAULT_CENTER); setLocationAccuracy('approximate'); }} className="font-semibold text-primary underline">Clear location point</button></div>}
          <div className="rounded-lg border border-border bg-surface/40 p-3 text-xs text-text-secondary">{areaPreview ? <>PostGIS calculated: <strong className="text-text-primary">{areaPreview.areaAcres.toFixed(3)} acres</strong> · {areaPreview.areaHectares.toFixed(3)} ha · {Math.round(areaPreview.areaSqm).toLocaleString()} m². Centroid {areaPreview.centroid.latitude.toFixed(6)}, {areaPreview.centroid.longitude.toFixed(6)}.</> : boundaryConfirmed ? areaPreviewError || 'Calculating boundary area…' : latitude && longitude ? 'This point-only registration will be labelled approximate; it is not a farm boundary.' : 'An approximate point can be entered if you cannot map the land boundary.'}</div>
          <p className="text-[11px] text-text-secondary">A saved satellite basemap is only visual context. NDVI will use Sentinel-2 spectral bands, never these displayed map tiles.</p>
        </section>}

        {step === 2 && <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-text-secondary">Soil type<select value={soilType} onChange={(event) => setSoilType(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary">{SOIL_TYPES.map((name) => <option key={name}>{name}</option>)}</select></label>
            {soilType === 'Other' && <TextInput label="Describe soil type" value={soilOther} onChange={setSoilOther} />}
            <label className="block text-sm font-medium text-text-secondary">Ownership / operation<select value={ownershipStatus} onChange={(event) => setOwnershipStatus(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"><option value="">Not specified</option>{['Owned', 'Leased', 'Shared', 'Managed', 'Other'].map((name) => <option key={name}>{name}</option>)}</select></label>
            <label className="block text-sm font-medium text-text-secondary">Terrain<select value={terrain} onChange={(event) => setTerrain(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"><option value="">Not specified</option>{['Flat', 'Slightly sloping', 'Moderately sloping', 'Steep'].map((name) => <option key={name}>{name}</option>)}</select></label>
          </div>
          <div><h3 className="mb-2 text-sm font-semibold text-text-primary">Optional soil readings</h3><p className="mb-3 text-xs text-text-secondary">These are recorded as farmer-entered, unverified values. Do not treat them as laboratory results.</p><div className="grid gap-3 sm:grid-cols-3">{Object.entries(soilMeasurements).map(([key, value]) => <TextInput key={key} label={key === 'ph' ? 'pH' : key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)} value={value} onChange={(next) => setSoilMeasurements((current) => ({ ...current, [key]: next }))} type="number" step="any" />)}</div></div>
          <div><h3 className="mb-2 text-sm font-semibold text-text-primary">Irrigation sources</h3><div className="flex flex-wrap gap-2">{IRRIGATION_TYPES.map((name) => <button key={name} type="button" aria-pressed={irrigationSources.includes(name)} className={toggleClass(irrigationSources.includes(name))} onClick={() => updateChoice(irrigationSources, setIrrigationSources, name)}>{name}</button>)}</div></div>
          <div><h3 className="mb-2 text-sm font-semibold text-text-primary">Water resources</h3><div className="flex flex-wrap gap-2">{['Borewell available', 'Open well available', 'Farm pond', 'Canal access'].map((name) => <button key={name} type="button" aria-pressed={waterResources.includes(name)} className={toggleClass(waterResources.includes(name))} onClick={() => updateChoice(waterResources, setWaterResources, name)}>{name}</button>)}</div></div>
          <div className="grid gap-4 sm:grid-cols-2">{['cultivableAcres', 'nonCultivableAcres', 'fallowAcres'].map((key) => <TextInput key={key} label={`${key.replace('Acres', '').replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)} area (acres, optional)`} value={areaBreakdown[key as keyof typeof areaBreakdown]} onChange={(value) => setAreaBreakdown((current) => ({ ...current, [key]: value }))} type="number" step="0.01" min="0" />)}<label className="block text-sm font-medium text-text-secondary">Seasonal water availability<select value={seasonalWater} onChange={(event) => setSeasonalWater(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"><option value="">Not specified</option>{['Year-round', 'Seasonal', 'Limited', 'Unknown'].map((name) => <option key={name}>{name}</option>)}</select></label></div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4"><h3 className="font-semibold text-text-primary">Crop cycles are added after the field is saved</h3><p className="mt-1 text-xs text-text-secondary">Open the farm’s details to add the crop you are planting, enter its sowing date, generate the crop calendar, and record manual field conditions. This keeps each season linked to the right field and dates.</p></div>
          <div className="grid gap-4 sm:grid-cols-2"><TextInput label="Drainage observations" value={drainage} onChange={setDrainage} /><TextInput label="Waterlogging observations" value={waterlogging} onChange={setWaterlogging} /><TextInput label="Erosion observations" value={erosion} onChange={setErosion} /><TextInput label="Cropping pattern / intercropping" value={croppingPattern} onChange={setCroppingPattern} /><label className="block text-sm font-medium text-text-secondary">Farming method<select value={farmingMethod} onChange={(event) => setFarmingMethod(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"><option value="">Not specified</option>{['Organic', 'Conventional', 'Mixed', 'Other'].map((name) => <option key={name}>{name}</option>)}</select></label></div>
          <TextInput label="Previous crops (optional)" value={previousCrops} onChange={setPreviousCrops} placeholder="Separate crops with commas" />
        </section>}

        {step === 3 && <section className="space-y-4">
          <h3 className="text-lg font-semibold text-text-primary">Review farm parcel</h3>
          <dl className="grid gap-3 rounded-xl border border-border bg-surface/40 p-4 sm:grid-cols-2">{[
            ['Name', parcelName], ['Village / Taluk', [village, taluk].filter(Boolean).join(' / ') || 'Not supplied'], ['District / State', [district, state].filter(Boolean).join(', ')],
            ['Boundary area', areaPreview ? `${areaPreview.areaAcres.toFixed(3)} acres (${areaPreview.areaHectares.toFixed(3)} ha), calculated by PostGIS` : 'No boundary; location will be approximate'],
            ['Farmer-reported area', manualArea ? `${manualArea} acres (kept separately from calculated area)` : 'Not supplied'],
            ['Soil', soilType === 'Other' ? soilOther || 'Other' : soilType], ['Irrigation', irrigationSources.join(', ') || 'Not supplied'], ['Ownership', ownershipStatus || 'Not supplied'],
            ['Previous crops', previousCrops || 'Not supplied'],
            ['Terrain', terrain || 'Not supplied'], ['Location accuracy', boundary ? 'Boundary and derived centroid' : locationAccuracy === 'gps' ? 'GPS point' : 'Approximate point'],
          ].map(([label, value]) => <div key={label}><dt className="text-xs text-text-secondary">{label}</dt><dd className="mt-1 text-sm text-text-primary">{value}</dd></div>)}</dl>
          {boundary && <FarmBoundaryMap points={points} center={center} editMode={false} savedBoundaries={[boundary]} />}
          <p className="text-xs text-text-secondary">PostGIS-derived area, farmer-reported area and soil inputs are stored separately. NDVI and verified laboratory measurements will only appear when real provider or lab data is connected.</p>
        </section>}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <button type="button" onClick={() => step === 0 ? requestClose() : setStep((current) => Math.max(0, current - 1))} disabled={isSubmitting} className="rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-primary">{step === 0 ? 'Cancel' : 'Back'}</button>
          <div className="flex gap-2">{step < 3 ? <button type="button" onClick={() => { setErrorMessage(''); setStep((current) => current + 1); }} disabled={isSubmitting || (step === 0 && !parcelName.trim())} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">Continue</button> : <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}{isSubmitting ? 'Saving…' : 'Confirm and save farm'}</button>}</div>
        </div>
      </form>
    </div>
  </div>;
}
