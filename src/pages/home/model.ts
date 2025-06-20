import { createStore } from "effector";

import { routes } from "@/shared/routing/shared";
import { chainAppLoaded } from "@/shared/routing/shared/app-loaded-chain";
import { User, Contact } from "@/shared/types/chat";

export enum View {
  ContentLoading = "ContentLoading",
  Content = "Content",
}

const appLoadedRoute = chainAppLoaded(routes.home);

// Моковые данные для демонстрации
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Анна Петрова",
    status: "online",
    unreadCount: 2,
    lastMessage: {
      text: "Привет! Как дела?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 минут назад
      isFromMe: false,
    },
  },
  {
    id: "2",
    name: "Михаил Сидоров",
    status: "away",
    unreadCount: 0,
    lastMessage: {
      text: "Встречаемся в 15:00",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 минут назад
      isFromMe: true,
    },
  },
  {
    id: "3",
    name: "Елена Козлова",
    status: "offline",
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 часа назад
    unreadCount: 1,
    lastMessage: {
      text: "Спасибо за помощь!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 час назад
      isFromMe: false,
    },
  },
  {
    id: "4",
    name: "Дмитрий Волков",
    status: "online",
    unreadCount: 0,
    lastMessage: {
      text: "Документы готовы",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 минут назад
      isFromMe: false,
    },
  },
  {
    id: "5",
    name: "Ольга Морозова",
    status: "offline",
    unreadCount: 3,
    lastMessage: {
      text: "Когда будет готово?",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 минут назад
      isFromMe: false,
    },
  },
];

const currentUser: User = {
  id: "current-user",
  name: "Вы",
  status: "online",
};

const $view = createStore<View>(View.Content);

export const $$homeModel = {
  $view,
  appLoadedRoute,
  $contacts: createStore<Contact[]>(mockContacts),
  $currentUser: createStore<User>(currentUser),
};
