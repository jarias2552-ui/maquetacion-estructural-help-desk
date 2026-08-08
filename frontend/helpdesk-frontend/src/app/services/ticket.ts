import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Ticket } from '../models/ticket.model';



@Injectable({
  providedIn:'root'
})


export class TicketService {



  private readonly API_URL =
  'https://maquetacion-estructural-help-desk.onrender.com/api/tickets';
  






  constructor(
    private http:HttpClient
  ) {}






  /**
   * Obtener todos los tickets
   */
  getTickets():Observable<Ticket[]>{


    return this.http
    .get<Ticket[]>(this.API_URL)
    .pipe(
      catchError(
        this.handleError
      )
    );


  }








  /**
   * Crear ticket
   */
  createTicket(ticket:Ticket):Observable<any>{


    return this.http
  .post<any>(
    this.API_URL,
    ticket
    );


  }









  /**
   * Actualizar ticket
   */
  updateTicket(
    id:string,
    ticket:Ticket
  ):Observable<any>{


    return this.http
    .put<any>(

      `${this.API_URL}/${id}`,

      ticket

    )
    .pipe(

      catchError(
        this.handleError
      )

    );


  }









  /**
   * Eliminar ticket
   */
  deleteTicket(
    id:string
  ):Observable<any>{


    return this.http
    .delete<any>(

      `${this.API_URL}/${id}`

    )
    .pipe(

      catchError(
        this.handleError
      )

    );


  }









  /**
   * Manejo de errores
   */
  private handleError(
    error:HttpErrorResponse
  ){



    let mensaje =
    'Ocurrió un error inesperado';




    if(error.error instanceof ErrorEvent){


      mensaje =
      `Error del cliente: ${error.error.message}`;


    }
    else{


      mensaje =
      `Error ${error.status}: ${error.message}`;


    }




    console.error(
      mensaje
    );



    return throwError(
      ()=>new Error(mensaje)
    );


  }



}