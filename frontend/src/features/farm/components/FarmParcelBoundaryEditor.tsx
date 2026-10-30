import { useEffect, useMemo, useState } from 'react';
import { FarmService } from '../services/FarmService';
import type { Farm } from '../types';
import { FarmBoundaryMap, type FarmBoundary } from './FarmBoundaryMap';

type Point = [number, number];

export function FarmParcelBoundaryEditor({ farm, onUpdated }: { farm: Farm; onUpdated: () => void }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [area, setArea] = useState<{ areaAcres: number; areaHectares: number } | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const boundary = useMemo<FarmBoundary | undefined>(() => {
    if (points.length < 3) return undefined;
    const ring = points.map(([lat, lng]) => [lng, lat]);
    if (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]) ring.push([...ring[0]]);
    return { type: 'Polygon', coordinates: [ring] };
  }, [points]);

  useEffect(() => {
    const ring = farm.boundaryGeoJson?.coordinates?.[0] || [];
    setPoints(ring.slice(0, -1).map(([lng, lat]) => [lat, lng]));
    setArea(farm.calculatedAreaAcres == null ? null : { areaAcres: farm.calculatedAreaAcres, areaHectares: farm.calculatedAreaAcres * 0.404685642 });
  }, [farm.id, farm.boundaryGeoJson, farm.calculatedAreaAcres]);
  useEffect(() => {
    if (!boundary) { setArea(null); return; }
    let stale = false;
    const timer = window.setTimeout(() => void FarmService.previewBoundary(boundary).then((result) => {
      if (!stale) setArea({ areaAcres: result.areaAcres, areaHectares: result.areaHectares });
    }).catch((cause: any) => { if (!stale) { setArea(null); setError(cause.response?.data?.message || 'The boundary is not valid.'); } }), 250);
    return () => { stale = true; window.clearTimeout(timer); };
  }, [boundary]);

  const save = async () => {
    if (!boundary || points.length < 3) { setError('Add at least three boundary vertices before saving.'); return; }
    setSaving(true); setError('');
    try {
      await FarmService.updateParcel(farm.id, { boundaryGeoJson: boundary, locationAccuracy: 'boundary' });
      setEditing(false); onUpdated();
    } catch (cause: any) { setError(cause.response?.data?.message || 'Boundary could not be saved.'); }
    finally { setSaving(false); }
  };

  const center: Point = points[0] || [farm.gpsCoordinates?.latitude || 12.9716, farm.gpsCoordinates?.longitude || 77.5946];
  return <div className="space-y-3">
    <FarmBoundaryMap points={editing ? points : []} center={center} editMode={editing} savedBoundaries={!editing && farm.boundaryGeoJson ? [farm.boundaryGeoJson] : []} savedLocations={farm.gpsCoordinates ? [{ point: [farm.gpsCoordinates.latitude, farm.gpsCoordinates.longitude], label: farm.name, detail: farm.locationAccuracy === 'approximate' ? 'Approximate location' : 'Parcel centroid' }] : []}
      onAddPoint={(point) => setPoints((current) => [...current, point])}
      onMovePoint={(index, point) => setPoints((current) => current.map((entry, i) => i === index ? point : entry))}
      onRemovePoint={(index) => setPoints((current) => current.filter((_, i) => i !== index))} />
    <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-text-secondary">{farm.boundaryGeoJson ? area ? `${area.areaAcres.toFixed(3)} acres · ${area.areaHectares.toFixed(3)} ha (PostGIS)` : 'Area unavailable' : 'Point-only parcel; no boundary recorded.'}</p>
      {editing ? <div className="flex gap-2"><button type="button" onClick={() => { setPoints(farm.boundaryGeoJson?.coordinates?.[0]?.slice(0, -1).map(([lng, lat]) => [lat, lng]) || []); setEditing(false); setError(''); }} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary">Cancel</button><button type="button" disabled={saving || points.length < 3} onClick={() => void save()} className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">{saving ? 'Saving…' : 'Save boundary'}</button></div> : <button type="button" onClick={() => { setEditing(true); setError(''); }} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary">{farm.boundaryGeoJson ? 'Edit boundary' : 'Draw boundary'}</button>}
    </div>{error && <p role="alert" className="text-xs text-error">{error}</p>}{editing && <p className="text-[11px] text-text-secondary">Click to add a vertex, drag a vertex to move it, and double-click one to remove it. Changes are saved to your parcel only when you select Save boundary.</p>}
  </div>;
}
