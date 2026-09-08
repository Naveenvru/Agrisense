import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';
import { useAuth } from '@/context/AuthContext';

import { FarmService } from '../services/FarmService';
import { Farm, FarmDashboardSummaryStats, LandParcel, CropSummary } from '../types';

import { FarmDashboardSummary } from './FarmDashboardSummary';
import { FarmListControls } from './FarmListControls';
import { FarmList } from './FarmList';
import { FarmDetailsDrawer } from './FarmDetailsDrawer';
import { AddFarmModal } from './AddFarmModal';

export function FarmPage() {
  const { user } = useAuth();
  
  // State
  const [dashboardStats, setDashboardStats] = useState<FarmDashboardSummaryStats | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
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
  const [selectedFarmCrops, setSelectedFarmCrops] = useState<CropSummary[]>([]);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  // Fetch data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [stats, farmsData] = await Promise.all([
        FarmService.getFarmDashboard(),
        FarmService.getFarms()
      ]);
      setDashboardStats(stats);
      setFarms(farmsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch farm data'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle drawer open
  useEffect(() => {
    async function loadDrawerData() {
      if (!selectedFarmId) return;
      
      try {
        setIsDrawerLoading(true);
        const [farmData, parcelsData, allCrops] = await Promise.all([
          FarmService.getFarmById(selectedFarmId),
          FarmService.getParcels(selectedFarmId),
          FarmService.getCropSummaries()
        ]);
        
        setSelectedFarmDetails(farmData || null);
        setSelectedFarmParcels(parcelsData);
        
        const farmCrops = allCrops.slice(0, parcelsData.length || 1); 
        setSelectedFarmCrops(farmCrops);
        
      } catch (err) {
        console.error('Failed to load farm details', err);
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
      setSelectedFarmCrops([]);
    }, 300);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-text-secondary gap-2 mb-2">
        <Link to={ROUTES.DASHBOARD} className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary font-medium">My Farm</span>
      </div>

      {/* Hero Section */}
      <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary">
            👋 Good Afternoon, {user?.name || 'Farmer'}
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-xl">
            Manage all your farms, parcels and crops from one intelligent workspace.
          </p>
        </div>
        
        <div className="relative z-10 w-full md:w-auto">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full md:w-auto gap-2 rounded-xl h-14 px-8 text-lg font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Farm
          </Button>
        </div>
      </div>

      {/* Dashboard Summary inline within the page layout */}
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
        crops={selectedFarmCrops}
        isLoading={isDrawerLoading}
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

