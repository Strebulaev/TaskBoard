# TaskBoard
Доска с задачами

## Что используется и зачем
**Бэкенд**:
- **Node.js + Express** - роутинг
- **Prisma** - миграции, типизированный доступ к db
- **MySQL** - хранение пользователей, проектов, задач
- **Redis** - кэш и сессии
- **bcryptjs** - хеши паролей

**Фронтенд**:
- **React**
- **Vite**
- **TypeScript**
- **React Router** - защищенные/публичные роуты
- **Zustand** - сторы (пользователь, тема, проекты, задачи)
- **React-query** - запросы к API, кэш
- **MUI**
- **Chart.js + react-chartjs** - графики в дашборде
- **Sass** - стили

**Инфраструктура**:
- **Docker-compose** - MySQL, Redis

## Архитектура
```
server/src/
  app.ts          - express, middleware, роуты
  index.ts        - запуск сервера
  config/         - подключение к бд
  controllers/    - обработчики запросов
  services/       - бизнес-логика, проверка прав
  repositories/   - запросы к бд
  routes/         - роуты
  middlewares/    - auth, upload, валидация
  utils/          - bcrypt, jwt

client/src/
  api/            - apiClient и endpoints
  hooks/          - useUser и react-query хуки
  store/          - сторы
  pages/          - страницы (дашборд, проекты, задачи, профиль)
  components/     - переиспользуемые компоненты
  routes/         - защищённые, публичные роуты
  layouts/        - навигация
  theme/          - светлая/темная темы
```

## Запуск
```bash
git clone git@github.com:Strebulaev/TaskBoard.git
cd TaskBoard

docker-compose up -d

cd server
Создайте .env по шаблону .env.example

npm install
npx prisma generate
npm run dev

В новом терминале
cd client
npm install
npm run dev
```

## API
```
POST /api/auth/register - регистрация
POST /api/auth/login    - авторизация
POST /api/auth/logout   - логаут
POST /api/auth/refresh  - refresh токена
GET  /api/auth/me       - текущий пользователь

GET  /api/projects       - мои проекты
POST /api/projects       - создать проект
GET  /api/projects/:id   - проект по id
PUT  /api/projects/:id   - обновить
DELETE /api/projects/:id - удалить
GET  /api/projects/:id/members - участники
POST /api/projects/:id/members - добавить участника

GET  /api/tasks/my        - мои задачи
GET  /api/tasks/project/:projectId - задачи проекта
POST /api/tasks              - создать задачу
PUT  /api/tasks/:id          - обновить
DELETE /api/tasks/:id        - удалить
PUT  /api/tasks/:id/status   - сменить статус
PUT  /api/tasks/:id/assignee - назначить исполнителя
PUT  /api/tasks/:id/reviewer - назначить ревьюера

GET  /api/dashboard/stats    - статистика
GET  /api/dashboard/upcoming - предстоящие задачи

GET  /api/users/:id - профиль пользователя
PUT  /api/users/:id - обновить профиль
POST /api/users/:id/avatar - загрузить аватар
DELETE /api/users/:id/avatar - удалить аватар
```

## Роли в проекте
`owner` - Управление проектом, задачами, участником
`admin` - управление задачами и участниками
`member` - только свои задачи
