import { FC, useState } from "react";

import { Button } from "@/shared/ui/atoms";
import { Drawer } from "@/shared/ui/atoms/drawer";
import { openFailureToast } from "@/shared/ui/atoms/notification";
import { Input } from "@/shared/ui/molecules/input";

type SettingsDrawerProps = {
  apiKey: string;
  isOpen: boolean;
  userPhone: string;
  webhookUrl: string;
  onSave: () => void;
  onClose: () => void;
  onApiKeyChange: (value: string) => void;
  onUserPhoneChange: (value: string) => void;
  onWebhookUrlChange: (value: string) => void;
};

export const SettingsDrawer: FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
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

  const handleSave = () => {
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
    <Drawer
      isOpen={isOpen}
      direction="left"
      onClose={onClose}
      title="360Dialog API Configuration"
    >
      <div className="p-4 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Настройка 360Dialog API
          </h3>
          <div className="text-xs text-blue-700 space-y-2">
            <div>
              <strong>1. Получение API ключа:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>
                  • Отправьте &quot;START&quot; на номер{" "}
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://wa.me/4930609859535?text=START"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    4930609859535
                  </a>{" "}
                  в WhatsApp
                </li>
                <li>• Вы получите API ключ для sandbox окружения</li>
              </ul>
            </div>
            <div>
              <strong>2. Укажите ваш номер телефона:</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Введите номер, который получил API ключ</li>
                <li>• Используйте международный формат без +: 7XXXXXXXXXX</li>
                <li>
                  • В sandbox можно отправлять сообщения только на этот номер
                </li>
              </ul>
            </div>
            <div>
              <strong>3. Webhook (опционально):</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Используйте RequestBin для тестирования</li>
                <li>• Или настройте собственный сервер</li>
              </ul>
            </div>
          </div>
        </div>

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

        <div className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Configuration
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
