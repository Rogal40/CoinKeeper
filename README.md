# CoinKeeper – Финансовый трекер 💸

## 🔧 ЭТАП 1: Инициализация и базовая структура
✅ **Шаг 1.1 – Создание проекта**  
Инициализируем проект с помощью Vite + React.

✅ **Шаг 1.2 – Установка зависимостей**  
- `react-router-dom`  
- `@reduxjs/toolkit` и `react-redux`  
- `axios`  

✅ **Шаг 1.3 – Настройка базовой структуры проекта**  
- Создаём папки: `pages/`, `components/`, `features/`, `store/`, `services/`, `styles/`  
- Настраиваем `RouterProvider` с маршрутами  
- Создаём `Redux store`  

## 👤 ЭТАП 2: Аутентификация
✅ **Шаг 2.1 – Страницы /login и /register**  
Создаём формы входа и регистрации

✅ **Шаг 2.2 – Auth Slice**  
Создаём `authSlice` для хранения токена и состояния пользователя

✅ **Шаг 2.3 – Авторизация**  
Реализуем вход/регистрацию через API  
Сохраняем токен в `localStorage`

✅ **Шаг 2.4 – Приватные маршруты**  
Доступ к `/dashboard`, `/stats`, `/settings` только с токеном

## 💰 ЭТАП 3: Работа с транзакциями
✅ **Шаг 3.1 – Создание transactionSlice**  
Хранение списка транзакций в Redux

✅ **Шаг 3.2 – Компонент добавления транзакции**  
Форма с полями: тип, сумма, категория, дата, комментарий

✅ **Шаг 3.3 – Компонент списка транзакций**  
Вывод последних операций

✅ **Шаг 3.4 – Удаление и редактирование транзакции**

## 📁 ЭТАП 4: Управление категориями
✅ **Шаг 4.1 – categorySlice**  
Список пользовательских категорий в Redux

✅ **Шаг 4.2 – Страница /settings**  
Отображение, добавление, удаление категорий

## 📊 ЭТАП 5: Статистика
✅ **Шаг 5.1 – statsSlice (опционально)**  
Получение статистики через API

✅ **Шаг 5.2 – Графики (PieChart и BarChart)**  
Установка и использование `recharts` или `chart.js`  
Группировка по категориям и дате

## 🧪 ЭТАП 6: Финальные детали
✅ **Шаг 6.1 – Обработка ошибок и валидация форм**  
✅ **Шаг 6.2 – UI/UX доработка (иконки, лоадеры)**  
✅ **Шаг 6.3 – Адаптивность и тестирование**

---

## 🚀 MVP ГОТОВ, если:
- ✅ Пользователь может войти и зарегистрироваться  
- ✅ Видит баланс и список транзакций  
- ✅ Может добавлять, редактировать, удалять транзакции  
- ✅ Управляет категориями  
- ✅ Видит статистику по категориям за период

coinkeeper/
├── public/
│   └── index.html
├── src/
│   ├── assets/                 # иконки, изображения
│   ├── components/             # переиспользуемые компоненты
│   │   ├── TransactionForm.jsx
│   │   ├── TransactionList.jsx
│   │   └── CategoryItem.jsx
│   ├── pages/                  # страницы приложения
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Stats.jsx
│   │   └── Settings.jsx
│   ├── features/               # Redux slices
│   │   ├── authSlice.js
│   │   ├── transactionSlice.js
│   │   ├── categorySlice.js
│   │   └── statsSlice.js
│   ├── services/               # API-запросы
│   │   ├── api.js
│   │   └── transactionService.js
│   ├── store/                  # Redux store
│   │   └── index.js
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx              # маршруты
├── tailwind.config.js
├── vite.config.js
├── package.json
└── README.md





















# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
