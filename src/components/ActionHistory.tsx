
import React from 'react';
import { Action } from '../models/Stack';
import { Clock } from 'lucide-react';

interface ActionHistoryProps {
  actions: Action[];
  onUndo: () => void;
}

const ActionHistory: React.FC<ActionHistoryProps> = ({ actions, onUndo }) => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Historial de Acciones (Stack)</h3>
        <button
          onClick={onUndo}
          disabled={actions.length === 0}
          className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Deshacer Última
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {actions.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay acciones en el historial</p>
        ) : (
          actions.map((action, index) => (
            <div key={index} className="flex items-start p-2 bg-gray-50 rounded border">
              <Clock className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-gray-900">{action.type}</span>
                  <span className="text-xs text-gray-500">
                    {action.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{action.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActionHistory;
