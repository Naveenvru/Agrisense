import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Bug, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DiseasePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Disease Detection" 
        description="Upload photos of your crops for instant disease identification and treatment plans." 
      />
      <Card className="glass border-dashed border-2">
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-surface rounded-full mb-4">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-heading font-medium text-text-primary mb-2">Upload Crop Image</h3>
          <p className="text-text-secondary max-w-md mb-6">
            Drag and drop an image or click to browse. Our computer vision model will analyze the image for known pathogens.
          </p>
          <Button className="gap-2"><Bug className="w-4 h-4"/> Scan for Disease</Button>
        </CardContent>
      </Card>
    </div>
  );
}
