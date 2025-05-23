package com.example.inventory.service.impl;

import com.example.inventory.dto.ImageResponse;
import com.example.inventory.exception.ResourceNotFoundException;
import com.example.inventory.mapper.ImageMapper;
import com.example.inventory.model.Product;
import com.example.inventory.model.ProductImage;
import com.example.inventory.repository.ProductImageRepository;
import com.example.inventory.repository.ProductRepository;
import com.example.inventory.service.ProductImageService;
import com.example.inventory.utils.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProductImageServiceImpl implements ProductImageService {
    private final ProductRepository productRepository;
    private final ProductImageRepository imageRepository;
    private final FileStorageService fileStorage;
    private final ImageMapper imageMapper;

    @Override
    public ImageResponse uploadImage(Long productId, MultipartFile file) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));
        String filename = fileStorage.store(file);
        String url = "/api/v1/products/" + productId + "/images/" + filename;
        ProductImage img = ProductImage.builder()
                .product(product)
                .filename(filename)
                .url(url)
                .uploadedAt(LocalDateTime.now())
                .build();
        return imageMapper.toResponse(imageRepository.save(img));
    }

    @Override
    public List<ImageResponse> listImages(Long productId) {
        return imageRepository.findAllByProductId(productId)
                .stream().map(imageMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public Resource loadImage(String filename) {
        return fileStorage.load(filename);
    }

    @Override
    public void deleteImage(Long imageId) {
        ProductImage img = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found: " + imageId));
        fileStorage.delete(img.getFilename());
        imageRepository.delete(img);
    }
}