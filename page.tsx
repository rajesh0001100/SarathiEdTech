import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { Todo } from "@/types";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <ul>
      {(todos as Todo[] | null)?.map((todo: Todo) => (
        <li key={todo.id}>{todo.name || todo.title || 'Untitled Todo'}</li>
      ))}
    </ul>
  );
}
