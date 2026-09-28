import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { ProductDTO } from '../../../models/product.model';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  isEditMode = false;
  productId: number | null = null;

  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;  
  existingImageUrl: string | null = null; 

  productForm = this.fb.group({
    productName: ['', [Validators.required, Validators.maxLength(100)]],
    productDesc: [''],
    productPrice: [0, [Validators.required, Validators.min(0)]],
    productQuantity: [0, [Validators.required, Validators.min(0)]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.isEditMode = true;
      this.productId = Number(idParam);
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          productName: product.productName,
          productDesc: product.productDesc ?? '',
          productPrice: product.productPrice,
          productQuantity: product.productQuantity
        });
        this.existingImageUrl = product.productImage;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Load product error:', err);
        this.errorMessage = 'Failed to load product details.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onSubmit(): void {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  if (!this.isEditMode && !this.selectedFile) {
    this.errorMessage = 'Please select a product image.';
    return;
  }

  this.submitting = true;
  this.errorMessage = '';
  this.successMessage = '';

  const formData = new FormData();

  formData.append(
    'Id',
    String(this.isEditMode && this.productId ? this.productId : 0)
  );

  formData.append(
    'ProductName',
    this.productForm.value.productName ?? ''
  );

  formData.append(
    'ProductDesc',
    this.productForm.value.productDesc ?? ''
  );

  formData.append(
    'ProductPrice',
    String(this.productForm.value.productPrice ?? 0)
  );

  formData.append(
    'ProductQuantity',
    String(this.productForm.value.productQuantity ?? 0)
  );

  // ProductImage is only needed when keeping the existing image.
  formData.append(
    'ProductImage',
    this.isEditMode
      ? (this.existingImageUrl ?? '')
      : ''
  );

  // Add newly selected image
  if (this.selectedFile) {
    formData.append(
      'ImageFile',
      this.selectedFile,
      this.selectedFile.name
    );
  }

  const request$ = this.isEditMode
    ? this.productService.updateProduct(formData)
    : this.productService.addProduct(formData);

  request$.subscribe({
    next: () => {
      this.submitting = false;

      this.successMessage = this.isEditMode
        ? 'Product updated successfully!'
        : 'Product added successfully!';

      setTimeout(() => {
        this.router.navigate(['/admin/products']);
      }, 1200);
    },

    error: (err) => {
      console.error('Save product error:', err);

      this.errorMessage =
        err.error || 'Failed to save product. Please try again.';

      this.submitting = false;
      this.cdr.detectChanges();
    }
  });
}

  getImageUrl(imagePath: string): string {
    return this.productService.getImageUrl(imagePath);
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}