
export interface Action {
  type: string;
  data: any;
  timestamp: Date;
  description: string;
}

export class ActionStack {
  private items: Action[] = [];
  private maxSize: number = 50; // Límite para evitar uso excesivo de memoria

  // LIFO: Last In, First Out
  public push(action: Action): void {
    if (this.items.length >= this.maxSize) {
      this.items.shift(); // Remover el más antiguo si alcanzamos el límite
    }
    this.items.push(action);
    console.log(`Acción ${action.type} agregada al historial`);
  }

  public pop(): Action | null {
    if (this.isEmpty()) {
      console.log('El historial está vacío');
      return null;
    }
    const action = this.items.pop()!;
    console.log(`Acción ${action.type} removida del historial`);
    return action;
  }

  public peek(): Action | null {
    return this.isEmpty() ? null : this.items[this.items.length - 1];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  public getAll(): Action[] {
    return [...this.items].reverse(); // Mostrar las más recientes primero
  }

  public clear(): void {
    this.items = [];
  }

  public getRecent(count: number = 10): Action[] {
    return this.getAll().slice(0, count);
  }
}
