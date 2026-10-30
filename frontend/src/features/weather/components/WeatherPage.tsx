import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { CloudOff, RefreshCw, Thermometer, Droplets, Wind, Gauge } from 'lucide-react';
import { CurrentObservation, ForecastObservation, HistoricalObservation, WeatherParcel, WeatherService } from '../services/WeatherService';
import { formatPressureHpa, formatRainfallMm, formatTemperature, formatWindSpeedMs, getCurrentLocale } from '@/features/settings/services/account-preferences';

export function WeatherPage() {
  const [parcels, setParcels] = useState<WeatherParcel[]>([]);
  const [parcelId, setParcelId] = useState('');
  const [current, setCurrent] = useState<CurrentObservation | null>(null);
  const [forecast, setForecast] = useState<ForecastObservation[]>([]);
  const [history, setHistory] = useState<HistoricalObservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (selectedId?: string) => {
    setLoading(true); setError('');
    try {
      const knownParcels = parcels.length ? parcels : await WeatherService.getParcels();
      setParcels(knownParcels);
      const withCoordinates = knownParcels.filter((parcel) => parcel.latitude != null && parcel.longitude != null && Number.isFinite(Number(parcel.latitude)) && Number.isFinite(Number(parcel.longitude)));
      const target = selectedId || parcelId || withCoordinates[0]?.id;
      if (!target) { setCurrent(null); setForecast([]); setHistory([]); setParcelId(''); return; }
      setParcelId(target);
      const [observation, forecastRows, historyRows] = await Promise.all([
        WeatherService.getCurrentWeather(target), WeatherService.getForecast(target), WeatherService.getHistory(target),
      ]);
      setCurrent(observation); setForecast(forecastRows); setHistory(historyRows);
    } catch (err: any) {
      setCurrent(null); setForecast([]); setHistory([]);
      setError(err.response?.data?.message || 'Weather service is unavailable. Try again later.');
    } finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);
  const selectedParcel = parcels.find((parcel) => parcel.id === parcelId);

  return <div className="space-y-6 pb-16">
    <PageHeader title="Weather Intelligence" description="Live and stored weather observations for your geolocated farm parcels. Agricultural recommendations and risk scores are not shown without verified evidence." action={<button type="button" onClick={() => void load()} className="flex items-center gap-2 text-sm font-bold text-primary"><RefreshCw className="h-4 w-4" />Refresh</button>} />
    {parcels.filter((parcel) => parcel.latitude != null && parcel.longitude != null && Number.isFinite(Number(parcel.latitude)) && Number.isFinite(Number(parcel.longitude))).length > 1 && <label className="block max-w-md text-xs text-text-secondary">Farm parcel<select value={parcelId} onChange={(event) => void load(event.target.value)} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-text-primary">{parcels.filter((parcel) => parcel.latitude != null && parcel.longitude != null && Number.isFinite(Number(parcel.latitude)) && Number.isFinite(Number(parcel.longitude))).map((parcel) => <option key={parcel.id} value={parcel.id}>{parcel.parcelName || `Parcel ${parcel.id}`}</option>)}</select></label>}
    {loading && <div className="glass rounded-xl border border-border p-8 text-center text-sm text-text-secondary">Loading weather observations…</div>}
    {error && <div role="alert" className="rounded-xl border border-error/30 bg-error/5 p-4 text-sm text-error">{error}</div>}
    {!loading && !error && !current && <EmptyState icon={<CloudOff className="h-10 w-10" />} title="No geolocated farm parcel" description="Add a parcel with GPS coordinates to request weather data for its location." />}
    {!loading && current && <>
      <section className="glass rounded-xl border border-border p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-text-secondary">{selectedParcel?.parcelName || `Parcel ${current.parcelId}`} · {[current.district, current.state].filter(Boolean).join(', ')}</p><h2 className="mt-1 text-3xl font-bold text-text-primary">{formatTemperature(current.temperature)} · {current.weatherDescription}</h2><p className="mt-2 text-xs text-text-secondary">Observed {new Date(current.timestamp).toLocaleString(getCurrentLocale())} · Source {current.source}</p></div></div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[[Thermometer,'Feels like',formatTemperature(current.feelsLike)],[Droplets,'Humidity',`${current.humidity}%`],[Wind,'Wind',formatWindSpeedMs(current.windSpeed)],[Gauge,'Pressure',formatPressureHpa(current.pressure)]].map(([Icon,label,value]: any) => <div key={label} className="rounded-lg bg-surface/50 p-4"><Icon className="mb-2 h-4 w-4 text-primary"/><p className="text-xs text-text-secondary">{label}</p><p className="font-semibold text-text-primary">{value}</p></div>)}
        </div>
        <p className="mt-4 text-xs text-text-secondary">Rainfall recorded: {formatRainfallMm(current.rainfall)}</p>
      </section>
      <section className="glass overflow-hidden rounded-xl border border-border"><div className="border-b border-border p-4"><h2 className="font-bold text-text-primary">Available forecast records</h2><p className="mt-1 text-xs text-text-secondary">Forecast values are provider data, not agricultural recommendations.</p></div>{forecast.length ? <div className="overflow-auto"><table className="w-full text-left text-sm"><thead className="text-xs text-text-secondary"><tr>{['Time','Condition','Temp','Feels like','Humidity','Rain probability','Wind'].map((item)=><th key={item} className="px-4 py-3">{item}</th>)}</tr></thead><tbody>{forecast.map((item, i)=><tr key={`${item.forecastDate}-${i}`} className="border-t border-border"><td className="whitespace-nowrap px-4 py-3 text-text-primary">{new Date(item.forecastDate).toLocaleString(getCurrentLocale())}</td><td className="px-4 py-3 text-text-primary">{item.weatherDescription}</td><td className="px-4 py-3 text-text-primary">{formatTemperature(item.temperature)}</td><td className="px-4 py-3 text-text-primary">{formatTemperature(item.feelsLike)}</td><td className="px-4 py-3 text-text-primary">{item.humidity}%</td><td className="px-4 py-3 text-text-primary">{item.rainProbability}%</td><td className="px-4 py-3 text-text-primary">{formatWindSpeedMs(item.windSpeed)}</td></tr>)}</tbody></table></div> : <p className="p-5 text-sm text-text-secondary">No forecast records returned for this parcel.</p>}</section>
      <section className="glass overflow-hidden rounded-xl border border-border"><div className="border-b border-border p-4"><h2 className="font-bold text-text-primary">Stored weather history</h2></div>{history.length ? <div className="overflow-auto"><table className="w-full text-left text-sm"><thead className="text-xs text-text-secondary"><tr>{['Time','Condition','Temp','Humidity','Rain','Wind','Pressure'].map((item)=><th key={item} className="px-4 py-3">{item}</th>)}</tr></thead><tbody>{history.map((item, i)=><tr key={`${item.timestamp}-${i}`} className="border-t border-border"><td className="whitespace-nowrap px-4 py-3 text-text-primary">{new Date(item.timestamp).toLocaleString(getCurrentLocale())}</td><td className="px-4 py-3 text-text-primary">{item.weatherCondition}</td><td className="px-4 py-3 text-text-primary">{formatTemperature(item.temperature)}</td><td className="px-4 py-3 text-text-primary">{item.humidity}%</td><td className="px-4 py-3 text-text-primary">{formatRainfallMm(item.rainfall)}</td><td className="px-4 py-3 text-text-primary">{formatWindSpeedMs(item.windSpeed)}</td><td className="px-4 py-3 text-text-primary">{formatPressureHpa(item.pressure)}</td></tr>)}</tbody></table></div> : <p className="p-5 text-sm text-text-secondary">No stored history records for the returned period.</p>}</section>
    </>}
  </div>;
}
