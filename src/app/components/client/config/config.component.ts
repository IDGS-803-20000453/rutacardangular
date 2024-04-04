import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  // Propiedades para enlazar los datos del usuario
  nombre: string = '';
  apellido: string = '';
  imagenURL: string = ''; // Asumiendo que tienes una URL de imagen por defecto o gestión de imágenes
  fileToUpload: File | null = null; // Archivo seleccionado para cargar

  constructor(
    private authApiService: AuthApiService, 
    public authService: AuthService,
    private http: HttpClient,
     
     ) { }

  ngOnInit() {
    this.loadInfo();
  }

  loadInfo() {
    const usuarioID = this.authService.currentUserValue?.usuarioId ?? 0;
    this.authApiService.getUsuario(usuarioID).subscribe({
      next: (response) => {
        console.log('Información del usuario:', response);
        // Actualiza las propiedades con la respuesta
        this.nombre = response.nombre;
        this.apellido = response.apellido;
        this.imagenURL = response.imagenURL;
      },
      error: (err) => console.error('Error al obtener la información del usuario:', err),
    });
  }

  
  
  updateProfile() {
    console.log("Perfil actualizado");
  }

  updateUserProfile() {
    if (this.fileToUpload) {
      this.uploadFileToCloudinary(this.fileToUpload)
        .pipe(
          tap((cloudinaryResponse) => {
            this.imagenURL = cloudinaryResponse.url; // Actualiza la imagenURL con la respuesta de Cloudinary
          }),
          switchMap(() => {
            const formData = {
              usuarioId: this.authService.currentUserValue?.usuarioId,
              nombre: this.nombre,
              apellido: this.apellido,
              imagenURL: this.imagenURL
            };
            return this.authApiService.patchProfile(formData);
          })
        )
        .subscribe({
          next: (data) => console.log('Perfil actualizado con éxito:', data),
          error: (err) => console.error('Error al actualizar el perfil:', err)
        });
    } else {
      console.error('No hay un archivo seleccionado para subir.');
    }
  }

  uploadFileToCloudinary(file: File): Observable<any> {
    // Código para subir el archivo a Cloudinary
    console.log('Subiendo archivo a Cloudinary:', file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rotacard');
    return this.http.post('https://api.cloudinary.com/v1_1/dapuibwvu/image/upload', formData);

  }
  onFileSelected(event: any) {
    this.fileToUpload = event.target.files[0];
  }
}
