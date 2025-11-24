# ⚡ Быстрые команды

## 🚀 Запуск (Windows)

### Вариант 1: Автоматический (рекомендуется)
```bash
start.bat
```
Откроет два терминала автоматически.

### Вариант 2: Ручной запуск

**Терминал 1 - API:**
```bash
cd api
npm start
```

**Терминал 2 - Frontend:**
```bash
npm run dev
```

## 📦 Первый запуск

```bash
# Установка зависимостей (только один раз)
npm install

# Установка зависимостей API
cd api
npm install
cd ..

# Затем запустить start.bat или вручную
```

## 🌐 URL адреса

После запуска:
- **Приложение**: http://localhost:5173
- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000

## 🔥 Полезные команды

```bash
# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview

# Проверка db.json
curl http://localhost:3000/sneakers

# Проверка отзывов
curl http://localhost:3000/reviews

# Проверка корзины
curl http://localhost:3000/cartItems

# Проверка заказов
curl http://localhost:3000/orders
```

## 📊 API Endpoints

```bash
# Получить все товары
GET http://localhost:3000/sneakers

# Получить товар по ID
GET http://localhost:3000/sneakers/1

# Получить отзывы товара
GET http://localhost:3000/reviews?sneakerId=1

# Добавить отзыв
POST http://localhost:3000/reviews
Content-Type: application/json
{
  "sneakerId": 1,
  "userName": "Иван",
  "rating": 5,
  "comment": "Отлично!",
  "createdAt": "2024-11-24T12:00:00Z"
}

# Получить корзину
GET http://localhost:3000/cartItems

# Добавить в корзину
POST http://localhost:3000/cartItems
Content-Type: application/json
{
  "sneakerId": 1,
  "size": 42,
  "quantity": 1
}

# Обновить товар в корзине
PATCH http://localhost:3000/cartItems/1
Content-Type: application/json
{
  "quantity": 2
}

# Удалить из корзины
DELETE http://localhost:3000/cartItems/1

# Получить заказы
GET http://localhost:3000/orders

# Создать заказ
POST http://localhost:3000/orders
Content-Type: application/json
{
  "items": [...],
  "totalAmount": 12990,
  "status": "pending",
  "customer": {...},
  "createdAt": "2024-11-24T12:00:00Z"
}
```

## 🛠️ Разработка

```bash
# Формат кода (если используется Prettier)
npm run format

# Линтинг (если используется ESLint)
npm run lint

# Очистить node_modules и переустановить
rm -rf node_modules package-lock.json
npm install
```

## 🐛 Решение проблем

### Порт 3000 занят
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Или изменить порт в api/package.json
"start": "json-server db.json --port 3001"
```

### Порт 5173 занят
```bash
# Vite автоматически выберет другой порт
# Или указать вручную в vite.config.js
server: {
  port: 5174
}
```

### Ошибка CORS
```bash
# JSON Server по умолчанию разрешает CORS
# Если проблема, добавить в api/package.json:
"start": "json-server db.json --port 3000 --middlewares ./middleware.js"
```

### Не загружаются изображения
- Проверьте интернет-соединение (используются изображения с Unsplash)
- Изображения загружаются по HTTPS

## 📱 Тест на мобильных

```bash
# Найти локальный IP
# Windows
ipconfig

# Затем открыть на мобильном
http://<YOUR_IP>:5173
```

## 🎯 Быстрая проверка функционала

1. **Каталог**: http://localhost:5173/
2. **Товар**: http://localhost:5173/product/1
3. **Корзина**: http://localhost:5173/cart
4. **Оформление**: http://localhost:5173/checkout
5. **Заказы**: http://localhost:5173/orders

## 📚 Документация

- `README.md` - Полная документация
- `FEATURES.md` - Список функций
- `CHECKLIST.md` - Чек-лист
- `PROJECT_STRUCTURE.md` - Структура проекта
- `START.md` - Инструкции запуска

## 🎉 Готово к работе!

Теперь можно открыть браузер и перейти на http://localhost:5173

