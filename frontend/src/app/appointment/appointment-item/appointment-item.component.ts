import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { map } from 'rxjs/operators';
import { IAppointmentItem } from 'src/app/models/IAppointmentItem';
import { ApiService } from 'src/app/services/api/api.service';

export interface IAppointmentData {
  service: string;
  barber: string;
  date: Date;
  time: string;
  isDone: boolean;
  comment: string;
  score: number;
  beforeImg: string;
  afterImg: string;
}

@Component({
  selector: 'app-appointment-item',
  templateUrl: './appointment-item.component.html',
  styleUrls: ['./appointment-item.component.scss']
})
export class AppointmentItemComponent implements OnInit {

  beforeImgSrc: string | ArrayBuffer;
  afterImgSrc: string | ArrayBuffer;

  @Input()
  formData: IAppointmentItem;
  data: IAppointmentItem;

  formGroup: FormGroup;
  isLoading = false;

  @Output()
  done: EventEmitter<void> = new EventEmitter<void>();

  constructor(private formBuilder: FormBuilder, private apiSrv: ApiService, private auth: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    if (this.formData) {
      this.data = JSON.parse(JSON.stringify(this.formData));
    }

    this.formGroup = this.formBuilder.group({
      commentCtrl: ['', Validators.required]
    });
  }

  cancel(): void {
    this.done.emit();
  }

  updateReview(): void {

    this.isLoading = true;

    this.auth.idTokenClaims$.pipe(map(r => r.__raw)).subscribe(async idToken => {
      try {

        const item = await this.apiSrv.updateReview({
          comment: this.data.comment,
          score: this.data.score
        }, this.data.appointmentId, idToken);

        this.formData.comment = this.data.comment;
        this.formData.score = this.data.score;

      } catch (err) {
        console.log(err);
      }

      this.done.emit();

      this.isLoading = false;
    });
  }

  async selectBeforeImg(event: any): Promise<void> {
    this.beforeImgSrc = await this.crop(event);
  }

  async selectAfterImg(event: any): Promise<void> {
    this.afterImgSrc = await this.crop(event);
  }

  private async crop(event: any): Promise<string> {

    return new Promise<string>(resolve => {

      const dialogRef = this.dialog.open(CropDialogComponent, {
        data: event
      });

      const subs = dialogRef.componentInstance.accept.subscribe(croppedImage => {
        subs.unsubscribe();

        if (croppedImage && croppedImage.length > 0) {
          resolve(croppedImage);
        } else {
          resolve(null);
        }

        dialogRef.close();
      });

    });
  }

}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './crop-dialog.component.html'
})
export class CropDialogComponent {

  croppedImage: any = '';

  accept = new EventEmitter<string>();

  constructor(@Inject(MAT_DIALOG_DATA) public imageChangedEvent: any = '') {
    this.fileChangeEvent(imageChangedEvent);
  }

  crop(): void {
    this.accept.emit(this.croppedImage);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  }

}
