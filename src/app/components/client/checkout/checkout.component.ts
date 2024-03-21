import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AuthApiService } from 'src/app/services/auth-api.service';
import { loadStripe } from '@stripe/stripe-js';
import { MatDialog } from '@angular/material/dialog';
import { GenericModalComponent } from '../../admin/modals/generic-modal/generic-modal.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  stripePromise = loadStripe('pk_test_51OrEqv2NKBfmHsAE02C4x4BzphBoaI4SXUlsD848rCJwYygfzSWkeYPn4PfXDfsrHEyFoofxT5Ey8P0BPFjLfnZw00aRIrQ3G3');
  elements: any;
  card: any;
  totalGeneral: number = 0;
  productosCarrito: any[] = [];
  totalProductos: number = 0;
  pesoTotal: number = 0;
  volumenTotal: number = 0;
  direccionEnvio: string = ''; // Inicializar la variable como una cadena vacía
  mostrarResumen: boolean = false; // Agregar esta variable para controlar la visibilidad del modal

  constructor(
    public authService: AuthService,
    public authApiService: AuthApiService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarTotalesCarrito();
    this.inicializarStripe();
  }

  ngOnDestroy() {
    if (this.card) {
      this.card.destroy();
    }
  }

  cargarTotalesCarrito() {
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

  async inicializarStripe() {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe no ha sido inicializado');
      return;
    }

    const elements = stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    this.card = elements.create('card', { style: style });
    this.card.mount('#card-element');
    this.card.addEventListener('change', (event: any) => {
      const displayError = document.getElementById('card-errors');
      if (event.error) {
        if (displayError) displayError.textContent = event.error.message;
      } else {
        if (displayError) displayError.textContent = '';
      }
    });
  }

  async finalizarPago() {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe no ha sido inicializado');
      return;
    }

    const { token, error } = await stripe.createToken(this.card);
    if (error) {
      console.error('Error al crear token:', error);
    } else {
      console.log('Token:', token);
      this.mostrarResumenCompra(); // Llamar a la función para mostrar el resumen de la compra
    }
  }

  async finalizarPedido() {
    const stripe = await this.stripePromise;
    if (!stripe) {
      console.error('Stripe no ha sido inicializado');
      return;
    }

    try {
      const { token, error } = await stripe.createToken(this.card);
      if (error) {
        console.error('Error al crear token:', error);
      } else {
        console.log('Token:', token);
        this.mostrarResumenCompra(); // Llamar a la función para mostrar el resumen de la compra
      }
    } catch (error) {
      console.error('Error al crear el token:', error);
    }
  }

  mostrarResumenCompra() {
    this.mostrarResumen = true; // Mostrar el modal de resumen
  }

  cerrarModal(): void {
    this.mostrarResumen = false; // Cerrar el modal de resumen
  }

  ngOnChanges(): void {
    this.cdr.detectChanges();
  }
}
