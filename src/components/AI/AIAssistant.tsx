import { useState, useRef, useEffect } from 'react';
import { useAIStore } from '../../stores/aiStore';
import { useWindowStore } from '../../stores/windowStore';
import { Send, Sparkles, Folder, Globe, FileText, X, Trash2 } from 'lucide-react';
import styles from './AIAssistant.module.css';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistant = ({ isOpen, onClose }: AIAssistantProps) => {
  const { messages, isTyping, sendMessage, clearMessages } = useAIStore();
  const openWindow = useWindowStore(state => state.openWindow);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        const dockAIButton = document.querySelector('[data-ai-trigger]');
        if (dockAIButton && !dockAIButton.contains(e.target as Node)) {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickAction = (appId: string) => {
    openWindow(appId);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div ref={panelRef} className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Sparkles size={18} className={styles.icon} />
            <span className={styles.title}>AIPC Assistant</span>
          </div>
          <div className={styles.headerActions}>
            <button
              className={styles.headerButton}
              onClick={clearMessages}
              title="Clear chat"
            >
              <Trash2 size={14} />
            </button>
            <button
              className={styles.headerButton}
              onClick={onClose}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className={styles.messages}>
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`${styles.message} ${styles[msg.role]}`}
            >
              {msg.role === 'assistant' && (
                <div className={styles.avatar}>
                  <Sparkles size={12} />
                </div>
              )}
              <div className={styles.messageContent}>
                {msg.content.split('\n').map((line, i) => (
                  <p key={i}>{line || '\u00A0'}</p>
                ))}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.message} ${styles.assistant}`}>
              <div className={styles.avatar}>
                <Sparkles size={12} />
              </div>
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.quickActions}>
          <button
            className={styles.quickButton}
            onClick={() => handleQuickAction('file-explorer')}
          >
            <Folder size={14} />
            <span>Files</span>
          </button>
          <button
            className={styles.quickButton}
            onClick={() => handleQuickAction('browser')}
          >
            <Globe size={14} />
            <span>Browse</span>
          </button>
          <button
            className={styles.quickButton}
            onClick={() => handleQuickAction('notes')}
          >
            <FileText size={14} />
            <span>Notes</span>
          </button>
        </div>

        <form className={styles.inputForm} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className={styles.input}
            disabled={isTyping}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={!input.trim() || isTyping}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
