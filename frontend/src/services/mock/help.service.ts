export interface HelpOption {
  id: string;
  title: string;
  desc: string;
  iconType: string;
  color: string;
  bg: string;
  link?: string;
  isExternal?: boolean;
}

export const mockHelpOptions: HelpOption[] = [
  { id: 'faq', title: 'FAQ', desc: 'Browse answers to commonly asked questions.', iconType: 'HelpCircle', color: 'text-primary', bg: 'bg-primary/10' },
  { id: 'support', title: 'Contact Support', desc: 'Open a ticket with our agricultural experts.', iconType: 'MessageSquare', color: 'text-secondary', bg: 'bg-secondary/10' },
  { id: 'bug', title: 'Report a Bug', desc: 'Found an issue? Let our engineering team know.', iconType: 'Bug', color: 'text-error', bg: 'bg-error/10' },
  { id: 'video', title: 'Video Tutorials', desc: 'Learn how to maximize your yield with AgriSense.', iconType: 'PlaySquare', color: 'text-info', bg: 'bg-info/10' },
  { id: 'docs', title: 'Documentation', desc: 'Read the detailed platform guides.', iconType: 'FileText', color: 'text-warning', bg: 'bg-warning/10' },
  { id: 'helpline', title: 'Kisan Helpline', desc: '1551 (Toll Free Govt Agri Helpline)', iconType: 'Phone', color: 'text-error', bg: 'bg-error/20', isExternal: true },
];

export const helpService = {
  getHelpOptions: async (): Promise<HelpOption[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockHelpOptions;
  }
};
