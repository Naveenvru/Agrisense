import { useEffect, useMemo, useRef, useState } from 'react';
import L, { type LatLngExpression } from 'leaflet';
import { CircleMarker, MapContainer, Marker, Polygon, Popup, ScaleControl, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { Search, LocateFixed, Maximize2, Minimize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export type FarmBoundary = { type: 'Polygon'; coordinates: number[][][]; id?: string; label?: string; detail?: string };
type Point = [latitude: number, longitude: number];
type TileMode = 'street' | 'satellite' | 'terrain';

const TILE_LAYERS: Record<TileMode, { url: string; attribution: string; maxZoom: number }> = {
  street: {
    url: import.meta.env.VITE_STREET_TILE_URL || 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: import.meta.env.VITE_STREET_TILE_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    maxZoom: 19,
  },
  satellite: {
    url: import.meta.env.VITE_SATELLITE_TILE_URL || 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: import.meta.env.VITE_SATELLITE_TILE_ATTRIBUTION || 'Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
    maxZoom: 19,
  },
  terrain: {
    url: import.meta.env.VITE_TERRAIN_TILE_URL || 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: import.meta.env.VITE_TERRAIN_TILE_ATTRIBUTION || 'Sources: Esri, DeLorme, USGS, FAO, and GIS User Community',
    maxZoom: 19,
  },
};

function MapClickHandler({ active, onClick, onLocationClick }: { active: boolean; onClick?: (point: Point) => void; onLocationClick?: (point: Point) => void }) {
  useMapEvents({ click: (event) => {
    const point: Point = [event.latlng.lat, event.latlng.lng];
    if (active) onClick?.(point);
    else onLocationClick?.(point);
  } });
  return null;
}

function Recenter({ center, zoom, boundsPoints = [], refresh = false }: { center: Point; zoom?: number; boundsPoints?: Point[]; refresh?: boolean }) {
  const map = useMap();
  // Use a value key because callers commonly construct savedLocations inline. Depending on
  // that array directly refits the map after every render, including every boundary vertex.
  const boundsKey = boundsPoints.map(([lat, lng]) => `${lat},${lng}`).join(';');
  useEffect(() => {
    if (boundsPoints.length > 1) map.fitBounds(boundsPoints, { padding: [24, 24], maxZoom: 14 });
    else map.setView(center, zoom ?? Math.max(map.getZoom(), 14));
    const timer = window.setTimeout(() => map.invalidateSize(), 100);
    return () => window.clearTimeout(timer);
  // boundsKey changes only when coordinates change, not when an equivalent array is recreated.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center[0], center[1], map, zoom, boundsKey, refresh]);
  return null;
}

function vertexIcon(index: number) {
  return L.divIcon({
    className: 'farm-boundary-vertex',
    html: `<span>${index + 1}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

interface FarmBoundaryMapProps {
  points: Point[];
  center: Point;
  savedBoundaries?: FarmBoundary[];
  savedLocations?: Array<{ point: Point; label: string; detail?: string }>;
  drawMode?: boolean;
  editMode?: boolean;
  onAddPoint?: (point: Point) => void;
  onMovePoint?: (index: number, point: Point) => void;
  onRemovePoint?: (index: number) => void;
  onSearchResult?: (point: Point, label: string) => void;
  onGpsPoint?: (point: Point) => void;
  onMapLocationSelected?: (point: Point) => void;
  showCenterMarker?: boolean;
  zoom?: number;
  showSearch?: boolean;
  onSavedBoundaryClick?: (id: string) => void;
}

export function FarmBoundaryMap({
  points,
  center,
  savedBoundaries = [],
  savedLocations = [],
  drawMode = false,
  editMode = false,
  onAddPoint,
  onMovePoint,
  onRemovePoint,
  onSearchResult,
  onGpsPoint,
  onMapLocationSelected,
  showCenterMarker = false,
  zoom,
  showSearch = false,
  onSavedBoundaryClick,
}: FarmBoundaryMapProps) {
  const [tileMode, setTileMode] = useState<TileMode>('street');
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [gpsError, setGpsError] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ label: string; point: Point }>>([]);
  const [selectedSearchLabel, setSelectedSearchLabel] = useState('');
  const lastSearchAt = useRef(0);
  const mapShell = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const tile = TILE_LAYERS[tileMode];
  const mapCenter: LatLngExpression = center;
  const boundaryPositions = useMemo(() => points.map(([lat, lng]) => [lat, lng] as LatLngExpression), [points]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement === mapShell.current);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement === mapShell.current) await document.exitFullscreen();
      else await mapShell.current?.requestFullscreen();
    } catch { /* Full-screen is optional; the embedded map remains usable. */ }
  };

  const selectSearchResult = (result: { label: string; point: Point }) => {
    setSelectedSearchLabel(result.label);
    onSearchResult?.(result.point, result.label);
  };

  const showSearchResults = (results: Array<{ label: string; point: Point }>) => {
    setSearchResults(results);
    if (!results.length) {
      setSelectedSearchLabel('');
      setSearchError('No location matches found. Try village, taluk, district, or coordinates.');
      return;
    }
    setSearchError('');
    // Search immediately takes the map to its best match. Other results remain available
    // so the farmer can correct an ambiguous village or district name.
    selectSearchResult(results[0]);
  };

  const searchLocation = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!query.trim()) return;
    if (Date.now() - lastSearchAt.current < 1000) {
      setSearchError('Please wait a moment before searching again.');
      return;
    }
    lastSearchAt.current = Date.now();
    setSearching(true);
    setSearchError('');
    setSearchResults([]);
    setSelectedSearchLabel('');
    try {
      const cacheKey = `agrisense:nominatim:${query.trim().toLowerCase()}`;
      const cached = window.sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as Array<{ label: string; point: Point }>;
        showSearchResults(parsed);
        setSearching(false);
        return;
      }
      // User-triggered one-shot search only; do not turn public Nominatim into autocomplete.
      const params = new URLSearchParams({ q: query.trim(), format: 'jsonv2', limit: '5', addressdetails: '1' });
      const baseUrl = import.meta.env.VITE_GEOCODING_URL || 'https://nominatim.openstreetmap.org/search';
      const response = await fetch(`${baseUrl}?${params.toString()}`, { headers: { Accept: 'application/json' }, referrerPolicy: 'strict-origin-when-cross-origin' });
      if (!response.ok) throw new Error('Location search is unavailable. Try a more specific place or enter coordinates.');
      const results = await response.json();
      const mapped = results.map((item: any) => ({
        point: [Number(item.lat), Number(item.lon)] as Point,
        label: String(item.display_name || query.trim()),
      })).filter((item: { point: Point }) => item.point.every(Number.isFinite));
      window.sessionStorage.setItem(cacheKey, JSON.stringify(mapped));
      showSearchResults(mapped);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Location search failed.');
    } finally {
      setSearching(false);
    }
  };

  const detectGps = () => {
    setGpsError('');
    if (!navigator.geolocation) {
      setGpsError('This browser does not support GPS location.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onGpsPoint?.([coords.latitude, coords.longitude]),
      () => setGpsError('GPS access was unavailable or denied. You can search or enter a location instead.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
    );
  };

  return <section className="space-y-3" aria-label="Farm boundary map">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Map layer">
        {(['street', 'satellite', 'terrain'] as const).map((mode) => <button key={mode} type="button" onClick={() => setTileMode(mode)} aria-pressed={tileMode === mode} className={`rounded-lg border px-3 py-2 text-xs font-semibold capitalize ${tileMode === mode ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-surface text-text-secondary'}`}>{mode}</button>)}
      </div>
      <button type="button" onClick={() => void toggleFullscreen()} aria-label={isFullscreen ? 'Exit full-screen map' : 'View map full-screen'} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary"><span aria-hidden="true">{isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}</span>{isFullscreen ? 'Exit full screen' : 'Full screen'}</button>
      {showSearch && <button type="button" onClick={detectGps} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-text-primary"><LocateFixed className="h-4 w-4" />Use GPS location</button>}
    </div>
    {showSearch && <form onSubmit={(event) => void searchLocation(event)} className="space-y-2">
      <div className="flex gap-2">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search village, taluk, district, PIN, or coordinates" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary" />
        <button type="submit" disabled={searching || !query.trim()} className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"><Search className="h-4 w-4" />{searching ? 'Searching…' : 'Search'}</button>
      </div>
      <p className="text-[11px] text-text-secondary">Search stays on this map and moves to the closest match. Choose another result below if needed.</p>
      {searchError && <p role="alert" className="text-xs text-error">{searchError}</p>}
      {gpsError && <p role="alert" className="text-xs text-error">{gpsError}</p>}
      {selectedSearchLabel && <p className="text-xs text-primary">Map moved to: <span className="text-text-primary">{selectedSearchLabel}</span></p>}
      {searchResults.length > 1 && <ul aria-label="Matching locations" className="max-h-32 overflow-auto rounded-lg border border-border bg-background">{searchResults.map((result, index) => <li key={`${result.point.join(',')}-${index}`}><button type="button" aria-pressed={selectedSearchLabel === result.label} className="w-full px-3 py-2 text-left text-xs text-text-primary hover:bg-surface aria-pressed:bg-primary/10" onClick={() => selectSearchResult(result)}>{result.label}{selectedSearchLabel === result.label && <span className="ml-2 text-primary">Selected</span>}</button></li>)}</ul>}
      <p className="text-[10px] text-text-secondary">Search is user-triggered via OpenStreetMap Nominatim. Attribution and usage limits apply.</p>
    </form>}
    <div ref={mapShell} className="farm-map-shell overflow-hidden rounded-xl border border-border">
      <MapContainer center={mapCenter} zoom={13} scrollWheelZoom className={`w-full ${isFullscreen ? 'h-screen' : 'h-[360px]'}`} style={{ minHeight: 320 }}>
        <TileLayer key={tileMode} url={tile.url} attribution={tile.attribution} maxZoom={tile.maxZoom} />
        <ScaleControl position="bottomleft" />
        <Recenter center={center} zoom={zoom} boundsPoints={savedLocations.map(({ point }) => point)} refresh={isFullscreen} />
        <MapClickHandler active={drawMode || editMode} onClick={onAddPoint} onLocationClick={onMapLocationSelected} />
        {savedBoundaries.map((feature, index) => feature && <Polygon key={feature.id || `saved-boundary-${index}`} positions={(feature.coordinates || []).map((ring) => ring.map(([lng, lat]) => [lat, lng] as LatLngExpression))} pathOptions={{ color: '#16a34a', weight: 3, fillOpacity: 0.18 }} eventHandlers={{ click: () => feature.id && onSavedBoundaryClick?.(feature.id) }}>
          {(feature.label || feature.detail) && <Popup><strong>{feature.label || 'Farm parcel'}</strong>{feature.detail && <><br />{feature.detail}</>}</Popup>}
        </Polygon>)}
        {savedLocations.map(({ point, label, detail }, index) => <CircleMarker key={`parcel-location-${index}`} center={point} radius={8} pathOptions={{ color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 0.95 }}><Popup><strong>{label}</strong>{detail && <><br />{detail}</>}</Popup></CircleMarker>)}
        {points.length >= 3 && <Polygon positions={boundaryPositions} pathOptions={{ color: '#f59e0b', weight: 3, dashArray: drawMode ? '8 8' : undefined, fillOpacity: 0.16 }} />}
        {points.map((point, index) => <Marker
          key={`vertex-${index}`}
          position={point}
          icon={vertexIcon(index)}
          draggable={editMode}
          eventHandlers={{
            dragend: (event) => { const at = event.target.getLatLng(); onMovePoint?.(index, [at.lat, at.lng]); },
            dblclick: () => { if (editMode) onRemovePoint?.(index); },
          }}
          title={editMode ? 'Drag to move; double-click to remove' : `Boundary point ${index + 1}`}
        />)}
        {showCenterMarker && <CircleMarker center={center} radius={6} pathOptions={{ color: '#fff', weight: 2, fillColor: '#2563eb', fillOpacity: 1 }} />}
      </MapContainer>
    </div>
    <p className="text-[10px] leading-relaxed text-text-secondary">Street map: &copy; OpenStreetMap contributors. Satellite and terrain layers: Esri and credited imagery providers. Tile availability, license terms, and usage limits depend on the provider.</p>
  </section>;
}
