const escapePdf = (text: string) => text.replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, '?');

/** Small dependency-free PDF renderer for text-first verified reports. */
export function renderTextPdf(title: string, lines: string[]): Buffer {
  const all = [title, 'AgriSense | Evidence-based agricultural intelligence', '', ...lines];
  const wrapped = all.flatMap((line) => {
    const safe = escapePdf(String(line));
    const result: string[] = [];
    for (let i = 0; i < safe.length; i += 92) result.push(safe.slice(i, i + 92));
    return result.length ? result : [''];
  });
  const pageChunks = Array.from({ length: Math.max(1, Math.ceil(wrapped.length / 48)) }, (_, i) => wrapped.slice(i * 48, (i + 1) * 48));
  const objects: string[] = [];
  const pageRefs = pageChunks.map((_, i) => `${4 + i * 2} 0 R`).join(' ');
  objects[1] = '<< /Type /Catalog /Pages 2 0 R >>';
  objects[2] = `<< /Type /Pages /Kids [${pageRefs}] /Count ${pageChunks.length} >>`;
  objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>';
  pageChunks.forEach((chunk, i) => {
    const pageId = 4 + i * 2; const streamId = pageId + 1;
    const content = ['BT', '/F1 10 Tf', '50 790 Td', '14 TL', ...chunk.flatMap((line, index) => [index ? 'T*' : '', `(${line}) Tj`]).filter(Boolean), 'ET', `BT /F1 8 Tf 500 30 Td (Page ${i + 1} of ${pageChunks.length}) Tj ET`].join('\n');
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 3 0 R >> >> /Contents ${streamId} 0 R >>`;
    objects[streamId] = `<< /Length ${Buffer.byteLength(content, 'latin1')} >>\nstream\n${content}\nendstream`;
  });
  let pdf = '%PDF-1.4\n'; const offsets = [0];
  for (let i = 1; i < objects.length; i++) { offsets[i] = Buffer.byteLength(pdf, 'latin1'); pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`; }
  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i++) pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'latin1');
}
