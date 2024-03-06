import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthApiService } from 'src/app/services/auth-api.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  totalGeneral: number = 0;
  productosCarrito: any[] = []; // Cambiado a arreglo vacío por defecto
  totalProductos: number = 0;
  pesoTotal: number = 0;
  volumenTotal: number = 0;

  constructor(
    public authService: AuthService,
    public authApiService: AuthApiService
  ) { }

  ngOnInit() {
    this.cargarProductosCarrito();
  }


  cargarProductosCarrito() {
    const usuarioID = this.authService.currentUserValue?.usuarioId;
    if (usuarioID) {
      this.authApiService.obtenerDetalleCarritoPorUsuario(usuarioID).subscribe({
        next: (productos) => {
          this.productosCarrito = productos;
          this.totalProductos = productos.reduce((acc: any, producto: { cantidad: any; }) => acc + producto.cantidad, 0);
          this.totalGeneral = productos.reduce((acc: number, producto: { cantidad: number; precio: number; }) => acc + (producto.cantidad * producto.precio), 0);
          this.pesoTotal = productos.reduce((acc: number, producto: { cantidad: number; peso: number; }) => acc + (producto.cantidad * producto.peso), 0);
          this.volumenTotal = productos.reduce((acc: number, producto: { cantidad: number; volumen: number; }) => acc + (producto.cantidad * producto.volumen), 0);
        },
        error: (err) => {
          console.error('Error al cargar productos del carrito:', err);
          // Reiniciar valores si hay error
          this.productosCarrito = [];
          this.totalProductos = 0;
          this.totalGeneral = 0;
          this.pesoTotal = 0;
          this.volumenTotal = 0;
        }
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  }
  hacerPedido() {
  }

  quitarProducto(producto: any) {
  }
  agregarProducto(producto: any, cantidad: number) {
  }

  // Los métodos agregarProducto y quitarProducto podrían ajustarse para reflejar el nuevo flujo, si es necesario
}
