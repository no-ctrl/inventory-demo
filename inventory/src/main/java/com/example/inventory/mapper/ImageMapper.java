package com.example.inventory.mapper;

import com.example.inventory.dto.ImageResponse;
import com.example.inventory.model.ProductImage;
import org.springframework.stereotype.Component;

@Component
public class ImageMapper {
    public ImageResponse toResponse(ProductImage img) {
        if (img == null) {
            return null;
        }

        return new ImageResponse(
                img.getId(),
                img.getFilename(),
                img.getUrl(),
                img.getUploadedAt()
        );
    }
}