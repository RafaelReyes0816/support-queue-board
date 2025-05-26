
import React from 'react';
import { Ticket, TicketStatus } from '../models/Ticket';
import { Clock, User, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

interface TechnicianTicketCardProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, newStatus: TicketStatus) => void;
}

const TechnicianTicketCard: React.FC<TechnicianTicketCardProps> = ({ ticket, onStatusChange }) => {
  const getStatusOptions = () => {
    const allStatuses = [
      { value: 'nuevo', label: 'Nuevo', disabled: false },
      { value: 'en-progreso', label: 'En Progreso', disabled: false },
      { value: 'resuelto', label: 'Resuelto', disabled: false },
      { value: 'cerrado', label: 'Cerrado', disabled: ticket.status !== 'resuelto' }
    ];
    return allStatuses;
  };

  const getPriorityIcon = () => {
    if (ticket.prioridad === 'critica') {
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
    return null;
  };

  const getQuickActions = () => {
    const actions = [];
    
    if (ticket.status === 'nuevo') {
      actions.push({
        label: 'Iniciar',
        action: () => onStatusChange(ticket.id, 'en-progreso'),
        className: 'bg-blue-600 hover:bg-blue-700 text-white'
      });
    }
    
    if (ticket.status === 'en-progreso') {
      actions.push({
        label: 'Resolver',
        action: () => onStatusChange(ticket.id, 'resuelto'),
        className: 'bg-green-600 hover:bg-green-700 text-white'
      });
    }
    
    if (ticket.status === 'resuelto') {
      actions.push({
        label: 'Cerrar',
        action: () => onStatusChange(ticket.id, 'cerrado'),
        className: 'bg-gray-600 hover:bg-gray-700 text-white'
      });
    }
    
    return actions;
  };

  const quickActions = getQuickActions();

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      {/* Header del ticket */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-lg">{ticket.titulo}</h3>
          {getPriorityIcon()}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.getPrioridadColor()}`}>
          {ticket.prioridad.toUpperCase()}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ticket.descripcion}</p>

      {/* Estado actual */}
      <div className="flex justify-center mb-4">
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${ticket.getStatusColor()}`}>
          {ticket.status.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      {/* Información del ticket */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>Cliente: {ticket.cliente}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Creado: {ticket.fechaCreacion.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>Actualizado: {ticket.fechaActualizacion.toLocaleString()}</span>
        </div>
        <div className="text-xs text-gray-500 font-mono">
          ID: {ticket.id}
        </div>
      </div>

      {/* Acciones rápidas */}
      {quickActions.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${action.className}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de estado manual */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Cambiar estado:
        </label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value as TicketStatus)}
        >
          {getStatusOptions().map(option => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TechnicianTicketCard;
