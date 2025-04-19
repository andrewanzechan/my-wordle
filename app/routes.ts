import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/my-wordle", "routes/wordle.tsx")
] satisfies RouteConfig;
