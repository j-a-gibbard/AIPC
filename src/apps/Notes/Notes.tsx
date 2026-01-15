import { useState } from 'react';
import {
  Plus,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  FileText,
  Trash2,
} from 'lucide-react';
import styles from './Notes.module.css';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
}

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes',
    content: `Team Meeting - January 15, 2026

Attendees: Alex, Jordan, Sam, Taylor

Agenda:
1. Q1 Planning Review
2. Product Roadmap Updates
3. Resource Allocation

Notes:
- Q1 targets are on track
- New feature launch scheduled for March
- Need additional frontend developer

Action Items:
- Alex: Finalize budget proposal
- Jordan: Update project timeline
- Sam: Schedule customer interviews`,
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Ideas',
    content: `App Ideas:
- Task manager with AI
- Habit tracker
- Recipe organizer
- Budget app

Side Projects:
- Learn Rust
- Build a game
- Contribute to open source`,
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '3',
    title: 'Todo',
    content: `Today's Tasks:
[ ] Review pull requests
[ ] Update documentation
[ ] Fix bug #1234
[ ] Team standup at 10am

This Week:
[ ] Finish feature implementation
[ ] Write tests
[ ] Deploy to staging`,
    updatedAt: new Date(Date.now() - 172800000),
  },
];

export const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedId, setSelectedId] = useState<string>(initialNotes[0].id);
  const [editingTitle, setEditingTitle] = useState(false);

  const selectedNote = notes.find(n => n.id === selectedId);

  const handleNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (selectedId === id && newNotes.length > 0) {
      setSelectedId(newNotes[0].id);
    }
  };

  const handleContentChange = (content: string) => {
    setNotes(notes.map(n =>
      n.id === selectedId
        ? { ...n, content, updatedAt: new Date() }
        : n
    ));
  };

  const handleTitleChange = (title: string) => {
    setNotes(notes.map(n =>
      n.id === selectedId
        ? { ...n, title, updatedAt: new Date() }
        : n
    ));
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / 86400000);

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className={styles.notes}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarTitle}>Notes</span>
          <button className={styles.newButton} onClick={handleNewNote} title="New Note">
            <Plus size={16} />
          </button>
        </div>
        <div className={styles.notesList}>
          {notes.map(note => (
            <button
              key={note.id}
              className={`${styles.noteItem} ${note.id === selectedId ? styles.selected : ''}`}
              onClick={() => setSelectedId(note.id)}
            >
              <FileText size={14} />
              <div className={styles.noteItemContent}>
                <span className={styles.noteItemTitle}>{note.title}</span>
                <span className={styles.noteItemDate}>{formatDate(note.updatedAt)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.editor}>
        {selectedNote ? (
          <>
            <div className={styles.editorToolbar}>
              <div className={styles.formatButtons}>
                <button className={styles.formatButton} title="Bold">
                  <Bold size={14} />
                </button>
                <button className={styles.formatButton} title="Italic">
                  <Italic size={14} />
                </button>
                <button className={styles.formatButton} title="Underline">
                  <Underline size={14} />
                </button>
                <div className={styles.divider} />
                <button className={styles.formatButton} title="Bullet List">
                  <List size={14} />
                </button>
                <button className={styles.formatButton} title="Numbered List">
                  <ListOrdered size={14} />
                </button>
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteNote(selectedNote.id)}
                title="Delete Note"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className={styles.editorContent}>
              {editingTitle ? (
                <input
                  type="text"
                  className={styles.titleInput}
                  value={selectedNote.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setEditingTitle(false)}
                  autoFocus
                />
              ) : (
                <h1
                  className={styles.title}
                  onClick={() => setEditingTitle(true)}
                >
                  {selectedNote.title}
                </h1>
              )}
              <textarea
                className={styles.textarea}
                value={selectedNote.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing..."
              />
            </div>
          </>
        ) : (
          <div className={styles.empty}>
            <FileText size={48} strokeWidth={1} />
            <p>Select a note or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
};
