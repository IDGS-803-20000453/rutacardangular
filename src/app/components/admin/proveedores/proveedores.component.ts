import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { GenericModalComponent } from '../modals/generic-modal/generic-modal.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  constructor(private authApiService: AuthApiService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.getProveedores(); 
  }

  getProveedores() {
    this.authApiService.getProveedores().subscribe({
      next: (data) => {
        console.log("Datos recibidos:", data); 
        this.dataSource.data = data; 
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => console.error(err),
    });
  }

  onAddProveedores() {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '250px',
      data: {
        action: 'create',
        fields: [
          { type: 'text', name: 'nombre', label: 'Nombre', placeholder: 'Escribe el nombre', value: '' },
          { type: 'text', name: 'direccion', label: 'Dirección', placeholder: 'Escribe una dirección', value: '' },
          { type: 'text', name: 'telefono', label: 'Teléfono', placeholder: 'Escribe un teléfono', value: '' },
          { type: 'text', name: 'email', label: 'Email', placeholder: 'Escribe un correo electrónico', value: '' },
          { type: 'button', action: 'create', icon: 'add' },
        ]
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.formData) {
        const formData = result.formData;
        console.log("Datos transformados para enviar a la API:", formData);
    
        this.authApiService.insertProveedores(formData).subscribe({
          next: (response) => {
            console.log("Proveedor creado con éxito", response);
            this.getProveedores();
          },
          error: (error) => {
            console.error("Error al crear el proveedor", error);
          }
        });
      } else {
        console.log('No se recibieron datos válidos del formulario o la acción fue cancelada');
      }
    });
  }

  onEditProveedores(element: any) {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '250px',
      data: {
        action: 'edit',
        fields: [
          { type: 'text', name: 'nombre', label: 'Nombre', placeholder: 'Escribe el nombre', value: element.nombre },
          { type: 'text', name: 'direccion', label: 'Dirección', placeholder: 'Escribe una dirección', value: element.direccion },
          { type: 'text', name: 'telefono', label: 'Teléfono', placeholder: 'Escribe un teléfono', value: element.telefono },
          { type: 'text', name: 'email', label: 'Email', placeholder: 'Escribe un correo electrónico', value: element.email },
          { type: 'button', action: 'edit', icon: 'edit' },
        ],
        proveedorId: element.proveedorID
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Resultado del diálogo:", result); // Esto mostrará lo que sea que se esté pasando al cerrar el diálogo

      if (result && result.formData) { // Asegúrate de que formData existe
        console.log("Datos del formulario desde el componente:", result.formData);
        const updateData = {
          proveedorID: element.proveedorID, // Asegúrate de que este dato se maneja correctamente
          nombre: result.formData.nombre,
          direccion: result.formData.direccion,
          telefono: result.formData.telefono,
          email: result.formData.email,
        };
        console.log("Datos transformados para enviar a la API:", updateData);

        this.authApiService.updateProveedores(updateData).subscribe({
          next: (response) => {
            console.log("Proveedor actualizado con éxito", response);
            this.getProveedores();
          },
          error: (error) => {
            console.error("Error al actualizar el proveedor", error);
          }
        });
      }
    });
}


  onDeleteProveedores(element: any) {
    const confirmation = confirm("¿Estás seguro de que deseas eliminar este proveedor?");
    if (!confirmation) {
      return;
    }

    this.authApiService.deleteProveedores(element.proveedorID).subscribe({
      next: (response) => {
        console.log("Proveedor eliminado con éxito", response);
        this.getProveedores();
      },
      error: (error) => {
        console.error("Error al eliminar el proveedor", error);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
