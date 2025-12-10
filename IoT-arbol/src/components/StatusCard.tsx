// src/components/StatusCard.tsx
import React from 'react';
import { CheckCircle2, AlertCircle, Waves } from 'lucide-react';

interface StatusCardProps {
    title: string;
    isStable: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, isStable }) => {
    // Definimos estilos basados en el estado booleano
    const statusStyles = isStable
        ? {
            bg: 'bg-green-50',
            border: 'border-green-200',
            text: 'text-green-800',
            iconColor: 'text-green-600',
            IconComponent: CheckCircle2,
            statusText: 'Estable',
          }
        : {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            iconColor: 'text-red-600',
            IconComponent: AlertCircle,
            statusText: 'Inestable / Crítico',
          };

    const StatusIcon = statusStyles.IconComponent;

    return (
        <div className={`${statusStyles.bg} ${statusStyles.border} rounded-xl shadow-sm p-6 border flex flex-col justify-between h-full relative overflow-hidden`}>
             {/* Icono de agua de fondo */}
             <div className="absolute right-2 top-2 opacity-5 text-gray-500 scale-150">
                <Waves size={64}/>
            </div>

            <div className="flex items-center mb-3 z-10">
                 <div className={`p-2 rounded-full mr-3 bg-white bg-opacity-60 ${statusStyles.iconColor}`}>
                    <Waves size={20} />
                 </div>
                <h3 className={`text-sm font-medium ${statusStyles.text} opacity-80`}>{title}</h3>
            </div>
            
            <div className="flex items-center z-10">
                <StatusIcon className={`mr-2 ${statusStyles.iconColor}`} size={28} />
                <span className={`text-xl font-bold ${statusStyles.text}`}>
                    {statusStyles.statusText}
                </span>
            </div>
        </div>
    );
};