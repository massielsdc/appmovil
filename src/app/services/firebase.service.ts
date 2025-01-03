import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { getAuth, updateProfile } from "firebase/auth";
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService
  ) { }

  //Autenticación

  login(user: User){
    return this.auth.signInWithEmailAndPassword(user.email, user.password)
  }

  signUp(user: User){
    return this.auth.createUserWithEmailAndPassword(user.email, user.password)
  }

  updateUser(user: any){
    const auth = getAuth();
    return updateProfile(auth.currentUser, user)
  }

  getAuthState(){
    return this.auth.authState
  }

  async sigOut(){
    await this.auth.signOut();
    this.utilsSvc.routerLink('/auth');
    localStorage.removeItem('user');


  }

  //Firestore base de datos

  //CRUD
  
  //LEER
  getSubcollection(path: string, subcollectionName: string){
    return this.db.doc(path).collection(subcollectionName).valueChanges({ idField: 'id' })
  }
//AGREGAR
  addToSubcollection(path: string, subcollectionName: string, object: any){
    return this.db.doc(path).collection(subcollectionName).add(object)
  }
//ACTUALIZAR
  updateDocument(path: string, object: any){
    return this.db.doc(path).update(object);
  }
//ELIMINAR
  deleteDocument(path: string){
    return this.db.doc(path).delete()
  }
}
