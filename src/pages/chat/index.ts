import { createRouteView } from "atomic-router-react";

import { ChatRenderer } from "./renderer";

import { routes } from "@/shared/routing/shared";
import { RouteRecord } from "@/shared/routing/shared/types";
import { PageLoader } from "@/shared/ui/atoms";

export const ChatRoute: RouteRecord = {
  route: routes.chat,
  view: createRouteView({
    view: ChatRenderer,
    otherwise: PageLoader,
    route: routes.chat,
  }),
};

export { ChatPage } from "./page";
export { ChatRenderer };
