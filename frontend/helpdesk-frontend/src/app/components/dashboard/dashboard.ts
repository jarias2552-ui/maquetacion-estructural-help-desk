import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';



@Component({

  selector:'app-dashboard',

  standalone:true,

  imports:[
    CommonModule
  ],

  templateUrl:'./dashboard.html',

  styleUrl:'./dashboard.css'

})



export class Dashboard implements OnInit {



  // =========================
  // DATOS
  // =========================


  tickets:Ticket[] = [];


  ticketsFiltrados:Ticket[] = [];



  // =========================
  // ESTADISTICAS
  // =========================


  totalTickets:number = 0;

  abiertos:number = 0;

  proceso:number = 0;

  cerrados:number = 0;



  // =========================
  // ESTADOS UI
  // =========================


  cargando:boolean = false;


  conectado:boolean = false;


  mensaje:string = '';




  constructor(

    private ticketService:TicketService

  ){}





  ngOnInit():void{


    this.cargarTickets();


  }








  // =========================
  // CARGAR TICKETS
  // =========================


  cargarTickets():void{


    this.cargando = true;



    this.ticketService
    .getTickets()
    .subscribe({



      next:(respuesta:any)=>{


        console.log(
          "Tickets recibidos:",
          respuesta
        );




        const lista:Ticket[] =
        respuesta.tickets ?? respuesta;




        this.tickets =
        lista || [];



        this.ticketsFiltrados =
        [...this.tickets];



        this.calcularEstadisticas();



        this.conectado = true;



        this.cargando = false;



      },






      error:(error)=>{


        console.error(
          "Error cargando tickets:",
          error
        );



        this.tickets=[];


        this.ticketsFiltrados=[];


        this.limpiarEstadisticas();



        this.conectado=false;


        this.cargando=false;



      }



    });



  }









  // =========================
  // ESTADISTICAS
  // =========================


  calcularEstadisticas():void{


    this.totalTickets =
    this.tickets.length;




    this.abiertos =
    this.contarEstado(
      'abierto'
    );




    this.proceso =
    this.contarEstado(
      'en proceso'
    );




    this.cerrados =
    this.contarEstado(
      'cerrado'
    );



  }









  contarEstado(
    estado:string
  ):number{


    return this.tickets.filter(ticket=>



      (ticket.estado || '')
      .toLowerCase()
      .trim()
      === estado


    ).length;



  }









  limpiarEstadisticas():void{


    this.totalTickets=0;

    this.abiertos=0;

    this.proceso=0;

    this.cerrados=0;


  }









  // =========================
  // BUSCADOR IA
  // =========================


  buscarTicket(
    event:Event
  ):void{


    const texto =

    (
      event.target as HTMLInputElement
    )
    .value
    .toLowerCase()
    .trim();





    if(!texto){


      this.ticketsFiltrados =
      [
        ...this.tickets
      ];


      return;


    }







    this.ticketsFiltrados =

    this.tickets.filter(ticket=>{


      return (

        ticket.titulo
        ?.toLowerCase()
        .includes(texto)



        ||



        ticket.descripcion
        ?.toLowerCase()
        .includes(texto)



        ||



        ticket.usuario
        ?.toLowerCase()
        .includes(texto)



        ||



        ticket.categoria
        ?.toLowerCase()
        .includes(texto)



        ||



        ticket.prioridad
        ?.toLowerCase()
        .includes(texto)



        ||



        ticket.estado
        ?.toLowerCase()
        .includes(texto)


      );


    });



  }









  // =========================
  // COLORES PRIORIDAD
  // =========================


  obtenerClasePrioridad(
    prioridad:string
  ):string{


    switch(

      prioridad
      ?.toLowerCase()
      .trim()

    ){


      case 'alta':

        return 'alta';



      case 'media':

        return 'media';



      case 'baja':

        return 'baja';



      default:

        return '';

    }


  }









  // =========================
  // COLORES ESTADO
  // =========================


  obtenerClaseEstado(
    estado:string
  ):string{


    switch(

      estado
      ?.toLowerCase()
      .trim()

    ){


      case 'abierto':

        return 'abierto';



      case 'en proceso':

        return 'proceso';



      case 'cerrado':

        return 'cerrado';



      default:

        return '';

    }


  }








  // =========================
  // ACTUALIZAR
  // =========================


  refrescarDashboard():void{


    this.cargarTickets();


  }





}