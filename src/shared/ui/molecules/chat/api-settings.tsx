import { FC, useState } from "react";

import { Link } from "atomic-router-react";

import { chat } from "@/shared/routing/shared/routes";
import { openFailureToast } from "@/shared/ui/atoms/notification";
import { Input } from "@/shared/ui/molecules/input";

type ApiSettingsProps = {
  apiKey: string;
  userPhone: string;
  webhookUrl: string;
  onSave: () => void;
  onApiKeyChange: (value: string) => void;
  onUserPhoneChange: (value: string) => void;
  onWebhookUrlChange: (value: string) => void;
};

export const ApiSettings: FC<ApiSettingsProps> = ({
  apiKey,
  userPhone,
  webhookUrl,
  onApiKeyChange,
  onUserPhoneChange,
  onWebhookUrlChange,
  onSave,
}) => {
  const [errors, setErrors] = useState<{
    apiKey?: boolean;
    userPhone?: boolean;
  }>({});

  const handleSaveAndNavigate = (e: React.MouseEvent) => {
    const newErrors: { apiKey?: boolean; userPhone?: boolean } = {};

    if (!apiKey.trim()) {
      newErrors.apiKey = true;
      openFailureToast("Please enter your API key");
    }

    if (!userPhone.trim()) {
      newErrors.userPhone = true;
      openFailureToast("Please enter your phone number");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      e.preventDefault();
      return;
    }

    onSave();
  };

  const handleApiKeyChange = (value: string) => {
    if (errors.apiKey) {
      setErrors((prev) => ({ ...prev, apiKey: false }));
    }
    onApiKeyChange(value);
  };

  const handleUserPhoneChange = (value: string) => {
    if (errors.userPhone) {
      setErrors((prev) => ({ ...prev, userPhone: false }));
    }
    onUserPhoneChange(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        360Dialog API Configuration
      </h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-base font-semibold text-blue-800 mb-3">
          Как настроить 360Dialog API
        </h3>
        <div className="text-sm text-blue-700 space-y-3">
          <div>
            <strong className="text-blue-800">1. Получите API ключ:</strong>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• Откройте WhatsApp на вашем телефоне</li>
              <li>
                • Отправьте сообщение &quot;START&quot; на номер{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://wa.me/4930609859535?text=START"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  4930609859535
                </a>
              </li>
              <li>• Вы получите API ключ в ответном сообщении</li>
            </ul>
          </div>
          <div>
            <strong className="text-blue-800">
              2. Укажите ваш номер телефона:
            </strong>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• Введите номер, который получил API ключ</li>
              <li>• Используйте международный формат без +: 7XXXXXXXXXX</li>
              <li>
                • В sandbox можно отправлять сообщения только на этот номер
              </li>
            </ul>
          </div>
          <div>
            <strong className="text-blue-800">
              3. Webhook URL (необязательно):
            </strong>
            <ul className="ml-4 mt-2 space-y-1">
              <li>• Нужен для получения входящих сообщений</li>
              <li>
                • Для тестирования используйте{" "}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://requestbin.com"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  RequestBin
                </a>
              </li>
              <li>• Или настройте собственный сервер</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Input
          value={apiKey}
          label="API Key"
          type="password"
          isError={errors.apiKey}
          placeholder="Enter your 360Dialog API key"
          onChange={(e) => handleApiKeyChange(e.target.value)}
          errorMessage={errors.apiKey ? "API key is required" : undefined}
        />

        <Input
          type="tel"
          value={userPhone}
          label="Your Phone Number"
          placeholder="7XXXXXXXXXX"
          isError={errors.userPhone}
          onChange={(e) => handleUserPhoneChange(e.target.value)}
          errorMessage={
            errors.userPhone ? "Phone number is required" : undefined
          }
        />

        <Input
          type="url"
          value={webhookUrl}
          label="Webhook URL (optional)"
          placeholder="https://your-webhook-url.com/webhook"
          onChange={(e) => onWebhookUrlChange(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Link
          to={chat}
          onClick={handleSaveAndNavigate}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Save Configuration & Open Chat
        </Link>
      </div>
    </div>
  );
};
