import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { GalleryListComponent } from './gallery/gallery-list/gallery-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { GalleryItemDetailComponent } from './gallery/gallery-item-detail/gallery-item-detail.component';
import { GalleryItemDetailResolver } from './_resolvers/gallery-item-detail.resolver';
import { GalleryListResolver } from './_resolvers/gallery-list.resolver';
import { GalleryItemEditComponent } from './gallery/gallery-item-edit/gallery-item-edit.component';
import { GalleryItemEditResolver } from './_resolvers/gallery-item-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';


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
         { path: 'gallery', component: GalleryListComponent, resolve: {users: GalleryListResolver} },
         { path: 'gallery/:id', component: GalleryItemDetailComponent, resolve: {user: GalleryItemDetailResolver} },
         { path: 'gallery/item/edit', component: GalleryItemEditComponent,
         resolve: {user: GalleryItemEditResolver}, canDeactivate: [PreventUnsavedChanges]},
         // Protect single route
         // { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
         { path: '**', redirectTo: '', pathMatch: 'full' },
       ];
