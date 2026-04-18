import { supabase } from './supabase';

export type Todo = {
  id: number;
  description: string;
  completed: boolean;
  when: 0 | 1 | 2; // 0: Morning, 1: Afternoon, 2: Evening
  position: number;
  created_at: string;
  user_id?: string;
};

export const todoService = {
  // utils/todoService.ts
    async fetchTodos() {
        const { data, error } = await supabase
            .from('todos')
            .select('*')
            .order('position', { ascending: true });

        if (error) throw error;

        // Filter out any "completed" tasks that are older than 24 hours 
        // just in case the Cron job hasn't run yet.
        const now = new Date();
        const filteredData = data.filter(todo => {
            if (!todo.completed) return true;
            
            const createdAt = new Date(todo.created_at);
            const hoursOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
            return hoursOld < 12;
        });

        return filteredData as Todo[];
    },

    async addTodo(description: string, when: number, lastPosition: number) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");


        const { data, error } = await supabase
        .from('todo')
        .insert([{ 
            description, 
            when, 
            position: lastPosition + 1.0, 
            user_id: user.id,
            completed: false 
        }])
        .select();
        
        if (error) throw error;
        return data[0] as Todo;
    },

    async toggleTodo(id: number, completed: boolean) {
        const { error } = await supabase
        .from('todo')
        .update({ completed })
        .eq('id', id);
        if (error) throw error;
    },

    async updatePosition(id: number, newPosition: number) {
        const { error } = await supabase
        .from('todo')
        .update({ position: newPosition })
        .eq('id', id);
        if (error) throw error;
    },
    // Add this to your todoService object in utils/todoService.ts
    async updateTaskCategory(id: number, when: number, position: number) {
        const { error } = await supabase
            .from('todos')
            .update({ when, position })
            .eq('id', id);
        if (error) throw error;
    },

    async deleteTodo(id: number) {
        const { error } = await supabase
        .from('todo')
        .delete()
        .eq('id', id);
        if (error) throw error;
    }
};