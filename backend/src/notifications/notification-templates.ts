export const NOTIFICATION_LANGUAGE_DEFAULT = 'en-kn';
export const VERIFIED_NOTIFICATION_LANGUAGES = ['en'] as const;

export function renderDailyDigest(input: { dateLabel: string; sections: string[] }): string | null {
  const sections = input.sections.map((section) => section.trim()).filter(Boolean);
  if (!sections.length) return null;
  return [`AgriSense Daily Update · ${input.dateLabel}`, ...sections.map((section) => `• ${section}`)].join('\n');
}

/** Kannada remains suppressed until translated templates pass review. */
export function getDeliveryLanguage(preference: string): 'en' {
  return VERIFIED_NOTIFICATION_LANGUAGES.includes(preference as 'en') ? 'en' : 'en';
}
