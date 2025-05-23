package com.example.inventory.mapper;

import com.example.inventory.dto.ProductRequest;
import com.example.inventory.dto.ProductResponse;
import com.example.inventory.model.Product;
import com.example.inventory.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductMapper {
    private final ProductImageRepository imageRepository;
    private final ImageMapper imageMapper;

    public ProductResponse toResponse(Product product) {
        if (product == null) {
            return null;
        }

        List<com.example.inventory.dto.ImageResponse> images = imageRepository.findAllByProductId(product.getId())
                .stream()
                .map(imageMapper::toResponse)
                .toList();

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getQuantity(),
                images.isEmpty() ? null : images
        );
    }

    public Product toEntity(ProductRequest request) {
        if (request == null) {
            return null;
        }

        return Product.builder()
                .name(request.getName() != null ? request.getName().trim() : null)
                .description(request.getDescription() != null ? request.getDescription().trim() : "")
                .price(request.getPrice())
                .quantity(request.getQuantity())
                .build();
    }
}