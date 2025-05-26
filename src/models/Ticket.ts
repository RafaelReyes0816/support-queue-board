
export type TicketStatus = 'nuevo' | 'en-progreso' | 'resuelto' | 'cerrado';
export type TicketPriority = 'baja' | 'media' | 'alta' | 'critica';

export class Ticket {
  public id: string;
  public titulo: string;
  public descripcion: string;
  public status: TicketStatus;
  public prioridad: TicketPriority;
  public fechaCreacion: Date;
  public fechaActualizacion: Date;
  public asignadoA?: string;
  public cliente: string;

  constructor(
    titulo: string,
    descripcion: string,
    cliente: string,
    prioridad: TicketPriority = 'media'
  ) {
    this.id = this.generateId();
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.status = 'nuevo';
    this.prioridad = prioridad;
    this.fechaCreacion = new Date();
    this.fechaActualizacion = new Date();
    this.cliente = cliente;
  }

  private generateId(): string {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  public actualizarStatus(nuevoStatus: TicketStatus): void {
    this.status = nuevoStatus;
    this.fechaActualizacion = new Date();
  }

  public asignar(tecnico: string): void {
    this.asignadoA = tecnico;
    this.fechaActualizacion = new Date();
  }

  public getPrioridadColor(): string {
    const colors = {
      'baja': 'bg-green-100 text-green-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-orange-100 text-orange-800',
      'critica': 'bg-red-100 text-red-800'
    };
    return colors[this.prioridad];
  }

  public getStatusColor(): string {
    const colors = {
      'nuevo': 'bg-blue-100 text-blue-800',
      'en-progreso': 'bg-purple-100 text-purple-800',
      'resuelto': 'bg-green-100 text-green-800',
      'cerrado': 'bg-gray-100 text-gray-800'
    };
    return colors[this.status];
  }
}
