import { create } from 'zustand';
import type { AIMessage } from '../types';
import { parseUserInput, getTimeResponse, helpText, greetings } from '../data/aiResponses';
import { useWindowStore } from './windowStore';

interface AIStore {
  messages: AIMessage[];
  isTyping: boolean;

  sendMessage: (content: string) => void;
  clearMessages: () => void;
}

const createMessage = (role: 'user' | 'assistant', content: string): AIMessage => ({
  id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  role,
  content,
  timestamp: new Date(),
});

const initialGreeting = greetings[Math.floor(Math.random() * greetings.length)];

export const useAIStore = create<AIStore>((set) => ({
  messages: [createMessage('assistant', initialGreeting)],
  isTyping: false,

  sendMessage: (content: string) => {
    const userMessage = createMessage('user', content);

    set(state => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));

    // Simulate AI thinking delay
    setTimeout(() => {
      const command = parseUserInput(content);
      let response = '';

      switch (command.action) {
        case 'openApp':
          if (command.appId) {
            useWindowStore.getState().openWindow(command.appId);
            const appNames: Record<string, string> = {
              'file-explorer': 'File Explorer',
              'browser': 'Browser',
              'notes': 'Notes',
              'settings': 'Settings',
              'photos': 'Photos',
              'music': 'Music',
            };
            response = `Opening ${appNames[command.appId] || command.appId} for you...`;
          }
          break;

        case 'showTime':
          response = getTimeResponse();
          break;

        case 'showHelp':
          response = helpText;
          break;

        case 'respond':
          response = command.response || "I'm not sure how to help with that.";
          break;

        default:
          response = "I'm not sure how to help with that.";
      }

      const assistantMessage = createMessage('assistant', response);

      set(state => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false,
      }));
    }, 500 + Math.random() * 500);
  },

  clearMessages: () => {
    set({
      messages: [createMessage('assistant', "Chat cleared! How can I help you?")],
    });
  },
}));
