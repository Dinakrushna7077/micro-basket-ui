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

  getAllProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/all-products/${keyword}`);
  }

  getProductById(pid: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/get-product/${pid}`);
  }

  searchProducts(keyword: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/search/${keyword}`);
  }

  addProduct(data: FormData): Observable<string> {
    return this.http.post(`${this.baseUrl}/add-new-product`, data, { responseType: 'text' });
  }

  updateProduct(data: FormData): Observable<string> {
    return this.http.put(`${this.baseUrl}/update-product`, data, { responseType: 'text' });
  }
  getLowStockProducts(): Observable<LowStockDTO[]> {
  return this.http.get<LowStockDTO[]>(`${this.baseUrl}/low-stock`);
}
getImageUrl(imagePath: string): string {
  if (!imagePath) {
    return 'default-image-url'; 
  }
  return `${environment.apiUrl.replace('/api', '')}${imagePath}`;
}
}