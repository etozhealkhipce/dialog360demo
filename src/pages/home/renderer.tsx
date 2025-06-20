import { FC } from "react";

import {
  $apiKey,
  setApiKey,
  $userPhone,
  $webhookUrl,
  setUserPhone,
  setWebhookUrl,
} from "@/pages/chat/model";
import { useUnit } from "effector-react";

import { openSuccessToast } from "@/shared/ui/atoms/notification";
import { ApiSettings } from "@/shared/ui/molecules/chat/api-settings";

export const Renderer: FC = () => {
  const { apiKey, userPhone, webhookUrl } = useUnit({
    apiKey: $apiKey,
    userPhone: $userPhone,
    webhookUrl: $webhookUrl,
  });

  const {
    setApiKey: setKey,
    setUserPhone: setPhone,
    setWebhookUrl: setWebhook,
    openSuccessToast: openSuccess,
  } = useUnit({
    setApiKey,
    setUserPhone,
    setWebhookUrl,
    openSuccessToast,
  });

  const handleSave = () => {
    openSuccess("Configuration saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to 360Dialog Chat
          </h1>
          <p className="text-gray-600">
            This is a WhatsApp-style chat interface integrated with 360Dialog
            API. Configure your API settings below and then save to open the
            chat with real WhatsApp messaging capabilities.
          </p>
        </div>

        <ApiSettings
          apiKey={apiKey}
          onSave={handleSave}
          userPhone={userPhone}
          webhookUrl={webhookUrl}
          onApiKeyChange={setKey}
          onUserPhoneChange={setPhone}
          onWebhookUrlChange={setWebhook}
        />
      </div>
    </div>
  );
};
