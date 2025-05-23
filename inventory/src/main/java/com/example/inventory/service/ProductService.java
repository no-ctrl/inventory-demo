package com.example.inventory.service;

import com.example.inventory.dto.ProductRequest;
import com.example.inventory.dto.ProductResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@Validated
public interface ProductService {
    ProductResponse createProduct(@Valid ProductRequest request);

    ProductResponse updateProduct(Long id, @Valid ProductRequest request);

    @Transactional
    void deleteProduct(Long id);

    ProductResponse getProductById(Long id);

    Page<ProductResponse> getAllProducts(Pageable pageable, String nameFilter);
}