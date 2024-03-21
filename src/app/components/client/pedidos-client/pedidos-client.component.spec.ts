import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosClientComponent } from './pedidos-client.component';

describe('PedidosClientComponent', () => {
  let component: PedidosClientComponent;
  let fixture: ComponentFixture<PedidosClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PedidosClientComponent]
    });
    fixture = TestBed.createComponent(PedidosClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
