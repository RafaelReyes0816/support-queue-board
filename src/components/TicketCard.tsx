
import React from 'react';
import { Ticket } from '../models/Ticket';
import { Clock, User, Calendar } from 'lucide-react';

interface TicketCardProps {
  ticket: Ticket;
  onStatusChange: (ticketId: string, newStatus: string) => void;
  onAssign: (ticketId: string) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, onStatusChange, onAssign }) => {
  const statusOptions = [
    { value: 'nuevo', label: 'Nuevo' },
    { value: 'en-progreso', label: 'En Progreso' },
    { value: 'resuelto', label: 'Resuelto' },
    { value: 'cerrado', label: 'Cerrado' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 truncate flex-1">{ticket.titulo}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.getPrioridadColor()}`}>
          {ticket.prioridad.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ticket.descripcion}</p>

      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.getStatusColor()}`}>
          {ticket.status.replace('-', ' ').toUpperCase()}
        </span>
        <span className="text-xs text-gray-500 font-mono">{ticket.id}</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <User className="w-3 h-3 mr-1" />
          <span>Cliente: {ticket.cliente}</span>
        </div>
        {ticket.asignadoA && (
          <div className="flex items-center text-xs text-gray-500">
            <User className="w-3 h-3 mr-1" />
            <span>Asignado: {ticket.asignadoA}</span>
          </div>
        )}
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          <span>Creado: {ticket.fechaCreacion.toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          <span>Actualizado: {ticket.fechaActualizacion.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <select
          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={ticket.status}
          onChange={(e) => onStatusChange(ticket.id, e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => onAssign(ticket.id)}
          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Asignar
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
