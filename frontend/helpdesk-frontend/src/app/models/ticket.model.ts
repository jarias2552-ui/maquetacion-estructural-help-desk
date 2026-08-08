export interface Ticket {

  _id?: string;

  titulo: string;

  descripcion: string;

  categoria?: string;

  prioridad: string;

  estado: string;

  usuario: string;

  createdAt?: Date;

  updatedAt?: Date;

}