import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';


@Component({
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
})
export class PhotoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    Camera.requestPermissions();
    this.CreateDir();

  }

  async takePhoto() {
    debugger;
    const image = await Camera.getPhoto({
      quality: 40,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
    });

    if (image) {
      this.SavePhoto(image.base64String!);
    }

  }

  async SavePhoto(photo: string) {
    await Filesystem.writeFile({
      path: 'Test.jpg',
      data: photo,
      directory: Directory.Documents,

    });
  }

  CreateDir() {
    Filesystem.mkdir(
      {
        path: 'ImageTest',
        directory: Directory.Documents
      }
    ).then(res => { console.log(res) })
      .catch(err => {
        console.log(err);
      })
  }
}


