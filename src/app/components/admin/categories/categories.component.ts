import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from '../modals/generic-modal/generic-modal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate(600)
      ]),
      transition(':leave', [
        animate(600, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class CategoriesComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;

  constructor(private authApiService: AuthApiService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
  }
  

  ngOnInit() {
    this.getCategories(); // Llama a tu función para obtener las categorías desde el servicio
  }

  getCategories() {
    this.authApiService.getCategories().subscribe({

      next: (data) => {
        this.dataSource.data = data; // Actualiza el dataSource con los datos recibidos
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => console.error(err),
      // Puedes manejar los errores aquí si es necesario
    });
  }

  onAddCategory() {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '250px', // Ajusta el ancho según tus necesidades
      data: {
        action: 'create',
        fields: [
          { type: 'text', name: 'nombre', label: 'Nombre', placeholder: 'Escribe el nombre', value: '' },
          { type: 'text', name: 'descripcion', label: 'Descripción', placeholder: 'Escribe una descripción', value: '' },
          { type: 'button', action: 'create', icon: 'add' },

        ]
      }
      
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Aquí puedes manejar los datos de retorno si es necesario
    });
  }
  
  
  onEditCategory(element: any) {
    // Lógica para editar una categoría existente
    // Puedes usar 'element' para obtener los datos de la categoría a editar
  }
  
  onDeleteCategory(element: any) {
    // Lógica para eliminar una categoría
    // Usa 'element' para identificar la categoría a eliminar
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
