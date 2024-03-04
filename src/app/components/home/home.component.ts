import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoEstadoService } from 'src/app/services/carrito-estado.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  products: any[] = []; // Inicializa la lista de productos vacía
  allProducts: any[] = []; // Copia de todos los productos
  pagedProducts: any[] = []; // Productos para la página actual
// Propiedades para la paginación
currentPage: number = 0;
pageSize: number = 5; // Número de ítems por página
  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator; // Obtiene el paginador (si existe
  constructor(private authApiService: AuthApiService, 
    public authService: AuthService,
    private carritoEstadoService: CarritoEstadoService
    ) { } // Inyecta el servicio

  ngOnInit(): void {
    this.loadProducts(); // Carga los productos al inicializar el componente
    const currentUser = this.authService.currentUserValue;
    if (currentUser) {
      console.log('UsuarioID desde home:', currentUser.usuarioId);
    }
  }
  agregarAlCarrito(productoID: number): void {
  const currentUser = this.authService.currentUserValue;
  if (currentUser && currentUser.usuarioId) {
    console.log('Agregando al carrito:', productoID);
    this.authApiService.addOrUpdateProductToCart(currentUser.usuarioId, productoID, 1).subscribe({
      next: (response) => {
        console.log('Producto agregado al carrito:', response);
        // Aquí debes obtener el total actualizado del carrito
        // Esto es un ejemplo, debes ajustarlo según tu API y lógica
        this.authApiService.obtenerDetalleCarritoPorUsuario(currentUser.usuarioId).subscribe({
          next: (productos) => {
            const totalActualizado = productos.reduce((acc: any, producto: { cantidad: any; }) => acc + producto.cantidad, 0);
            this.carritoEstadoService.actualizarTotalProductos(totalActualizado);
            this.carritoEstadoService.solicitarRecargaProductos();

          }
        });
      },
      error: (err) => console.error('Error al agregar al carrito:', err),
    });
  }
}


  loadProducts() {
    this.authApiService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data; // Almacena los productos en allProducts
        this.products = [...this.allProducts]; // Inicializa products con todos los productos
        this.applyPagination(); // Aplica la paginación
        console.log("Productos cargados:", this.products);
      },
      error: (err) => console.error("Error al cargar los productos:", err),
    });
  }
  applyPagination() {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.pagedProducts = this.products.slice(startIndex, endIndex);
  }
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyPagination();
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase(); // Obtiene el valor del filtro y lo convierte a minúsculas
    if (filterValue) {
      this.products = this.allProducts.filter(product => 
        product.nombre.toLowerCase().includes(filterValue) || 
        product.descripcion.toLowerCase().includes(filterValue)
      );
    } else {
      this.products = [...this.allProducts]; // Restablece los productos a todos los productos si el filtro está vacío
    }
    this.applyPagination(); // Aplica la paginación después de filtrar

  }
}
