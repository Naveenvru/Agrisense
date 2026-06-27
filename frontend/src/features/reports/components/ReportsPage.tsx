import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ReportsPage() {
  const reports = [
    { title: "Monthly Yield Forecast - October", date: "Oct 1, 2026", type: "Forecast" },
    { title: "Quarterly Financial Summary", date: "Sep 30, 2026", type: "Financial" },
    { title: "Soil Health Analysis - Field A & B", date: "Sep 15, 2026", type: "Agronomy" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Reports" 
        description="Access and generate comprehensive reports for your farm." 
        action={<Button className="gap-2"><FileText className="w-4 h-4"/> Generate New Report</Button>}
      />
      <div className="grid grid-cols-1 gap-4">
        {reports.map((report, idx) => (
          <Card key={idx} className="glass">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-surface rounded-lg">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-text-primary">{report.title}</h3>
                  <div className="text-sm text-text-secondary flex gap-2">
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.type}</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="w-5 h-5 text-text-secondary" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
