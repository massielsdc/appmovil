import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ItemReorderEventDetail } from '@ionic/angular';
import { Item, Task } from 'src/app/models/task.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-update-task',
  templateUrl: './add-update-task.component.html',
  styleUrls: ['./add-update-task.component.scss'],
})
export class AddUpdateTaskComponent implements OnInit {
  

  @Input() task: Task;
  user = {} as User

  form = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(4)]),
    items: new FormControl([], [Validators.required]),
  })

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.user = this.utilsSvc.getElementFromLocalStorage('user')

    if (this.task) {
      this.task.items = this.task.items || [];
      this.form.patchValue(this.task);
      this.form.updateValueAndValidity()

    }
  }

  //***********Crear o Actualizar tarea***************
  submit() {

    if (this.form.valid) {

      if (this.task) {
        this.updateTask()

      } else {

        this.createTask();
      }
    }
  }

  //******Crear tarea*******
  createTask() {
    let path = `users/${this.user.uid}`

    this.utilsSvc.presentLoading();
    delete this.form.value.id;

    this.firebaseSvc.addToSubcollection(path, 'tasks', this.form.value).then(res => {

      this.utilsSvc.dismissModal({ sucess: true });

      this.utilsSvc.presentToast({
        message: 'Tarea creada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })

      this.utilsSvc.dismissLoading()

    }, error => {

      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })

      this.utilsSvc.dismissLoading()


    })
  }
  // *********Actualizar tarea*************
  updateTask() {
    let path = `users/${this.user.uid}/tasks/${this.task.id}`;

    this.utilsSvc.presentLoading();
    delete this.form.value.id;

    this.firebaseSvc.updateDocument(path, this.form.value).then(res => {

      this.utilsSvc.dismissModal({ sucess: true });

      this.utilsSvc.presentToast({
        message: 'Tarea actualizada exitosamente',
        color: 'success',
        icon: 'checkmark-circle-outline',
        duration: 1500
      })

      this.utilsSvc.dismissLoading()

    }, error => {

      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      })

      this.utilsSvc.dismissLoading()


    })
  }


 // Reordenar
handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
  const items = this.form.controls.items.value;
  this.form.controls.items.setValue(ev.detail.complete(items));
}

// Eliminar
removeItem(index: number) {
  const items = this.form.controls.items.value;
  items.splice(index, 1);
  this.form.controls.items.setValue(items);
}


  //Crear actividad
  createItem() {
    this.utilsSvc.presentAlert({
      header: 'Nueva Actividad',
      backdropDismiss: false,
      inputs: [
        {
          name: 'name',
          type: 'textarea',
          placeholder: 'Hacer algo...',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Agregar',
          handler: (res) => {
            const item: Item = { name: res.name, completed: false };
            const items = this.form.controls.items.value;
            items.push(item);
            this.form.controls.items.setValue(items);
          },
        },
      ],
    });
  }
  
  
   //Sacar foto
  takePhoto()
  {
    debugger;
    const takePicture = async () => {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
    
      // image.webPath will contain a path that can be set as an image src.
      // You can access the original file using image.path, which can be
      // passed to the Filesystem API to read the raw data of the image,
      // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
      var imageUrl = image.webPath;
    
      // Can be set to the src of an image now
      //imageElement.src = imageUrl;
    };
  }

}
