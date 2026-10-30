import { useState, useRef } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Bug, 
  Upload, 
  Camera, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  X, 
  Leaf, 
  ShieldAlert,
  History
} from 'lucide-react';
import { geminiService } from '@/features/ai/services/gemini.service';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

interface ScanHistoryItem {
  id: string;
  timestamp: string;
  cropName: string;
  imagePreview: string;
  diagnosis: string;
  model: string;
}

// Client-side image compression helper to ensure fast payload transmission
const compressImage = (dataUrl: string, maxWidth = 1024, maxHeight = 1024): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

export function DiseasePage() {
  const { user } = useAuth();
  const aiEnabled = Boolean(user?.preferences?.aiAssistanceEnabled);
  const [inputMode, setInputMode] = useState<'upload' | 'camera'>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [cropName, setCropName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [result, setResult] = useState<{ diagnosis: string; model: string } | null>(null);
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);

  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // File Upload Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setMimeType('image/jpeg');
    const reader = new FileReader();
    reader.onload = async () => {
      const rawDataUrl = reader.result as string;
      const compressed = await compressImage(rawDataUrl);
      setSelectedImage(compressed);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Start Camera
  const startCamera = async () => {
    try {
      setInputMode('camera');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      toast.error('Unable to access camera. Please check camera permissions.');
      console.error('Camera access error:', err);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture Camera Snapshot
  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      const compressed = await compressImage(dataUrl);
      setSelectedImage(compressed);
      setMimeType('image/jpeg');
      stopCamera();
      setInputMode('upload');
      setResult(null);
      toast.success('Photo captured successfully!');
    }
  };

  // Clear Selected Image
  const clearSelection = () => {
    setSelectedImage(null);
    setResult(null);
    stopCamera();
  };

  // Submit to Gemini Vision AI
  const handleScan = async () => {
    if (!aiEnabled) {
      toast.error('Enable AI assistance in Settings before submitting crop photos for analysis.');
      return;
    }
    if (!selectedImage) {
      toast.error('Please upload or capture a crop photo first.');
      return;
    }

    setIsScanning(true);
    setResult(null);

    try {
      const data = await geminiService.analyzeDisease({
        imageBase64: selectedImage,
        mimeType,
        cropName: cropName.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setResult(data);
      toast.success('Disease diagnostic report generated by Gemini AI!');

      // Save to history
      const historyItem: ScanHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cropName: cropName.trim() || 'General Crop',
        imagePreview: selectedImage,
        diagnosis: data.diagnosis,
        model: data.model,
      };

      setScanHistory((prev) => [historyItem, ...prev.slice(0, 5)]);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to scan image. Please try again.';
      toast.error(msg);
      console.error('Disease scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const quickCrops = ['Rice', 'Wheat', 'Maize', 'Tomato', 'Potato', 'Cotton', 'Sugarcane', 'Chilli'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="AI Disease Detection & Pathology" 
        description="AI image assessment for crop health. Uploaded images are processed only after you enable AI assistance in settings; results are not a confirmed diagnosis."
      />
      {!aiEnabled && <div className="rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-text-primary">AI assistance is off. Enable it in <a className="font-semibold text-primary underline" href="/settings">Settings → AI Preferences</a> before starting a scan.</div>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Input & Scanning Controls */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass border-primary/20 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-heading flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" /> Crop Photo Input
                </CardTitle>
                <div className="flex bg-surface-hover rounded-lg p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => { stopCamera(); setInputMode('upload'); }}
                    className={`px-3 py-1 rounded-md transition-colors ${inputMode === 'upload' ? 'bg-primary text-white font-medium' : 'text-text-secondary'}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={startCamera}
                    className={`px-3 py-1 rounded-md transition-colors ${inputMode === 'camera' ? 'bg-primary text-white font-medium' : 'text-text-secondary'}`}
                  >
                    Live Camera
                  </button>
                </div>
              </div>
              <CardDescription>Capture leaf, stem, or fruit symptoms clearly.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Camera Feed Mode */}
              {inputMode === 'camera' && isCameraActive && (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center border-2 border-primary/50">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 flex items-center gap-3">
                    <Button type="button" onClick={capturePhoto} className="gap-2 bg-primary hover:bg-primary-hover shadow-lg">
                      <Camera className="w-4 h-4" /> Snap Photo
                    </Button>
                    <Button type="button" onClick={stopCamera} variant="outline" size="icon" className="bg-background/80">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Upload Mode or Captured Image Preview */}
              {inputMode === 'upload' && !selectedImage && (
                <label 
                  htmlFor="crop-photo-file"
                  className="border-2 border-dashed border-primary/30 hover:border-primary rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-surface/50 hover:bg-surface-hover/80 group"
                >
                  <input
                    id="crop-photo-file"
                    name="cropPhotoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-4 bg-primary/10 group-hover:bg-primary/20 rounded-full mb-3 text-primary transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-medium text-text-primary mb-1">
                    Drag & Drop or Click to Select Image
                  </h4>
                  <p className="text-xs text-text-secondary max-w-xs">
                    Supports JPEG, PNG, WebP crop photos up to 10MB
                  </p>
                </label>
              )}

              {/* Selected Image Preview with Laser Scanning Overlay */}
              {selectedImage && (
                <div className="relative rounded-xl overflow-hidden border border-border bg-black group">
                  <img
                    src={selectedImage}
                    alt="Crop symptom preview"
                    className="w-full h-64 object-contain bg-surface"
                  />
                  
                  {/* Laser Scanning Animation */}
                  {isScanning && (
                    <div className="absolute inset-0 bg-primary/10 flex flex-col items-center justify-center pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_15px_#22c55e] animate-bounce" />
                      <div className="bg-background/90 text-primary text-xs font-mono px-3 py-1.5 rounded-full flex items-center gap-2 border border-primary/30 shadow-lg">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" /> Gemini Vision AI Scanning...
                      </div>
                    </div>
                  )}

                  {!isScanning && (
                    <button
                      type="button"
                      onClick={clearSelection}
                      className="absolute top-3 right-3 p-1.5 bg-background/80 hover:bg-background text-text-primary rounded-full shadow transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {/* Crop Name & Symptoms Input */}
              <div className="space-y-3">
                <div>
                  <label htmlFor="crop-name" className="text-xs font-medium text-text-secondary mb-1.5 block">
                    Crop Variety / Name (Optional)
                  </label>
                  <Input
                    id="crop-name"
                    name="cropName"
                    placeholder="e.g. Tomato, Paddy Rice, Chilli"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                  />
                  {/* Quick crop chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {quickCrops.map((crop) => (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => setCropName(crop)}
                        className={`text-xs px-2.5 py-1 rounded-md transition-colors ${cropName === crop ? 'bg-primary/20 text-primary border border-primary/30 font-medium' : 'bg-surface hover:bg-surface-hover text-text-secondary'}`}
                      >
                        {crop}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="crop-notes" className="text-xs font-medium text-text-secondary mb-1.5 block">
                    Observed Symptoms / Notes (Optional)
                  </label>
                  <textarea
                    id="crop-notes"
                    name="cropNotes"
                    placeholder="e.g. Yellow leaves with dark spots, wilting stems after rain..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <Button
                type="button"
                onClick={handleScan}
                disabled={!selectedImage || isScanning || !aiEnabled}
                className="w-full gap-2 py-6 text-base font-medium shadow-md bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-hover hover:to-emerald-700 text-white"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" /> Analyzing with Gemini AI...
                  </>
                ) : (
                  <>
                    <Bug className="w-5 h-5" /> Run Gemini Diagnostic Scan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Diagnostic Results & Pathology Report */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !isScanning && (
            <Card className="glass border-dashed p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
              <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
                <Leaf className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                Ready for Crop Pathology Scan
              </h3>
              <p className="text-text-secondary max-w-md text-sm mb-6">
                Upload or snap a photo of any unhealthy leaf, crop, or fruit. Google Gemini AI will inspect the photo against agronomical diagnostic models to generate an instant treatment plan.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left w-full max-w-sm text-xs text-text-secondary">
                <div className="flex items-center gap-2 p-2 bg-surface/50 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> Precise Pathogen Identification
                </div>
                <div className="flex items-center gap-2 p-2 bg-surface/50 rounded-lg">
                  <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" /> Severity & Impact Assessment
                </div>
                <div className="flex items-center gap-2 p-2 bg-surface/50 rounded-lg">
                  <Leaf className="w-4 h-4 text-emerald-500 shrink-0" /> Organic & Bio Treatments
                </div>
                <div className="flex items-center gap-2 p-2 bg-surface/50 rounded-lg">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" /> Chemical Dosage Guidance
                </div>
              </div>
            </Card>
          )}

          {isScanning && (
            <Card className="glass p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px] space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <Sparkles className="w-6 h-6 text-primary absolute inset-0 m-auto" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-medium text-text-primary">
                  Consulting Gemini Vision Pathology Intelligence...
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Inspecting image texture, leaf spots, and plant symptoms against agricultural database
                </p>
              </div>
            </Card>
          )}

          {result && !isScanning && (
            <Card className="glass border-primary/30 shadow-lg animate-in fade-in duration-300">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-heading">
                        Pathology Diagnostic Report
                      </CardTitle>
                      <CardDescription className="text-xs flex items-center gap-2 mt-0.5">
                        <span>Powered by <strong className="text-primary">{result.model}</strong></span>
                        <span>•</span>
                        <span>{new Date().toLocaleTimeString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => setResult(null)} className="gap-1.5 text-xs">
                    <RefreshCw className="w-3.5 h-3.5" /> New Scan
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                {/* Render Markdown Diagnostic Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-text-primary space-y-3 leading-relaxed">
                  {result.diagnosis.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h3 key={idx} className="text-base font-heading font-semibold text-primary mt-4 mb-2 border-b border-border/40 pb-1">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('## ')) {
                      return <h2 key={idx} className="text-lg font-heading font-bold text-text-primary mt-4 mb-2">{line.replace('## ', '')}</h2>;
                    }
                    if (line.startsWith('- **')) {
                      const parts = line.replace('- **', '').split('**:');
                      return (
                        <div key={idx} className="ml-2 my-1 text-sm">
                          <strong className="text-text-primary font-medium">{parts[0]}:</strong>
                          <span className="text-text-secondary ml-1">{parts.slice(1).join('**:')}</span>
                        </div>
                      );
                    }
                    if (line.startsWith('- ')) {
                      return <li key={idx} className="ml-4 list-disc text-sm text-text-secondary">{line.replace('- ', '')}</li>;
                    }
                    if (line.trim() === '') return <div key={idx} className="h-1" />;
                    return <p key={idx} className="text-sm text-text-secondary">{line}</p>;
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session History list */}
          {scanHistory.length > 0 && (
            <Card className="glass">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-heading flex items-center gap-2">
                  <History className="w-4 h-4 text-primary" /> Session Diagnostic History ({scanHistory.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {scanHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setResult({ diagnosis: item.diagnosis, model: item.model })}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-surface hover:bg-surface-hover border border-border/40 cursor-pointer transition-all"
                  >
                    <img src={item.imagePreview} alt="Thumbnail" className="w-10 h-10 rounded object-cover bg-black" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-text-primary truncate">{item.cropName}</span>
                        <span className="text-[10px] text-text-muted">{item.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-text-secondary truncate mt-0.5">
                        {item.diagnosis.split('\n')[0].replace(/[^a-zA-Z0-9 :]/g, '') || 'Diagnosis Report'}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
