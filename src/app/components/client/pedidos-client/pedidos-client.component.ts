import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pedidos-client',
  templateUrl: './pedidos-client.component.html',
  styleUrls: ['./pedidos-client.component.css']
})
export class PedidosClientComponent implements OnInit {
  totalGeneral: number = 0;
  productosCarrito: any[] = [];
  totalProductos: number = 0;
  pesoTotal: number = 0;
  volumenTotal: number = 0;

  dataSource: MatTableDataSource<any>;
  selectedProduct: any; // Variable para almacenar el producto seleccionado

  constructor(
    public authService: AuthService,
    public authApiService: AuthApiService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.cargarProductosCarrito();
  }

  cargarProductosCarrito() {
    const usuarioID = this.authService.currentUserValue?.usuarioId;
    if (usuarioID) {
      this.authApiService.obtenerDetalleCarritoPorUsuario(usuarioID).subscribe({
        next: (productos) => {
          this.productosCarrito = productos;
          this.dataSource.data = this.productosCarrito;
          this.totalProductos = productos.reduce((acc: any, producto: { cantidad: any; }) => acc + producto.cantidad, 0);
          this.totalGeneral = productos.reduce((acc: number, producto: { cantidad: number; precio: number; }) => acc + (producto.cantidad * producto.precio), 0);
          this.pesoTotal = productos.reduce((acc: number, producto: { cantidad: number; peso: number; }) => acc + (producto.cantidad * producto.peso), 0);
          this.volumenTotal = productos.reduce((acc: number, producto: { cantidad: number; volumen: number; }) => acc + (producto.cantidad * producto.volumen), 0);
        },
        error: (err) => {
          console.error('Error al cargar productos del carrito:', err);
          this.productosCarrito = [];
          this.dataSource.data = [];
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

  openDetails(row: any) {
    this.selectedProduct = row; // Almacena el producto seleccionado
  }

  closeDetails() {
    this.selectedProduct = null; // Limpia el producto seleccionado al cerrar los detalles
  }
}
