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
    this.getCategories(); 
  }

  getCategories() {
    this.authApiService.getCategories().subscribe({

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

  onAddCategory() {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '250px',
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
      // Verifica que el resultado contenga formData
      if (result && result.formData) {
        const formData = result.formData; // Ya no necesitas reducir, porque formData es un objeto
        
        console.log("Datos transformados para enviar a la API:", formData);
    
        // Ahora puedes enviar formData directamente a tu API
        this.authApiService.insertCategory(formData).subscribe({
          next: (response) => {
            console.log("Categoría creada con éxito", response);
            this.getCategories(); // Refresca la lista de categorías
          },
          error: (error) => {
            console.error("Error al crear la categoría", error);
          }
        });
      } else {
        console.log('No se recibieron datos válidos del formulario o la acción fue cancelada');
      }
    });
}
  

  
onEditCategory(element: any) {
  const dialogRef = this.dialog.open(GenericModalComponent, {
    width: '250px',
    data: {
      action: 'edit',
      fields: [
        { type: 'text', name: 'nombre', label: 'Nombre', placeholder: 'Escribe el nombre', value: element.nombre },
        { type: 'text', name: 'descripcion', label: 'Descripción', placeholder: 'Escribe una descripción', value: element.descripcion },
        { type: 'button', action: 'edit', icon: 'edit' },
      ],
      categoryId: element.categoriaID
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const updateData = {
        categoriaID: result.categoryId,
        nombre: result.fields.find((f: { name: string; }) => f.name === 'nombre').value,
        descripcion: result.fields.find((f: { name: string; }) => f.name === 'descripcion').value,
      };

      this.authApiService.updateCategory(updateData).subscribe({
        next: (response) => {
          console.log("Categoría actualizada con éxito", response);
          this.getCategories(); // Refresca la lista de categorías
        },
        error: (error) => {
          console.error("Error al actualizar la categoría", error);
        }
      });
    }
  });
}



  
onDeleteCategory(element: any) {
  // Confirmación antes de eliminar, opcional pero recomendado
  const confirmation = confirm("¿Estás seguro de que deseas eliminar esta categoría?");
  if (!confirmation) {
    return;
  }

  // Llamada al servicio para eliminar la categoría
  this.authApiService.deleteCategory(element.categoriaID).subscribe({
    next: (response) => {
      console.log("Categoría eliminada con éxito", response);
      this.getCategories(); // Refresca la lista de categorías para reflejar la eliminación
    },
    error: (error) => {
      console.error("Error al eliminar la categoría", error);
    }
  });
}

  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}