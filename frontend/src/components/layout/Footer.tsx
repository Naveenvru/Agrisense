export function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-8 px-4 lg:px-8 bg-surface/50 text-text-secondary text-sm backdrop-blur-md">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-heading font-semibold text-text-primary text-lg">AgriSense</span>
          <span className="text-text-secondary">Know Before You Grow.</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-text-secondary opacity-70">Version 2.0.0</span>
          <a href="#" className="hover:text-primary transition-colors font-medium">Support</a>
        </div>
      </div>
    </footer>
  );
}
