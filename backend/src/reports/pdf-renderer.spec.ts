import { renderTextPdf } from './pdf-renderer';

describe('renderTextPdf', () => {
  it('produces a valid PDF structure and paginates long reports', () => {
    const pdf = renderTextPdf('Farm Report', Array.from({ length: 100 }, (_, index) => `Recorded row ${index}`)).toString('latin1');
    expect(pdf.startsWith('%PDF-1.4')).toBe(true);
    expect(pdf).toContain('/Type /Pages');
    expect(pdf).toContain('/Count 3');
    expect(pdf.endsWith('%%EOF')).toBe(true);
  });
});
