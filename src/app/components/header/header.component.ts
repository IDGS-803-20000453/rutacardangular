import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { CarritoEstadoService } from 'src/app/services/carrito-estado.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  totalGeneral: number = 0;
  productosCarrito: any[] | null = [];
  totalProductos: number = 0;
  private subs = new Subscription();

  constructor(
    public authService: AuthService,
    public authApiService: AuthApiService,
    private carritoEstadoService: CarritoEstadoService
  ) {}

  ngOnInit() {
    this.subs.add(
      this.authService.isLoggedIn.subscribe(isLoggedIn => {
        if (!isLoggedIn) {
          // Limpiar el carrito si el usuario cierra sesión
          this.productosCarrito = [];
          this.totalProductos = 0;
          this.totalGeneral = 0;
        }
      })
    );

    this.authService.isLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          console.log('UsuarioID desde header:', currentUser.usuarioId);
          this.cargarProductosCarrito();
          this.subs.add(
            this.carritoEstadoService.totalProductos$.subscribe(total => {
              this.totalProductos = total;
            })
          );
          // Suscripción al evento de recarga de productos
          this.subs.add(
            this.carritoEstadoService.recargarProductos$.subscribe(() => {
              this.cargarProductosCarrito();
            })
          );
        }
      }
    });
  }
  
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  agregarProducto(productoID: number) {
    const usuarioID = this.authService.currentUserValue?.usuarioId;
    if (usuarioID) {
      this.authApiService.AgregarOActualizarProducto(usuarioID, productoID, 1).subscribe({
        next: () => {
          console.log('Producto agregado con éxito');
          // Aquí podrías recargar los productos del carrito o actualizar la UI según sea necesario
          this.cargarProductosCarrito();
        },
        error: (error) => console.error('Error al agregar producto:', error),
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  }
  
  quitarProducto(productoID: number) {
    const usuarioID = this.authService.currentUserValue?.usuarioId;
    if (usuarioID) {
      this.authApiService.reducirProductoDelCarrito(usuarioID, productoID).subscribe({
        next: () => {
          console.log('Producto quitado con éxito');
          // Aquí podrías recargar los productos del carrito o actualizar la UI según sea necesario
          this.cargarProductosCarrito();
        },
        error: (error) => console.error('Error al quitar producto:', error),
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  vaciarCarrito() {
    const currentUser = this.authService.currentUserValue;
  
    if (currentUser && currentUser.usuarioId) {
      const usuarioID = currentUser.usuarioId;
      this.authApiService.vaciarCarrito(usuarioID).subscribe({
        next: () => {
          console.log('Carrito vaciado con éxito.');
          console.log('UsuarioID:', usuarioID)
          // Actualizar la UI para reflejar el carrito vacío
          this.productosCarrito = [];
          this.totalProductos = 0;
          this.totalGeneral = 0;
          // Opcional: Emitir un evento o llamar a un método para recargar los datos necesarios
          this.carritoEstadoService.solicitarRecargaProductos();
        },
        error: (error) => console.error('Error al vaciar el carrito:', error),
      });
    } else {
      console.error('Usuario no autenticado.');
    }
  }

  cargarProductosCarrito() {
    const usuarioID = this.authService.currentUserValue?.usuarioId;
    if (usuarioID) {
      this.authApiService.obtenerDetalleCarritoPorUsuario(usuarioID).subscribe({
        next: (productos) => {
          this.productosCarrito = productos.length > 0 ? productos : null;
          this.totalProductos = productos.reduce((acc: any, producto: { cantidad: any; }) => acc + producto.cantidad, 0);
          // Calcula el total general
          this.totalGeneral = productos.reduce((acc: any, producto: { cantidad: any; precio: any; }) => acc + (producto.cantidad * producto.precio), 0);
          console.log('Total de productos en el carrito:', this.totalProductos);
          console.log('Total general de la compra:', this.totalGeneral);
        },
        error: (err) => {
          console.error('Error al cargar productos del carrito:', err);
          this.productosCarrito = null;
          this.totalProductos = 0;
          this.totalGeneral = 0; // Resetea el total general a 0 si hay un error
        }
      });
    }
  }
}
