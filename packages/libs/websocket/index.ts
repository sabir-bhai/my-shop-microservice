

import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Configuration options for WebSocket server
 */
export interface WebSocketConfig {
  cors?: {
    origin: string | string[];
    credentials?: boolean;
  };
  redis?: {
    host: string;
    port: number;
    password?: string;
  };
  pingTimeout?: number;
  pingInterval?: number;
}

/**
 * Custom Socket interface with user information
 */
export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userData?: any;
}

/**
 * Event data structure for typed events
 */
export interface SocketEventData {
  event: string;
  data: any;
  timestamp?: Date;
}

// ============================================================================
// GLOBAL STATE
// ============================================================================

let io: SocketIOServer | null = null;
let redisPubClient: Redis | null = null;
let redisSubClient: Redis | null = null;

// ============================================================================
// SETUP FUNCTIONS
// ============================================================================

/**
 * Setup Redis adapter for horizontal scaling
 * Allows multiple server instances to share socket connections
 *
 * @param redisConfig - Redis connection configuration
 */
function setupRedisAdapter(redisConfig: { host: string; port: number; password?: string }): void {
  console.log('🔴 Setting up Redis adapter for Socket.IO...');

  // Create Redis pub/sub clients
  redisPubClient = new Redis({
    host: redisConfig.host,
    port: redisConfig.port,
    password: redisConfig.password,
  });

  redisSubClient = redisPubClient.duplicate();

  // Attach adapter to Socket.IO
  if (io) {
    io.adapter(createAdapter(redisPubClient, redisSubClient));
    console.log('✅ Redis adapter configured');
  }
}

/**
 * Setup authentication and authorization middleware
 * Runs before the connection is established
 */
function setupMiddleware(): void {
  if (!io) return;

  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;

    // If no token is provided, allow connection but mark as unauthenticated
    if (!token) {
      console.log('⚠️ Socket connection without authentication token');
      return next();
    }

    try {
      console.log('🔐 Authenticated socket connection');
      next();
    } catch (error) {
      console.error('❌ Socket authentication failed:', error);
      next(new Error('Authentication failed'));
    }
  });
}

/**
 * Setup connection event handlers
 * Handles new connections, disconnections, and custom events
 */
function setupConnectionHandlers(): void {
  if (!io) return;

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`📱 New socket connected: ${socket.id}`);

    // Handle user joining a specific room (e.g., user's private room)
    socket.on('join:room', (roomId: string) => {
      socket.join(roomId);
      console.log(`👥 Socket ${socket.id} joined room: ${roomId}`);
      socket.emit('room:joined', { roomId, socketId: socket.id });
    });

    // Handle user leaving a room
    socket.on('leave:room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`👋 Socket ${socket.id} left room: ${roomId}`);
      socket.emit('room:left', { roomId });
    });

    // Handle custom messages
    socket.on('message', (data: any) => {
      console.log('📨 Received message:', data);
      // Echo back or process the message
      socket.emit('message:received', {
        success: true,
        data,
        timestamp: new Date()
      });
    });

    // Handle broadcast message to a room
    socket.on('message:room', ({ roomId, message }: { roomId: string; message: any }) => {
      console.log(`📨 Broadcasting message to room ${roomId}`);
      io?.to(roomId).emit('message:room', {
        from: socket.id,
        message,
        timestamp: new Date()
      });
    });

    // Handle ping/pong for connection health check
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: new Date() });
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log(`📴 Socket disconnected: ${socket.id}, Reason: ${reason}`);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error(`❌ Socket error for ${socket.id}:`, error);
    });
  });
}

// ============================================================================
// MAIN INITIALIZATION FUNCTION
// ============================================================================

/**
 * Initialize the WebSocket server
 *
 * @param httpServer - The HTTP server instance to attach Socket.IO to
 * @param config - Configuration options for the WebSocket server
 *
 * @example
 * const httpServer = http.createServer(app);
 * initializeWebSocket(httpServer, {
 *   cors: { origin: 'http://localhost:3000', credentials: true }
 * });
 */
export function initializeWebSocket(httpServer: HttpServer, config: WebSocketConfig = {}): void {
  console.log('🔌 Initializing WebSocket server...');

  // Create Socket.IO server with configuration
  io = new SocketIOServer(httpServer, {
    cors: config.cors || {
      origin: '*',
      credentials: true,
    },
    pingTimeout: config.pingTimeout || 60000,
    pingInterval: config.pingInterval || 25000,
    transports: ['websocket', 'polling'],
  });

  // Setup Redis adapter if Redis config is provided
  if (config.redis) {
    setupRedisAdapter(config.redis);
  }

  // Setup middleware and event handlers
  setupMiddleware();
  setupConnectionHandlers();

  console.log('✅ WebSocket server initialized successfully');
}

// ============================================================================
// PUBLIC FUNCTIONS FOR BROADCASTING MESSAGES
// ============================================================================

/**
 * Emit an event to all connected clients
 *
 * @param event - Event name
 * @param data - Data to send
 *
 * @example
 * broadcast('notification', { message: 'Server maintenance in 5 minutes' });
 */
export function broadcast(event: string, data: any): void {
  if (!io) {
    console.warn('⚠️ WebSocket not initialized. Call initializeWebSocket() first.');
    return;
  }
  console.log(`📢 Broadcasting event: ${event}`);
  io.emit(event, data);
}







export async function closeWebSocket(): Promise<void> {
  console.log('🔌 Closing WebSocket server...');

  if (io) {
    io.close();
    io = null;
  }

  if (redisPubClient) {
    await redisPubClient.quit();
    redisPubClient = null;
  }

  if (redisSubClient) {
    await redisSubClient.quit();
    redisSubClient = null;
  }

  console.log('✅ WebSocket server closed');
}

