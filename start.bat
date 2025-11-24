@echo off
echo ========================================
echo   Sneaker Shop - Запуск приложения
echo ========================================
echo.

echo [1/2] Запуск JSON Server API...
cd api
start "JSON Server" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo [2/2] Запуск Vue приложения...
cd ..
start "Vue Dev Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Готово!
echo ========================================
echo.
echo API запущен на:       http://localhost:3000
echo Приложение доступно:  http://localhost:5173
echo.
echo Нажмите любую клавишу для закрытия этого окна...
pause >nul

