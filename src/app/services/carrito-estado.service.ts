import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoEstadoService {
  private totalProductosSource = new BehaviorSubject<number>(0);
  totalProductos$ = this.totalProductosSource.asObservable();

  private recargarProductosSource = new Subject<void>();
  recargarProductos$ = this.recargarProductosSource.asObservable();

  actualizarTotalProductos(total: number) {
    this.totalProductosSource.next(total);
  }

  solicitarRecargaProductos() {
    this.recargarProductosSource.next();
  }
}
