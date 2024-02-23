import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

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
  
  // Añade un campo 'price' a tu modelo de producto.
products = [
  { name: 'Bomba de Agua', description: 'Alta eficiencia energética y durabilidad para cualquier sistema de tratamiento de agua.', imageUrl: 'assets/bomba-agua.jpg', price: '99.99' },
  { name: 'Filtro de Agua', description: 'Filtro avanzado para purificar y tratar agua reciclada.', imageUrl: 'assets/filtro-agua.jpg', price: '149.99' },
  { name: 'Kit de Análisis de Agua', description: 'Herramientas esenciales para el análisis y monitoreo de la calidad del agua.', imageUrl: 'assets/kit-analisis.jpg', price: '199.99' },
  // Continúa con otros productos...
];


  constructor() { }

  ngOnInit(): void { }
}
