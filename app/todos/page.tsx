import Link from "next/link";
export default async function Todos() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos");
  const todos: { userId: number; id: number; title: string; completed: boolean }[] =
    await res.json();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-2xl font-semibold mb-6">Todos Page</h1>

        <ul className="w-full space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="...">
              <Link href={`/todos/${todo.id}`} className="flex w-full justify-between">
                <span className="font-medium">{todo.title}</span>
                <span className={todo.completed ? "text-green-600" : "text-red-600"}>
                  {todo.completed ? "Done" : "Pending"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
