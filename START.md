# Быстрый старт

## Windows

Запустите файл `start.bat` - он автоматически откроет два терминала:
1. JSON Server (API) на порту 3000
2. Vue Dev Server на порту 5173

## Ручной запуск

### Терминал 1 - API:
```bash
cd api
npm start
```

### Терминал 2 - Frontend:
```bash
npm run dev
```

## После запуска

- **API**: http://localhost:3000
- **Приложение**: http://localhost:5173

## Первый запуск

Если это первый запуск, установите зависимости:

```bash
# Основные зависимости
npm install

# Зависимости API
cd api
npm install
```

