import { Routes } from '@angular/router';

import { Dashboard } from './components/dashboard/dashboard';
import { RegistroIncidente } from './components/registro-incidente/registro-incidente';
import { ListadoTickets } from './components/listado-tickets/listado-tickets';

export const routes: Routes = [

  {
    path: '',
    component: Dashboard
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'registro-incidente',
    component: RegistroIncidente
  },

  {
    path: 'tickets',
    component: ListadoTickets
  }

];