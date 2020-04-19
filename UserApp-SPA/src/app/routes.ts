import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'messages',
        component: MessagesComponent,
      },
      {
        path: 'lists',
        component: ListsComponent,
      },
    ],
  },
  { path: 'gallery', component: GalleryListComponent },
  // Protect single route
  // { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
