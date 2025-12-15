import type { DeviceData, DeviceSummary } from '../types';

const AUTH_CREDENTIALS = {
    username: import.meta.env.VITE_TB_USERNAME,
    password: import.meta.env.VITE_TB_PASSWORD
};

const TARGET_DEVICE_ID = import.meta.env.VITE_TB_DEVICE_ID;

// Variable para guardar el token temporalmente en memoria
let jwtToken: string | null = null;
interface TBTelemetryResponse {
    [key: string]: Array<{
        ts: number;
        value: string;
    }>;
}

interface TBLoginResponse {
    token: string;
    refreshToken: string;
}


/**
 * 1. Autenticación
 */
const login = async (): Promise<string> => {
    if (jwtToken) return jwtToken;
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(AUTH_CREDENTIALS),
        });

        if (!response.ok) {
            throw new Error(`Error en Login: ${response.status}`);
        }

        const data: TBLoginResponse = await response.json();
        jwtToken = data.token;
        return data.token;
    } catch (error) {
        console.error("Fallo al autenticar con ThingsBoard", error);
        throw error;
    }
};

/**
 * 2. Obtener lista de dispositivos
 */
export const fetchDeviceList = async (): Promise<DeviceSummary[]> => {
    return [
        { id: TARGET_DEVICE_ID, name: 'EvapoTranspo' },
    ];
};

/**
 * 3. Obtener detalles del dispositivo
 */
const fetchTBTelemetry = async (deviceId: string, keys: string, timeRange: number) => {
    const token = await login();
    const endTs = Date.now();
    const startTs = endTs - timeRange;

    const url = `/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keys}&startTs=${startTs}&endTs=${endTs}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'X-Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) throw new Error(`Error TB: ${response.status}`);
    return await response.json();
};
export const fetchRealTimeData = async (deviceId: string): Promise<Partial<DeviceData> | null> => {
    try {
        const data = await fetchTBTelemetry(deviceId, 'temperature,humidity,uv_intensity,water_level', 12 * 60 * 60 * 1000);

        const getValue = (key: string) => {
            if (data[key] && data[key].length > 0) {
                return parseFloat(data[key].sort((a: any, b: any) => b.ts - a.ts)[0].value);
            }
            return 0;
        };

        const getLastTs = (key: string) => {
            if (data[key] && data[key].length > 0) return data[key][0].ts;
            return Date.now();
        };

        return {
            id: deviceId,
            name: 'TestEvapoTranspo',
            temperature: getValue('temperature'),
            humidity: getValue('humidity'),
            uvIndex: getValue('uv_intensity'),
            waterLevel: getValue('water_level'),
            lastIrrigation: new Date(getLastTs('temperature')).toLocaleString('es-CL', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            }),
        };
    } catch (error) {
        console.error("Error fetching real-time:", error);
        return null;
    }
};

export const fetchDailyET0 = async (deviceId: string): Promise<number> => {
    try {
        const data = await fetchTBTelemetry(deviceId, 'evapotranspiration', 24 * 60 * 60 * 1000);
        
        if (data['evapotranspiration'] && data['evapotranspiration'].length > 0) {
            return parseFloat(data['evapotranspiration'][0].value);
        }
        return 0; 
    } catch (error) {
        console.error("Error fetching ET0:", error);
        return 0;
    }
};
