import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/v1/products`;

  constructor(private http: HttpClient) { }

  private transformImageUrls(product: Product): Product {
    if (product.images) {
      product.images = product.images.map(img => ({
        ...img,
        url: img.url.startsWith('http') ? img.url : `${environment.apiUrl}${img.url}`
      }));
    }
    return product;
  }

  getProducts(page: number = 0, size: number = 10, name?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => ({
        ...response,
        content: response.content.map((product: Product) => this.transformImageUrls(product))
      }))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => this.transformImageUrls(product))
    );
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData).pipe(
      map(product => this.transformImageUrls(product))
    );
  }

  updateProduct(id: number, formData: FormData): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData).pipe(
      map(product => this.transformImageUrls(product))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(productId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/${productId}/images`, formData);
  }

  getImages(productId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${productId}/images`).pipe(
      map(images => images.map(img => ({
        ...img,
        url: img.url.startsWith('http') ? img.url : `${environment.apiUrl}${img.url}`
      })))
    );
  }

  deleteImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}/images/${imageId}`);
  }
} 