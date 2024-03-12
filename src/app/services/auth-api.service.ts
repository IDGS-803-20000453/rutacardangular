import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
// --------------------- categories ---------------------
private categoriesUrl = 'https://localhost:7248/api/Categorias';
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
  // Asegúrate de que la URL y el método HTTP coincidan con tu backend
  return this.http.put(`${this.categoriesUrl}/${category.categoriaID}`, category);
}
// --------------------- proveedores ---------------------
private proveedoresUrl = 'https://localhost:7248/api/Proveedores';
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
updateProveedores(proveedores: any): Observable<any> {
  // Asegúrate de que la URL y el método HTTP coincidan con tu backend
  return this.http.put(`${this.proveedoresUrl}/${proveedores.categoriaID}`, proveedores);
}
// --------------------- products ---------------------
private productsUrl = 'https://localhost:7248/api/Productos';

insertProduct(product: any): Observable<any> {
  console.log("Datos del formulario desde el servicio:", product); // Asegúrate de que product tenga los datos correctos
  return this.http.post(this.productsUrl, product);
}
getProducts(): Observable<any> {
  return this.http.get(this.productsUrl);
}
deleteProduct(id: number): Observable<any> {
  return this.http.delete(`${this.productsUrl}/${id}`);
}
updateProduct(product: any): Observable<any> {
  // Asegúrate de que la URL y el método HTTP coincidan con tu backend
  return this.http.put(`${this.productsUrl}/${product.productoID}`, product);
}

// --------------------- carritos ---------------------
private cartsUrl = 'https://localhost:7248/api/Carritos';

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



  
}
