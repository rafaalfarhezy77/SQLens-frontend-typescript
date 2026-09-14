import { create } from 'zustand';

export interface UIState {
  selectedTable: string;
  isSidebarOpen: boolean;
  activeTab: 'result' | 'schema' | 'history';
  setSelectedTable: (tableName: string) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: 'result' | 'schema' | 'history') => void;
}

export const useUIStore = create((set) => ({
  selectedTable: 'users',
  isSidebarOpen: true,
  activeTab: 'result',
  setSelectedTable: (tableName: string) => set({ selectedTable: tableName }),
  toggleSidebar: () => set((state: UIState) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setActiveTab: (tab: 'result' | 'schema' | 'history') => set({ activeTab: tab }),
}));