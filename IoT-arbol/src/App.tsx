// src/App.tsx
import { useState, useEffect } from 'react';
import { Thermometer, Droplets, Sun, CalendarClock, Sprout, CloudFog, Loader2 } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { StatusCard } from './components/StatusCard';
import type { DeviceData, DeviceSummary } from './types';
import { fetchDeviceDetails, fetchDeviceList } from './services/api';

function App() {
    // Estados para manejar la data y la UI
    const [deviceList, setDeviceList] = useState<DeviceSummary[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
    const [currentDevice, setCurrentDevice] = useState<DeviceData | null>(null);
    
    // Estados de carga y error
    const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
    const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Efecto inicial: Cargar la lista de dispositivos para el dropdown
    useEffect(() => {
        const loadList = async () => {
            try {
                const list = await fetchDeviceList();
                setDeviceList(list);
                if (list.length > 0) {
                    // Seleccionar automáticamente el primero al cargar
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

    // 2. Efecto secundario: Cargar detalles cuando cambia el ID seleccionado
    useEffect(() => {
        if (!selectedDeviceId) return;

        const loadDetails = async () => {
            setIsLoadingDetails(true);
            setError(null); // Resetear errores previos
            try {
                const data = await fetchDeviceDetails(selectedDeviceId);
                if (data) {
                    setCurrentDevice(data);
                } else {
                    setError('Dispositivo no encontrado.');
                }
            } catch (err) {
                setError('Error al conectar con el servidor de sensores.');
            } finally {
                setIsLoadingDetails(false);
            }
        };

        loadDetails();
    }, [selectedDeviceId]); // Se ejecuta cada vez que selectedDeviceId cambia

    // Renderizado condicional para el estado de carga inicial de la lista
    if (isLoadingList) {
        return <div className="min-h-screen flex items-center justify-center text-gray-500"><Loader2 className="animate-spin mr-2"/> Cargando sistema...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- Header y Selector --- */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                             <Sprout className="text-green-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Dashboard de Riego IoT</h1>
                            <p className="text-sm text-gray-500">Monitorización vía API</p>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto">
                        <select
                            value={selectedDeviceId}
                            onChange={(e) => setSelectedDeviceId(e.target.value)}
                            disabled={isLoadingDetails} // Deshabilitar mientras carga
                            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-green-500 focus:ring-green-500 sm:text-sm border shadow-sm cursor-pointer disabled:opacity-50"
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

            {/* --- Contenido Principal --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {/* Manejo de Errores */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {/* Estado de Carga de Detalles */}
                {isLoadingDetails && (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-green-600 h-8 w-8" />
                    </div>
                )}

                {/* Grid de Datos (Solo se muestra si hay datos y no está cargando) */}
                {!isLoadingDetails && currentDevice && (
                <>
                    <div className="mb-6 animate-fade-in">
                         <h2 className="text-lg font-medium text-gray-700">
                            Métricas: <span className="font-bold text-gray-900">{currentDevice.name}</span>
                        </h2>
                    </div>

                    {/* AHORA EL GRID ES DE 3 COLUMNAS EN DESKTOP */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
                        
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

                        {/* NUEVA TARJETA: Evapotranspiración */}
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

                        {/* Status Card ahora ocupa solo 1 espacio en desktop para mantener el grid de 3x2 ordenado */}
                        <div className="md:col-span-1 lg:col-span-1">
                            <StatusCard
                                title="Nivel de Agua (Estabilidad)"
                                isStable={currentDevice.isWaterLevelStable}
                            />
                        </div>
                    </div>
                </>
                )}
            </main>
        </div>
    );
}

export default App;