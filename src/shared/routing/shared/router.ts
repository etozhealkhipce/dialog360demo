import { createHistoryRouter } from "atomic-router";

import { controls } from "./controls";
import { home, chat, authError } from "./routes";

export enum ERoutes {
  Main = "/",
  AuthError = "/auth-error",
  Chat = "/chat",
}

const routes = [
  { route: home, path: ERoutes.Main },
  { route: authError, path: ERoutes.AuthError },
  { route: chat, path: ERoutes.Chat },
];

export const router = createHistoryRouter({ routes, controls });
