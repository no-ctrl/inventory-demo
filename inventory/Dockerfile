# Multi-stage build за оптимизација
FROM eclipse-temurin:17-jdk-jammy AS build

WORKDIR /app

# Копирај dependency фајлови прво за кеширање
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Направи gradlew извршлив
RUN chmod +x ./gradlew

# Download dependencies (ќе се кешира ако нема промени во dependencies)
RUN ./gradlew dependencies --no-daemon --stacktrace

# Копирај source код
COPY src ./src

# Build апликацијата
RUN ./gradlew bootJar -x test --no-daemon --stacktrace

# Production stage
FROM eclipse-temurin:17-jre-jammy

# Креирај non-root корисник за безбедност
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# Инсталирај curl за health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Копирај JAR од build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Креирај потребни директориуми
RUN mkdir -p uploads logs && chown -R appuser:appuser /app

# Премини на non-root корисник
USER appuser

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM настройки за production
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:+UseContainerSupport"

# Стартување на апликацијата
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]