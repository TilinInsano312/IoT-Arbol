import { useState, useEffect, useCallback } from 'react';
import { 
    Thermometer, 
    Droplets, 
    Sun, 
    CalendarClock, 
    Sprout, 
    CloudFog, 
    Loader2,
    RefreshCw 
} from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { StatusCard } from './components/StatusCard';
import type { DeviceData, DeviceSummary } from './types';
import { fetchRealTimeData, fetchDailyET0, fetchDeviceList } from './services/api';

function App() {
    const [deviceList, setDeviceList] = useState<DeviceSummary[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [currentDevice, setCurrentDevice] = useState<DeviceData | null>(null);
    
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadList = async () => {
            try {
                const list = await fetchDeviceList();
                setDeviceList(list);
                if (list.length > 0) {
                    setSelectedDeviceId(list[0].id);
                }
            } catch (err) {
                setError('Error al cargar la lista de dispositivos.');
            } finally {
                setIsLoadingList(false);
            }
        };
        loadList();
    }, []);

    const updateRealTimeMetrics = useCallback(async () => {
        if (!selectedDeviceId) return;
        if (!currentDevice) setIsLoadingDetails(true);
        
        try {
            const partialData = await fetchRealTimeData(selectedDeviceId);
            
            if (partialData) {
                setCurrentDevice(prev => {
                    const base = prev || { evapotranspiration: 0 } as DeviceData;
                    return { ...base, ...partialData } as DeviceData;
                });
                
                setLastUpdate(new Date());
                setError(null);
            }
        } catch (err) {
            console.error(err);
            if (!currentDevice) setError('Error de conexión con sensores.');
        } finally {
            setIsLoadingDetails(false);
        }
    }, [selectedDeviceId, currentDevice]);

    const updateDailyMetrics = useCallback(async () => {
        if (!selectedDeviceId) return;

        try {
            const et0Value = await fetchDailyET0(selectedDeviceId);
            
            setCurrentDevice(prev => {
                const base = prev || { 
                    id: selectedDeviceId, 
                    name: 'Cargando...', 
                    temperature: 0, 
                    humidity: 0, 
                    uvIndex: 0, 
                    waterLevel: 0, 
                    lastIrrigation: '--' 
                } as DeviceData;
                
                return { ...base, evapotranspiration: et0Value };
            });
        } catch (err) {
            console.error("Error actualizando ET0 diario:", err);
        }
    }, [selectedDeviceId]);

    useEffect(() => {
        if (!selectedDeviceId) return;
        updateRealTimeMetrics();
        updateDailyMetrics();
        const intervalFast = setInterval(() => {
            console.log(`[${new Date().toLocaleTimeString()}] Polling 5min: Sensores`);
            updateRealTimeMetrics();
        }, 5 * 60 * 1000);
        const intervalSlow = setInterval(() => {
            console.log(`[${new Date().toLocaleTimeString()}] Polling 24h: ET0`);
            updateDailyMetrics();
        }, 24 * 60 * 60 * 1000);
        return () => {
            clearInterval(intervalFast);
            clearInterval(intervalSlow);
        };
    }, [selectedDeviceId, updateRealTimeMetrics, updateDailyMetrics]);
    if (isLoadingList) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500 bg-gray-50">
                <Loader2 className="animate-spin mr-2"/> Iniciando sistema...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-slate-800">
            <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3 shadow-sm">
                             <Sprout className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 leading-tight">Dashboard EvapoTranspo</h1>
                            <div className="flex items-center mt-1">
                                <span className={`h-2 w-2 rounded-full mr-2 ${currentDevice ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                                <p className="text-xs text-gray-500 font-medium">
                                    {currentDevice ? 'API Conectada' : 'Desconectado'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto min-w-[250px]">
                        <select
                            value={selectedDeviceId}
                            onChange={(e) => {
                                setCurrentDevice(null);
                                setSelectedDeviceId(e.target.value);
                            }}
                            className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2.5 pl-3 pr-10 text-sm focus:border-green-500 focus:ring-green-500 shadow-sm cursor-pointer hover:bg-white transition-colors"
                        >
                            {deviceList.map((device) => (
                                <option key={device.id} value={device.id}>
                                    {device.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-md animate-fade-in">
                        <p className="text-sm text-red-700 font-medium">{error}</p>
                    </div>
                )}

                {isLoadingDetails && !currentDevice && (
                    <div className="flex flex-col items-center justify-center py-20 opacity-75">
                        <Loader2 className="animate-spin text-green-600 h-10 w-10 mb-4" />
                        <p className="text-gray-500 animate-pulse">Obteniendo telemetría...</p>
                    </div>
                )}

                {currentDevice && (
                <div className="animate-fade-in">
                                        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                        <h2 className="text-lg font-medium text-gray-700">
                            Métricas: <span className="font-bold text-gray-900">{currentDevice.name}</span>
                        </h2>
                        
                        <div className="flex items-center text-xs text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
                            <RefreshCw size={12} className="mr-2 text-green-600" />
                            <span>
                                {lastUpdate ? lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                <MetricCard
                            title="Temperatura Aire"
                            value={currentDevice.temperature}
                            unit="°C"
                            icon={<Thermometer size={24} />}
                            colorClass="text-orange-500"
                        />
                        <MetricCard
                            title="Humedad Relativa"
                            value={currentDevice.humidity}
                            unit="%"
                            icon={<Droplets size={24} />}
                            colorClass="text-blue-500"
                        />
                        <MetricCard
                            title="Índice UV"
                            value={currentDevice.uvIndex}
                            unit={currentDevice.uvIndex > 7 ? 'Alto' : 'Normal'}
                            icon={<Sun size={24} />}
                            colorClass={currentDevice.uvIndex > 7 ? 'text-purple-600' : 'text-yellow-500'}
                        />
                        <MetricCard
                            title="Evapotranspiración (ET₀)"
                            value={currentDevice.evapotranspiration}
                            unit="mm/día"
                            icon={<CloudFog size={24} />}
                            colorClass="text-cyan-600"
                        />
                        <MetricCard
                            title="Último Riego"
                            value={currentDevice.lastIrrigation}
                            icon={<CalendarClock size={24} />}
                            colorClass="text-teal-600"
                        />
                        <div className="md:col-span-1 lg:col-span-1">
                            <StatusCard
                                title="Nivel de Agua (Tanque)"
                                value={currentDevice.waterLevel}
                                unit="mm"
                                threshold={20}
                            />
                        </div>
                    </div>
                </div>
                )}
            </main>
        </div>
    );
}

export default App;