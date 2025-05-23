# Inventory Management System

A full-stack inventory management application built with Spring Boot and Angular, featuring user authentication, role-based access control, and product management with image support.

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (User and Admin roles)
- Protected routes and API endpoints
- Session management

### Product Management
- Create, read, update, and delete products
- Product image management (up to 5 images per product)
- Product search and filtering
- Pagination support
- Responsive image gallery
- Real-time form validation

### User Interface
- Modern Material Design
- Responsive layout
- Toast notifications
- Loading indicators
- Error handling
- Image preview and management
- User-friendly forms with validation

## Technology Stack

### Backend (Spring Boot)
- Java 17
- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Flyway for database migrations
- Lombok
- OpenAPI/Swagger documentation

### Frontend (Angular)
- Angular 16+
- Angular Material
- RxJS
- NgRx
- TypeScript
- SCSS
- JWT Authentication

## Prerequisites

- Java 17 or higher
- Node.js 18 or higher
- npm 9 or higher
- PostgreSQL 12 or higher
- Maven 3.8 or higher

## Setup Instructions

### Database Setup
1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE inventory_db;
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd inventory
```

2. Configure database connection in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/inventory_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. Build and run the application:
```bash
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd inventory-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The frontend will be available at `http://localhost:4200`

## API Documentation

The API documentation is available through Swagger UI at:
`http://localhost:8080/swagger-ui.html`

## Default Credentials

The system creates a default admin user on startup:
- Username: admin
- Password: admin123

## Available Endpoints

### Authentication
- POST `/api/v1/auth/register` - Register new user
- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/assign-role` - Assign role to user (Admin only)

### Products
- GET `/api/v1/products` - List all products (paginated)
- GET `/api/v1/products/{id}` - Get product details
- POST `/api/v1/products` - Create new product (Admin only)
- PUT `/api/v1/products/{id}` - Update product (Admin only)
- DELETE `/api/v1/products/{id}` - Delete product (Admin only)

### Product Images
- POST `/api/v1/products/{id}/images` - Upload product image (Admin only)
- GET `/api/v1/products/{id}/images` - Get product images
- DELETE `/api/v1/products/{id}/images/{imageId}` - Delete product image (Admin only)

## Frontend Routes

- `/login` - Login page
- `/register` - Registration page
- `/products` - Product list (requires authentication)
- `/products/new` - Create product (requires admin role)
- `/products/:id` - Product details (requires authentication)
- `/products/edit/:id` - Edit product (requires admin role)

## Security Features

- JWT token authentication
- Password encryption using BCrypt
- Role-based access control
- CORS configuration
- Protected API endpoints
- Secure file upload handling

## File Storage

Product images are stored in the configured upload directory:
- Development: `uploads/` directory in the project root
- Production: Configurable through `FILE_STORAGE_LOCATION` environment variable

## Environment Configuration

### Backend
Environment variables that can be configured:
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRATION` - Token expiration time in milliseconds
- `FILE_STORAGE_LOCATION` - Location for storing uploaded files

### Frontend
Environment configuration in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

## Error Handling

The application includes comprehensive error handling:
- Frontend toast notifications for user feedback
- HTTP interceptors for handling API errors
- Global exception handling in the backend
- Validation error messages
- Authentication/Authorization error handling

## Development

### Backend Development
- Uses Spring Boot DevTools for hot reloading
- Flyway for database migrations
- Lombok for reducing boilerplate code
- OpenAPI for API documentation

### Frontend Development
- Angular CLI for development workflow
- Angular Material components
- Reactive forms with validation
- HTTP interceptors for authentication and error handling
- Modular architecture with lazy loading

## Building for Production

### Backend
```bash
./mvnw clean package
```

### Frontend
```bash
ng build --configuration production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License. 