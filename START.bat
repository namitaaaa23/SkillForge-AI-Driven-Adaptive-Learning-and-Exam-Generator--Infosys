@echo off
echo Starting SkillForge Application...
echo.

echo Starting Backend...
start "Backend" cmd /k "cd backend && set JAVA_HOME=C:\Program Files\Java\jdk-17 && .\mvnw.cmd spring-boot:run"

timeout /t 10

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo SkillForge is starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
pause