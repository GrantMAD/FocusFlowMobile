import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { BrainDumpItem } from '@/types';

type BrainDumpStore = {
  items: BrainDumpItem[];
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (content: string) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  convertToTask: (id: string) => Promise<void>;
};

export const useBrainDumpStore = create<BrainDumpStore>((set, get) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('brain_dump_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      set({ items: data as BrainDumpItem[], isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },

  addItem: async (content: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('brain_dump_items')
      .insert([{ user_id: user.id, content }])
      .select()
      .single();

    if (!error && data) {
      set({ items: [data as BrainDumpItem, ...get().items] });
    }
  },

  removeItem: async (id: string) => {
    const { error } = await supabase
      .from('brain_dump_items')
      .delete()
      .eq('id', id);

    if (!error) {
      set({ items: get().items.filter(i => i.id !== id) });
    }
  },

  convertToTask: async (id: string) => {
    const item = get().items.find(i => i.id === id);
    if (!item) return;

    // Use taskStore to create a new task
    const { useTaskStore } = await import('./taskStore');
    await useTaskStore.getState().addTask({
      title: item.content,
      status: 'pending',
      priority: 'later',
    });

    // Remove from brain dump
    await get().removeItem(id);
  },
}));
