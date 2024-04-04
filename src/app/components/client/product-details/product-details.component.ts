import { Component, OnInit } from '@angular/core';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoEstadoService } from 'src/app/services/carrito-estado.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: any;

  constructor(
    private route: ActivatedRoute,
    private authApiService: AuthApiService,
    private authService: AuthService,
    private carritoEstadoService: CarritoEstadoService,
    private location: Location,
    private router: Router // Para redirigir al usuario a la página de carrito o pago
  ) {}

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => {
        const id = +params['id'];
        return this.authApiService.getProduct(id);
      })
    ).subscribe(product => {
      this.product = product;
    });
  }
  goBack(): void {
    this.location.back(); // Método para regresar a la página anterior
  }

  Add(): void {
    console.log('Agregando al carrito:', this.product.productoID);
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.usuarioId) {
      this.authApiService.addOrUpdateProductToCart(currentUser.usuarioId, this.product.productoID, 1).subscribe({
        next: () => {
          this.carritoEstadoService.solicitarRecargaProductos();
          // Opcional: Mostrar algún mensaje de éxito al usuario
        },
        error: (err) => console.error('Error al agregar al carrito:', err),
      });
    }
  }
  AddAndPay(): void {
    console.log('Agregando al carrito y pagando:', this.product.productoID);
    const currentUser = this.authService.currentUserValue;
    if (currentUser && currentUser.usuarioId) {
      this.authApiService.addOrUpdateProductToCart(currentUser.usuarioId, this.product.productoID, 1).pipe(
        finalize(() => this.router.navigate(['/shopping-cart']))
      ).subscribe({
        next: () => {
          this.carritoEstadoService.solicitarRecargaProductos();
          // Opcional: Mostrar algún mensaje de éxito al usuario
        },
        error: (err) => console.error('Error al agregar al carrito:', err),
      });
    }
  }
}