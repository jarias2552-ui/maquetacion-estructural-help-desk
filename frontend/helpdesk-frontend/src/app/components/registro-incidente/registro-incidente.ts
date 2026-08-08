import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TicketService } from '../../services/ticket';
import { Ticket } from '../../models/ticket.model';


@Component({

  selector:'app-registro-incidente',

  standalone:true,

  imports:[
    FormsModule,
    CommonModule
  ],

  templateUrl:'./registro-incidente.html',

  styleUrl:'./registro-incidente.css'

})


export class RegistroIncidente {


  cargando:boolean = false;

  mensaje:string = '';

  error:string = '';



  categorias:string[]=[

    'Hardware',
    'Software',
    'Red',
    'Impresora'

  ];



  prioridades:string[]=[

    'Alta',
    'Media',
    'Baja'

  ];





  ticket:Ticket={


    titulo:'',

    descripcion:'',

    categoria:'Hardware',

    prioridad:'Media',

    estado:'Abierto',

    usuario:''


  };







  constructor(

     private ticketService:TicketService,

  private cd:ChangeDetectorRef

  ){}





  /*
  =========================================================
  INDICADORES VISUALES
  No modifican la lógica del ticket.
  Solamente calculan información para la interfaz.
  =========================================================
  */


  get progreso():number{

    let porcentaje:number = 0;

    if(this.ticket.titulo.trim().length >= 3){

      porcentaje += 25;

    }

    if(this.ticket.descripcion.trim().length >= 5){

      porcentaje += 25;

    }

    if(this.ticket.categoria){

      porcentaje += 20;

    }

    if(this.ticket.prioridad){

      porcentaje += 10;

    }

    if(this.ticket.usuario.trim().length > 0){

      porcentaje += 20;

    }

    return porcentaje;

  }



  get estadoReporte():string{

    if(this.progreso === 0){

      return 'Esperando información';

    }

    if(this.progreso < 50){

      return 'Información inicial';

    }

    if(this.progreso < 100){

      return 'Información en progreso';

    }

    return 'Listo para registrar';

  }



  get pasoActual():number{

    if(!this.ticket.titulo.trim()){

      return 1;

    }

    if(!this.ticket.descripcion.trim()){

      return 2;

    }

    if(!this.ticket.usuario.trim()){

      return 3;

    }

    return 4;

  }



  get tituloValido():boolean{

    return this.ticket.titulo.trim().length >= 3;

  }



  get descripcionValida():boolean{

    return this.ticket.descripcion.trim().length >= 5;

  }



  get usuarioValido():boolean{

    return this.ticket.usuario.trim().length > 0;

  }






crearTicket():void{


  if(this.cargando){

    return;

  }




  this.mensaje='';

  this.error='';




  if(

    !this.ticket.titulo.trim() ||

    !this.ticket.descripcion.trim() ||

    !this.ticket.usuario.trim()

  ){


    this.error='Complete todos los campos obligatorios';


    return;


  }






  this.cargando=true;






  this.ticketService.createTicket(this.ticket)

  .subscribe({




    next:(respuesta)=>{

 console.log("Ticket creado:", respuesta);


  this.cargando=false;
  this.cd.detectChanges();

  console.log(
    "Estado cargando después:",
    this.cargando
  );


  this.mensaje=
  '✅ Incidente registrado correctamente';




      // LIMPIAR FORMULARIO

      this.limpiarFormulario();





      // quitar mensaje después de unos segundos

      setTimeout(()=>{


        this.mensaje='';


      },4000);




    },







    error:(error)=>{


      console.error(

        "Error:",
        error

      );



      this.cargando=false;
      this.cd.detectChanges();



      this.error=
      '❌ No fue posible registrar el incidente';



      setTimeout(()=>{


        this.error='';


      },4000);



    }



  });





}









limpiarFormulario():void{


  this.ticket={


    titulo:'',


    descripcion:'',


    categoria:'Hardware',


    prioridad:'Media',


    estado:'Abierto',


    usuario:''


  };


}



}