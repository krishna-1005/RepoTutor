import { CodebaseGraphResponse } from '../types/graph';
import { ExecutionFlowTrace } from '../types/execution';
import { AuditReportResponse } from '../types/audit';

export interface PresetRepository {
  id: string;
  name: string;
  description: string;
  fileName: string;
  codeContent: string;
  graph: CodebaseGraphResponse;
  flows: ExecutionFlowTrace[];
  audit: AuditReportResponse;
}

export const PRESET_REPOSITORIES: PresetRepository[] = [
  {
    id: 'auth-flow',
    name: 'Authentication & JWT Flow',
    description: 'User login, password verification, access token signing, and session middleware.',
    fileName: 'authService.ts',
    codeContent: `import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from './database';
import { RedisSessionStore } from './redis';

export async function loginUser(req, res) {
  const { email, password } = req.body;
  
  // 1. Sanitize & Fetch User
  const user = await db.users.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 2. Validate Password Hash
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // 3. Issue Signed JWT Access Token
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'secret-key',
    { expiresIn: '15m' }
  );

  // 4. Store Session in Redis Cache
  await RedisSessionStore.set(\`session:\${user.id}\`, accessToken, 900);

  return res.status(200).json({ accessToken, user: { id: user.id, email: user.email } });
}

export async function authenticateMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret-key');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token expired or invalid' });
  }
}`,
    graph: {
      repositoryName: 'Authentication & JWT Microservice',
      overview: 'End-to-end security pipeline managing credential validation, bcrypt hash comparison, token signing, and Express authorization middleware.',
      nodes: [
        {
          id: 'node-login',
          label: 'POST /api/v1/auth/login',
          type: 'endpoint',
          filePath: 'authService.ts',
          startLine: 7,
          endLine: 31,
          summary: 'Primary authentication endpoint accepting email and password credentials.',
          complexity: 'medium',
          tags: ['auth', 'endpoint', 'jwt']
        },
        {
          id: 'node-db-fetch',
          label: 'db.users.findByEmail()',
          type: 'function',
          filePath: 'database.ts',
          startLine: 12,
          endLine: 18,
          summary: 'Queries SQL database for user record corresponding to provided email.',
          complexity: 'low',
          tags: ['database', 'query']
        },
        {
          id: 'node-bcrypt',
          label: 'bcrypt.compare()',
          type: 'utility',
          filePath: 'node_modules/bcrypt',
          startLine: 1,
          endLine: 50,
          summary: 'Cryptographically compares plaintext password against stored salted hash.',
          complexity: 'medium',
          tags: ['crypto', 'security']
        },
        {
          id: 'node-jwt-sign',
          label: 'jwt.signToken()',
          type: 'function',
          filePath: 'authService.ts',
          startLine: 23,
          endLine: 27,
          summary: 'Encodes payload with user claims into signed RS256 JWT access token.',
          complexity: 'low',
          tags: ['jwt', 'token']
        },
        {
          id: 'node-redis',
          label: 'RedisSessionStore.set()',
          type: 'utility',
          filePath: 'redis.ts',
          startLine: 5,
          endLine: 15,
          summary: 'Persists active session token in distributed Redis cache with 15-minute TTL.',
          complexity: 'low',
          tags: ['cache', 'redis']
        },
        {
          id: 'node-middleware',
          label: 'authenticateMiddleware()',
          type: 'endpoint',
          filePath: 'authService.ts',
          startLine: 33,
          endLine: 49,
          summary: 'Express middleware interceptor verifying Bearer tokens on protected API routes.',
          complexity: 'medium',
          tags: ['middleware', 'security']
        }
      ],
      edges: [
        { id: 'e1', source: 'node-login', target: 'node-db-fetch', label: '1. Queries user record', type: 'sync' },
        { id: 'e2', source: 'node-db-fetch', target: 'node-bcrypt', label: '2. Passes hash for verification', type: 'sync' },
        { id: 'e3', source: 'node-bcrypt', target: 'node-jwt-sign', label: '3. On success, requests token', type: 'sync' },
        { id: 'e4', source: 'node-jwt-sign', target: 'node-redis', label: '4. Caches token in Redis', type: 'async' },
        { id: 'e5', source: 'node-middleware', target: 'node-jwt-sign', label: 'Verifies issued JWT signature', type: 'sync' }
      ]
    },
    flows: [
      {
        flowId: 'flow-auth-login',
        title: 'User Login & Token Provisioning',
        description: 'Complete trace of user credential submission through database lookup, hash verification, JWT signing, and Redis session creation.',
        steps: [
          {
            stepNumber: 1,
            nodeId: 'node-login',
            title: '1. HTTP Request Received',
            explanation: 'Client sends POST request to `/api/v1/auth/login` containing user email and password payload.',
            codeSnippet: `const { email, password } = req.body;`,
            sidebarNote: 'Ensure payload validation middleware is active to prevent malformed request handling.'
          },
          {
            stepNumber: 2,
            nodeId: 'node-db-fetch',
            title: '2. User Database Lookup',
            explanation: 'Service queries database table `users` by indexed email address to locate user record and stored password hash.',
            codeSnippet: `const user = await db.users.findByEmail(email);`,
            sidebarNote: 'Ensure `email` column has a unique B-Tree index to maintain O(1) lookup time.'
          },
          {
            stepNumber: 3,
            nodeId: 'node-bcrypt',
            title: '3. Bcrypt Hash Comparison',
            explanation: 'Bcrypt algorithm computes hash of raw submitted password using saved salt and compares against stored hash.',
            codeSnippet: `const isValid = await bcrypt.compare(password, user.passwordHash);`,
            sidebarNote: 'Cost factor 12 is utilized to protect against GPU brute-force attacks.'
          },
          {
            stepNumber: 4,
            nodeId: 'node-jwt-sign',
            title: '4. Signed JWT Token Generation',
            explanation: 'Generates cryptographically signed JWT containing user claims (`userId`, `role`) with short-lived 15m expiration.',
            codeSnippet: `const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);`,
            sidebarNote: 'Review: Avoid storing sensitive PII in unencrypted JWT payload claims.'
          },
          {
            stepNumber: 5,
            nodeId: 'node-redis',
            title: '5. Redis Session Storage',
            explanation: 'Saves active token key in Redis cache with automatic 900-second expiration for fast revocation capabilities.',
            codeSnippet: `await RedisSessionStore.set(\`session:\${user.id}\`, accessToken, 900);`,
            sidebarNote: 'Allows instant session revocation on logout or security incidents.'
          }
        ]
      }
    ],
    audit: {
      summary: 'Security analysis identified 1 high-risk hardcoded secret fallback and 1 missing rate limiter.',
      overallScore: 82,
      items: [
        {
          id: 'audit-1',
          targetNodeId: 'node-jwt-sign',
          category: 'security',
          severity: 'high',
          title: 'Hardcoded JWT Secret Fallback',
          description: 'The code uses `process.env.JWT_SECRET || "secret-key"`. If environment variable is omitted in production, a trivial default key is used.',
          recommendation: 'Throw an explicit error during initialization if process.env.JWT_SECRET is undefined.'
        },
        {
          id: 'audit-2',
          targetNodeId: 'node-login',
          category: 'security',
          severity: 'medium',
          title: 'Missing Rate Limiting',
          description: 'Login endpoint does not specify rate limiting, leaving the service vulnerable to credential stuffing attacks.',
          recommendation: 'Attach express-rate-limit middleware to restrict attempts to 5 per minute per IP.'
        }
      ]
    }
  },
  {
    id: 'order-pipeline',
    name: 'E-Commerce Order Pipeline',
    description: 'Shopping cart checkout, inventory reservation, payment authorization, and order confirmation.',
    fileName: 'orderPipeline.ts',
    codeContent: `export async function processOrder(orderId, userId, items) {
  // 1. Reserve Inventory Items
  const reserved = await inventoryService.reserveItems(items);
  if (!reserved) throw new Error("Inventory reservation failed");

  // 2. Charge Payment Gateway
  const payment = await paymentGateway.charge({ userId, amount: calculateTotal(items) });

  // 3. Update Order Status
  await db.orders.updateStatus(orderId, 'CONFIRMED');

  // 4. Publish Event to Event Bus
  await eventBus.publish('ORDER_COMPLETED', { orderId, userId, paymentId: payment.id });
}`,
    graph: {
      repositoryName: 'Order Processing Pipeline',
      overview: 'Distributed checkout transaction workflow handling stock reservations, credit card charges, DB mutations, and async message queue events.',
      nodes: [
        { id: 'node-checkout', label: 'processOrder()', type: 'function', filePath: 'orderPipeline.ts', startLine: 1, endLine: 14, summary: 'Orchestrator function executing multi-step order checkout transaction.', complexity: 'high', tags: ['order', 'checkout'] },
        { id: 'node-inventory', label: 'inventoryService.reserveItems()', type: 'utility', filePath: 'inventory.ts', startLine: 10, endLine: 35, summary: 'Reserves item stock quantities within atomic DB transaction.', complexity: 'medium', tags: ['inventory', 'db'] },
        { id: 'node-payment', label: 'paymentGateway.charge()', type: 'endpoint', filePath: 'payment.ts', startLine: 5, endLine: 25, summary: 'External API call charging customer credit card.', complexity: 'high', tags: ['payment', 'external'] },
        { id: 'node-db-order', label: 'db.orders.updateStatus()', type: 'function', filePath: 'db.ts', startLine: 40, endLine: 50, summary: 'Updates status flag of order row to CONFIRMED.', complexity: 'low', tags: ['database'] },
        { id: 'node-eventbus', label: 'eventBus.publish()', type: 'module', filePath: 'events.ts', startLine: 1, endLine: 20, summary: 'Publishes ORDER_COMPLETED event to RabbitMQ/Kafka queue.', complexity: 'medium', tags: ['event', 'queue'] }
      ],
      edges: [
        { id: 'e1', source: 'node-checkout', target: 'node-inventory', label: '1. Reserves stock', type: 'sync' },
        { id: 'e2', source: 'node-inventory', target: 'node-payment', label: '2. Charges card', type: 'sync' },
        { id: 'e3', source: 'node-payment', target: 'node-db-order', label: '3. Updates status', type: 'sync' },
        { id: 'e4', source: 'node-db-order', target: 'node-eventbus', label: '4. Emits async event', type: 'async' }
      ]
    },
    flows: [
      {
        flowId: 'flow-checkout',
        title: 'Complete Order Checkout Transaction',
        description: 'Step-by-step trace of order submission from stock locking to async event publishing.',
        steps: [
          { stepNumber: 1, nodeId: 'node-checkout', title: '1. Order Transaction Initiate', explanation: 'Client initiates checkout process passing order ID, user ID, and cart items.', codeSnippet: `processOrder(orderId, userId, items);` },
          { stepNumber: 2, nodeId: 'node-inventory', title: '2. Inventory Stock Lock', explanation: 'Atomic database row lock prevents overselling stock across concurrent orders.', codeSnippet: `const reserved = await inventoryService.reserveItems(items);` },
          { stepNumber: 3, nodeId: 'node-payment', title: '3. Payment Gateway Charge', explanation: 'External HTTP API invocation to payment gateway for transaction authorization.', codeSnippet: `const payment = await paymentGateway.charge({...});` },
          { stepNumber: 4, nodeId: 'node-db-order', title: '4. DB State Update', explanation: 'Marks order status as CONFIRMED in relational database.', codeSnippet: `await db.orders.updateStatus(orderId, 'CONFIRMED');` },
          { stepNumber: 5, nodeId: 'node-eventbus', title: '5. Async Event Broadcast', explanation: 'Dispatches Kafka/RabbitMQ message triggering fulfillment and shipping notifications.', codeSnippet: `await eventBus.publish('ORDER_COMPLETED', {...});` }
        ]
      }
    ],
    audit: {
      summary: 'Distributed transaction warning: Missing saga rollback pattern if payment fails post-inventory reservation.',
      overallScore: 78,
      items: [
        {
          id: 'audit-order-1',
          targetNodeId: 'node-checkout',
          category: 'maintainability',
          severity: 'high',
          title: 'Missing Distributed Saga Compensation',
          description: 'If payment fails in step 3, reserved inventory is not released, leading to orphaned stock locks.',
          recommendation: 'Implement try/catch block with explicit inventory unreserve compensation step.'
        }
      ]
    }
  }
];
