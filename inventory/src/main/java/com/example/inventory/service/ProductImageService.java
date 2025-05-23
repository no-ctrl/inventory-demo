package com.example.inventory.service;

import com.example.inventory.dto.ImageResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductImageService {
    ImageResponse uploadImage(Long productId, MultipartFile file);

    List<ImageResponse> listImages(Long productId);

    Resource loadImage(String filename);

    void deleteImage(Long imageId);
}