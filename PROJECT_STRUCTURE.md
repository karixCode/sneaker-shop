# 📁 Структура проекта

```
sneakers-shop/
│
├── 📄 README.md                    # Документация проекта
├── 📄 START.md                     # Быстрый старт
├── 📄 FEATURES.md                  # Список реализованных функций
├── 📄 package.json                 # Зависимости основного приложения
├── 📄 vite.config.js               # Конфигурация Vite
├── 📄 start.bat                    # Скрипт запуска для Windows
│
├── 📂 api/                         # Backend (JSON Server)
│   ├── 📄 db.json                  # База данных (15 товаров, отзывы, заказы)
│   └── 📄 package.json             # Зависимости API
│
├── 📂 public/                      # Статические файлы
│   └── 📄 vite.svg
│
└── 📂 src/                         # Исходный код приложения
    │
    ├── 📄 main.js                  # Точка входа приложения
    ├── 📄 App.vue                  # Главный компонент
    ├── 📄 style.css                # Глобальные стили
    │
    ├── 📂 api/                     # API сервисы
    │   └── 📄 index.js             # Axios + эндпоинты (sneakers, reviews, cart, orders)
    │
    ├── 📂 router/                  # Vue Router
    │   └── 📄 index.js             # Маршруты (/, /product/:id, /cart, /checkout, /orders)
    │
    ├── 📂 stores/                  # Pinia Store (управление состоянием)
    │   ├── 📄 sneakers.js          # Каталог, фильтрация, поиск, пагинация
    │   ├── 📄 cart.js              # Корзина покупок
    │   ├── 📄 reviews.js           # Отзывы и рейтинги
    │   ├── 📄 orders.js            # История заказов
    │   └── 📄 viewHistory.js       # История просмотров (localStorage)
    │
    ├── 📂 components/              # Переиспользуемые компоненты
    │   ├── 📄 Header.vue           # Шапка сайта (навигация, корзина)
    │   ├── 📄 Filters.vue          # Панель фильтров (поиск, бренд, цена, размер)
    │   └── 📄 SneakerCard.vue      # Карточка товара (сетка/список)
    │
    ├── 📂 views/                   # Страницы приложения
    │   ├── 📄 Catalog.vue          # 🏠 Каталог товаров с фильтрами
    │   ├── 📄 ProductDetail.vue    # 👟 Детальная страница товара
    │   ├── 📄 Cart.vue             # 🛒 Корзина покупок
    │   ├── 📄 Checkout.vue         # 💳 Оформление заказа
    │   └── 📄 Orders.vue           # 📦 История заказов
    │
    └── 📂 assets/                  # Медиа-файлы
        └── 📄 vue.svg
```

## 📊 Статистика

### Компоненты
- **3** переиспользуемых компонента
- **5** страниц (views)
- **1** layout компонент (App.vue)

### Stores (Pinia)
- **5** stores для управления состоянием
- **Реактивность** на основе Composition API

### API
- **10** эндпоинтов
- **REST** архитектура
- **JSON Server** в качестве backend

### База данных
- **15** товаров (кроссовки)
- **10** отзывов
- **3** примера заказов
- **Реальные изображения** из Unsplash

### Стили
- **~2000** строк CSS
- **Scoped стили** для каждого компонента
- **CSS переменные** для цветов
- **Flexbox** и **Grid** для раскладки

## 🎯 Ключевые файлы

### Точки входа
- `src/main.js` - инициализация Vue, Pinia, Router
- `src/App.vue` - главный компонент с Header и router-view

### Конфигурация
- `vite.config.js` - настройки сборки
- `package.json` - зависимости и скрипты

### API
- `src/api/index.js` - все HTTP запросы через Axios
- `api/db.json` - база данных JSON Server

### Роутинг
- `src/router/index.js` - 5 маршрутов с навигацией

### Управление состоянием
- `src/stores/` - 5 Pinia stores для разных модулей

## 🔄 Поток данных

```
User Action (View)
    ↓
Component emits event / calls store action
    ↓
Store (Pinia) updates state
    ↓
API call via Axios (if needed)
    ↓
JSON Server (api/db.json)
    ↓
Response updates store
    ↓
Computed properties update
    ↓
View re-renders
```

## 🎨 Стили

### Компоненты со стилями
- `style.css` - глобальные стили (reset, утилиты, переменные)
- Каждый `.vue` файл имеет `<style scoped>` секцию

### CSS архитектура
- **Mobile-first** подход
- **BEM-подобная** методология именования классов
- **CSS Grid** и **Flexbox** для раскладки
- **CSS переменные** для консистентности
- **Media queries** для адаптивности

## 🚀 Технологии

| Технология | Версия | Назначение |
|------------|--------|------------|
| Vue 3 | 3.5.24 | Frontend фреймворк |
| Pinia | 3.0.4 | State management |
| Vue Router | 4.x | Маршрутизация |
| Axios | 1.13.2 | HTTP клиент |
| Vite | 7.2.4 | Сборщик и dev server |
| JSON Server | 1.0.0 | Fake REST API |

## 📦 Размер bundle (приблизительно)

- **Vendor** (Vue, Pinia, Router, Axios): ~150KB (gzip)
- **App code**: ~80KB (gzip)
- **CSS**: ~20KB (gzip)
- **Total**: ~250KB (gzip)

## 🔥 Hot Module Replacement (HMR)

Vite обеспечивает мгновенную перезагрузку:
- ⚡ Изменения `.vue` файлов
- ⚡ Изменения `.js` файлов
- ⚡ Изменения `.css` файлов
- 🔄 Сохранение состояния при обновлении

