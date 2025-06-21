import { io, Socket } from 'socket.io-client';

export interface ChatMessage {
  _id: string;
  chatId: string;
  senderId: string;
  content: {
    text: string;
    attachments?: string[];
  };
  appointmentId: string;
  timestamp: string;
}

export interface WebSocketCallbacks {
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: string) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private callbacks: WebSocketCallbacks = {};

  connect(serverUrl: string = 'https://two47-medics-api.onrender.com') {
    if (this.socket && this.isConnected) {
      return;
    }

    const token = localStorage.getItem('authToken');
    
    this.socket = io(serverUrl, {
      transports: ['websocket'],
      timeout: 20000,
      forceNew: true,
      auth: {
        token: token
      },
      extraHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.callbacks.onConnect?.();
      
      // Register with token if not already passed in auth
      if (token) {
        this.socket?.emit('register', { token });
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.callbacks.onDisconnect?.();
    });

    this.socket.on('connect_error', (error) => {
      this.callbacks.onError?.(`Connection error: ${error.message}`);
    });

    this.socket.on('receiveMessage', (message: ChatMessage) => {
      this.callbacks.onMessage?.(message);
    });

    this.socket.on('errorMessage', (error: any) => {
      const errorMsg = typeof error === 'object' ? JSON.stringify(error) : error;
      this.callbacks.onError?.(errorMsg);
    });

    // Listen for registration response
    this.socket.on('registered', (data) => {
      console.log('Successfully registered with WebSocket server:', data);
    });

    this.socket.on('registrationError', (error: any) => {
      const errorMsg = typeof error === 'object' ? JSON.stringify(error) : error;
      this.callbacks.onError?.(`Registration failed: ${errorMsg}`);
    });

    // Listen for message sending confirmation
    this.socket.on('messageSent', (data) => {
      console.log('Message sent successfully:', data);
    });

    this.socket.on('messageError', (error: any) => {
      const errorMsg = typeof error === 'object' ? JSON.stringify(error) : error;
      this.callbacks.onError?.(`Failed to send message: ${errorMsg}`);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinChat(chatId: string) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinChat', { chatId });
    }
  }

  sendMessage(chatId: string, text: string, attachments: string[] = [], appointmentId: string) {
    if (this.socket && this.isConnected) {
      const messageData = {
        chatId,
        text,
        attachments,
        appointmentId,
      };
      this.socket.emit('sendMessage', messageData);
    } else {
      this.callbacks.onError?.('WebSocket not connected');
    }
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export a singleton instance
export const websocketService = new WebSocketService(); 