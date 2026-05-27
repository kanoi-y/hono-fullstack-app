import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { apiClient } from "../lib/api";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const [title, setTitle] = useState("");
	const queryClient = useQueryClient();

	const todosQuery = useQuery({
		queryKey: ["todos"],
		queryFn: async () => {
			const res = await apiClient.api.todos.$get();

			if (!res.ok) {
				throw new Error("Failed to fetch todos");
			}

			return res.json();
		},
	});

	const createTodoMutation = useMutation({
		mutationFn: async (title: string) => {
			const res = await apiClient.api.todos.$post({
				json: { title },
			});

			if (!res.ok) {
				throw new Error("Failed to create todo");
			}

			return res.json();
		},
		onSuccess: () => {
			setTitle("");
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	return (
		<main>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					createTodoMutation.mutate(title);
				}}
			>
				<input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="Todo title"
				/>
				<button type="submit">Add</button>
			</form>

			{todosQuery.isLoading && <p>Loading...</p>}
			{todosQuery.isError && <p>Failed to load todos.</p>}

			<ul>
				{todosQuery.data?.map((todo) => (
					<li key={todo.id}>
						{todo.done ? "✅" : "⬜️"} {todo.title}
					</li>
				))}
			</ul>
		</main>
	);
}
