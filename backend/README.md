# SkillForge Backend

Professional Spring Boot backend with JWT authentication.

## Features
- JWT Authentication & Authorization
- Input Validation
- Global Exception Handling
- Consistent API Response Format
- CORS Configuration
- Professional Error Messages

## Quick Start

1. **Run Application:**
   ```bash
   mvn spring-boot:run
   ```

2. **Access H2 Console:** http://localhost:8080/h2-console
   - URL: `jdbc:h2:mem:skillforge`
   - Username: `sa`
   - Password: (empty)

3. **API Documentation:** See `API_DOCUMENTATION.md`

## Architecture
```
├── controller/     # REST endpoints
├── service/        # Business logic
├── repository/     # Data access
├── model/          # Entity classes
├── dto/            # Data transfer objects
├── security/       # JWT & Security config
├── exception/      # Error handling
└── config/         # Application config
```

## Professional Standards
- ✅ Input validation
- ✅ Error handling
- ✅ Security headers
- ✅ Consistent responses
- ✅ Clean architecture
- ✅ Documentation