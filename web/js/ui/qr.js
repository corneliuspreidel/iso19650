// SPDX-License-Identifier: MIT
import { qrcode } from '../../vendor/qrcode-generator/qrcode.mjs';

/** Liefert ein SVG-Markup für einen QR-Code (Typnummer 0 = automatisch). */
export function qrSvg(text, { cellSize = 4, margin = 2 } = {}) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize, margin, scalable: true });
}
