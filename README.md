# Open API Toolkit

A modular toolkit for creating and managing API connections with a Next.js-based server interface. This project provides a framework for building extensible API connectors that can interact with various services like Google Calendar, Gmail, Drive, Tasks, and Contacts.

## 🏗️ Architecture

The project is organized into four main modules:

- **server/** - Next.js web application with UI for managing connections
- **connections/** - Connector implementations (e.g., Google services)
- **types/** - Shared TypeScript type definitions
- **prisma/** - Database schema and client for storing connection configurations

## ✨ Features

- Extensible connector architecture for integrating with any API
- Built-in Google connector with support for:
  - Gmail (send, search, list, read emails)
  - Google Calendar (create, edit, view, delete events)
  - Google Drive (create, update, move, delete, list files)
  - Google Tasks (create, update, delete, list tasks)
  - Google Contacts (create, update, delete contacts)
- SQLite database for storing connection configurations
- Next.js-based UI with React components
- TypeScript support throughout

## 📋 Prerequisites

- **Node.js** 22 or higher
- **Yarn** package manager
- **Nix** (optional, for development environment)

## 🚀 Setup and Installation

### Option 1: Using Nix (Recommended)

If you have Nix with flakes enabled:

```bash
# Enter the development environment
nix develop

# The shell will automatically set up DATABASE_PATH
```

### Option 2: Manual Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/danhab99/open-api-toolkit.git
   cd open-api-toolkit
   ```

2. **Set up environment variables**
   ```bash
   # Create a database path for Prisma
   export DATABASE_PATH="file:$(pwd)/db"
   ```

3. **Install dependencies**
   ```bash
   # Install dependencies for all modules
   cd types && yarn install && cd ..
   cd prisma && yarn install && cd ..
   cd connections/google && yarn install && cd ../..
   cd server && yarn install && cd ..
   ```

4. **Initialize the database**
   ```bash
   cd prisma
   yarn build
   cd ..
   ```

   This will:
   - Generate the Prisma client
   - Create the SQLite database
   - Apply the schema migrations

## 🖥️ Running the Server

### Development Mode

```bash
cd server
yarn dev
```

The server will start on [http://localhost:3000](http://localhost:3000) with hot-reloading enabled.

### Production Build

```bash
cd server
yarn build
yarn start
```

### Available Scripts

In the `server/` directory:

- `yarn dev` - Start development server with Turbopack
- `yarn build` - Create production build
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn storybook` - Start Storybook on port 6006
- `yarn build-storybook` - Build Storybook

## 🔌 Creating New Connectors

The project uses a modular connector architecture. Here's how to create a new connector based on the existing Google connector:

### Step 1: Create Connector Directory Structure

```bash
mkdir -p connections/your-service/src
cd connections/your-service
```

### Step 2: Initialize Package

Create `package.json`:

```json
{
  "name": "@open-api-connection/your-service",
  "version": "1.0.0",
  "main": "src/index.ts",
  "license": "MIT",
  "dependencies": {
    "open-api-connection-types": "link:../../types",
    "open-api-prisma": "link:../../prisma",
    "typescript": "^5.8.3"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Step 3: Define Connection Configuration

Create `src/index.ts`:

```typescript
import { OpenAPIConnectionDefinition, Tool } from "open-api-connection-types";

// Define your connection with configuration parameters
export const Connection: OpenAPIConnectionDefinition = {
  id: "your-service",
  displayName: "Your Service",
  userDescription: "Connects to Your Service API",
  aiDescription: "Allows tools to interact with Your Service on behalf of the user",
  configurationArguments: [
    {
      id: "apiKey",
      displayName: "API Key",
      userDescription: "Your Service API key",
      aiDescription: "Authentication key for Your Service API",
      type: "string",
    },
    {
      id: "apiUrl",
      displayName: "API URL",
      userDescription: "Base URL for Your Service API",
      aiDescription: "Base endpoint URL for API requests",
      type: "string",
    },
  ],
};

// Export array of tools
export const Tools: Tool[] = [
  // Your tools will go here
];
```

### Step 4: Create Helper Functions

Create `src/lib.ts` for shared utility functions:

```typescript
import { KVP } from "open-api-connection-types";

export function getClient(config: KVP) {
  const { apiKey, apiUrl } = config;
  
  // Initialize and return your API client
  // Example:
  // return new YourServiceClient({
  //   apiKey,
  //   baseUrl: apiUrl,
  // });
}
```

### Step 5: Implement Tools

Create tool files in subdirectories (e.g., `src/resources/create_item.ts`):

```typescript
import { Tool } from "open-api-connection-types";
import { getClient } from "../lib";

export const createItem: Tool = {
  id: "createItem",
  displayName: "Create Item",
  userDescription: "Creates a new item in Your Service",
  aiDescription: "Creates an item with specified properties",
  arguments: [
    {
      id: "name",
      displayName: "Name",
      type: "string",
      userDescription: "Name of the item to create",
      aiDescription: "Item name",
    },
    {
      id: "description",
      displayName: "Description",
      type: "string",
      userDescription: "Description of the item",
      aiDescription: "Item description",
    },
  ],
  async handler(config, args) {
    const client = getClient(config);
    const { name, description } = args;

    try {
      const result = await client.createItem({
        name,
        description,
      });

      return {
        results: {
          id: result.id,
          success: true,
        },
        log: {
          message: `Item created successfully: ${name}`,
          data: result,
        },
      };
    } catch (error) {
      return {
        results: {
          success: false,
        },
        log: {
          message: "Failed to create item",
          data: error,
        },
      };
    }
  },
};
```

### Step 6: Export Tools

Update `src/index.ts` to export your tools:

```typescript
import { createItem } from "./resources/create_item";
import { listItems } from "./resources/list_items";
// ... import other tools

export const Tools: Tool[] = [
  createItem,
  listItems,
  // ... add other tools
];
```

### Step 7: Integrate with Server

Add your connector to the server's `package.json`:

```json
{
  "dependencies": {
    "@open-api-connection/your-service": "file:../connections/your-service"
  }
}
```

Then install:

```bash
cd server
yarn install
```

### Step 8: Register in Server

Import and use your connector in the server application where connections are managed.

## 📁 Project Structure

```
open-api-toolkit/
├── connections/           # Connector implementations
│   └── google/           # Google services connector
│       ├── src/
│       │   ├── calendar/ # Calendar tools
│       │   ├── contacts/ # Contacts tools
│       │   ├── drive/    # Drive tools
│       │   ├── gmail/    # Gmail tools
│       │   ├── tasks/    # Tasks tools
│       │   ├── index.ts  # Connection definition
│       │   └── lib.ts    # Shared utilities
│       └── package.json
├── types/                # Shared TypeScript types
│   └── src/
│       ├── types.ts      # Core type definitions
│       └── index.ts
├── prisma/               # Database schema and client
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   └── src/
│       └── index.ts
├── server/               # Next.js web application
│   ├── src/
│   │   ├── app/         # Next.js app router pages
│   │   ├── components/  # React components
│   │   └── lib/         # Utilities and helpers
│   └── package.json
├── flake.nix            # Nix development environment
└── README.md            # This file
```

## 🔧 Configuration

### Database

The project uses SQLite for storing connection configurations. The database path is controlled by the `DATABASE_PATH` environment variable.

**Schema:**
- **Connection** - Stores API connection configurations (credentials, settings)
- **AuditLog** - Logs of connection activities and tool executions

### Environment Variables

- `DATABASE_PATH` - Path to SQLite database file (e.g., `file:./db`)

## 🛠️ Development

### Type System

The project uses a strongly-typed system for defining connections and tools:

- **OpenAPIConnectionDefinition** - Defines a connector with configuration parameters
- **Tool** - Defines an API operation with arguments and handler
- **ConfigDef** - Configuration parameter definition
- **ToolResult** - Standardized return type for tool handlers

### Adding New Tool to Existing Connector

1. Create a new file in the appropriate subdirectory (e.g., `connections/google/src/calendar/`)
2. Define the tool following the `Tool` type
3. Implement the `handler` function
4. Export the tool from `connections/google/src/index.ts`

Example:
```typescript
export const myNewTool: Tool = {
  id: "myNewTool",
  displayName: "My New Tool",
  userDescription: "Description for users",
  aiDescription: "Description for AI",
  arguments: [/* ... */],
  async handler(config, args) {
    // Implementation
  },
};
```

## 📝 Database Schema

```prisma
model Connection {
  id              Int        @id @default(autoincrement())
  connectionID    String
  config          String     // JSON-encoded configuration
  enable          Boolean
  userDescription String
  aiDescription   String
  displayName     String
  auditLog        AuditLog[]
}

model AuditLog {
  id           Int        @id @default(autoincrement())
  connection   Connection @relation(fields: [connectionID], references: [id])
  connectionID Int
  timestamp    DateTime   @default(now())
  message      String
  data         String     // JSON-encoded data
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Database with [Prisma](https://www.prisma.io/)
- Google APIs integration via [googleapis](https://github.com/googleapis/google-api-nodejs-client)
