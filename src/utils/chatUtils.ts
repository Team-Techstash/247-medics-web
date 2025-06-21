import { ChatMessage } from '@/api/services/websocketService';

/**
 * Format timestamp for chat messages
 */
export const formatMessageTime = (timestamp: string | Date): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Today - show time only
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).toLowerCase();
  } else if (diffInHours < 48) {
    // Yesterday
    return 'Yesterday';
  } else {
    // Show date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }
};

/**
 * Check if a message is from the current user
 */
export const isOwnMessage = (message: ChatMessage, currentUserId: string): boolean => {
  return message.senderId === currentUserId;
};

/**
 * Validate message text
 */
export const validateMessage = (text: string): { isValid: boolean; error?: string } => {
  if (!text || text.trim().length === 0) {
    return { isValid: false, error: 'Message cannot be empty' };
  }

  if (text.length > 1000) {
    return { isValid: false, error: 'Message too long (max 1000 characters)' };
  }

  return { isValid: true };
};

/**
 * Generate a temporary message ID for optimistic updates
 */
export const generateTempMessageId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if a message is a temporary message (not yet confirmed by server)
 */
export const isTempMessage = (messageId: string): boolean => {
  return messageId.startsWith('temp-');
};

/**
 * Group messages by date for better UI organization
 */
export const groupMessagesByDate = (messages: ChatMessage[]): { [key: string]: ChatMessage[] } => {
  const groups: { [key: string]: ChatMessage[] } = {};

  messages.forEach(message => {
    const date = new Date(message.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return groups;
};

/**
 * Get the last message from a chat
 */
export const getLastMessage = (messages: ChatMessage[]): ChatMessage | null => {
  if (messages.length === 0) return null;
  return messages[messages.length - 1];
};

/**
 * Check if chat has unread messages (placeholder for future implementation)
 */
export const hasUnreadMessages = (messages: ChatMessage[], lastReadTimestamp?: string): boolean => {
  if (!lastReadTimestamp) return false;
  
  const lastMessage = getLastMessage(messages);
  if (!lastMessage) return false;

  return new Date(lastMessage.timestamp) > new Date(lastReadTimestamp);
}; 