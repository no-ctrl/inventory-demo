import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';
import { Product } from '../../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  template: `
    <div class="container" *ngIf="product">
      <!-- Image Slideshow -->
      <div class="slideshow-container" *ngIf="product.images && product.images.length > 0">
        <div class="slideshow">
          <img *ngIf="currentImage" [src]="currentImage.url" [alt]="product.name">
          
          <!-- Navigation Arrows -->
          <button mat-icon-button class="nav-button prev" (click)="previousImage()" *ngIf="product.images && product.images.length > 1">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button mat-icon-button class="nav-button next" (click)="nextImage()" *ngIf="product.images && product.images.length > 1">
            <mat-icon>chevron_right</mat-icon>
          </button>

          <!-- Image Counter -->
          <div class="image-counter" *ngIf="product.images && product.images.length > 1">
            {{currentImageIndex + 1}} / {{product.images.length}}
          </div>

          <!-- Thumbnail Navigation -->
          <div class="thumbnails" *ngIf="product.images && product.images.length > 1">
            <button mat-mini-fab 
                    *ngFor="let image of product.images; let i = index"
                    [color]="i === currentImageIndex ? 'primary' : ''"
                    (click)="setImage(i)">
              <img [src]="image.url" [alt]="'Thumbnail ' + (i + 1)">
            </button>
          </div>
        </div>
      </div>

      <!-- No Images Message -->
      <div class="no-images" *ngIf="!product.images || product.images.length === 0">
        <mat-icon>image_not_supported</mat-icon>
        <p>No images available</p>
      </div>

      <!-- Product Details -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{product.name}}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p class="description">{{product.description}}</p>
          <p class="price">Price: {{product.price | currency}}</p>
          <p class="quantity">Quantity in Stock: {{product.quantity}}</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" [routerLink]="['/products/edit', product.id]">Edit</button>
          <button mat-button color="warn" (click)="deleteProduct()">Delete</button>
          <button mat-button routerLink="/products">Back to List</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    .slideshow-container {
      margin-bottom: 20px;
    }

    .slideshow {
      position: relative;
      background: #f5f5f5;
      border-radius: 8px;
      overflow: hidden;
      aspect-ratio: 16/9;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .slideshow img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    .nav-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.8) !important;
      z-index: 2;
    }

    .prev {
      left: 10px;
    }

    .next {
      right: 10px;
    }

    .image-counter {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 14px;
    }

    .thumbnails {
      position: absolute;
      bottom: 10px;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.4);
    }

    .thumbnails button {
      width: 40px;
      height: 40px;
      padding: 0;
      overflow: hidden;
    }

    .thumbnails img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .no-images {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      border-radius: 8px;
      padding: 40px;
      margin-bottom: 20px;
      color: rgba(0, 0, 0, 0.6);
    }

    .no-images mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    mat-card {
      margin-top: 20px;
    }

    .description {
      margin: 16px 0;
      white-space: pre-line;
    }

    .price {
      font-size: 1.2em;
      color: #1976d2;
      font-weight: 500;
    }

    .quantity {
      color: rgba(0, 0, 0, 0.6);
    }

    mat-card-actions {
      display: flex;
      gap: 8px;
      padding: 16px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    RouterLink,
    CurrencyPipe
  ]
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  currentImageIndex = 0;

  get currentImage() {
    return this.product?.images?.[this.currentImageIndex];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: () => {
        this.toastr.error('Failed to load product');
        this.router.navigate(['/products']);
      }
    });
  }

  previousImage(): void {
    if (this.product?.images?.length) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.product.images.length) % this.product.images.length;
    }
  }

  nextImage(): void {
    if (this.product?.images?.length) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.product.images.length;
    }
  }

  setImage(index: number): void {
    this.currentImageIndex = index;
  }

  deleteProduct(): void {
    if (!this.product?.id) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          this.toastr.success('Product deleted successfully');
          this.router.navigate(['/products']);
        },
        error: () => {
          this.toastr.error('Failed to delete product');
        }
      });
    }
  }
} 