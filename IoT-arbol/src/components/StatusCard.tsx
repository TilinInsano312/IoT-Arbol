import React from 'react';
import { AlertCircle, Waves } from 'lucide-react';

interface StatusCardProps {
    title: string;
    value: number;
    unit: string;
    threshold?: number;
}

export const StatusCard: React.FC<StatusCardProps> = ({ title, value, unit, threshold = 10 }) => {
    const isStable = value > threshold;

    const statusStyles = isStable
        ? {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            text: 'text-blue-900',
            iconColor: 'text-blue-600',
          }
        : {
            bg: 'bg-red-50',
            border: 'border-red-200',
            text: 'text-red-800',
            iconColor: 'text-red-600',
          };

    return (
        <div className={`${statusStyles.bg} ${statusStyles.border} rounded-xl shadow-sm p-6 border flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500`}>
             <div className="absolute right-2 top-2 opacity-10 text-gray-500 scale-150">
                <Waves size={64}/>
            </div>
            <div className="flex items-center mb-2 z-10">
                 <div className={`p-2 rounded-full mr-3 bg-white bg-opacity-60 ${statusStyles.iconColor}`}>
                    {isStable ? <Waves size={20} /> : <AlertCircle size={20} />}
                 </div>
                <h3 className={`text-sm font-medium ${statusStyles.text} opacity-80`}>{title}</h3>
            </div>
            <div className="flex items-baseline z-10 mt-2">
                <span className={`text-5xl font-bold ${statusStyles.text} tracking-tight`}>
                    {value}
                </span>
                <span className={`text-xl ml-2 font-medium ${statusStyles.text} opacity-70`}>
                    {unit}
                </span>
            </div>
        </div>
    );
};