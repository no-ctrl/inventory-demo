package com.example.inventory.config;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(info = @Info(title = "Inventory API", version = "1.0", description = "Документација на Inventory API"))
@Configuration
public class OpenApiConfig {
}
