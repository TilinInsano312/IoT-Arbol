// src/services/api.ts
// src/services/api.ts
import type { DeviceData, DeviceSummary } from '../types';

// Datos "en el servidor"
const dbDevices: DeviceData[] = [
    {
        id: 'dev_001',
        name: 'Invernadero Zona Norte (Tomates)',
        temperature: 26.5,
        humidity: 55,
        isWaterLevelStable: true,
        uvIndex: 8,
        evapotranspiration: 4.2, // Nuevo valor
        lastIrrigation: '27 Oct, 08:30 AM',
    },
    {
        id: 'dev_002',
        name: 'Semillero Exterior',
        temperature: 19.2,
        humidity: 70,
        isWaterLevelStable: false,
        uvIndex: 4,
        evapotranspiration: 2.1, // Nuevo valor
        lastIrrigation: '26 Oct, 06:15 PM',
    },
     {
        id: 'dev_003',
        name: 'Zona de Cactus',
        temperature: 31.0,
        humidity: 20,
        isWaterLevelStable: true,
        uvIndex: 10,
        evapotranspiration: 6.5, // Nuevo valor alto por calor
        lastIrrigation: '20 Oct, 10:00 AM',
    },
];

// Simula un retraso de red (ej. 500ms)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Simula: GET /api/devices
 * Devuelve solo la lista resumen para el dropdown
 */
export const fetchDeviceList = async (): Promise<DeviceSummary[]> => {
    await delay(300); // Simula latencia
    return dbDevices.map(({ id, name }) => ({ id, name }));
};

/**
 * Simula: GET /api/devices/:id
 * Devuelve los detalles completos de un dispositivo
 */
export const fetchDeviceDetails = async (deviceId: string): Promise<DeviceData | null> => {
    console.log(`Fetching data for... ${deviceId}`);
    await delay(600); // Simula un poco más de latencia para los detalles
    const device = dbDevices.find(d => d.id === deviceId);
    return device || null;
};