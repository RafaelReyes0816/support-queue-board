
import { Ticket } from './Ticket';

export class TicketQueue {
  private items: Ticket[] = [];

  // FIFO: First In, First Out
  public enqueue(ticket: Ticket): void {
    this.items.push(ticket);
    console.log(`Ticket ${ticket.id} agregado a la cola`);
  }

  public dequeue(): Ticket | null {
    if (this.isEmpty()) {
      console.log('La cola está vacía');
      return null;
    }
    const ticket = this.items.shift()!;
    console.log(`Ticket ${ticket.id} removido de la cola`);
    return ticket;
  }

  public peek(): Ticket | null {
    return this.isEmpty() ? null : this.items[0];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  public getAll(): Ticket[] {
    return [...this.items];
  }

  public findById(id: string): Ticket | null {
    return this.items.find(ticket => ticket.id === id) || null;
  }

  public removeById(id: string): boolean {
    const index = this.items.findIndex(ticket => ticket.id === id);
    if (index !== -1) {
      this.items.splice(index, 1);
      return true;
    }
    return false;
  }

  public clear(): void {
    this.items = [];
  }
}
