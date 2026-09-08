import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Camera, Mail, Phone, MapPin, Shield, Star, LayoutGrid, Clock, CreditCard, Droplet, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/axios';
import { SkeletonCard } from '@/components/ui/skeleton-card';

export function ProfilePage() {
  const { user, login } = useAuth();
  
  const userName = user?.name || "Farmer";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userEmail = user?.email || "farmer@agrisense.ai";
  
  const [formData, setFormData] = useState({
    name: userName,
    phone: '',
    language: 'English',
    district: '',
    state: '',
    village: ''
  });

  const [liveProfile, setLiveProfile] = useState<any>(null);
  const [totalFarms, setTotalFarms] = useState<number>(0);
  const [totalArea, setTotalArea] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchProfileAndLand = async () => {
    try {
      setIsLoading(true);
      const [profileRes, parcelsRes] = await Promise.allSettled([
        apiClient.get('/farmer-profile/me'),
        apiClient.get('/land-parcels')
      ]);

      let profData: any = null;
      if (profileRes.status === 'fulfilled' && profileRes.value.data?.data) {
        profData = profileRes.value.data.data;
        setLiveProfile(profData);
      }

      let parcels: any[] = [];
      if (parcelsRes.status === 'fulfilled' && parcelsRes.value.data?.data) {
        parcels = parcelsRes.value.data.data;
      }

      const calculatedArea = parcels.reduce((sum: number, p: any) => sum + (Number(p.areaAcres) || 0), 0);
      setTotalFarms(parcels.length);
      setTotalArea(parcels.length > 0 ? calculatedArea : Number(profData?.totalLandArea || 0));

      const uPhone = profData?.user?.phoneNumber || user?.phone || (user as any)?.phoneNumber || '';
      const uLang = profData?.user?.preferredLanguage || 'English';

      setFormData({
        name: profData?.user?.name || userName,
        phone: uPhone,
        language: uLang,
        district: profData?.district || '',
        state: profData?.state || '',
        village: profData?.village || ''
      });
    } catch (error) {
      console.error('Failed to load profile data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileAndLand();
  }, []);

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setSuccessMsg(null);
      setErrorMsg(null);

      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        language: formData.language,
        district: formData.district,
        state: formData.state,
        village: formData.village,
        totalLandArea: totalArea
      };

      const res = await apiClient.put('/farmer-profile/me', updatePayload);
      if (res.data?.data) {
        setLiveProfile(res.data.data);
        if (user) {
          const updatedLocalUser = { ...user, name: formData.name, phone: formData.phone };
          localStorage.setItem('user', JSON.stringify(updatedLocalUser));
        }
      }

      window.dispatchEvent(new CustomEvent('profile-updated'));

      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 pb-20 p-4">
        <div className="h-12 w-48 bg-surface rounded-lg animate-pulse mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-48" />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard className="h-32" />
              <SkeletonCard className="h-32" />
              <SkeletonCard className="h-32" />
              <SkeletonCard className="h-32" />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard className="h-[300px]" />
            <SkeletonCard className="h-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  const locationStr = formData.district 
    ? `${formData.district}${formData.state ? `, ${formData.state}` : ''}`
    : (formData.state || liveProfile?.state || 'Not specified');

  const farmerIdStr = liveProfile?.id 
    ? `AGRI-${String(liveProfile.id).padStart(4, '0')}`
    : (user?.id ? `AGRI-${String(user.id).padStart(4, '0')}` : 'AGRI-0001');

  const regDateStr = (liveProfile?.createdAt || (user as any)?.createdAt) 
    ? new Date(liveProfile?.createdAt || (user as any)?.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <SectionHeader title="My Profile" subtitle="Manage your personal information, live farm stats, and account settings." />

      {successMsg && (
        <div className="p-4 bg-success/10 border border-success/30 rounded-xl flex items-center gap-3 text-success font-medium text-sm">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-error/10 border border-error/30 rounded-xl flex items-center gap-3 text-error font-medium text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="space-y-6">
          
          <div className="glass hover-card rounded-xl p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-3xl border-4 border-background shadow-xl mx-auto">
                {userInitials}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-text-primary">{formData.name}</h2>
            <p className="text-sm text-text-secondary mt-1">PRO Subscriber</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-text-secondary bg-surface py-2 rounded-lg border border-border">
              <Shield className="w-3.5 h-3.5 text-success" />
              {user?.googleId ? 'Connected via Google' : 'AgriSense Verified Account'}
            </div>
          </div>

          <div className="glass hover-card rounded-xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" /> Achievements
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Early Adopter</p>
                  <p className="text-xs text-text-secondary">Joined AgriSense platform</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Droplet className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Smart Irrigation</p>
                  <p className="text-xs text-text-secondary">Connected land parcels</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">Precision Agronomy</p>
                  <p className="text-xs text-text-secondary">AI harvest engine enabled</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <LayoutGrid className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-text-primary">{totalFarms}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Farms / Parcels</p>
            </div>
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <CreditCard className="w-5 h-5 text-secondary mb-2" />
              <p className="text-lg font-bold text-text-primary">{totalArea} Acres</p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Total Land Area</p>
            </div>
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <MapPin className="w-5 h-5 text-info mb-2" />
              <p className="text-sm font-bold text-text-primary truncate max-w-full px-1" title={locationStr}>
                {formData.district || 'Karnataka'}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">District</p>
            </div>
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Clock className="w-5 h-5 text-warning mb-2" />
              <p className="text-sm font-bold text-text-primary">Active</p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Status</p>
            </div>
          </div>
          
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass hover-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Personal & Farm Information</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                    <input 
                      type="text" 
                      value={formData.phone}
                      placeholder="Enter phone number (e.g. +91 98765 43210)"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">District</label>
                  <input 
                    type="text" 
                    value={formData.district}
                    placeholder="e.g. Hassan, Mandya"
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">State</label>
                  <input 
                    type="text" 
                    value={formData.state}
                    placeholder="e.g. Karnataka"
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary ml-1">Preferred Language</label>
                <select 
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSaveChanges} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="glass hover-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Read-Only Information</h3>
            <div className="space-y-4">
              <div className="space-y-1.5 opacity-60">
                <label className="text-xs font-bold text-text-secondary ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                  <input 
                    type="email" 
                    value={userEmail}
                    readOnly
                    className="w-full bg-surface border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-text-secondary cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-text-secondary ml-1 mt-1 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-warning" /> 
                  Email is secured and tied to your account identity.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">Farmer ID</label>
                  <input 
                    type="text" 
                    value={farmerIdStr}
                    readOnly
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-secondary cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">Registration Date</label>
                  <input 
                    type="text" 
                    value={regDateStr}
                    readOnly
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-secondary cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
