import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto py-12 px-4 lg:px-8 bg-transparent text-text-secondary text-sm">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto w-full border-t border-border/50 pt-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-heading font-semibold text-text-primary text-lg tracking-wide">AgriSense</span>
          <span className="text-text-secondary/70">{t('Know Before You Grow.')}</span>
        </div>
        <div className="flex items-center gap-8">
          <span className="text-text-secondary/50">Version 2.0.0</span>
          <a href="#" className="hover:text-primary transition-colors font-medium">{t('Support')}</a>
        </div>
      </div>
    </footer>
  );
}
