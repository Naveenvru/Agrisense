import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { getAccountPreferencesFromStorage } from '@/features/settings/services/account-preferences';

import { FarmService } from '../services/FarmService';
import { Farm, FarmDashboardSummaryStats, LandParcel } from '../types';

import { FarmDashboardSummary } from './FarmDashboardSummary';
import { FarmListControls } from './FarmListControls';
import { FarmList } from './FarmList';
import { FarmDetailsDrawer } from './FarmDetailsDrawer';
import { AddFarmModal } from './AddFarmModal';
import { FarmBoundaryMap } from './FarmBoundaryMap';
import { VegetationMonitoring } from './VegetationMonitoring';

export function FarmPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State
  const [dashboardStats, setDashboardStats] = useState<FarmDashboardSummaryStats | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [spatialParcels, setSpatialParcels] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Drawer State
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFarmDetails, setSelectedFarmDetails] = useState<Farm | null>(null);
  const [selectedFarmParcels, setSelectedFarmParcels] = useState<LandParcel[]>([]);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);
  const [drawerError, setDrawerError] = useState('');

  // Fetch data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [farmsResult, statsResult, spatialResult] = await Promise.allSettled([
        FarmService.getFarms(), FarmService.getFarmDashboard(), FarmService.getSpatialParcels(),
      ]);
      if (farmsResult.status === 'rejected') throw farmsResult.reason;
      const farmsData = farmsResult.value;
      const areaTotal = farmsData.reduce((total, farm) => total + farm.totalArea, 0);
      setDashboardStats(statsResult.status === 'fulfilled' ? statsResult.value : {
        totalFarms: farmsData.length, totalLandArea: Number(areaTotal.toFixed(2)),
        areaUnit: getAccountPreferencesFromStorage().units === 'imperial' ? 'ac' : 'ha', totalActiveParcels: farmsData.length, activeCrops: 0,
        harvestsThisMonth: 0, healthyFarmsPercentage: null,
      });
      setFarms(farmsData);
      setSpatialParcels(spatialResult.status === 'fulfilled' ? spatialResult.value : farmsData.map((farm) => ({
        id: farm.id, label: farm.name, detail: farm.location,
        boundary: farm.boundaryGeoJson ? { ...farm.boundaryGeoJson, id: farm.id, label: farm.name, detail: farm.location } : undefined,
        point: farm.gpsCoordinates ? [farm.gpsCoordinates.latitude, farm.gpsCoordinates.longitude] as [number, number] : undefined,
      })));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch farm data'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const requestedFarmId = (location.state as { openFarmId?: string } | null)?.openFarmId;
    if (!requestedFarmId) return;
    setSelectedFarmId(String(requestedFarmId));
    setIsDrawerOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  // Handle drawer open
  useEffect(() => {
    async function loadDrawerData() {
      if (!selectedFarmId) return;
      
      try {
        setIsDrawerLoading(true);
        setDrawerError('');
        const [farmResult, parcelsResult] = await Promise.allSettled([
          FarmService.getFarmById(selectedFarmId),
          FarmService.getParcels(selectedFarmId),
        ]);
        if (farmResult.status === 'fulfilled') setSelectedFarmDetails(farmResult.value || null);
        else setSelectedFarmDetails(null);
        setSelectedFarmParcels(parcelsResult.status === 'fulfilled' ? parcelsResult.value : []);
        const failedSections = [farmResult, parcelsResult].filter((result) => result.status === 'rejected').length;
        if (failedSections) setDrawerError(farmResult.status === 'rejected'
          ? 'Farm details could not be loaded. Check your connection and try opening the farm again.'
          : 'Some parcel or crop information is temporarily unavailable. The farm details are still shown.');
      } catch (err) {
        setDrawerError(err instanceof Error ? err.message : 'Farm details could not be loaded.');
      } finally {
        setIsDrawerLoading(false);
      }
    }
    
    if (isDrawerOpen) {
      loadDrawerData();
    }
  }, [selectedFarmId, isDrawerOpen]);

  // Derived data (Filtering and Search)
  const filteredFarms = useMemo(() => {
    let result = [...farms];
    
    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(f => 
        f.name.toLowerCase().includes(query) || 
        f.location.toLowerCase().includes(query) ||
        f.currentCrop?.toLowerCase().includes(query)
      );
    }
    
    // Filters
    if (activeFilter !== 'all') {
      if (activeFilter === 'healthy') result = result.filter(f => f.overallHealthStatus === 'Healthy');
      if (activeFilter === 'attention') result = result.filter(f => f.overallHealthStatus === 'Needs Attention' || f.overallHealthStatus === 'Medium Risk');
      if (activeFilter === 'harvest') result = result.filter(f => f.growthStage === 'Harvest Ready');
    }
    
    return result;
  }, [farms, searchQuery, activeFilter]);

  const handleFarmClick = (id: string) => {
    setSelectedFarmId(id);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedFarmId(null);
      setSelectedFarmDetails(null);
      setSelectedFarmParcels([]);
      setDrawerError('');
    }, 300);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-text-secondary gap-2 mb-2">
        <Link to={ROUTES.DASHBOARD} className="hover:text-primary transition-colors">{t('Dashboard')}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary font-medium">{t('My Farm')}</span>
      </div>

      {/* Hero Section */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
            👋 {t('Good Afternoon, {{name}}', { name: user?.name || 'Farmer' })}
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-xl">
            {t('Manage all your farms, parcels and crops from one intelligent workspace.')}
          </p>
        </div>
        
        <div className="relative z-10 w-full md:w-auto">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto gap-2 rounded-xl h-14 px-8 text-lg font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            {t('Add Farm')}
          </Button>
        </div>
      </div>

      {/* Dashboard Summary inline within the page layout */}
      <section className="space-y-4 rounded-2xl border border-border bg-card p-5 md:p-6">
        <div><h2 className="text-xl font-bold text-text-primary">Farm map</h2><p className="mt-1 text-sm text-text-secondary">Your saved parcel boundaries and registered locations. Select a parcel outline to open its details.</p></div>
        <FarmBoundaryMap
          points={[]}
          center={spatialParcels.find((parcel) => parcel.point)?.point || [12.9716, 77.5946]}
          savedBoundaries={spatialParcels.map((parcel) => parcel.boundary).filter(Boolean)}
          savedLocations={spatialParcels.filter((parcel) => parcel.point).map((parcel) => ({ point: parcel.point, label: parcel.label, detail: parcel.detail }))}
          onSavedBoundaryClick={handleFarmClick}
        />
        {!spatialParcels.length && !isLoading && <p className="text-sm text-text-secondary">Register a farm parcel to see its location here.</p>}
      </section>
      <VegetationMonitoring parcels={spatialParcels.map((parcel) => ({ id: parcel.id, name: parcel.label, hasBoundary: Boolean(parcel.boundary) }))} />

      {dashboardStats && !isLoading && !error && (
        <FarmDashboardSummary stats={dashboardStats} />
      )}

      {/* Main Content Area */}
      <div>
        <FarmListControls 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        <FarmList 
          farms={filteredFarms}
          isLoading={isLoading}
          error={error}
          viewMode={viewMode}
          selectedFarmId={selectedFarmId}
          onFarmClick={handleFarmClick}
          onAddFarm={() => setIsAddModalOpen(true)}
        />
      </div>

      {/* Details Drawer */}
      <FarmDetailsDrawer 
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        farm={selectedFarmDetails}
        parcels={selectedFarmParcels}
        isLoading={isDrawerLoading}
        detailsError={drawerError}
        onDelete={(farm) => {
          if (!window.confirm(`Delete “${farm.name}” and its associated crop and satellite records?`)) return;
          void FarmService.deleteParcel(farm.id).then(() => { handleCloseDrawer(); void loadData(); })
            .catch((cause: any) => setError(new Error(cause.response?.data?.message || 'Farm parcel could not be deleted.')));
        }}
        onParcelUpdated={() => {
          void loadData();
          if (selectedFarmId) void FarmService.getFarmById(selectedFarmId).then((updated) => { if (updated) setSelectedFarmDetails(updated); });
        }}
      />

      {/* Add Farm Modal */}
      <AddFarmModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
}

