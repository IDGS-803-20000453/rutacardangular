import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
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



}
