package com.example.inventory.controller;

import com.example.inventory.dto.ImageResponse;
import com.example.inventory.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLConnection;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/products/{productId}/images")
public class ProductImageController {
    private final ProductImageService imageService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageResponse> upload(
            @PathVariable Long productId,
            @RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(imageService.uploadImage(productId, file));
    }

    @GetMapping
    public ResponseEntity<List<ImageResponse>> list(@PathVariable Long productId) {
        return ResponseEntity.ok(imageService.listImages(productId));
    }

    @GetMapping("/{filename:.+}")
    public ResponseEntity<Resource> serve(@PathVariable String filename) {
        Resource resource = imageService.loadImage(filename);

        String contentType = null;
        try {
            contentType = URLConnection.guessContentTypeFromName(filename);
        } catch (Exception e) {
            // Ignore
        }

        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(resource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{imageId}")
    public ResponseEntity<Void> delete(@PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.noContent().build();
    }
}