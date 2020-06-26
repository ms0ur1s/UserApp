import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload/';
import { Picture } from 'src/app/_models/picture';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-picture-editor',
  templateUrl: './picture-editor.component.html',
  styleUrls: ['./picture-editor.component.css'],
})
export class PictureEditorComponent implements OnInit {
  @Input() pictures: Picture[];
  @Output() getMemberPictureChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMain: Picture;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit() {
    this.initialiseUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initialiseUploader() {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/pictures',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 2000 * 2000,
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const res: Picture = JSON.parse(response);
        const picture = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          isMain: res.isMain,
        };
        this.pictures.push(picture);
      }
    };
  }

  setMainPicture(picture: Picture) {
    this.userService
      .setMainPicture(this.authService.decodedToken.nameid, picture.id).subscribe(() => {
          this.currentMain = this.pictures.filter((p) => p.isMain === true)[0];
          this.currentMain.isMain = false;
          picture.isMain = true;
          this.authService.changeMemberImage(picture.url);
          this.authService.currentUser.pictureUrl = picture.url;
          localStorage.setItem(
            'user',
            JSON.stringify(this.authService.currentUser)
          );
        },
        (error) => {
          this.alertify.error(error);
        }
      );
  }

  deletePicture(id: number) {
    this.alertify.confirm(
      'Are you sure you want to delete this picture', () => {
        this.userService.deletePicture(this.authService.decodedToken.nameid, id).subscribe(() => {
              this.pictures.splice(this.pictures.findIndex((p) => p.id === id), 1);
              this.alertify.success('Photo has been deleted');
            },
            (error) => {
              this.alertify.error('Failed to delete the photo');
            }
          );
      }
    );
  }
}
