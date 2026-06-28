import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/routes';

import { FarmService } from '../services/FarmService';
import { Farm, FarmDashboardSummaryStats, LandParcel, CropSummary } from '../types';

import { FarmDashboardSummary } from './FarmDashboardSummary';
import { FarmListControls } from './FarmListControls';
import { FarmList } from './FarmList';
import { FarmDetailsDrawer } from './FarmDetailsDrawer';

export function FarmPage() {
  // State
  const [dashboardStats, setDashboardStats] = useState<FarmDashboardSummaryStats | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Drawer State
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedFarmDetails, setSelectedFarmDetails] = useState<Farm | null>(null);
  const [selectedFarmParcels, setSelectedFarmParcels] = useState<LandParcel[]>([]);
  const [selectedFarmCrops, setSelectedFarmCrops] = useState<CropSummary[]>([]);
  const [isDrawerLoading, setIsDrawerLoading] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function loadData() {
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
    }
    loadData();
  }, []);

  // Handle drawer open
  useEffect(() => {
    async function loadDrawerData() {
      if (!selectedFarmId) return;
      
      try {
        setIsDrawerLoading(true);
        const [farmData, parcelsData, allCrops] = await Promise.all([
          FarmService.getFarmById(selectedFarmId),
          FarmService.getParcels(selectedFarmId),
          FarmService.getCropSummaries() // In a real app, this would be getCropsByFarmId
        ]);
        
        setSelectedFarmDetails(farmData || null);
        setSelectedFarmParcels(parcelsData);
        
        // Mock filtering crops for this farm based on area to make it look realistic
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
    }, 300); // Wait for animation
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-text-secondary gap-2 mb-2">
        <Link to={ROUTES.DASHBOARD} className="hover:text-primary transition-colors">Dashboard</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-text-primary font-medium">My Farm</span>
      </div>

      <PageHeader 
        title="My Farm" 
        description="Manage your farms, land parcels, and crops." 
        action={<Button className="gap-2"><Plus className="w-4 h-4"/> Add Farm</Button>}
      />

      {/* Dashboard Summary */}
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
          onFarmClick={handleFarmClick}
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
    </div>
  );
}
