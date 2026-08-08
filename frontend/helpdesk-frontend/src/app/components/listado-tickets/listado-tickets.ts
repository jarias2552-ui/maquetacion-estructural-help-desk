import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';


@Component({

  selector: 'app-listado-tickets',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './listado-tickets.html',

  styleUrl: './listado-tickets.css'

})


export class ListadoTickets implements OnInit {


  // ==========================================
  // DATOS
  // ==========================================

  tickets: Ticket[] = [];

  ticketsFiltrados: Ticket[] = [];

  cantidadTickets = 0;


  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  abiertos = 0;

  enProceso = 0;

  cerrados = 0;

  porcentajeCerrados = 0;


  // Tickets que todavía requieren atención
  get ticketsActivos(): number {

    return this.abiertos + this.enProceso;

  }


  // ==========================================
  // FILTROS
  // ==========================================

  buscar = '';

  filtroEstado = 'Todos';

  filtroPrioridad = 'Todas';


  // ==========================================
  // ESTADO DEL SISTEMA
  // ==========================================

  cargando = false;

  mensaje = '';

  tipoMensaje = '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private ticketService: TicketService,

    private cd: ChangeDetectorRef

  ) {}


  // ==========================================
  // INICIO
  // ==========================================

  ngOnInit(): void {

    this.cargarTickets();

  }


  // ==========================================
  // CARGAR TICKETS
  // ==========================================

  cargarTickets(): void {

    this.cargando = true;

    this.ticketService
      .getTickets()
      .subscribe({

        next: (data: Ticket[]) => {

          console.log(
            'Tickets recibidos:',
            data
          );

          this.tickets = Array.isArray(data)
            ? data
            : [];

          this.calcularEstadisticas();

          this.aplicarFiltros();

          this.cargando = false;

          this.cd.detectChanges();

        },


        error: (error) => {

          console.error(
            'Error cargando tickets:',
            error
          );

          this.tickets = [];

          this.calcularEstadisticas();

          this.aplicarFiltros();

          this.cargando = false;

          this.mostrarMensaje(
            'No se pudieron cargar los tickets',
            'error'
          );

          this.cd.detectChanges();

        }

      });

  }


  // ==========================================
  // CALCULAR ESTADÍSTICAS
  // ==========================================

  calcularEstadisticas(): void {

    this.cantidadTickets = this.tickets.length;


    this.abiertos = this.tickets.filter(
      ticket => ticket.estado === 'Abierto'
    ).length;


    this.enProceso = this.tickets.filter(
      ticket => ticket.estado === 'En Proceso'
    ).length;


    this.cerrados = this.tickets.filter(
      ticket => ticket.estado === 'Cerrado'
    ).length;


    if (this.cantidadTickets > 0) {

      this.porcentajeCerrados = Math.round(
        (this.cerrados / this.cantidadTickets) * 100
      );

    } else {

      this.porcentajeCerrados = 0;

    }

  }


  // ==========================================
  // FILTROS
  // ==========================================

  aplicarFiltros(): void {

    const texto = this.buscar
      .toLowerCase()
      .trim();


    this.ticketsFiltrados = this.tickets.filter(
      (ticket: Ticket) => {

        const titulo = (
          ticket.titulo || ''
        ).toLowerCase();


        const descripcion = (
          ticket.descripcion || ''
        ).toLowerCase();


        const categoria = (
          ticket.categoria || ''
        ).toLowerCase();


        const usuario = (
          ticket.usuario || ''
        ).toLowerCase();


        const coincideBusqueda =

          titulo.includes(texto) ||

          descripcion.includes(texto) ||

          categoria.includes(texto) ||

          usuario.includes(texto);


        const coincideEstado =

          this.filtroEstado === 'Todos' ||

          ticket.estado === this.filtroEstado;


        const coincidePrioridad =

          this.filtroPrioridad === 'Todas' ||

          ticket.prioridad === this.filtroPrioridad;


        return (

          coincideBusqueda &&

          coincideEstado &&

          coincidePrioridad

        );

      }
    );

  }


  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  limpiarFiltros(): void {

    this.buscar = '';

    this.filtroEstado = 'Todos';

    this.filtroPrioridad = 'Todas';

    this.aplicarFiltros();

  }


  // ==========================================
  // OBTENER INICIAL DEL USUARIO
  // ==========================================

  obtenerInicial(usuario?: string): string {

    if (!usuario || usuario.trim() === '') {

      return '?';

    }

    return usuario
      .trim()
      .charAt(0)
      .toUpperCase();

  }


  // ==========================================
  // CAMBIAR ESTADO
  // ==========================================

  cambiarEstado(ticket: Ticket): void {

    if (!ticket._id) {

      this.mostrarMensaje(
        'El ticket no tiene un identificador válido',
        'error'
      );

      return;

    }


    let nuevoEstado = ticket.estado;


    if (ticket.estado === 'Abierto') {

      nuevoEstado = 'En Proceso';

    }

    else if (ticket.estado === 'En Proceso') {

      nuevoEstado = 'Cerrado';

    }

    else {

      nuevoEstado = 'Abierto';

    }


    this.cargando = true;


    this.ticketService
      .updateTicket(

        ticket._id,

        {

          ...ticket,

          estado: nuevoEstado

        }

      )
      .subscribe({

        next: () => {

          this.mostrarMensaje(

            `Estado actualizado a "${nuevoEstado}"`,

            'success'

          );

          this.cargarTickets();

        },


        error: (error) => {

          console.error(
            'Error actualizando ticket:',
            error
          );

          this.cargando = false;

          this.mostrarMensaje(
            'No se pudo actualizar el ticket',
            'error'
          );

        }

      });

  }


  // ==========================================
  // ELIMINAR TICKET
  // ==========================================

  eliminarTicket(id?: string): void {

    if (!id) {

      this.mostrarMensaje(
        'No se encontró el ID del ticket',
        'error'
      );

      return;

    }


    const confirmar = window.confirm(

      '¿Está seguro de eliminar este ticket?\n\nEsta acción no se puede deshacer.'

    );


    if (!confirmar) {

      return;

    }


    this.cargando = true;


    this.ticketService
      .deleteTicket(id)
      .subscribe({

        next: () => {

          this.mostrarMensaje(

            'Ticket eliminado correctamente',

            'success'

          );

          this.cargarTickets();

        },


        error: (error) => {

          console.error(
            'Error eliminando ticket:',
            error
          );

          this.cargando = false;

          this.mostrarMensaje(
            'No se pudo eliminar el ticket',
            'error'
          );

        }

      });

  }


  // ==========================================
  // MENSAJES
  // ==========================================

  mostrarMensaje(

    texto: string,

    tipo: string

  ): void {

    this.mensaje = texto;

    this.tipoMensaje = tipo;


    setTimeout(() => {

      this.mensaje = '';

      this.tipoMensaje = '';

      this.cd.detectChanges();

    }, 3500);

  }

}