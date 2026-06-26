/**
 * Master Data Interfaces — Phase 10
 */

export interface IState {
  name: string;
  code?: string;
}

export interface IDistrict {
  name: string;
  stateId: string;
}

export interface ITaluk {
  name: string;
  districtId: string;
}

export interface IVillage {
  name: string;
  talukId: string;
}

export interface IMandi {
  name: string;
  districtId: string;
}

export interface ICommodity {
  name: string;
  category?: string;
}

export interface ICropVariety {
  name: string;
  commodityId: string;
}

export interface ISeason {
  name: string;
  startMonth?: number;
  endMonth?: number;
}

export interface ISoilType {
  name: string;
  description?: string;
}

export interface IIrrigationType {
  name: string;
}

export interface IFertilizer {
  name: string;
  type?: string;
}

export interface IPesticide {
  name: string;
  type?: string;
}
