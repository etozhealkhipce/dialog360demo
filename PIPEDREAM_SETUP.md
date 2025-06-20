# Настройка Pipedream для получения сообщений

## Шаг 1: Создание Pipedream аккаунта

1. Зайдите на [pipedream.com](https://pipedream.com)
2. Создайте бесплатный аккаунт

## Шаг 2: Создание webhook endpoint

1. Нажмите "New" → "HTTP / Webhook"
2. Выберите "HTTP / Webhook" как источник
3. Скопируйте URL webhook'а (например: `https://eoxxxxxx.m.pipedream.net`)

## Шаг 3: Настройка в приложении

1. Откройте приложение в браузере
2. Перейдите на страницу чата
3. Нажмите на кнопку настроек (⚙️) рядом с "Contacts"
4. В поле "Webhook URL" введите URL от Pipedream
5. Сохраните настройки

## Шаг 4: Тестирование

1. Отправьте сообщение `START` на номер `4930609859535` в WhatsApp
2. Получите API ключ от 360Dialog
3. Введите API ключ в настройках приложения
4. Отправьте любое сообщение на номер `4930609859535`
5. Проверьте в Pipedream, что webhook получен
6. Сообщение должно появиться в вашем веб-чате

## Просмотр webhook'ов в Pipedream

1. В Pipedream перейдите к вашему webhook endpoint
2. Во вкладке "Events" вы увидите все полученные webhook'и
3. Нажмите на любой event для просмотра деталей

## Пример webhook payload

```json
{
  "contacts": [
    {
      "profile": {
        "name": "Your Name"
      },
      "wa_id": "49YOURNUMBER"
    }
  ],
  "messages": [
    {
      "from": "49YOURNUMBER",
      "id": "ABGGSHggVwIvAhANFj5aqzEi_lbauSkLYDCO",
      "text": {
        "body": "Hello from WhatsApp!"
      },
      "timestamp": "1591955533",
      "type": "text"
    }
  ]
}
```

## Troubleshooting

### Webhook не получается

- Проверьте, что URL правильно скопирован
- Убедитесь, что API ключ правильный
- Попробуйте отправить сообщение `START` заново

### Сообщения не появляются в чате

- Проверьте консоль браузера на ошибки
- Убедитесь, что webhook URL настроен
- Проверьте, что сообщения приходят в Pipedream

### CORS ошибки

- Pipedream автоматически обрабатывает CORS
- Если используете другой сервис, убедитесь, что CORS настроен правильно
