import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { switchMap, of, tap } from 'rxjs';

import { AuthApiService } from 'src/app/services/auth-api.service';
import { GenericModalComponent } from '../modals/generic-modal/generic-modal.component';
import { Proveedor } from 'src/app/models/proveedor.models';

@Component({
  selector: 'app-envios',
  templateUrl: './envios.component.html',
  styleUrls: ['./envios.component.css']
})
export class EnviosComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  constructor(private authApiService: AuthApiService, public dialog: MatDialog, private changeDetectorRef: ChangeDetectorRef) {
    this.dataSource = new MatTableDataSource<any>();
  }

  ngOnInit() {
    this.getPedidos();
  }

  getPedidos() {
    this.authApiService.getAllOrders().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => console.error('Error fetching orders:', err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editFechaEntregaEstimada(element: any) {
  }

  abrirModalConfiguracion(element: any) {
    // Llama a getProveedores una sola vez
    
    this.authApiService.getProveedores().subscribe((proveedores: Proveedor[]) => {
      const proveedoresOptions = proveedores.map((proveedor: Proveedor) => ({
        value: proveedor.proveedorID,
        label: proveedor.nombre
      }));
      console.log("Elemento a editar:", element);
      console.log("Opciones de estado:", [{ value: 'Procesando', label: 'Procesando' }, { value: 'Enviado', label: 'Enviado' }, { value: 'Entregado', label: 'Entregado' }]);
      console.log("Opciones de proveedor:", proveedoresOptions);
      console.log("Fecha de entrega estimada:", element.fechaEntregaEstimada ? new Date(element.fechaEntregaEstimada).toISOString().split('T')[0] : '');
      
      const dialogRef = this.dialog.open(GenericModalComponent, {
        width: '250px',
        data: {
          title: 'Actualizar Envío',
          fields: [
            { name: 'estado', label: 'Estado del Envío', type: 'select', options: [{ value: 'Procesando', label: 'Procesando' }, { value: 'Enviado', label: 'Enviado' }, { value: 'Entregado', label: 'Entregado' }], value: element.estadoEnvio },
            { name: 'costoEnvio', label: 'Costo de Envío', type: 'number', value: element.costoEnvio ?? '', placeholder: 'Ingrese el costo' },
            {
              name: 'proveedorID',
              label: 'Proveedor',
              type: 'select',
              options: proveedoresOptions,
              value: element.proveedorID // Asegúrate de que tu elemento tenga proveedorID
            },
            {
              name: 'fechaEntregaEstimada',
              label: 'Fecha Entrega Estimada',
              type: 'date', // Especifica que es un campo de tipo fecha
              value: element.fechaEntregaEstimada ? new Date(element.fechaEntregaEstimada).toISOString().split('T')[0] : '', // Convierte la fecha a formato YYYY-MM-DD
            },
            { type: 'button', label: 'Guardar', action: 'save', icon: 'save' }
          ]
        }
      });

      dialogRef.afterClosed().pipe(
        switchMap(result => {
          if (result?.action === 'save') {
            const updateData = {
              estado: result.formData.estado,
              proveedorID: result.formData.proveedorID,
              fechaEntregaEstimada: result.formData.fechaEntregaEstimada,
              ...(result.formData.costoEnvio && { costoEnvio: result.formData.costoEnvio })
            };
            console.log('Datos a enviar para actualizar el envío:', updateData);

            return this.authApiService.patchEnvio({ envioID: element.envioID, ...updateData });

          }
          return of(null);
        }),
        tap(() => this.getPedidos()),
      ).subscribe({
        next: (response) => {
          if (response) {
            console.log('Envío actualizado con éxito:', response);
            this.getPedidos(); // Refresca la lista de envíos.
            this.changeDetectorRef.detectChanges();
          }

        },
        error: (error) => console.error('Error actualizando el envío:', error),
      });
    });
  }
}
