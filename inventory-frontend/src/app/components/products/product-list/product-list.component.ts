import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-list',
  template: `
    <div class="container">
      <div class="header">
        <h1>Products</h1>
        <button mat-raised-button color="primary" routerLink="/products/new">
          <mat-icon>add</mat-icon>
          Add Product
        </button>
      </div>

      <!-- Search -->
      <mat-form-field appearance="outline" class="search-field">
        <mat-label>Search products</mat-label>
        <input matInput [(ngModel)]="searchTerm" (keyup)="onSearch()" placeholder="Enter product name">
        <button mat-icon-button matSuffix *ngIf="searchTerm" (click)="clearSearch()">
          <mat-icon>close</mat-icon>
        </button>
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>

      <!-- Products Grid -->
      <div class="products-grid">
        <mat-card *ngFor="let product of products" class="product-card" [routerLink]="['/products', product.id]">
          <!-- Product Image -->
          <div class="product-image">
            <img *ngIf="product.images && product.images.length > 0 && product.images[0]" 
                 [src]="product.images[0].url" 
                 [alt]="product.name">
            <div *ngIf="!product.images || product.images.length === 0" class="no-image">
              <mat-icon>image_not_supported</mat-icon>
            </div>
            <div class="image-count" *ngIf="product.images && product.images.length > 1">
              <mat-icon>collections</mat-icon>
              {{product.images.length}}
            </div>
          </div>

          <mat-card-header>
            <mat-card-title>{{product.name}}</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <p class="description">
              {{product.description?.slice(0, 100)}}
              <ng-container *ngIf="product.description && product.description.length > 100">...</ng-container>
            </p>
            <p class="price">{{product.price | currency}}</p>
            <p class="stock" [class.low-stock]="product.quantity < 10">
              <mat-icon>inventory_2</mat-icon>
              {{product.quantity}} in stock
            </p>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Pagination -->
      <mat-paginator
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageSizeOptions]="[12, 24, 48]"
        (page)="onPageChange($event)"
        aria-label="Select page">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 20px;
    }

    .product-card {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .product-image {
      position: relative;
      width: 100%;
      padding-bottom: 75%;
      background: #f5f5f5;
      overflow: hidden;
      border-radius: 4px 4px 0 0;
    }

    .product-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0,0,0,0.4);
    }

    .no-image mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }

    .image-count {
      position: absolute;
      top: 8px;
      right: 8px;
      background: rgba(0,0,0,0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .image-count mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    mat-card-header {
      padding: 16px 16px 0;
    }

    mat-card-content {
      padding: 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    .description {
      color: rgba(0,0,0,0.6);
      margin-bottom: 8px;
      flex-grow: 1;
    }

    .price {
      font-size: 1.2em;
      color: #1976d2;
      font-weight: 500;
      margin: 8px 0;
    }

    .stock {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #4caf50;
      margin: 0;
    }

    .stock.low-stock {
      color: #f44336;
    }

    .stock mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    FormsModule,
    CurrencyPipe
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  page = 0;
  pageSize = 12;
  totalElements = 0;
  searchTerm = '';

  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts(this.page, this.pageSize, this.searchTerm).subscribe({
      next: (response) => {
        this.products = response.content;
        this.totalElements = response.totalElements;
      },
      error: () => {
        this.toastr.error('Failed to load products');
      }
    });
  }

  onPageChange(event: any): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onSearch(): void {
    this.page = 0;
    this.loadProducts();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.onSearch();
  }
} 