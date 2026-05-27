import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
	component: () => (
		<div style={{ padding: 24 }}>
			<h1>Hono Fullstack App</h1>
			<Outlet />
		</div>
	),
});
