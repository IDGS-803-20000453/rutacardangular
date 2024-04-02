import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatPaginator } from '@angular/material/paginator'; // Importa MatPaginator

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

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator; // Define MatPaginator

  constructor(
    public authService: AuthService,
    public authApiService: AuthApiService
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    //this.cargarProductosCarrito();
    this.getPedidos();
  }

 /* cargarProductosCarrito() {
    const usuarioID = this.authService.currentUserValue?.usuarioId;
    if (usuarioID) {
      this.authApiService.obtenerDetalleCarritoPorUsuario(usuarioID).subscribe({
        next: (productos) => {
          this.productosCarrito = productos;
          this.dataSource.data = this.productosCarrito;
          this.totalProductos = this.productosCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
          this.totalGeneral = this.productosCarrito.reduce((acc, producto) => acc + (producto.cantidad * producto.precio), 0);
          this.pesoTotal = this.productosCarrito.reduce((acc, producto) => acc + (producto.cantidad * producto.peso), 0);
          this.volumenTotal = this.productosCarrito.reduce((acc, producto) => acc + (producto.cantidad * producto.volumen), 0);
        },
        error: (err) => {
          console.error('Error al cargar productos del carrito:', err);
          this.clearProductData();
        }
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  }*/

  clearProductData() {
    this.productosCarrito = [];
    this.dataSource.data = [];
    this.totalProductos = 0;
    this.totalGeneral = 0;
    this.pesoTotal = 0;
    this.volumenTotal = 0;
  }

  openDetails(row: any) {
    this.selectedProduct = row; // Almacena el producto seleccionado
  }

  closeDetails() {
    this.selectedProduct = null; // Limpia el producto seleccionado al cerrar los detalles
  }

  getPedidos() {
    this.authApiService.getAllOrdersGroup().subscribe({
      next: (data) => {
        console.log("Datos recibidos:", data); 
        this.dataSource.data = data; 
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        console.error('Error al obtener pedidos:', err);
        // Limpia los datos del pedido en caso de error
        this.dataSource.data = [];
      }
    });
  }
}
