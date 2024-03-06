import { Input } from '@angular/core';
import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter es alias para void => *
        style({ opacity: 0 }),
        animate(600, style({ opacity: 1 }))
      ]),
      transition(':leave', [   // :leave es alias para * => void
        animate(600, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class GenericModalComponent {
  constructor(
    public dialogRef: MatDialogRef<GenericModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  formData: any = {};

  onAction(action: string, data: any) {
    let formData: any = {};

    // Itera sobre cada campo en data.fields para llenar formData
    this.data.fields.forEach((field: any) => {
      if (field.type !== 'button' && field.type !== 'file') {
        formData[field.name] = field.value;
      }
    });

    // Si hay un archivo seleccionado, lo incluimos directamente en el objeto que se devuelve.
    // No intentamos incluirlo en formData porque formData se construye a partir de data.fields,
    // y el archivo no es parte de esos campos de manera directa.
    if (this.selectedFile) {
        // Cierra el modal y pasa el archivo junto con formData y la acción
        this.dialogRef.close({ action, formData, file: this.selectedFile });
    } else {
        // Si no hay archivo, solo devuelve formData y la acción
        this.dialogRef.close({ action, formData });
    }
}


  selectedFile: File | null = null;

onFileSelected(event: Event, fieldName: string) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.selectedFile = file;
  }
}

  

  
  
  
  
  
  
}
