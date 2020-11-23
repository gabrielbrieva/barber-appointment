import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NGXLogger } from 'ngx-logger';
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
  beforeImgChanged = false;
  afterImgSrc: string | ArrayBuffer;
  afterImgChanged = false;

  @Input()
  formData: IAppointmentItem;
  data: IAppointmentItem;

  formGroup: FormGroup;
  isLoading = false;

  @Output()
  done: EventEmitter<void> = new EventEmitter<void>();

  constructor(private logger: NGXLogger, private formBuilder: FormBuilder, private apiSrv: ApiService,
              private auth: AuthService, private dialog: MatDialog, private http: HttpClient) { }

  ngOnInit(): void {
    if (this.formData) {
      // clone of input data to prevent mutation
      this.data = JSON.parse(JSON.stringify(this.formData));
      this.beforeImgSrc = this.data.beforeImg;
      this.afterImgSrc = this.data.afterImg;
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

        if (this.beforeImgChanged && this.beforeImgSrc) {
          const uploadUrl = await this.apiSrv.getUploadUrl('before', this.data.appointmentId, idToken);
          this.logger.debug(`Signed URL to upload 'before barber photo': ${uploadUrl}`);

          await this.http.put(uploadUrl, this.dataURItoBlob(this.beforeImgSrc)).toPromise();
        }

        if (this.afterImgChanged && this.afterImgSrc) {
          const uploadUrl = await this.apiSrv.getUploadUrl('after', this.data.appointmentId, idToken);
          this.logger.debug(`Signed URL to upload 'after barber photo': ${uploadUrl}`);

          await this.http.put(uploadUrl, this.dataURItoBlob(this.afterImgSrc)).toPromise();
        }

        this.logger.info('Updating Appointment review...');

        const item = await this.apiSrv.updateReview({
          comment: this.data.comment,
          score: this.data.score
        }, this.data.appointmentId, idToken);

        this.formData.comment = this.data.comment;
        this.formData.score = this.data.score;

        this.logger.info(`Appointment review updated: ${JSON.stringify(this.formData)}`);

      } catch (err) {
        this.logger.error(err);
      }

      this.done.emit();

      this.isLoading = false;
    });
  }

  async selectBeforeImg(event: any): Promise<void> {
    const newImgSrc = await this.crop(event);
    this.beforeImgChanged = this.beforeImgSrc !== newImgSrc;
    this.beforeImgSrc = newImgSrc;
  }

  async selectAfterImg(event: any): Promise<void> {
    const newImgSrc = await this.crop(event);
    this.afterImgChanged = this.afterImgSrc !== newImgSrc;
    this.afterImgSrc = newImgSrc;
  }

  private dataURItoBlob(dataURI): Blob {

    this.logger.info('getting Base64 image to Blob');

    const binary = atob(dataURI.split(',')[1]);
    const array = [];

    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

  private async crop(event: any): Promise<string> {

    return new Promise<string>(resolve => {

      this.logger.info(`Starting Crop dialog...`);

      const dialogRef = this.dialog.open(CropDialogComponent, {
        data: event
      });

      const subs = dialogRef.componentInstance.accept.subscribe(croppedImage => {
        subs.unsubscribe();

        if (croppedImage && croppedImage.length > 0) {
          this.logger.info('Image croped');
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
