"use client";

import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { todoService, Todo } from '@/utils/todoService';

  export default function HomePage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);

    const sections = [
      { id: 0, label: 'Morning' },
      { id: 1, label: 'Afternoon' },
      { id: 2, label: 'Evening' }
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login'; 
    };

    useEffect(() => {
        const load = async () => {
            try {
              const data = await todoService.fetchTodos();
              setTasks(data);
            } catch (err) {
              console.error("Error loading tasks:", err);
            } finally {
              setLoading(false);
            }
        };
        load();
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
              console.log("No session found, redirecting...");
              router.push('/login');
            } else {
              console.log("Logged in as:", session.user.email);
            }
        };
    checkUser();
    }, []);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        // 1. If dropped outside a list or in the same spot, do nothing
        if (!destination) return;
        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) return;

        const sourceWhen = parseInt(source.droppableId);
        const destWhen = parseInt(destination.droppableId);
        const taskId = parseInt(draggableId);

        // 2. Get the tasks specifically in the destination category to calculate position
        const destTasks = tasks
          .filter(t => t.when === destWhen)
          .sort((a, b) => a.position - b.position);

        // If moving within the same list, we need to remove the item from the destTasks array first
        // so the index calculation is accurate.
        if (sourceWhen === destWhen) {
          const itemIndex = destTasks.findIndex(t => t.id === taskId);
          destTasks.splice(itemIndex, 1);
        }

        // 3. Calculate new position based on the items around the drop index
        let newPos: number;
        const prev = destTasks[destination.index - 1];
        const next = destTasks[destination.index]; // The item currently at that index

        if (destTasks.length === 0) {
          newPos = 1.0; // First item in a new list
        } else if (!prev) {
          newPos = next.position - 1.0; // Dropped at the very top
        } else if (!next) {
          newPos = prev.position + 1.0; // Dropped at the very bottom
        } else {
          newPos = (prev.position + next.position) / 2; // Dropped between two items
        }

        // 4. UI Update: Update both 'when' and 'position'
        setTasks(prevTasks => prevTasks.map(t => 
          t.id === taskId ? { ...t, when: destWhen as 0 | 1 | 2, position: newPos } : t
        ));

        // 5. Update Database: We need a service method that handles both updates
        try {
          // We update both 'when' and 'position' in one go
          await todoService.updateTaskCategory(taskId, destWhen, newPos);
        } catch (err) {
          console.error("Failed to sync drag update:", err);
        }
    };

    const handleToggle = async (todo: Todo) => {
      const newStatus = !todo.completed;
      setTasks(tasks.map(t => t.id === todo.id ? { ...t, completed: newStatus } : t));
      await todoService.toggleTodo(todo.id, newStatus);
    };

    const handleDelete = async (id: number) => {
      setTasks(tasks.filter(t => t.id !== id));
      await todoService.deleteTodo(id);
    };

    const TodoSection = ({ label, whenValue }: { label: string, whenValue: number }) => {
      const [newTitle, setNewTitle] = useState("");
      
      const sectionTasks = tasks
        .filter(t => t.when === whenValue)
        .sort((a, b) => a.position - b.position);

      const handleAddItem = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTitle.trim()) {
          const lastPos = sectionTasks.length > 0 
            ? Math.max(...sectionTasks.map(t => t.position)) 
            : 0;
          
          try {
            const newItem = await todoService.addTodo(newTitle, whenValue, lastPos);
            setTasks(prev => [...prev, newItem]);
            setNewTitle("");
          } catch (err) {
            alert("Failed to add task. Make sure you are logged in!");
          }
        }
      };

      return (
        <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg text-gray-200 mb-8">
          <div className="flex items-center mb-6">
            <h4 className="font-semibold text-xl"> {label} </h4>
          </div>

          <Droppable droppableId={whenValue.toString()}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                {sectionTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef} 
                        {...provided.draggableProps} 
                        {...provided.dragHandleProps}
                        className="group flex items-center justify-between h-10 px-2 rounded hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex items-center flex-grow">
                          <input 
                            className="peer hidden" 
                            type="checkbox" 
                            id={`task-${task.id}`} 
                            checked={task.completed}
                            onChange={() => handleToggle(task)}
                          />
                          <label className="flex items-center cursor-pointer w-full" htmlFor={`task-${task.id}`}>
                            <span className="flex items-center justify-center w-5 h-5 border-2 border-gray-500 rounded-full peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all">
                              {task.completed && (
                                <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                                  <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                                </svg>
                              )}
                            </span>
                            <span className={`ml-4 text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                              {task.description}
                            </span>
                          </label>
                        </div>

                        {task.completed && (
                          <button 
                            onClick={() => handleDelete(task.id)}
                            className="text-gray-500 hover:text-red-500 px-2 transition-colors"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Input */}
          <div className="flex items-center w-full h-8 px-2 mt-4 text-sm font-medium rounded hover:bg-gray-900 transition-colors cursor-text">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <input 
              className="flex-grow h-8 ml-4 bg-transparent focus:outline-none font-medium text-gray-200 placeholder-gray-500" 
              type="text" 
              placeholder={`Add a new ${label.toLowerCase()} task...`}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={handleAddItem}
            />
          </div>
        </div>
      );
    };

    if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <main className="min-h-screen bg-gray-900 flex flex-col items-center py-16 px-4">
          <h1 className="text-3xl font-bold text-gray-100 mb-10 tracking-wide">My Daily Flow</h1>
          {sections.map(s => <TodoSection key={s.id} label={s.label} whenValue={s.id} />)}
        <button 
  onClick={handleLogout}
  className="absolute top-4 right-4 text-gray-300 hover:text-white text-sm"
>
  Logout
</button>
        </main>
      </DragDropContext>
    );
  }