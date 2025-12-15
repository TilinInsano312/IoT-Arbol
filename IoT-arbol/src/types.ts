// src/types.ts

export interface DeviceData {
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    waterLevel: number; 
    uvIndex: number;
    evapotranspiration: number;
    lastIrrigation: string;
}

export interface DeviceSummary {
    id: string;
    name: string;
}
export interface TelemetryValue {
  ts: number;     
  value: string;   
}
export interface TelemetryResponse {
  [key: string]: TelemetryValue[];
}

export interface HistoricalParams {
  entityType: 'DEVICE' | 'ASSET';
  entityId: string;
  keys: string[];       
  startTs: number;
  endTs: number;
  interval?: number; 
  agg?: 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT' | 'NONE';
  limit?: number;
}