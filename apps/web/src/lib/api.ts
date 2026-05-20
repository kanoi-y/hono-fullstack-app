import { hc } from "hono/client";
import type { AppType } from "../../../api/src";

export const apiClient = hc<AppType>("/");
