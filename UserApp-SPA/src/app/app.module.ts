import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { GalleryListComponent } from './gallery/gallery-list/gallery-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { appRoutes } from './routes';
import { GalleryCardComponent } from './gallery/gallery-card/gallery-card.component';
import { GalleryItemDetailComponent } from './gallery/gallery-item-detail/gallery-item-detail.component';
import { GalleryItemDetailResolver } from './_resolvers/gallery-item-detail.resolver';
import { GalleryListResolver } from './_resolvers/gallery-list.resolver';
import { GalleryItemEditComponent } from './gallery/gallery-item-edit/gallery-item-edit.component';
import { GalleryItemEditResolver } from './_resolvers/gallery-item-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PictureEditorComponent } from './gallery/picture-editor/picture-editor.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    GalleryListComponent,
    ListsComponent,
    MessagesComponent,
    GalleryCardComponent,
    GalleryItemDetailComponent,
    GalleryItemEditComponent,
    PictureEditorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgxGalleryModule,
    FileUploadModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    })
  ],
  providers: [
    AuthService,
    ErrorInterceptorProvider,
    GalleryItemDetailResolver,
    GalleryListResolver,
    GalleryItemEditResolver,
    PreventUnsavedChanges
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
