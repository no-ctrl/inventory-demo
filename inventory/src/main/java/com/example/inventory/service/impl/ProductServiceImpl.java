package com.example.inventory.service.impl;

import com.example.inventory.dto.ProductRequest;
import com.example.inventory.dto.ProductResponse;
import com.example.inventory.exception.ResourceNotFoundException;
import com.example.inventory.mapper.ProductMapper;
import com.example.inventory.model.Product;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

@RequiredArgsConstructor
@Service
@Validated
@Transactional
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ProductResponse createProduct(@Valid ProductRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Product request cannot be null");
        }

        Product product = productMapper.toEntity(request);
        if (product.getName() == null || product.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }

        product = productRepository.save(product);
        return productMapper.toResponse(product);
    }

    @Override
    public ProductResponse updateProduct(Long id, @Valid ProductRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Product request cannot be null");
        }

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Product name is required");
        }

        existing.setName(request.getName().trim());
        existing.setDescription(request.getDescription() != null ? request.getDescription().trim() : "");
        existing.setPrice(request.getPrice());
        existing.setQuantity(request.getQuantity());

        existing = productRepository.save(existing);
        return productMapper.toResponse(existing);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));

        // The images will be automatically deleted due to CascadeType.ALL and orphanRemoval = true
        productRepository.delete(product);
    }

    @Override
    public ProductResponse getProductById(Long id) {
        return productMapper.toResponse(
                productRepository.findById(id)
                        .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id))
        );
    }

    @Override
    public Page<ProductResponse> getAllProducts(Pageable pageable, String nameFilter) {
        return (nameFilter == null || nameFilter.isBlank()) ?
                productRepository.findAll(pageable).map(productMapper::toResponse) :
                productRepository.findByNameContainingIgnoreCase(nameFilter, pageable)
                        .map(productMapper::toResponse);
    }
}