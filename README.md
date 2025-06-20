# 360Dialog WhatsApp Chat Interface

Современный интерфейс чата в стиле WhatsApp с интеграцией 360Dialog API для отправки реальных сообщений через WhatsApp Business API.

## 🚀 Возможности

- **Реальные WhatsApp сообщения** через 360Dialog API
- **Поддержка шаблонных сообщений** (Template Messages)
- **Настройка webhook** для получения входящих сообщений
- **Sandbox окружение** для тестирования
- **Адаптивный дизайн** для мобильных, планшетов и десктопов
- **Современный UI** с использованием shadcn/ui компонентов

## 🛠 Технологии

- **React 18** + **TypeScript**
- **Effector** для управления состоянием
- **Atomic Router** для маршрутизации
- **Tailwind CSS** для стилизации
- **shadcn/ui** для UI компонентов
- **360Dialog WhatsApp Business API**

## 📦 Установка

```bash
# Клонирование репозитория
git clone <repository-url>
cd 360dialog

# Установка зависимостей
yarn install

# Запуск в режиме разработки
yarn dev
```

## 🔧 Настройка 360Dialog API

### 1. Получение API ключа

1. Отправьте сообщение `START` на номер `4930609859535` в WhatsApp
2. Вы получите API ключ для sandbox окружения
3. Введите полученный ключ в поле "API Key" в интерфейсе

### 2. Настройка номера телефона

**Важно**: В sandbox окружении вы можете отправлять сообщения **только на свой номер телефона**, который получил API ключ.

1. Введите ваш номер телефона в поле "Your Phone Number"
2. Номер должен быть в международном формате (например: `+1234567890`)
3. Этот же номер будет получателем всех сообщений

### 3. Настройка Webhook (опционально)

Для получения входящих сообщений настройте webhook URL:

- Используйте сервисы типа [RequestBin](https://requestbin.com/) для тестирования
- Или настройте собственный сервер для обработки webhook'ов

## 🎯 Использование

### Основной интерфейс

1. Откройте приложение и перейдите на страницу чата
2. Введите ваш API ключ 360Dialog
3. Введите ваш номер телефона (который получил API ключ)
4. Выберите контакт из списка
5. Отправляйте текстовые сообщения

**Примечание**: Все сообщения будут отправлены на ваш номер телефона, независимо от выбранного контакта в интерфейсе.

### Шаблонные сообщения

В интерфейсе доступна кнопка "Send Template Message" для отправки предустановленных шаблонов:

```typescript
{
  templateName: "first_welcome_messsage",
  namespace: "c8ae5f90_307a_ca4c_b8f6_d1e2a2573574",
  parameters: [
    { type: "text", text: "Test User" }
  ]
}
```

## 🏗 Архитектура

### API Layer (`src/shared/api/360dialog/`)

- **`types.ts`** - TypeScript типы для API
- **`client.ts`** - Effector эффекты для API вызовов
- **`index.ts`** - Queries и Mutations с использованием Farfetched

### Pages (`src/pages/chat/`)

- **`model.ts`** - Effector модель с состоянием и логикой
- **`page.tsx`** - React компонент страницы
- **`renderer.tsx`** - Рендерер для маршрутизации

### UI Components (`src/shared/ui/molecules/`)

- **`chat/`** - Основной компонент чата
- **`contact-list/`** - Список контактов
- **`message-list/`** - История сообщений
- **`message-input/`** - Поле ввода сообщений
- **`chat-header/`** - Заголовок чата

## 📱 Адаптивность

Интерфейс адаптирован для всех устройств:

- **Мобильные** - Полноэкранный режим с оверлей меню контактов
- **Планшеты** - Адаптивная ширина панелей
- **Десктоп** - Фиксированная ширина с боковой панелью

## 🔌 API Endpoints

### Отправка сообщений

```typescript
// Текстовое сообщение
POST https://waba-sandbox.360dialog.io/v1/messages
{
  "to": "PHONE_NUMBER",
  "type": "text",
  "text": {
    "body": "Hello World"
  }
}

// Шаблонное сообщение
POST https://waba-sandbox.360dialog.io/v1/messages
{
  "to": "PHONE_NUMBER",
  "type": "template",
  "template": {
    "namespace": "NAMESPACE",
    "language": {
      "policy": "deterministic",
      "code": "en"
    },
    "name": "TEMPLATE_NAME",
    "components": [...]
  }
}
```

### Webhook

```typescript
// Настройка webhook
POST https://waba-sandbox.360dialog.io/v1/configs/webhook
{
  "url": "YOUR_WEBHOOK_URL"
}
```

## 🚨 Ограничения Sandbox

Согласно [официальной документации 360Dialog](https://docs.360dialog.com/partner/api-reference/sandbox):

- **Отправка сообщений только на ваш номер телефона** - каждый API ключ привязан к одному номеру
- **Неограниченное количество сообщений** для тестирования
- **Только текстовые сообщения и шаблоны** - медиа файлы не поддерживаются в sandbox
- **Один API ключ на номер телефона** - для тестирования с несколькими номерами нужны отдельные ключи
- **Номер может быть стационарным** - если он поддерживает WhatsApp

## 📄 Лицензия

MIT License

## 🤝 Поддержка

Для получения поддержки по 360Dialog API обратитесь к [официальной документации](https://docs.360dialog.com/partner/api-reference/sandbox).
