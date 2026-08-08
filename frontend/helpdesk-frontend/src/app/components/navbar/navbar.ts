import {
  Component,
  OnInit,
  OnDestroy,
  HostListener
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';

import { Subscription, interval } from 'rxjs';


@Component({

  selector: 'app-navbar',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './navbar.html',

  styleUrl: './navbar.css'

})


export class Navbar implements OnInit, OnDestroy {


  // =====================================================
  // MENUS
  // =====================================================

  menuUsuario: boolean = false;

  menuNotificaciones: boolean = false;



  // =====================================================
  // NOTIFICACIONES
  // =====================================================

  notificaciones: any[] = [];

  cantidadNotificaciones: number = 0;



  // =====================================================
  // CONTROL TIEMPO REAL
  // =====================================================

  private monitoreoSubscription?: Subscription;


  private ticketsAnteriores: Ticket[] = [];



  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private ticketService: TicketService
  ) {}



  // =====================================================
  // INICIO
  // =====================================================

  ngOnInit(): void {

    /*
      Primera carga
    */

    this.cargarNotificaciones();


    /*
      MONITOREO AUTOMÁTICO

      Cada 1 segundo consulta la API
      para detectar nuevos tickets
      o cambios en los existentes.
    */

    this.monitoreoSubscription = interval(1000)
      .subscribe(() => {

        this.monitorearTickets();

      });

  }



  // =====================================================
  // DESTRUCCIÓN
  // =====================================================

  ngOnDestroy(): void {

    if (this.monitoreoSubscription) {

      this.monitoreoSubscription.unsubscribe();

    }

  }



  // =====================================================
  // CARGA INICIAL
  // =====================================================

  cargarNotificaciones(): void {

    this.ticketService.getTickets()
      .subscribe({

        next: (respuesta: any) => {

          /*
            Tu backend puede devolver:

            [
              ticket,
              ticket
            ]

            o:

            {
              tickets: [...]
            }
          */

          const tickets: Ticket[] =
            respuesta?.tickets ?? respuesta ?? [];


          /*
            Guardamos una copia inicial
          */

          this.ticketsAnteriores =
            this.clonarTickets(tickets);


          /*
            Generamos las notificaciones
          */

          this.generarNotificaciones(tickets);

        },


        error: (error) => {

          console.error(
            'Error cargando notificaciones:',
            error
          );

        }

      });

  }



  // =====================================================
  // MONITOREO AUTOMÁTICO
  // =====================================================

  monitorearTickets(): void {

    this.ticketService.getTickets()
      .subscribe({

        next: (respuesta: any) => {


          const ticketsActuales: Ticket[] =
            respuesta?.tickets ?? respuesta ?? [];



          /*
            Primera ejecución
          */

          if (this.ticketsAnteriores.length === 0) {

            this.ticketsAnteriores =
              this.clonarTickets(ticketsActuales);

            this.generarNotificaciones(ticketsActuales);

            return;

          }



          /*
            DETECTAR CAMBIOS
          */

          this.detectarCambios(
            this.ticketsAnteriores,
            ticketsActuales
          );



          /*
            Actualizamos memoria
          */

          this.ticketsAnteriores =
            this.clonarTickets(ticketsActuales);

        },


        error: (error) => {

          console.error(
            'Error monitoreando tickets:',
            error
          );

        }

      });

  }



  // =====================================================
  // DETECTAR CAMBIOS
  // =====================================================

  detectarCambios(
    anteriores: Ticket[],
    actuales: Ticket[]
  ): void {


    /*
      ====================================================
      NUEVOS TICKETS
      ====================================================
    */

    actuales.forEach(ticketActual => {


      const ticketAnterior =
        anteriores.find(
          ticket =>
            ticket._id === ticketActual._id
        );



      /*
        Si no existía anteriormente
        significa que es NUEVO.
      */

      if (!ticketAnterior) {

        this.agregarNotificacion({

          icon: '🎫',

          texto:
            `Nuevo incidente: ${ticketActual.titulo}`,

          tiempo:
            'Registrado ahora mismo',

          tipo: 'normal'

        });


        /*
          Notificación visual del navegador
        */

        this.mostrarAlertaVisual(
          'Nuevo incidente',
          ticketActual.titulo || 'Se registró un nuevo ticket'
        );


        return;

      }



      /*
        ==================================================
        CAMBIO DE ESTADO
        ==================================================
      */

      if (
        ticketAnterior.estado !==
        ticketActual.estado
      ) {

        this.agregarNotificacion({

          icon: this.obtenerIconoEstado(
            ticketActual.estado
          ),

          texto:
            `Estado actualizado: ${ticketActual.titulo}`,

          tiempo:
            `Ahora: ${ticketActual.estado}`,

          tipo:
            this.obtenerTipoEstado(
              ticketActual.estado
            )

        });


        this.mostrarAlertaVisual(

          'Ticket actualizado',

          `${ticketActual.titulo} → ${ticketActual.estado}`

        );

      }



      /*
        ==================================================
        CAMBIO DE PRIORIDAD
        ==================================================
      */

      if (
        ticketAnterior.prioridad !==
        ticketActual.prioridad
      ) {

        this.agregarNotificacion({

          icon: '🚨',

          texto:
            `Prioridad modificada: ${ticketActual.titulo}`,

          tiempo:
            `Nueva prioridad: ${ticketActual.prioridad}`,

          tipo:
            ticketActual.prioridad
              ?.toLowerCase() === 'alta'
              ? 'danger'
              : 'normal'

        });


        this.mostrarAlertaVisual(

          'Prioridad actualizada',

          `${ticketActual.titulo} → ${ticketActual.prioridad}`

        );

      }



      /*
        ==================================================
        CAMBIO DE CATEGORÍA
        ==================================================
      */

      if (
        ticketAnterior.categoria !==
        ticketActual.categoria
      ) {

        this.agregarNotificacion({

          icon: '📂',

          texto:
            `Categoría actualizada: ${ticketActual.titulo}`,

          tiempo:
            `Categoría: ${ticketActual.categoria}`,

          tipo: 'normal'

        });

      }



      /*
        ==================================================
        CAMBIO DE USUARIO
        ==================================================
      */

      if (
        ticketAnterior.usuario !==
        ticketActual.usuario
      ) {

        this.agregarNotificacion({

          icon: '👤',

          texto:
            `Responsable actualizado: ${ticketActual.titulo}`,

          tiempo:
            `Usuario: ${ticketActual.usuario}`,

          tipo: 'normal'

        });

      }

    });

  }



  // =====================================================
  // GENERAR NOTIFICACIONES INICIALES
  // =====================================================

  generarNotificaciones(
    tickets: Ticket[]
  ): void {


    this.notificaciones = [];


    /*
      Ordenamos los tickets
      más recientes primero.
    */

    const ticketsOrdenados =
      [...tickets].sort((a: any, b: any) => {

        const fechaA =
          new Date(
            a.createdAt || 0
          ).getTime();

        const fechaB =
          new Date(
            b.createdAt || 0
          ).getTime();

        return fechaB - fechaA;

      });



    /*
      Revisamos cada ticket
    */

    ticketsOrdenados.forEach(ticket => {


      /*
        NUEVOS TICKETS
      */

      if (ticket.createdAt) {

        const fecha =
          new Date(ticket.createdAt);

        const ahora =
          new Date();

        const diferencia =
          ahora.getTime()
          -
          fecha.getTime();



        if (diferencia < 86400000) {

          this.notificaciones.push({

            icon: '🎫',

            texto:
              `Nuevo incidente: ${ticket.titulo}`,

            tiempo:
              this.formatearTiempo(fecha),

            tipo: 'normal'

          });

        }

      }



      /*
        PRIORIDAD ALTA
      */

      if (
        ticket.prioridad
          ?.toLowerCase()
          .trim() === 'alta'
      ) {

        this.notificaciones.push({

          icon: '🚨',

          texto:
            `Atención requerida: ${ticket.titulo}`,

          tiempo:
            'Prioridad Alta',

          tipo: 'danger'

        });

      }



      /*
        TICKET CERRADO
      */

      if (
        ticket.estado
          ?.toLowerCase()
          .trim() === 'cerrado'
      ) {

        this.notificaciones.push({

          icon: '✅',

          texto:
            `Ticket solucionado: ${ticket.titulo}`,

          tiempo:
            'Proceso finalizado',

          tipo: 'success'

        });

      }

    });



    /*
      Limitar a las últimas 50
      para evitar que el navbar
      se vuelva gigantesco.
    */

    this.notificaciones =
      this.notificaciones.slice(0, 50);



    this.cantidadNotificaciones =
      this.notificaciones.length;

  }



  // =====================================================
  // AGREGAR NOTIFICACIÓN EN TIEMPO REAL
  // =====================================================

  agregarNotificacion(
    notificacion: any
  ): void {


    /*
      Agregamos la nueva notificación
      al principio.
    */

    this.notificaciones.unshift(
      notificacion
    );


    /*
      Máximo 50 notificaciones
    */

    this.notificaciones =
      this.notificaciones.slice(0, 50);



    /*
      Actualizamos contador
    */

    this.cantidadNotificaciones =
      this.notificaciones.length;



    /*
      Abrimos automáticamente
      el panel para mostrar que ocurrió algo.
    */

    this.menuNotificaciones = true;


    /*
      Cerramos menú usuario
    */

    this.menuUsuario = false;

  }



  // =====================================================
  // ICONOS SEGÚN ESTADO
  // =====================================================

  obtenerIconoEstado(
    estado: string
  ): string {


    switch (
      estado
        ?.toLowerCase()
        .trim()
    ) {

      case 'abierto':

        return '🟢';


      case 'en proceso':

        return '⚙️';


      case 'cerrado':

        return '✅';


      default:

        return '🔄';

    }

  }



  // =====================================================
  // TIPO DE NOTIFICACIÓN SEGÚN ESTADO
  // =====================================================

  obtenerTipoEstado(
    estado: string
  ): string {


    switch (
      estado
        ?.toLowerCase()
        .trim()
    ) {

      case 'cerrado':

        return 'success';


      case 'en proceso':

        return 'normal';


      default:

        return 'normal';

    }

  }



  // =====================================================
  // CLONAR TICKETS
  // =====================================================

  clonarTickets(
    tickets: Ticket[]
  ): Ticket[] {


    return tickets.map(
      ticket => ({
        ...ticket
      })
    );

  }



  // =====================================================
  // FORMATO DE TIEMPO
  // =====================================================

  formatearTiempo(
    fecha: Date
  ): string {


    const ahora =
      new Date();


    const diferencia =
      ahora.getTime()
      -
      fecha.getTime();


    const segundos =
      Math.floor(
        diferencia / 1000
      );


    if (segundos < 10) {

      return 'Ahora mismo';

    }


    if (segundos < 60) {

      return `Hace ${segundos} segundos`;

    }


    const minutos =
      Math.floor(
        segundos / 60
      );


    if (minutos < 60) {

      return `Hace ${minutos} min`;

    }


    const horas =
      Math.floor(
        minutos / 60
      );


    return `Hace ${horas} h`;

  }



  // =====================================================
  // ALERTA VISUAL
  // =====================================================

  mostrarAlertaVisual(
    titulo: string,
    mensaje: string
  ): void {


    /*
      Si el navegador permite
      notificaciones del sistema.
    */

    if (
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {

      new Notification(
        titulo,
        {
          body: mensaje,
          icon: '🤖'
        }
      );

    }

  }



  // =====================================================
  // USUARIO
  // =====================================================

  mostrarUsuario(): void {


    this.menuUsuario =
      !this.menuUsuario;


    this.menuNotificaciones =
      false;

  }



  // =====================================================
  // NOTIFICACIONES
  // =====================================================

  mostrarNotificaciones(): void {


    this.menuNotificaciones =
      !this.menuNotificaciones;


    this.menuUsuario =
      false;

  }



  // =====================================================
  // CERRAR SESIÓN
  // =====================================================

  cerrarSesion(): void {


    alert(
      'Sesión cerrada correctamente'
    );

  }



  // =====================================================
  // CERRAR MENUS
  // =====================================================

  @HostListener(
    'document:click',
    ['$event']
  )

  cerrarMenus(
    event: any
  ): void {


    const elemento =
      event.target;



    if (
      !elemento.closest('.user-area') &&
      !elemento.closest('.dropdown')
    ) {

      this.menuUsuario =
        false;

    }



    if (
      !elemento.closest('.notification-box')
    ) {

      this.menuNotificaciones =
        false;

    }

  }

}