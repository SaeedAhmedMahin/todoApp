import { notFound } from "next/navigation";

type Todo = { userId: number; id: number; title: string; completed: boolean };

export default async function TodoPage({ params }: { params: { todoId: string } }) {
  const { todoId } = await params;
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`);

  if (!res.ok) {
    // show 404 for non-existent IDs
    notFound();
  }

  const todo: Todo = await res.json();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-start py-16 px-8 bg-white dark:bg-black">
        <h1 className="text-2xl font-semibold mb-4">Todo #{todo.id}</h1>

        <div className="w-full rounded-md border p-6">
          <h2 className="text-lg font-medium mb-2">{todo.title}</h2>
          <p className="mb-2"><strong>User:</strong> {todo.userId}</p>
          <p className="mb-2">
            <strong>Status:</strong>{" "}
            <span className={todo.completed ? "text-green-600" : "text-red-600"}>
              {todo.completed ? "Completed" : "Pending"}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}
