import { useState, useRef, useEffect } from 'react';
import { useAIStore } from '../../stores/aiStore';
import { useWindowStore } from '../../stores/windowStore';
import { Send, Sparkles, Folder, Globe, FileText } from 'lucide-react';
import styles from './AIAssistant.module.css';

export const AIAssistant = () => {
  const { messages, isTyping, sendMessage } = useAIStore();
  const openWindow = useWindowStore(state => state.openWindow);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  const handleQuickAction = (appId: string) => {
    openWindow(appId);
  };

  return (
    <div className={styles.assistant}>
      <div className={styles.header}>
        <Sparkles size={18} className={styles.icon} />
        <span className={styles.title}>AIPC Assistant</span>
      </div>

      <div className={styles.messages}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`${styles.message} ${styles[msg.role]}`}
          >
            <div className={styles.messageContent}>
              {msg.content.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.typing}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className={styles.input}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!input.trim()}
        >
          <Send size={16} />
        </button>
      </form>

      <div className={styles.quickActions}>
        <span className={styles.quickActionsLabel}>Quick actions:</span>
        <div className={styles.quickButtons}>
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
      </div>
    </div>
  );
};
