import {Injectable} from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { GalleryItemEditComponent } from '../gallery/gallery-item-edit/gallery-item-edit.component';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<GalleryItemEditComponent> {
    canDeactivate(component: GalleryItemEditComponent){
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue? Any unsaved changes will be lost');
        }
        return true;
    }
}
