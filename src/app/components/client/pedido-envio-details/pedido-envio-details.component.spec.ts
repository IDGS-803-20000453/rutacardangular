import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoEnvioDetailsComponent } from './pedido-envio-details.component';

describe('PedidoEnvioDetailsComponent', () => {
  let component: PedidoEnvioDetailsComponent;
  let fixture: ComponentFixture<PedidoEnvioDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PedidoEnvioDetailsComponent]
    });
    fixture = TestBed.createComponent(PedidoEnvioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
