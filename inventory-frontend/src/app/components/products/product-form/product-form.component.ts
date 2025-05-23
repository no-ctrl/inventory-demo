import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MaterialModule } from '../../../shared/material.module';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductImage } from '../../../models/product.model';

@Component({
  selector: 'app-product-form',
  template: `
    <div class="container">
      <h1>{{ isEditMode ? 'Edit' : 'Create' }} Product</h1>
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" placeholder="Enter product name">
          <mat-error *ngIf="productForm.get('name')?.hasError('required')">
            Name is required
          </mat-error>
          <mat-error *ngIf="productForm.get('name')?.hasError('minlength')">
            Name must be at least 2 characters
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" placeholder="Enter product description" rows="4"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Price</mat-label>
          <input matInput type="number" formControlName="price" placeholder="Enter product price">
          <mat-error *ngIf="productForm.get('price')?.hasError('required')">
            Price is required
          </mat-error>
          <mat-error *ngIf="productForm.get('price')?.hasError('min')">
            Price must be greater than 0
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" formControlName="quantity" placeholder="Enter product quantity">
          <mat-error *ngIf="productForm.get('quantity')?.hasError('required')">
            Quantity is required
          </mat-error>
          <mat-error *ngIf="productForm.get('quantity')?.hasError('min')">
            Quantity must be greater than or equal to 0
          </mat-error>
        </mat-form-field>

        <div class="images-section">
          <h3>Product Images</h3>
          
          <!-- Image Gallery -->
          <div class="image-gallery" *ngIf="existingImages.length > 0 || newImages.length > 0">
            <!-- Existing Images -->
            <div class="image-item" *ngFor="let image of existingImages">
              <div class="preview">
                <img [src]="image.url" [alt]="'Product image ' + image.id">
                <button mat-icon-button color="warn" type="button" (click)="removeExistingImage(image)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>

            <!-- New Images -->
            <div class="image-item" *ngFor="let image of newImages; let i = index">
              <div class="preview">
                <img [src]="image.preview" [alt]="'New image ' + (i + 1)">
                <button mat-icon-button color="warn" type="button" (click)="removeNewImage(i)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- No Images Message -->
          <p *ngIf="existingImages.length === 0 && newImages.length === 0" class="no-images">
            No images added yet
          </p>

          <!-- Add Image Button -->
          <div class="add-image">
            <input type="file" 
                   #fileInput 
                   hidden 
                   (change)="onFileSelected($event)" 
                   accept="image/*"
                   multiple>
            <button mat-stroked-button 
                    type="button" 
                    (click)="fileInput.click()"
                    [disabled]="existingImages.length + newImages.length >= 5">
              <mat-icon>add_photo_alternate</mat-icon>
              Add Images
            </button>
            <small class="hint">You can add up to 5 images</small>
          </div>
        </div>

        <div class="form-actions">
          <button mat-raised-button 
                  color="primary" 
                  type="submit" 
                  [disabled]="productForm.invalid || isSubmitting">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
          <button mat-button type="button" routerLink="/products">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .images-section {
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .images-section h3 {
      margin-top: 0;
      margin-bottom: 16px;
    }
    .image-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .image-item {
      position: relative;
    }
    .preview {
      position: relative;
      width: 100%;
      padding-bottom: 100%;
      overflow: hidden;
      border-radius: 4px;
      background-color: #f5f5f5;
    }
    .preview img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .preview button {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(255,255,255,0.9);
    }
    .add-image {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .hint {
      color: rgba(0,0,0,0.6);
    }
    .no-images {
      text-align: center;
      color: rgba(0,0,0,0.6);
      margin: 20px 0;
    }
    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 24px;
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  existingImages: ProductImage[] = [];
  newImages: Array<{ file: File, preview: string }> = [];
  private currentProductId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.currentProductId = id;
      this.loadProduct(id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.productForm.patchValue(product);
        if (product.images) {
          this.existingImages = product.images;
        }
      },
      error: () => {
        this.toastr.error('Failed to load product');
        this.router.navigate(['/products']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const fileList = (event.target as HTMLInputElement).files;
    if (!fileList) return;

    // Convert FileList to Array for easier handling
    const files = Array.from(fileList);
    
    // Check if adding these files would exceed the limit
    if (this.existingImages.length + this.newImages.length + files.length > 5) {
      this.toastr.error('Maximum 5 images allowed');
      return;
    }

    // Process each file
    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        this.toastr.error(`File "${file.name}" is not an image`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.newImages.push({
          file: file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    });

    // Clear input
    (event.target as HTMLInputElement).value = '';
  }

  removeExistingImage(image: ProductImage): void {
    if (this.currentProductId) {
      this.productService.deleteImage(this.currentProductId, image.id).subscribe({
        next: () => {
          this.existingImages = this.existingImages.filter(img => img.id !== image.id);
          this.toastr.success('Image deleted successfully');
        },
        error: () => {
          this.toastr.error('Failed to delete image');
        }
      });
    }
  }

  removeNewImage(index: number): void {
    this.newImages.splice(index, 1);
  }

  onSubmit(): void {
    if (this.productForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formData = new FormData();
      const productData = this.productForm.value;
      
      // Append product data
      formData.append('name', productData.name || '');
      formData.append('description', productData.description || '');
      formData.append('price', productData.price?.toString() || '0');
      formData.append('quantity', productData.quantity?.toString() || '0');

      // Append all new images
      this.newImages.forEach((image, index) => {
        formData.append('images', image.file);
      });

      const request = this.isEditMode
        ? this.productService.updateProduct(this.currentProductId!, formData)
        : this.productService.createProduct(formData);

      request.subscribe({
        next: () => {
          this.toastr.success(`Product ${this.isEditMode ? 'updated' : 'created'} successfully`);
          this.router.navigate(['/products']);
        },
        error: (error) => {
          console.error('Error:', error);
          this.toastr.error(error.error?.message || `Failed to ${this.isEditMode ? 'update' : 'create'} product`);
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }
} 