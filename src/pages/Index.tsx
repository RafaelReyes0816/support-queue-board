import React, { useState, useEffect } from 'react';
import { TicketManager } from '../models/TicketManager';
import { Ticket, TicketStatus } from '../models/Ticket';
import TicketCard from '../components/TicketCard';
import MetricsCard from '../components/MetricsCard';
import ActionHistory from '../components/ActionHistory';
import NewTicketForm from '../components/NewTicketForm';
import { 
  Ticket as TicketIcon, 
  Clock, 
  User, 
  Users,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [ticketManager] = useState(() => new TicketManager());
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'todos'>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [assigningTicket, setAssigningTicket] = useState<string | null>(null);

  const technicians = ['Técnico 1', 'Técnico 2', 'Técnico 3', 'Técnico 4'];

  const refreshData = () => {
    const allTickets = ticketManager.getAllTickets();
    setTickets(allTickets);
    applyFilters(allTickets);
  };

  const applyFilters = (ticketsToFilter: Ticket[]) => {
    let filtered = ticketsToFilter;

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (searchQuery.trim()) {
      filtered = ticketManager.searchTickets(searchQuery);
      if (statusFilter !== 'todos') {
        filtered = filtered.filter(ticket => ticket.status === statusFilter);
      }
    }

    setFilteredTickets(filtered);
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    applyFilters(tickets);
  }, [statusFilter, searchQuery, tickets]);

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    const success = ticketManager.updateTicketStatus(ticketId, newStatus as TicketStatus);
    if (success) {
      refreshData();
    }
  };

  const handleAssignTicket = (ticketId: string) => {
    setAssigningTicket(ticketId);
  };

  const confirmAssignment = () => {
    if (assigningTicket && selectedTechnician) {
      const success = ticketManager.assignTicket(assigningTicket, selectedTechnician);
      if (success) {
        refreshData();
      }
      setAssigningTicket(null);
      setSelectedTechnician('');
    }
  };

  const handleNewTicket = (ticketData: any) => {
    const newTicket = new Ticket(
      ticketData.titulo,
      ticketData.descripcion,
      ticketData.cliente,
      ticketData.prioridad
    );
    ticketManager.addTicket(newTicket);
    refreshData();
  };

  const handleUndo = () => {
    const undoneAction = ticketManager.undoLastAction();
    if (undoneAction) {
      console.log('Acción deshecha:', undoneAction.description);
      // En una implementación real, aquí revertiríamos la acción
      refreshData();
    }
  };

  const metrics = ticketManager.getMetrics();
  const recentActions = ticketManager.getRecentActions(10);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard de Tickets</h1>
              <p className="text-sm text-gray-600">Gestión con estructuras FIFO, Stack y POO</p>
            </div>
            <div className="flex gap-4">
              <Link
                to="/technician"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Dashboard Técnico
              </Link>
              <button
                onClick={() => setShowNewTicketForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Nuevo Ticket
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricsCard
            title="Total Tickets"
            value={metrics.total}
            icon={<TicketIcon className="h-8 w-8" />}
            color="text-blue-600"
          />
          <MetricsCard
            title="En Progreso"
            value={metrics.enProgreso}
            icon={<Clock className="h-8 w-8" />}
            color="text-purple-600"
            description="Cola FIFO activa"
          />
          <MetricsCard
            title="Críticos"
            value={metrics.criticos}
            icon={<User className="h-8 w-8" />}
            color="text-red-600"
            description="Prioridad alta"
          />
          <MetricsCard
            title="Resueltos"
            value={metrics.resuelto}
            icon={<Users className="h-8 w-8" />}
            color="text-green-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel principal de tickets */}
          <div className="lg:col-span-2">
            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar tickets..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
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
            </div>

            {/* Lista de tickets */}
            <div className="grid grid-cols-1 gap-4">
              {filteredTickets.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 text-center">
                  <TicketIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tickets</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchQuery ? 'No se encontraron resultados para tu búsqueda.' : 'Comienza creando tu primer ticket.'}
                  </p>
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    onStatusChange={handleStatusChange}
                    onAssign={handleAssignTicket}
                  />
                ))
              )}
            </div>
          </div>

          {/* Panel lateral */}
          <div className="space-y-6">
            <ActionHistory
              actions={recentActions}
              onUndo={handleUndo}
            />

            {/* Información sobre estructuras de datos */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Estructuras de Datos</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-blue-50 rounded">
                  <h4 className="font-medium text-blue-900">Cola FIFO</h4>
                  <p className="text-blue-700">Los tickets se procesan por orden de llegada en cada estado.</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <h4 className="font-medium text-purple-900">Stack (Pila)</h4>
                  <p className="text-purple-700">Historial de acciones con capacidad de deshacer (LIFO).</p>
                </div>
                <div className="p-3 bg-green-50 rounded">
                  <h4 className="font-medium text-green-900">POO</h4>
                  <p className="text-green-700">Clases Ticket, Queue, Stack y TicketManager encapsulan la lógica.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de nuevo ticket */}
      {showNewTicketForm && (
        <NewTicketForm
          onSubmit={handleNewTicket}
          onClose={() => setShowNewTicketForm(false)}
        />
      )}

      {/* Modal de asignación */}
      {assigningTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Asignar Ticket</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar Técnico
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedTechnician}
                  onChange={(e) => setSelectedTechnician(e.target.value)}
                >
                  <option value="">Selecciona un técnico...</option>
                  {technicians.map(tech => (
                    <option key={tech} value={tech}>{tech}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={confirmAssignment}
                  disabled={!selectedTechnician}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Asignar
                </button>
                <button
                  onClick={() => {
                    setAssigningTicket(null);
                    setSelectedTechnician('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
