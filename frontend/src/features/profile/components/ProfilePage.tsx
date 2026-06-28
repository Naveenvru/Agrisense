import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { SectionHeader } from '@/components/common/SectionHeader';
import { Button } from '@/components/ui/button';
import { Camera, Mail, Phone, MapPin, Shield, Star, LayoutGrid, Clock, CreditCard, Droplet, TrendingUp } from 'lucide-react';
import { profileService, ProfileData } from '@/services/mock/profile.service';
import { SkeletonCard } from '@/components/ui/skeleton-card';

export function ProfilePage() {
  const { user } = useAuth();
  
  const userName = user?.name || "Naveen";
  const userInitials = userName.substring(0, 2).toUpperCase();
  const userEmail = user?.email || "naveen@example.com";
  
  const [formData, setFormData] = useState({
    name: userName,
    phone: "",
    language: "English (US)"
  });

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfileData(data);
        setFormData(prev => ({ ...prev, phone: data.phone, language: data.language }));
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (isLoading || !profileData) {
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

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <SectionHeader title="My Profile" subtitle="Manage your personal information and account settings." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quick Profile & Stats */}
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
            <h2 className="text-xl font-bold text-text-primary">{userName}</h2>
            <p className="text-sm text-text-secondary mt-1">PRO Subscriber</p>
            <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium text-text-secondary bg-surface py-2 rounded-lg border border-border">
              <Shield className="w-3.5 h-3.5 text-success" />
              Connected via Google
            </div>
          </div>

          <div className="glass hover-card rounded-xl p-6">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-warning" /> Achievements
            </h3>
            <div className="space-y-3">
              {profileData.achievements.map((ach) => (
                <div key={ach.id} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {ach.icon === 'Star' && <Star className="w-4 h-4" />}
                    {ach.icon === 'Droplet' && <Droplet className="w-4 h-4" />}
                    {ach.icon === 'TrendingUp' && <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{ach.title}</p>
                    <p className="text-xs text-text-secondary">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <LayoutGrid className="w-5 h-5 text-primary mb-2" />
              <p className="text-2xl font-bold text-text-primary">{profileData.totalFarms}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Farms</p>
            </div>
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <CreditCard className="w-5 h-5 text-secondary mb-2" />
              <p className="text-lg font-bold text-text-primary">{profileData.subscription.split(' ')[1]}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Plan</p>
            </div>
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <MapPin className="w-5 h-5 text-info mb-2" />
              <p className="text-sm font-bold text-text-primary truncate max-w-full px-1" title={profileData.location}>{profileData.location.split(',')[0]}</p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Location</p>
            </div>
            <div className="glass hover-card rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <Clock className="w-5 h-5 text-warning mb-2" />
              <p className="text-sm font-bold text-text-primary">Today</p>
              <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Last Login</p>
            </div>
          </div>
          
        </div>

        {/* Right Column: Edit Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="glass hover-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-text-primary mb-6">Personal Information</h3>
            
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
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary ml-1">Preferred Language</label>
                <select 
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-colors appearance-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Kannada</option>
                  <option>Telugu</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button>Save Changes</Button>
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
                  Email cannot be changed directly for Google connected accounts.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-60">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">Farmer ID</label>
                  <input 
                    type="text" 
                    value={profileData.farmerId}
                    readOnly
                    className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-secondary cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary ml-1">Registration Date</label>
                  <input 
                    type="text" 
                    value={profileData.registrationDate}
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
