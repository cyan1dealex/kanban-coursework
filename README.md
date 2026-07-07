# Interactive Kanban Board

Веб-приложение для управления задачами на React по методологии Feature-Sliced Design.

🚀 **[Live Demo]({https://kanban-coursework.vercel.app/})**

---

## 🛠️ Стек технологий

- **Сборщик:** Vite
- **Фреймворк:** React
- **Стейт-менеджер:** Context API (с запланированным переходом на Redux Toolkit)
- **Язык:** JavaScript (в процессе миграции на TypeScript)
- **Архитектура:** Feature-Sliced Design (FSD)
- **Роутинг:** React Router v6
- **Зависимости:** `@dnd-kit/core` (Drag-and-Drop), `@tiptap/react` (WYSIWYG-редактор)

---

## 📐 Архитектура и технические решения

- **Feature-Sliced Design:** Кодовая база разделена на изолированные слои (`app`, `pages`, `widgets`, `features`, `entities`, `shared`). Сущности (карточка задачи, колонка) отделены от фич (перенос, создание, удаление), что обеспечивает масштабируемость проекта.
- **Состояние:** На текущем этапе стейт реализован через Context API для быстрой интеграции с `dnd-kit`.

### Ближайший Roadmap:

1. **TypeScript:** Полный перевод компонентов и слоев на строгую типизацию.
2. **Redux Toolkit:** Миграция с Context API на RTK для минимизации избыточных ререндеров при Drag-and-Drop операциях.
3. **Backend:** Подключение Node.js / Express + PostgreSQL для авторизации (JWT) и синхронизации через WebSockets.

---

## 🏁 Локальный запуск

```bash
# Клонировать репозиторий
git clone [https://github.com/cyan1dealex/kanban-coursework.git](https://github.com/cyan1dealex/kanban-coursework.git)

# Перейти в папку проекта
cd kanban-coursework

# Установить зависимости
npm install

# Запустить локальный сервер
npm run dev
```
