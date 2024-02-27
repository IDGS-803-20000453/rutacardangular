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

  onAction(action: string) {
    console.log(`Acción ${action} ejecutada.`);
    // Aquí puedes manejar las acciones de crear, editar, etc.
  }
  
}
