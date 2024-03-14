import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from '../modals/generic-modal/generic-modal.component';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],animations: [
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
export class ProductsComponent implements OnInit{
  dataSource: MatTableDataSource<any>;
  categories: any[] = []; // Aquí guardaremos las categorías

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  constructor(private authApiService: AuthApiService, public dialog: MatDialog, private http: HttpClient) {
    this.dataSource = new MatTableDataSource();
  }
  ngOnInit() {
    this.getProducts(); 
    this.getCategories();
  }
  getProducts() {
    this.authApiService.getProducts().subscribe({
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
  getCategories() {
    this.authApiService.getCategories().subscribe({
      next: (data) => {
        this.categories = data; // Guarda las categorías recibidas
      },
      error: (err) => console.error(err),
    });
  }

  onAddProduct() {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '550px',
      data: {
        action: 'create',
        fields: [
          { type: 'text', name: 'nombre', label: 'Nombre', placeholder: 'Escribe el nombre', value: '' },
          { type: 'text', name: 'descripcion', label: 'Descripción', placeholder: 'Escribe una descripción', value: '' },
          { type: 'number', name: 'precio', label: 'Precio', placeholder: 'Escribe el precio', value: '' },
          { type: 'number', name: 'peso', label: 'Peso', placeholder: 'Escribe el peso', value: '' },
          { type: 'number', name: 'volumen', label: 'Volumen', placeholder: 'Escribe el volumen', value: '' },
          { type: 'number', name: 'stock', label: 'Stock', placeholder: 'Escribe el stock', value: '' },
          {
            type: 'select',
            name: 'categoriaID',
            label: 'Categoría',
            options: this.categories.map(cat => ({ value: cat.categoriaID, label: cat.nombre })),
            placeholder: 'Selecciona la categoría',
            value: ''
          },
          { type: 'file', name: 'imagen', label: 'Imagen del Producto', placeholder: '' }, // Campo de carga de archivo

          { type: 'button', action: 'create', icon: 'add' },
        ]
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
          // Ahora, verifica si se incluyó un archivo en la respuesta
          if (result.file) {
              // Si hay un archivo, primero lo subimos a Cloudinary
              this.uploadFileToCloudinary(result.file).subscribe(cloudinaryResponse => {
                  // Luego, incluimos la URL de la imagen en formData
                  result.formData.imagenURL = cloudinaryResponse.url;
                  
                  // Y procedemos con el envío de formData a la API
                  this.processFormData(result.formData);
              });
          } else {
              // Si no hay archivo, procedemos directamente
              this.processFormData(result.formData);
          }
      }
  });
  
}

processFormData(formData: any) {
  console.log('Producto a insertar:', formData);
  this.authApiService.insertProduct(formData).subscribe({
      next: (data) => {
          console.log("Producto insertado con éxito:", data);
          this.getProducts(); // Refresca la lista de productos
      },
      error: (err) => console.error("Error al insertar el producto:", err),
  });
}

uploadFileToCloudinary(file: File): Observable<any> {
  console.log("Archivo a cargar:", file); // Verificar que el archivo se está recibiendo correctamente
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'rotacard');
  
  return this.http.post('https://api.cloudinary.com/v1_1/dapuibwvu/image/upload', formData);
}


  
  
  

onEditProduct(element: any) {
  const dialogRef = this.dialog.open(GenericModalComponent, {
      width: '550px',
      data: {
          action: 'update',
          fields: [
              { type: 'text', name: 'nombre', label: 'Nombre', placeholder: 'Escribe el nombre', value: element.nombre },
              { type: 'text', name: 'descripcion', label: 'Descripción', placeholder: 'Escribe una descripción', value: element.descripcion },
              { type: 'number', name: 'precio', label: 'Precio', placeholder: 'Escribe el precio', value: element.precio },
              { type: 'number', name: 'peso', label: 'Peso', placeholder: 'Escribe el peso en kg', value: element.peso },
              { type: 'number', name: 'volumen', label: 'Volumen', placeholder: 'Escribe el volumen en m³', value: element.volumen },
              { type: 'number', name: 'stock', label: 'Stock', placeholder: 'Cantidad disponible', value: element.stock },
              {
                  type: 'select',
                  name: 'categoriaID',
                  label: 'Categoría',
                  options: this.categories.map(cat => ({ value: cat.categoriaID, label: cat.nombre })),
                  value: element.categoriaID
              },
              { type: 'file', name: 'imagen', label: 'Imagen del Producto', placeholder: '' }, // Campo de carga de archivo
              { type: 'hidden', name: 'productoID', value: element.productoID },
              { type: 'button', action: 'update', icon: 'edit' },
          ]
      }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result && result.action) {
          const formData = { ...result.formData, productoID: element.productoID }; // Incluye el ID del producto en formData
          if (result.file) {
              // Si hay un archivo, primero lo subimos a Cloudinary
              this.uploadFileToCloudinary(result.file).subscribe(cloudinaryResponse => {
                  formData.imagenURL = cloudinaryResponse.url; // Asume que obtienes la URL así
                  this.processUploadFormData(formData, true); // Indica que es una actualización
              });
          } else {
              // Si no se seleccionó un nuevo archivo, procede sin cambiar la imagenURL
              this.processUploadFormData(formData, true); // Indica que es una actualización
          }
      }
  });
}

processUploadFormData(formData: any, isUpdate: boolean = false) {
  console.log('Producto a procesar:', formData);
  if (isUpdate) {
      this.authApiService.updateProduct(formData).subscribe({
          next: (data) => {
              console.log("Producto actualizado con éxito:", data);
              this.getProducts(); // Refresca la lista de productos
          },
          error: (err) => console.error("Error al actualizar el producto:", err),
      });
  } else {
      this.authApiService.insertProduct(formData).subscribe({
          next: (data) => {
              console.log("Producto insertado con éxito:", data);
              this.getProducts(); // Refresca la lista de productos
          },
          error: (err) => console.error("Error al insertar el producto:", err),
      });
  }
}

  
  onDeleteProduct(element: any) {
    const confirmation = confirm(`¿Estás seguro de que quieres eliminar el producto ${element.nombre}?`);
    if (!confirmation) {
      return;
    }
    this.authApiService.deleteProduct(element.productoID).subscribe({
      next: (data) => {
        console.log("Producto eliminado:", data);
        this.getProducts();
      },
      error: (err) => console.error(err),
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
