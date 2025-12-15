// src/components/MetricCard.tsx
import React, { type ReactNode } from 'react';

interface MetricCardProps {
    title: string;
    value: number | string;
    unit?: string;
    icon: ReactNode;
    colorClass?: string; 
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, icon, colorClass = 'text-gray-600' }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex items-center overflow-hidden relative">
            <div className={`absolute -right-4 -bottom-4 opacity-10 ${colorClass} transform scale-150 rotate-12`}>
                {icon}
            </div>
            
            <div className={`p-3 rounded-full bg-opacity-20 mr-4 ${colorClass.replace('text-', 'bg-')}`}>
                <div className={colorClass}>
                    {icon}
                </div>
            </div>
            <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
                <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-800">{value}</span>
                    {unit && <span className="ml-1 text-sm text-gray-500 font-medium">{unit}</span>}
                </div>
            </div>
        </div>
    );
};