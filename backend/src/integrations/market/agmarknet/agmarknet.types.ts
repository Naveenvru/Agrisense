/**
 * agmarknet.types.ts
 *
 * Type stubs for the AGMARKNET (Agri Marketing Network) API.
 * Will be filled in Phase 9 (Market Price Module).
 */

/** Raw AGMARKNET API response shape (placeholder) */
export interface AgmarknetPriceRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: number;
  max_price: number;
  modal_price: number;
}

export interface AgmarknetApiResponse {
  records: AgmarknetPriceRecord[];
  total: number;
}
