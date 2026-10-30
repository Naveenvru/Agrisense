import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Loader2, Plus, Sprout, ClipboardList, Check, Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/axios';
import { FarmService, type CropConditionRecord, type FarmCropCycle } from '../services/FarmService';

interface CropCycleManagerProps {
  parcelId: string;
  farmName: string;
  onChanged: () => void;
}

type CropCatalogEntry = { id: string; cropName: string; season?: string; durationDays?: number | null };
type CropCycleDetails = { events: any[]; observations: CropConditionRecord[]; calendarError?: string };

const dateOnly = (value?: string | null) => value ? new Date(value).toLocaleDateString() : 'Not recorded';
const errorText = (error: any) => error?.response?.data?.message || (error?.message === 'Network Error'
  ? `Cannot reach the AgriSense API at ${apiClient.defaults.baseURL}. Check that the backend is running and reachable.`
  : error?.message || 'Could not save this information.');

export function CropCycleManager({ parcelId, farmName, onChanged }: CropCycleManagerProps) {
  const [catalog, setCatalog] = useState<CropCatalogEntry[]>([]);
  const [cycles, setCycles] = useState<FarmCropCycle[]>([]);
  const [details, setDetails] = useState<Record<string, CropCycleDetails>>({});
  const [loading, setLoading] = useState(true);
  const [showCropForm, setShowCropForm] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [variety, setVariety] = useState('');
  const [sowingDate, setSowingDate] = useState('');
  const [savingCrop, setSavingCrop] = useState(false);
  const [savingConditionFor, setSavingConditionFor] = useState<string | null>(null);
  const [deletingCropId, setDeletingCropId] = useState<string | null>(null);
  const [regeneratingCalendarFor, setRegeneratingCalendarFor] = useState<string | null>(null);
  const [conditionFormFor, setConditionFormFor] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [condition, setCondition] = useState({ label: '', stage: '', soilMoisture: '', airTemperature: '', rainfall: '', irrigation: '', symptoms: '', notes: '' });
  const calendarAutoAttempted = useRef(new Set<string>());

  const selectedCrop = useMemo(() => catalog.find((crop) => crop.id === selectedCropId), [catalog, selectedCropId]);
  const expectedHarvestDate = useMemo(() => {
    if (!sowingDate || !selectedCrop?.durationDays) return '';
    const date = new Date(`${sowingDate}T00:00:00`);
    date.setDate(date.getDate() + selectedCrop.durationDays);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }, [selectedCrop, sowingDate]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [catalogResult, cyclesResult] = await Promise.all([FarmService.getCropCatalog(), FarmService.getCropCycles(parcelId)]);
      const mappedCatalog = catalogResult.map((crop: any) => ({ id: String(crop.id), cropName: crop.cropName, season: crop.season, durationDays: crop.durationDays == null ? null : Number(crop.durationDays) }));
      setCatalog(mappedCatalog);
      setCycles(cyclesResult);
      const detailResults = await Promise.all(cyclesResult.map(async (cycle) => {
        const [events, observations] = await Promise.allSettled([FarmService.getCropCalendar(cycle.id), FarmService.getCropConditions(cycle.id)]);
        return [cycle.id, {
          events: events.status === 'fulfilled' ? events.value : [],
          observations: observations.status === 'fulfilled' ? observations.value : [],
          calendarError: events.status === 'rejected' ? errorText(events.reason) : undefined,
        }] as const;
      }));
      const loadedDetails = Object.fromEntries(detailResults);
      setDetails(loadedDetails);
      // Older crop cycles may predate automatic calendar generation. Try once when the
      // farmer opens the field, using Gemini first and verified templates as fallback.
      for (const cycle of cyclesResult) {
        const cycleDetails = loadedDetails[cycle.id];
        if (cycle.status !== 'active' || cycleDetails.events.length || cycleDetails.calendarError || calendarAutoAttempted.current.has(cycle.id)) continue;
        calendarAutoAttempted.current.add(cycle.id);
        try {
          const generation = await FarmService.regenerateCropCalendar(cycle.id);
          if (generation.updated) {
            const events = await FarmService.getCropCalendar(cycle.id);
            setDetails((current) => ({ ...current, [cycle.id]: { ...current[cycle.id], events } }));
          } else if (generation.warning) {
            setDetails((current) => ({ ...current, [cycle.id]: { ...current[cycle.id], calendarError: generation.warning } }));
          }
        } catch (cause: any) {
          setDetails((current) => ({ ...current, [cycle.id]: { ...current[cycle.id], calendarError: errorText(cause) } }));
        }
      }
    } catch (cause: any) {
      setError(errorText(cause));
    } finally {
      setLoading(false);
    }
  }, [parcelId]);

  useEffect(() => { void load(); }, [load]);

  const startCrop = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedCropId || !sowingDate) return;
    setSavingCrop(true);
    setError('');
    setFeedback('');
    try {
      const result = await FarmService.createCropCycle({
        parcelId, cropId: selectedCropId, cropVariety: variety.trim() || undefined,
        sowingDate, expectedHarvestDate: expectedHarvestDate || undefined,
      });
      setShowCropForm(false);
      setSelectedCropId(''); setVariety(''); setSowingDate('');
      setFeedback(result.calendarError
        ? `${result.crop.cropName} was added to ${farmName}. ${result.calendarError}`
        : `${result.crop.cropName} was added to ${farmName}; ${result.calendarCount} crop-calendar tasks were scheduled.`);
      await load();
      onChanged();
    } catch (cause: any) {
      setError(errorText(cause));
    } finally {
      setSavingCrop(false);
    }
  };

  const saveCondition = async (event: React.FormEvent, cycleId: string) => {
    event.preventDefault();
    if (!condition.label.trim()) return;
    setSavingConditionFor(cycleId); setError(''); setFeedback('');
    const optionalNumber = (value: string) => value.trim() === '' ? undefined : Number(value);
    try {
      const result = await FarmService.createCropCondition(cycleId, {
        conditionLabel: condition.label.trim(), growthStage: condition.stage.trim() || undefined,
        soilMoisturePercent: optionalNumber(condition.soilMoisture), airTemperatureC: optionalNumber(condition.airTemperature),
        rainfallMm: optionalNumber(condition.rainfall), irrigationStatus: condition.irrigation.trim() || undefined,
        symptomsAndSigns: condition.symptoms.trim() || undefined, notes: condition.notes.trim() || undefined,
      });
      setCondition({ label: '', stage: '', soilMoisture: '', airTemperature: '', rainfall: '', irrigation: '', symptoms: '', notes: '' });
      setConditionFormFor(null);
      setFeedback(result.calendar?.updated
        ? 'Field condition saved. Gemini updated upcoming calendar tasks using this observation.'
        : `Field condition saved.${result.calendar?.warning ? ` ${result.calendar.warning}` : ' It will be included in your farm context when you ask AgriSense AI.'}`);
      await load();
    } catch (cause: any) {
      setError(errorText(cause));
    } finally {
      setSavingConditionFor(null);
    }
  };

  const finishCycle = async (cycle: FarmCropCycle) => {
    if (!window.confirm(`Mark ${cycle.cropName} on ${farmName} as harvested/completed? Its crop calendar will move to history.`)) return;
    setError('');
    try {
      await FarmService.updateCropCycle(cycle.id, { status: 'harvested' });
      setFeedback(`${cycle.cropName} crop cycle marked complete.`);
      await load();
      onChanged();
    } catch (cause: any) {
      setError(errorText(cause));
    }
  };

  const deleteCycle = async (cycle: FarmCropCycle) => {
    if (!window.confirm(`Delete ${cycle.cropName} from ${farmName}? This permanently removes this crop cycle, its calendar tasks, and all saved field-condition records.`)) return;
    setDeletingCropId(cycle.id); setError(''); setFeedback('');
    try {
      await FarmService.deleteCropCycle(cycle.id);
      setFeedback(`${cycle.cropName} and its crop-cycle records were deleted. You can now add a new crop to this field.`);
      await load();
      onChanged();
    } catch (cause: any) {
      setError(errorText(cause));
    } finally {
      setDeletingCropId(null);
    }
  };

  const regenerateCalendar = async (cycle: FarmCropCycle) => {
    setRegeneratingCalendarFor(cycle.id); setError(''); setFeedback('');
    try {
      const result = await FarmService.regenerateCropCalendar(cycle.id);
      setFeedback(result.updated
        ? result.source === 'templates'
          ? `${result.warning || 'Loaded verified crop-template tasks.'} ${result.taskCount} calendar items are available.`
          : `Gemini updated ${result.taskCount} upcoming calendar tasks using the saved crop details and field conditions.`
        : result.warning || 'Gemini could not update the calendar. Existing tasks were kept.');
      await load();
    } catch (cause: any) {
      setError(errorText(cause));
    } finally {
      setRegeneratingCalendarFor(null);
    }
  };

  return <section className="space-y-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div><h3 className="font-semibold text-text-primary">Crop cycles & field conditions</h3><p className="mt-1 text-xs text-text-secondary">Add each planting as a separate crop cycle for {farmName}. Previous seasons remain in this field’s history.</p></div>
      <button type="button" onClick={() => { setShowCropForm((open) => !open); setError(''); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"><Plus className="h-4 w-4" />Add crop to this field</button>
    </div>

    {error && <p role="alert" className="rounded-lg border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p>}
    {feedback && <p role="status" className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-text-primary">{feedback}</p>}

    {showCropForm && <form onSubmit={(event) => void startCrop(event)} className="space-y-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
      <h4 className="font-semibold text-text-primary">Start a new crop cycle</h4>
      <label className="block text-sm text-text-secondary">Crop<select required value={selectedCropId} onChange={(event) => setSelectedCropId(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary"><option value="">Choose from crop catalog</option>{catalog.map((crop) => <option key={crop.id} value={crop.id}>{crop.cropName}{crop.season ? ` · ${crop.season}` : ''}</option>)}</select></label>
      <div className="grid gap-3 sm:grid-cols-2"><label className="block text-sm text-text-secondary">Variety (optional)<input value={variety} onChange={(event) => setVariety(event.target.value)} maxLength={255} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" placeholder="e.g. local seed variety" /></label><label className="block text-sm text-text-secondary">Sowing / planting date<input required type="date" value={sowingDate} onChange={(event) => setSowingDate(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label></div>
      <p className="text-xs text-text-secondary">{expectedHarvestDate ? `Expected harvest is estimated from the crop catalog duration: ${dateOnly(expectedHarvestDate)}.` : 'Expected harvest can be added later if no crop duration is available in the catalog.'} Gemini creates the initial schedule when AI assistance is enabled. New field observations refresh upcoming tasks; verified crop templates are used if Gemini is unavailable.</p>
      <div className="flex justify-end gap-2"><button type="button" onClick={() => setShowCropForm(false)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary">Cancel</button><button type="submit" disabled={savingCrop || !selectedCropId || !sowingDate} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{savingCrop ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sprout className="h-4 w-4" />}Save crop & build calendar</button></div>
    </form>}

    {loading ? <div className="flex items-center gap-2 py-6 text-sm text-text-secondary"><Loader2 className="h-4 w-4 animate-spin" />Loading crop cycles…</div>
      : cycles.length === 0 ? <div className="rounded-xl border border-dashed border-border p-5 text-sm text-text-secondary">No crop cycles are recorded for this field yet. Add the crop you are planting to create its calendar and condition log.</div>
      : <div className="space-y-3">{cycles.map((cycle) => {
        const cycleDetails = details[cycle.id] || { events: [], observations: [] };
        return <article key={cycle.id} className="space-y-3 rounded-xl border border-border bg-background/70 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="rounded-lg bg-primary/10 p-2 text-primary"><Sprout className="h-5 w-5" /></span><div><h4 className="font-semibold text-text-primary">{cycle.cropName}{cycle.variety ? ` · ${cycle.variety}` : ''}</h4><p className="mt-1 text-xs text-text-secondary">{farmName} · Planted {dateOnly(cycle.sowingDate)} · Harvest {dateOnly(cycle.expectedHarvestDate)}</p></div></div><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${cycle.status === 'active' ? 'bg-success/10 text-success' : 'bg-surface text-text-secondary'}`}>{cycle.status === 'active' ? 'Current crop' : cycle.status}</span><button type="button" disabled={deletingCropId === cycle.id} onClick={() => void deleteCycle(cycle)} className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 px-2.5 py-1.5 text-[11px] font-semibold text-error disabled:opacity-50" title="Delete crop cycle, calendar, and conditions">{deletingCropId === cycle.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}Delete crop</button></div></div>
          {cycle.status === 'active' && <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setConditionFormFor(conditionFormFor === cycle.id ? null : cycle.id)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary">{conditionFormFor === cycle.id ? 'Close condition form' : 'Add field condition'}</button><button type="button" disabled={regeneratingCalendarFor === cycle.id} onClick={() => void regenerateCalendar(cycle)} className="inline-flex items-center gap-2 rounded-lg border border-primary/30 px-3 py-2 text-xs font-semibold text-primary disabled:opacity-50">{regeneratingCalendarFor === cycle.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}Update calendar with Gemini</button><button type="button" onClick={() => void finishCycle(cycle)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary">Mark crop harvested</button></div>}

          {conditionFormFor === cycle.id && cycle.status === 'active' && <form onSubmit={(event) => void saveCondition(event, cycle.id)} className="space-y-3 rounded-lg border border-border bg-surface/40 p-3">
            <h5 className="text-sm font-semibold text-text-primary">Manual field observation <span className="font-normal text-text-secondary">(farmer-reported; no sensors connected)</span></h5>
            <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs text-text-secondary">Overall condition *<input required maxLength={120} value={condition.label} onChange={(event) => setCondition({ ...condition, label: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" placeholder="Healthy, water stress, yellowing…" /></label><label className="block text-xs text-text-secondary">Growth stage<input value={condition.stage} onChange={(event) => setCondition({ ...condition, stage: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" placeholder="Seedling, flowering…" /></label></div>
            <div className="grid gap-3 sm:grid-cols-3"><label className="block text-xs text-text-secondary">Soil moisture (%)<input type="number" min="0" max="100" step="0.1" value={condition.soilMoisture} onChange={(event) => setCondition({ ...condition, soilMoisture: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label><label className="block text-xs text-text-secondary">Air temperature (°C)<input type="number" min="-30" max="70" step="0.1" value={condition.airTemperature} onChange={(event) => setCondition({ ...condition, airTemperature: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label><label className="block text-xs text-text-secondary">Recent rainfall (mm)<input type="number" min="0" max="1000" step="0.1" value={condition.rainfall} onChange={(event) => setCondition({ ...condition, rainfall: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label></div>
            <label className="block text-xs text-text-secondary">Irrigation / water status<input value={condition.irrigation} onChange={(event) => setCondition({ ...condition, irrigation: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" placeholder="Irrigated today, waiting for rain…" /></label>
            <label className="block text-xs text-text-secondary">Visible symptoms or signs<textarea rows={2} value={condition.symptoms} onChange={(event) => setCondition({ ...condition, symptoms: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" placeholder="Describe only what you observed" /></label>
            <label className="block text-xs text-text-secondary">Additional notes<textarea rows={2} value={condition.notes} onChange={(event) => setCondition({ ...condition, notes: event.target.value })} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" /></label>
            <div className="flex justify-end"><button type="submit" disabled={savingConditionFor === cycle.id || !condition.label.trim()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{savingConditionFor === cycle.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Save observation</button></div>
          </form>}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-surface/40 p-3"><h5 className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-primary"><CalendarDays className="h-4 w-4 text-primary" />Crop calendar · {cycleDetails.events.length} tasks</h5>{cycleDetails.calendarError && <p role="alert" className="mb-2 rounded border border-error/30 bg-error/10 p-2 text-xs text-error">Could not load calendar: {cycleDetails.calendarError}</p>}{cycleDetails.events.length ? <ul className="max-h-80 space-y-2 overflow-y-auto pr-1">{cycleDetails.events.map((item) => <li key={item.id} className="border-b border-border/60 pb-2 text-xs last:border-0"><span className="font-medium text-text-primary">{dateOnly(item.eventDate)} · {item.taskName}</span><span className="ml-2 rounded bg-surface px-1.5 py-0.5 text-[10px] text-text-secondary">{item.sourceConditionId ? 'Field condition' : item.generatedByAi ? 'Gemini' : 'Template'}</span><span className="mt-1 block text-text-secondary">{item.taskDescription || 'No description provided.'}</span></li>)}</ul> : <div><p className="text-xs text-text-secondary">{cycleDetails.calendarError ? 'Calendar tasks could not be loaded. Use the update button to retry.' : cycle.status === 'active' ? 'No tasks have been generated yet. Use “Update calendar with Gemini” to create a schedule or load verified crop templates.' : 'No saved calendar tasks for this cycle.'}</p></div>}</div>
            <div className="rounded-lg bg-surface/40 p-3"><h5 className="mb-2 flex items-center gap-2 text-xs font-semibold text-text-primary"><ClipboardList className="h-4 w-4 text-primary" />Field condition history</h5>{cycleDetails.observations.length ? <ul className="max-h-56 space-y-3 overflow-y-auto">{cycleDetails.observations.slice(0, 5).map((observation, index) => <li key={observation.id || `${observation.observedAt}-${index}`} className="border-b border-border/60 pb-2 last:border-0"><p className="text-sm font-medium text-text-primary">{observation.conditionLabel}</p><p className="mt-1 text-[11px] text-text-secondary">{new Date(observation.observedAt).toLocaleString()}{observation.growthStage ? ` · ${observation.growthStage}` : ''}</p><p className="mt-1 text-xs text-text-secondary">{[observation.soilMoisturePercent != null ? `Soil moisture ${observation.soilMoisturePercent}%` : '', observation.airTemperatureC != null ? `${observation.airTemperatureC}°C` : '', observation.rainfallMm != null ? `Rain ${observation.rainfallMm} mm` : '', observation.irrigationStatus, observation.symptomsAndSigns, observation.notes].filter(Boolean).join(' · ')}</p></li>)}</ul> : <p className="text-xs text-text-secondary">No farmer-reported conditions recorded for this crop cycle.</p>}</div>
          </div>
        </article>;
      })}</div>}
    <p className="text-[11px] text-text-secondary">Schedules are generated by Gemini when AI assistance is enabled, with configured crop templates as fallback. Manual observations are farmer-reported, not sensor measurements or diagnoses.</p>
  </section>;
}
