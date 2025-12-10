// src/types.ts

export interface DeviceData {
    id: string;
    name: string;
    temperature: number;
    humidity: number;
    isWaterLevelStable: boolean;
    uvIndex: number;
    evapotranspiration: number; // NUEVO CAMPO: mm/día
    lastIrrigation: string;
}

// Tipo auxiliar para la lista desplegable
export interface DeviceSummary {
    id: string;
    name: string;
}