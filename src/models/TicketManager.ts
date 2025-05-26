
import { Ticket, TicketStatus, TicketPriority } from './Ticket';
import { TicketQueue } from './Queue';
import { ActionStack, Action } from './Stack';

export class TicketManager {
  private allTickets: Map<string, Ticket> = new Map();
  private queuesByStatus: Map<TicketStatus, TicketQueue> = new Map();
  private actionHistory: ActionStack = new ActionStack();

  constructor() {
    // Inicializar colas para cada estado
    const statuses: TicketStatus[] = ['nuevo', 'en-progreso', 'resuelto', 'cerrado'];
    statuses.forEach(status => {
      this.queuesByStatus.set(status, new TicketQueue());
    });

    // Cargar tickets de ejemplo
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    const sampleTickets = [
      new Ticket('Error en login', 'Los usuarios no pueden acceder al sistema', 'Juan Pérez', 'alta'),
      new Ticket('Lentitud en la aplicación', 'La aplicación web está muy lenta', 'María García', 'media'),
      new Ticket('Bug en reportes', 'Los reportes no se generan correctamente', 'Carlos López', 'alta'),
      new Ticket('Solicitud de nueva funcionalidad', 'Agregar filtros avanzados', 'Ana Rodríguez', 'baja'),
      new Ticket('Error 500 en servidor', 'Error interno del servidor recurrente', 'Luis Martín', 'critica'),
    ];

    sampleTickets.forEach((ticket, index) => {
      if (index < 2) {
        ticket.actualizarStatus('en-progreso');
        ticket.asignar('Técnico ' + (index + 1));
      }
      this.addTicket(ticket);
    });
  }

  public addTicket(ticket: Ticket): void {
    this.allTickets.set(ticket.id, ticket);
    const queue = this.queuesByStatus.get(ticket.status);
    if (queue) {
      queue.enqueue(ticket);
    }

    this.addAction({
      type: 'CREATE_TICKET',
      data: { ticketId: ticket.id, titulo: ticket.titulo },
      timestamp: new Date(),
      description: `Ticket creado: ${ticket.titulo}`
    });
  }

  public updateTicketStatus(ticketId: string, newStatus: TicketStatus): boolean {
    const ticket = this.allTickets.get(ticketId);
    if (!ticket) return false;

    const oldStatus = ticket.status;
    
    // Remover de la cola actual
    const oldQueue = this.queuesByStatus.get(oldStatus);
    if (oldQueue) {
      oldQueue.removeById(ticketId);
    }

    // Actualizar status
    ticket.actualizarStatus(newStatus);

    // Agregar a la nueva cola
    const newQueue = this.queuesByStatus.get(newStatus);
    if (newQueue) {
      newQueue.enqueue(ticket);
    }

    this.addAction({
      type: 'UPDATE_STATUS',
      data: { ticketId, oldStatus, newStatus },
      timestamp: new Date(),
      description: `Status cambiado de ${oldStatus} a ${newStatus} para ticket ${ticketId}`
    });

    return true;
  }

  public assignTicket(ticketId: string, tecnico: string): boolean {
    const ticket = this.allTickets.get(ticketId);
    if (!ticket) return false;

    const oldTecnico = ticket.asignadoA;
    ticket.asignar(tecnico);

    this.addAction({
      type: 'ASSIGN_TICKET',
      data: { ticketId, oldTecnico, newTecnico: tecnico },
      timestamp: new Date(),
      description: `Ticket ${ticketId} asignado a ${tecnico}`
    });

    return true;
  }

  public getNextTicket(status: TicketStatus): Ticket | null {
    const queue = this.queuesByStatus.get(status);
    return queue ? queue.peek() : null;
  }

  public processNextTicket(status: TicketStatus): Ticket | null {
    const queue = this.queuesByStatus.get(status);
    if (!queue) return null;

    const ticket = queue.dequeue();
    if (ticket) {
      this.addAction({
        type: 'PROCESS_TICKET',
        data: { ticketId: ticket.id },
        timestamp: new Date(),
        description: `Ticket ${ticket.id} procesado desde cola ${status}`
      });
    }
    return ticket;
  }

  public getTicketsByStatus(status: TicketStatus): Ticket[] {
    const queue = this.queuesByStatus.get(status);
    return queue ? queue.getAll() : [];
  }

  public getAllTickets(): Ticket[] {
    return Array.from(this.allTickets.values());
  }

  public getTicketById(id: string): Ticket | null {
    return this.allTickets.get(id) || null;
  }

  public getMetrics() {
    const allTickets = this.getAllTickets();
    return {
      total: allTickets.length,
      nuevo: this.getTicketsByStatus('nuevo').length,
      enProgreso: this.getTicketsByStatus('en-progreso').length,
      resuelto: this.getTicketsByStatus('resuelto').length,
      cerrado: this.getTicketsByStatus('cerrado').length,
      criticos: allTickets.filter(t => t.prioridad === 'critica').length,
      altos: allTickets.filter(t => t.prioridad === 'alta').length,
    };
  }

  public addAction(action: Action): void {
    this.actionHistory.push(action);
  }

  public getRecentActions(count: number = 10): Action[] {
    return this.actionHistory.getRecent(count);
  }

  public undoLastAction(): Action | null {
    return this.actionHistory.pop();
  }

  public searchTickets(query: string): Ticket[] {
    const lowercaseQuery = query.toLowerCase();
    return this.getAllTickets().filter(ticket =>
      ticket.titulo.toLowerCase().includes(lowercaseQuery) ||
      ticket.descripcion.toLowerCase().includes(lowercaseQuery) ||
      ticket.cliente.toLowerCase().includes(lowercaseQuery) ||
      ticket.id.toLowerCase().includes(lowercaseQuery)
    );
  }
}
