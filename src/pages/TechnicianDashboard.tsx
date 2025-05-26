
import React, { useState, useEffect } from 'react';
import { TicketManager } from '../models/TicketManager';
import { Ticket, TicketStatus } from '../models/Ticket';
import TechnicianTicketCard from '../components/TechnicianTicketCard';
import TechnicianMetrics from '../components/TechnicianMetrics';
import { 
  User, 
  Clock, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';

const TechnicianDashboard = () => {
  const [ticketManager] = useState(() => new TicketManager());
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [technicianTickets, setTechnicianTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'todos'>('todos');

  const technicians = ['Técnico 1', 'Técnico 2', 'Técnico 3', 'Técnico 4'];

  const refreshData = () => {
    if (selectedTechnician) {
      const allTickets = ticketManager.getAllTickets();
      const assignedTickets = allTickets.filter(ticket => ticket.asignadoA === selectedTechnician);
      setTechnicianTickets(assignedTickets);
    }
  };

  useEffect(() => {
    refreshData();
  }, [selectedTechnician]);

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    const success = ticketManager.updateTicketStatus(ticketId, newStatus);
    if (success) {
      refreshData();
    }
  };

  const getFilteredTickets = () => {
    if (statusFilter === 'todos') {
      return technicianTickets;
    }
    return technicianTickets.filter(ticket => ticket.status === statusFilter);
  };

  const getTechnicianMetrics = () => {
    const total = technicianTickets.length;
    const enProgreso = technicianTickets.filter(t => t.status === 'en-progreso').length;
    const resueltos = technicianTickets.filter(t => t.status === 'resuelto').length;
    const criticos = technicianTickets.filter(t => t.prioridad === 'critica').length;
    
    return { total, enProgreso, resueltos, criticos };
  };

  const filteredTickets = getFilteredTickets();
  const metrics = getTechnicianMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard del Técnico</h1>
              <p className="text-sm text-gray-600">Gestiona tus tickets asignados</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-gray-500" />
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                >
                  <option value="">Seleccionar técnico...</option>
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTechnician ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Métricas del técnico */}
          <TechnicianMetrics metrics={metrics} technicianName={selectedTechnician} />

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Mis Tickets</h3>
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'todos')}
              >
                <option value="todos">Todos los estados</option>
                <option value="nuevo">Nuevo</option>
                <option value="en-progreso">En Progreso</option>
                <option value="resuelto">Resuelto</option>
                <option value="cerrado">Cerrado</option>
              </select>
            </div>
          </div>

          {/* Lista de tickets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredTickets.length === 0 ? (
              <div className="col-span-full bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {statusFilter === 'todos' ? 'No hay tickets asignados' : `No hay tickets ${statusFilter}`}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {statusFilter === 'todos' 
                    ? 'Excelente trabajo, no tienes tickets pendientes.' 
                    : `No tienes tickets con estado ${statusFilter}.`
                  }
                </p>
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <TechnicianTicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onStatusChange={handleStatusChange}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <User className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-xl font-medium text-gray-900">Selecciona un técnico</h3>
            <p className="mt-2 text-gray-500">
              Elige un técnico del menú superior para ver sus tickets asignados
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboard;
