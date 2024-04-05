import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
// --------------------- categories ---------------------
private categoriesUrl = 'https://www.bazarapi.somee.com/api/Categorias';
constructor(private http: HttpClient) { }

insertCategory(category: any): Observable<any> {
  console.log("Datos del formulario desde el servicio:", category); // Asegúrate de que category tenga los datos correctos
  return this.http.post(this.categoriesUrl, category);
}
getCategories(): Observable<any> {
  return this.http.get(this.categoriesUrl);
}
deleteCategory(id: number): Observable<any> {
  return this.http.delete(`${this.categoriesUrl}/${id}`);
}
updateCategory(category: any): Observable<any> {
  console.log("Datos del formulario desde el servicio:", category); // Asegúrate de que category tenga los datos correctos
  return this.http.put(`${this.categoriesUrl}/${category.categoriaID}`, category);
}
// --------------------- proveedores ---------------------
private proveedoresUrl = 'https://www.bazarapi.somee.com/api/Proveedores';
insertProveedores(proveedores: any): Observable<any> {
  console.log("Datos del formulario desde el servicio:", proveedores); // Asegúrate de que category tenga los datos correctos
  return this.http.post(this.proveedoresUrl, proveedores);
}
getProveedores(): Observable<any> {
  return this.http.get(this.proveedoresUrl);
}
deleteProveedores(id: number): Observable<any> {
  return this.http.delete(`${this.proveedoresUrl}/${id}`);
}
updateProveedores(provider: any): Observable<any> {
  return this.http.put(`${this.proveedoresUrl}/${provider.proveedorID}`, provider);
}
// --------------------- products ---------------------
private productsUrl = 'https://www.bazarapi.somee.com/api/Productos';

insertProduct(product: any): Observable<any> {
  console.log("Datos del formulario desde el servicio:", product); // Asegúrate de que product tenga los datos correctos
  return this.http.post(this.productsUrl, product);
}
getProducts(): Observable<any> {
  return this.http.get(this.productsUrl);
}
getProduct(id: number): Observable<any> {
  return this.http.get<any>(`${this.productsUrl}/${id}`);
}

deleteProduct(id: number): Observable<any> {
  return this.http.delete(`${this.productsUrl}/${id}`);
}
updateProduct(product: any): Observable<any> {
  return this.http.put(`${this.productsUrl}/${product.productoID}`, product);
}
// --------------------- envios ---------------------

private enviosUrl = 'https://www.bazarapi.somee.com/api/Envios';

patchEnvio(envio: any): Observable<any> {
  // api/Envios/ActualizarEstado
  const url = `${this.enviosUrl}/ActualizarEstado`;
  return this.http.patch(`${url}/${envio.envioID}`, envio);
}

putEnvio(envio: any): Observable<any> {
  return this.http.put(`${this.enviosUrl}/${envio.envioID}`, envio);
}

getEnvio(id: number): Observable<any> {
  return this.http.get<any>('URL_DEL_ENDPOINT_PARA_OBTENER_UNICO_ENVIO/' + id);
}


// --------------------- carritos ---------------------

private cartsUrl = 'https://www.bazarapi.somee.com/api/Carritos';

addOrUpdateProductToCart(usuarioID: number, productoID: number, cantidad: number): Observable<any> {
  const url = `${this.cartsUrl}/AgregarOActualizarProducto/${usuarioID}/${productoID}/${cantidad}`;
  return this.http.post(url, {}); // El cuerpo de la petición está vacío
  }
  
  obtenerDetalleCarritoPorUsuario(usuarioID: number): Observable<any> {
    const url = `${this.cartsUrl}/DetalleCarritoPorUsuario/${usuarioID}`;
    return this.http.get(url);
  }

  vaciarCarrito(usuarioID: number): Observable<any> {
    // Incluir usuarioId como un parámetro de consulta en la URL
    const url = `${this.cartsUrl}/VaciarCarrito?usuarioId=${usuarioID}`;
    console.log(`URL final: ${url}`); // Esto debería mostrar la URL correctamente formada
    // Para un POST donde se espera que los parámetros vayan en la URL, puedes enviar un objeto vacío o el objeto que necesites en el cuerpo
    // Si el backend no espera un cuerpo, puedes enviar un objeto vacío o null
    return this.http.post(url, {});
}

reducirProductoDelCarrito(usuarioID: number, productoID: number): Observable<any> {
  const url = `${this.cartsUrl}/ReducirProducto?usuarioId=${usuarioID}&productoId=${productoID}`;
  return this.http.post(url, {});
}


AgregarOActualizarProducto(usuarioID: number, productoID: number, cantidad: number): Observable<any> {
  const url = `${this.cartsUrl}/AgregarOActualizarProducto/${usuarioID}/${productoID}/${cantidad}`;
  console.log(`URL final: ${url}`); // Esto debería mostrar la URL correctamente formada

  return this.http.post(url, {});
}

// --------------------- Pedidos ---------------------
private ordersUrl = 'https://www.bazarapi.somee.com/api/Pedidos';

getAllOrdersGroup(): Observable<any> {
  const url = `${this.ordersUrl}/PedidoEnvio/Agrupado/Todos`;
  return this.http.get(url);
}

getAllOrders(): Observable<any> {
  const url = `${this.ordersUrl}/PedidoEnvio/Todos`;
  return this.http.get(url);
}
getAllOrdersByUser(userId: number): Observable<any> {
  const url = `${this.ordersUrl}/PedidoEnvio/Agrupado/PorUsuario/${userId}`;
  return this.http.get(url);
}

getAllOrdersAndShippingByUser(userId: number): Observable<any> {
  const url = `${this.ordersUrl}/PedidoEnvio/PorUsuario/${userId}`;
  return this.http.get(url);
}
//agregar pedido envio en api/pedidos/crear
AgregarPedidoEnvio(pedidoEnvio: any): Observable<any> {
  const url = `${this.ordersUrl}/Crear`;
  return this.http.post(url, pedidoEnvio);
}

// --------------------- configuración del perfil para el usuario, metodo patch ---------------------
private profileUrl = 'https://www.bazarapi.somee.com/api/Usuarios';

patchProfile(user: any): Observable<any> {
  const url = `${this.profileUrl}/${user.usuarioId}`;
  return this.http.patch(url, user);
}

//getUsuario por id
getUsuario(usuarioId: number): Observable<any> {
  const url = `${this.profileUrl}/${usuarioId}`;
  return this.http.get(url);
}

//getAllUsuarios
getAllUsuarios(): Observable<any> {
  return this.http.get(this.profileUrl);
}


  
}
