package com.example.inventory.controller;

import com.example.inventory.dto.ProductRequest;
import com.example.inventory.dto.ProductResponse;
import com.example.inventory.service.ProductImageService;
import com.example.inventory.service.ProductService;
import jakarta.validation.constraints.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/products")
@Validated
public class ProductController {
    private final ProductService productService;
    private final ProductImageService imageService;
    private static final Logger log = LoggerFactory.getLogger(ProductController.class);

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> createProduct(
            @RequestParam("name") @NotBlank(message = "Product name is required") @Size(min = 2, max = 255, message = "Product name must be between 2 and 255 characters") String name,
            @RequestParam("description") @Size(max = 1000, message = "Description cannot exceed 1000 characters") String description,
            @RequestParam("price") @NotNull(message = "Price is required") @DecimalMin(value = "0.0", inclusive = true, message = "Price must be positive") BigDecimal price,
            @RequestParam("quantity") @NotNull(message = "Quantity is required") @Min(value = 0, message = "Quantity must be positive") Integer quantity,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {

        ProductRequest request = ProductRequest.builder()
                .name(name.trim())
                .description(description != null ? description.trim() : "")
                .price(price)
                .quantity(quantity)
                .build();

        ProductResponse response = productService.createProduct(request);

        if (images != null && images.length > 0) {
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    try {
                        imageService.uploadImage(response.getId(), image);
                    } catch (Exception e) {
                        log.error("Failed to upload image for product {}: {}", response.getId(), e.getMessage());
                    }
                }
            }
            response = productService.getProductById(response.getId());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<Page<ProductResponse>> listProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String name) {
        return ResponseEntity.ok(productService.getAllProducts(PageRequest.of(page, size), name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestParam("name") @NotBlank(message = "Product name is required") @Size(min = 2, max = 255, message = "Product name must be between 2 and 255 characters") String name,
            @RequestParam("description") @Size(max = 1000, message = "Description cannot exceed 1000 characters") String description,
            @RequestParam("price") @NotNull(message = "Price is required") @DecimalMin(value = "0.0", inclusive = true, message = "Price must be positive") BigDecimal price,
            @RequestParam("quantity") @NotNull(message = "Quantity is required") @Min(value = 0, message = "Quantity must be positive") Integer quantity,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {

        ProductRequest request = ProductRequest.builder()
                .name(name.trim())
                .description(description != null ? description.trim() : "")
                .price(price)
                .quantity(quantity)
                .build();

        ProductResponse response = productService.updateProduct(id, request);

        if (images != null && images.length > 0) {
            for (MultipartFile image : images) {
                if (image != null && !image.isEmpty()) {
                    try {
                        imageService.uploadImage(response.getId(), image);
                    } catch (Exception e) {
                        log.error("Failed to upload image for product {}: {}", response.getId(), e.getMessage());
                    }
                }
            }
            response = productService.getProductById(response.getId());
        }

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}