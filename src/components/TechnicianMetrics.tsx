
import React from 'react';
import { TicketIcon, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface TechnicianMetricsProps {
  metrics: {
    total: number;
    enProgreso: number;
    resueltos: number;
    criticos: number;
  };
  technicianName: string;
}

const TechnicianMetrics: React.FC<TechnicianMetricsProps> = ({ metrics, technicianName }) => {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Dashboard de {technicianName}</h2>
        <p className="text-sm text-gray-600">Resumen de tickets asignados</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TicketIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Asignados</dt>
                <dd className="text-3xl font-bold text-gray-900">{metrics.total}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">En Progreso</dt>
                <dd className="text-3xl font-bold text-gray-900">{metrics.enProgreso}</dd>
                <dd className="text-sm text-gray-600">Trabajando ahora</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Resueltos</dt>
                <dd className="text-3xl font-bold text-gray-900">{metrics.resueltos}</dd>
                <dd className="text-sm text-gray-600">Completados</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Críticos</dt>
                <dd className="text-3xl font-bold text-gray-900">{metrics.criticos}</dd>
                <dd className="text-sm text-gray-600">Prioridad alta</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianMetrics;
