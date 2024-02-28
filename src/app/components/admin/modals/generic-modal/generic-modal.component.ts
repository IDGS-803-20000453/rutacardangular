import { Input } from '@angular/core';
import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.css']
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
    console.log("Acción:", action, "Datos del formulario:", this.data.fields);
    // Cierra el modal y pasa los datos de los campos directamente junto con la acción
    this.dialogRef.close({ action: action, fields: this.data.fields, categoryId: this.data.categoryId });
  }
  
  
  
  
  
}
