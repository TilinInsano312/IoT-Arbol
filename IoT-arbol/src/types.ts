// src/types.ts

export interface DeviceData {
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    waterLevel: number; // CAMBIO: Ahora es numérico (mm)
    uvIndex: number;
    evapotranspiration: number;
    lastIrrigation: string;
}

// Tipo auxiliar para la lista desplegable
export interface DeviceSummary {
    id: string;
    name: string;
}
export interface TelemetryValue {
  ts: number;      // Timestamp en milisegundos
  value: string;   // ThingsBoard suele devolver el valor como string
}

// La respuesta es un mapa donde la clave es el nombre de la variable (ej: "temperature")
export interface TelemetryResponse {
  [key: string]: TelemetryValue[];
}

// Parámetros para la consulta histórica
export interface HistoricalParams {
  entityType: 'DEVICE' | 'ASSET';
  entityId: string;
  keys: string[];       // Ej: ['temperature', 'humidity']
  startTs: number;
  endTs: number;
  interval?: number;    // Opcional: agrupación en ms
  agg?: 'MIN' | 'MAX' | 'AVG' | 'SUM' | 'COUNT' | 'NONE';
  limit?: number;
}