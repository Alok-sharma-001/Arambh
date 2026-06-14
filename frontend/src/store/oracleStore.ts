import { create } from 'zustand';

export interface OracleMessage {
  id: string;
  role: 'user' | 'oracle';
  content: string;
  timestamp: string;
}

interface OracleStore {
  isOpen: boolean;
  messages: OracleMessage[];
  isTyping: boolean;
  activeHintLevel: number;
  currentError: string | null;
  
  toggleOracle: () => void;
  setIsOpen: (open: boolean) => void;
  addMessage: (msg: Omit<OracleMessage, 'id' | 'timestamp'>) => void;
  setIsTyping: (typing: boolean) => void;
  setActiveHintLevel: (level: number) => void;
  setCurrentError: (error: string | null) => void;
  clearChat: () => void;
}

export const useOracleStore = create<OracleStore>((set) => ({
  isOpen: false,
  messages: [],
  isTyping: false,
  activeHintLevel: 0,
  currentError: null,

  toggleOracle: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (open) => set({ isOpen: open }),
  
  addMessage: (msg) => set((state) => ({
    messages: [
      ...state.messages,
      {
        ...msg,
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString()
      }
    ]
  })),

  setIsTyping: (typing) => set({ isTyping: typing }),
  setActiveHintLevel: (level) => set({ activeHintLevel: level }),
  setCurrentError: (error) => set({ currentError: error }),
  clearChat: () => set({ messages: [] })
}));
