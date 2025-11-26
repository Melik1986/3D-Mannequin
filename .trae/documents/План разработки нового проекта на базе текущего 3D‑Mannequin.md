ROLE: Отвечаю как эксперт в проектировании фронтенд/бэкенд архитектуры для Next.js/NestJS/PixiJS
TL;DR: Новый проект переносим на NestJS+Bun и Next.js (SSR) с PixiJS‑вьюером 2.5D, GSAP‑инерцией, CDN‑ассетами и JSON‑манифестом. Этапы: аудит → архитектура → миграция клиента на Next → реализация API/манифеста → вьюер 2.5D → тесты/CI → документация.

ANSWER:

## 1) Анализ существующего проекта

- Ключевые компоненты и функционал
  - `Backend (NestJS + Bun)`: точка входа `server/src/main.ts` (d:\3D-Mannequin\server\src\main.ts:1–12), модуль приложения `AppModule` (зарегистрирован, исходник не показан), `ManifestController` с ключевым API `GET /api/v1/models/:id/manifest` (d:\3D-Mannequin\server\src\manifest\manifest.controller.ts:1–29).
  - `Frontend (Client/Vite/React)`: пакетный конфиг клиента (d:\3D-Mannequin\client\package.json:1–32), сборка через Vite; в README описан старый функционал с Three.js, Tailwind, OpenAI (d:\3D-Mannequin\README.md:95–148).
  - `Инфраструктура`: деплой-гайд (d:\3D-Mannequin\DEPLOYMENT.md:1–118), версел-конфиг (`vercel.json`) указывает на старую структуру (d:\3D-Mannequin\vercel.json:1–17).
- Сильные стороны
  - Уже создан API‑манифест под ТЗ; перенос на Bun выполнен; линт и тип‑чек настроены и проверены.
  - Разделение клиент/сервер; понятный деплой; минимальная зависимость сервера от AI/внешних сервисов.
- Слабые стороны
  - Клиент на Vite, а ТЗ требует Next.js (SSR/SSG/ISR).
  - Нет 2.5D PixiJS‑вьюера и GSAP‑инерции; отсутствует ротация кадра по мыши.
  - Недостаточная строгая типизация и правила для клиента; мало тестов; нет e2e.
  - `vercel.json` ссылается на старый путь; возможны проблемы с маршрутизацией и `distDir`.
  - Отсутствует формальная схема API (OpenAPI/Swagger) и централизованный CORS/секьюрити.
- Устаревшие/подлежащие обновлению технологии
  - Vite‑клиент → миграция на Next.js 14+.
  - Three.js‑основанный подход для одежды → переход на PixiJS спрайт‑листы по ТЗ.
  - README с акцентом на OpenAI и Express → привести к NestJS/Next/PixiJS.

## 2) Планирование нового проекта

- Цели и задачи
  - Реализовать фотореалистичный 2.5D‑вьюер костюмов с вращением 360° и инерцией.
  - Обеспечить SSR/SSG/ISR для страниц продукта, быстрый TTI и SEO.
  - Обеспечить стабильный API‑манифест, независимый от AI в рантайме, с URL CDN/S3.
  - Поддержать смену цвета/модели, масштаб (размеры), кэширование ассетов.
- Архитектура
  - Backend (NestJS+Bun):
    - Модули: `ProductCatalogModule`, `ManifestModule`, `StorageModule` (как в ТЗ).
    - `GET /api/v1/models/:id/manifest` — единый источник правды для фронтенда.
    - CORS, конфиг через `bunfig.toml`/env; OpenAPI/Swagger для схем.
  - Frontend (Next.js+TypeScript):
    - Страницы продукта (SSR/SSG/ISR); клиентский компонент `MannequinViewer` (PixiJS) для Canvas/GPU.
    - Слои по FSD: `entities/`, `features/`, `pages/`, `shared/`; barrel‑экспорты, path‑алиасы.
    - Вьюер: загрузка спрайт‑листа по URL из манифеста, мэппинг `mousemove→frameIndex`, GSAP инерция.
  - Ассеты: оффлайн пайплайн (съемка → интерполяция AI → сборка sprite sheet → CDN/S3).
- Стек технологий
  - Backend: `NestJS`, `TypeScript`, `Bun`, `Swagger`, `Helmet`, `CORS`, `Joi/Zod` для валидаций.
  - Frontend: `Next.js 14+`, `TypeScript (strict)`, `PixiJS`, `GSAP (Draggable/InertiaPlugin)`, `Tailwind CSS` или минимальный SCSS по BEM.
  - Тесты: `bun test`/`jest`, `playwright` для e2e, `eslint` + `@typescript-eslint`.
- Новые функции/улучшения
  - 2.5D‑вьюер с инерцией, плавной прокруткой кадров.
  - SKU/цвет/размер — моментальная смена текстуры без перезагрузки страницы.
  - Кэширование ассетов, прелоад спрайтов, graceful fallback.
  - Профилирование и оптимизация: lazy loading, priority assets, CDN cache control.
  - Строгая типизация, контракт‑тесты манифеста.

## 3) Этапы разработки

- Этап A: Аудит и подготовка
  - Проверка текущих конфигов (`vercel.json`, `DEPLOYMENT.md`), согласование пути развёртывания клиента.
  - Включение CORS/Helmet на сервере; генерация Swagger.
  - Базовый CI: линт, тип‑чек, unit.
- Этап B: Архитектура и каркас
  - Настроить Next.js проект (SSR/SSG/ISR), FSD структура, алиасы.
  - Общий layout, роут страницы продукта, загрузка манифеста.
- Этап C: Вьюер 2.5D
  - Интеграция PixiJS, рендер спрайт‑листа, индексация кадров.
  - GSAP инерция: Draggable + InertiaPlugin; настройки чувствительности.
- Этап D: SKU/цвет/размер
  - Компоненты выбора; мгновенная смена `spriteSheetUrl` из манифеста; масштабирование для размеров.
- Этап E: Тестирование/качество
  - Unit: парс манифеста, маппинг кадров, утилиты.
  - e2e: Playwright — загрузка манифеста, смена цветов, плавность вращения.
  - Перф: Lighthouse/Next Analyze, бандл‑сайз, TTFB/TTI.
- Этап F: Интеграция и релиз
  - Обновление деплой‑конфигов (Vercel для клиента, Railway/Render для сервера).
  - Smoke‑тесты, мониторинг, логирование.

## Приоритеты реализации

- P0: API‑манифест, SSR/SSG продукта, базовый вьюер PixiJS с кадрами.
- P1: GSAP инерция, выбор SKU/цвет/размер, кэширование ассетов.
- P2: Оптимизации, аналитика, прогрессивные улучшения.

## Тестирование и контроль качества

- Линт/тип‑чек в CI: `bun x eslint`, `bun x tsc --noEmit`.
- Unit: `bun test`/`jest` для утилит и моделей.
- e2e: `playwright` сценарии по ключевым пользовательским путям.
- Контракт‑тесты манифеста (валидация JSON, обязательные поля).
- Sec/Perf: CORS, Helmet, rate limiting; CDN cache; Lighthouse/Next.js metrics.

## Интеграция с существующими компонентами

- Сохранить эндпоинт `GET /api/v1/models/:id/manifest` (d:\3D-Mannequin\server\src\manifest\manifest.controller.ts:1–29).
- Миграция клиента: перенести конфигурации из Vite в Next, заменить рендер 3D на PixiJS спрайты.
- Обновить `vercel.json` на новую корневую директорию клиента и корректный `distDir`.

## Документирование

- Архитектурные решения (ADR): модули NestJS, FSD слои, вьюер PixiJS.
- API документация: Swagger/OpenAPI, примеры манифеста, схемы валидации.
- Руководства:
  - Пользовательское: работа с вьюером (вращение, цвет, размер).
  - Разработчика: настройка окружения, сборка ассетов, схемы импорта PixiJS/GSAP.
- Поддержка и обновления: процесс изменения манифеста, версии ассетов, релиз‑нотсы.

SOURCES:

- [1] Bun — Installation: https://bun.sh/docs/installation
- [2] NestJS — Official Docs: https://docs.nestjs.com
- [3] Next.js — Routing & Rendering: https://nextjs.org/docs
- [4] PixiJS — Guides: https://pixijs.com/tutorials
- [5] GSAP Draggable/InertiaPlugin: https://gsap.com/docs/v3/Plugins/Draggable/
- [6] d:\3D-Mannequin\server\src\main.ts — точка входа
- [7] d:\3D-Mannequin\server\src\manifest\manifest.controller.ts — манифест API
- [8] d:\3D-Mannequin\client\package.json — конфиг клиента
- [9] d:\3D-Mannequin\DEPLOYMENT.md — деплой‑гайд
- [10] d:\3D-Mannequin\vercel.json — текущая конфигурация развертывания

VERIFICATION STATUS: Partially Verified
