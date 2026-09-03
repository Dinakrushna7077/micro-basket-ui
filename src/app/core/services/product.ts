import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductDTO } from '../../models/product.model';
import { LowStockDTO } from '../../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/Product`;

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/all-products`);
  }

  getProductById(pid: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/get-product/${pid}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/serach/${keyword}`);
  }

  addProduct(data: ProductDTO): Observable<string> {
    return this.http.post(`${this.baseUrl}/add-new-product`, data, { responseType: 'text' });
  }

  updateProduct(data: ProductDTO): Observable<string> {
    return this.http.put(`${this.baseUrl}/update-product`, data, { responseType: 'text' });
  }
  getLowStockProducts(): Observable<LowStockDTO[]> {
  return this.http.get<LowStockDTO[]>(`${this.baseUrl}/low-stock`);
}
}