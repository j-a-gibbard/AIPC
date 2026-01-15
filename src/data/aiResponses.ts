import type { AICommand } from '../types';

export const greetings = [
  "Hello! How can I help you today?",
  "Hi there! What would you like to do?",
  "Welcome back! Ready to be productive?",
  "Hey! I'm here to help. What do you need?",
];

export const fallbackResponses = [
  "I'm not sure how to help with that yet. Try asking me to open an app!",
  "I can help you open apps, check the time, or navigate files. What would you like?",
  "That's beyond my current abilities, but I'm learning! Try 'open files' or 'open browser'.",
  "Hmm, I don't understand that command. Try saying 'help' to see what I can do!",
];

export const helpText = `I can help you with:

**Open Applications:**
• "Open files" or "Open file explorer"
• "Open browser"
• "Open notes"
• "Open settings"
• "Open photos"
• "Open music"

**Utilities:**
• "What time is it?"
• "What's the date?"

**Tips:**
• Double-click desktop icons to open apps
• Drag windows to move them
• Drag window edges to resize
• Click the dock to switch between apps`;

interface CommandMatch {
  patterns: RegExp[];
  command: AICommand;
}

const commands: CommandMatch[] = [
  {
    patterns: [/open\s*(file|files|file\s*explorer|explorer|finder)/i, /show\s*(my\s*)?(files|folders)/i],
    command: { action: 'openApp', appId: 'file-explorer' },
  },
  {
    patterns: [/open\s*(web\s*)?(browser|internet|chrome|safari|firefox)/i, /browse\s*(the\s*)?(web|internet)/i],
    command: { action: 'openApp', appId: 'browser' },
  },
  {
    patterns: [/open\s*(notes?|notepad|text\s*editor)/i, /take\s*(a\s*)?note/i, /write\s*(a\s*)?note/i],
    command: { action: 'openApp', appId: 'notes' },
  },
  {
    patterns: [/open\s*settings?/i, /preferences/i, /system\s*settings/i],
    command: { action: 'openApp', appId: 'settings' },
  },
  {
    patterns: [/open\s*(photos?|pictures?|gallery|images?)/i, /show\s*(my\s*)?(photos?|pictures?)/i],
    command: { action: 'openApp', appId: 'photos' },
  },
  {
    patterns: [/open\s*music/i, /play\s*music/i],
    command: { action: 'openApp', appId: 'music' },
  },
  {
    patterns: [/what\s*time/i, /current\s*time/i, /tell\s*(me\s*)?the\s*time/i],
    command: { action: 'showTime' },
  },
  {
    patterns: [/what('s|\s*is)\s*(the\s*)?date/i, /today('s|\s*is)?\s*date/i, /what\s*day/i],
    command: { action: 'showTime' },
  },
  {
    patterns: [/^help$/i, /what\s*can\s*you\s*do/i, /how\s*(do\s*)?you\s*work/i, /commands?/i],
    command: { action: 'showHelp' },
  },
];

export const parseUserInput = (input: string): AICommand => {
  const trimmed = input.trim().toLowerCase();

  // Check for greetings
  if (/^(hi|hello|hey|howdy|greetings)/i.test(trimmed)) {
    return {
      action: 'respond',
      response: greetings[Math.floor(Math.random() * greetings.length)],
    };
  }

  // Check for thanks
  if (/^(thanks?|thank\s*you|thx)/i.test(trimmed)) {
    return {
      action: 'respond',
      response: "You're welcome! Let me know if you need anything else.",
    };
  }

  // Check commands
  for (const { patterns, command } of commands) {
    for (const pattern of patterns) {
      if (pattern.test(trimmed)) {
        return command;
      }
    }
  }

  // Fallback
  return {
    action: 'respond',
    response: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
  };
};

export const getTimeResponse = (): string => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  return `It's ${time} on ${date}.`;
};
