
import React from 'react';

interface MetricsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  description?: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({ title, value, icon, color, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`flex-shrink-0 ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-3xl font-bold text-gray-900">{value}</dd>
            {description && (
              <dd className="text-sm text-gray-600">{description}</dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
