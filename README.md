# Database Connection Tutorial

A comprehensive Next.js application demonstrating how to connect and work with both SQL (Supabase) and NoSQL (MongoDB) databases.

## 🎯 Learning Objectives

This project teaches you:
- How to connect to SQL and NoSQL databases
- Similarities and differences between database types
- Best practices for database operations
- Real-world database patterns and approaches
- Environment variable management
- API route creation for database operations

## 🏗️ Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── supabase/users/     # SQL database API routes
│   │   └── mongodb/users/      # NoSQL database API routes
│   ├── page.tsx                # Main tutorial interface
│   └── layout.tsx
├── lib/
│   ├── supabase.ts            # SQL database connection
│   └── mongodb.ts             # NoSQL database connection
├── scripts/
│   └── supabase-setup.sql     # SQL table creation script
└── components/ui/             # UI components
\`\`\`

## 🚀 Getting Started

### 1. Clone and Install

\`\`\`bash
git clone <your-repo>
cd database-tutorial
npm install
\`\`\`

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local` and fill in your database credentials:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Set Up Supabase (SQL Database)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key to `.env.local`
3. Run the SQL script in `scripts/supabase-setup.sql` in your Supabase SQL editor

### 4. Set Up MongoDB (NoSQL Database)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a cluster
2. Create a database user and get your connection string
3. Add the connection string to `.env.local`

### 5. Run the Application

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the tutorial in action!

## 📚 Key Concepts Covered

### Database Connections

**SQL (Supabase):**
\`\`\`typescript
// Client initialization
const supabase = createClient(url, key)

// Query data
const { data } = await supabase.from('users').select()

// Insert data
const { data } = await supabase.from('users').insert({ name, email, age })
\`\`\`

**NoSQL (MongoDB):**
\`\`\`typescript
// Client initialization
const client = new MongoClient(uri)
await client.connect()

// Query data
const users = await collection.find({}).toArray()

// Insert data
const result = await collection.insertOne({ name, email, age })
\`\`\`

### Similarities Between Databases

1. **Client Initialization**: Both require setting up a connection
2. **CRUD Operations**: Create, Read, Update, Delete work similarly
3. **Async Operations**: Both use promises/async-await
4. **Connection Pooling**: Both manage connections efficiently
5. **Environment Variables**: Both use secure credential storage

### Key Differences

| Aspect | SQL (Supabase) | NoSQL (MongoDB) |
|--------|----------------|-----------------|
| Data Structure | Tables with rows | Collections with documents |
| Schema | Fixed schema required | Flexible, dynamic schema |
| Relationships | JOINs between tables | Embedded documents |
| Query Language | SQL | Method chaining |
| ACID Compliance | Full ACID support | Eventual consistency |
| Scaling | Vertical scaling | Horizontal scaling |

## 🛠️ Real-World Best Practices

### Connection Management
- Use connection pooling
- Implement singleton pattern for clients
- Handle connection errors gracefully
- Cache connections in serverless environments

### Security
- Store credentials in environment variables
- Use Row Level Security (RLS) in Supabase
- Implement proper authentication
- Validate input data

### Performance
- Create appropriate indexes
- Use connection pooling
- Implement caching strategies
- Monitor query performance

### Error Handling
- Wrap database operations in try-catch
- Provide meaningful error messages
- Log errors for debugging
- Implement retry logic for transient failures

## 🔧 API Routes Structure

The project includes RESTful API routes for both databases:

- `GET /api/supabase/users` - Fetch all users from SQL database
- `POST /api/supabase/users` - Create user in SQL database
- `DELETE /api/supabase/users/[id]` - Delete user from SQL database
- `GET /api/mongodb/users` - Fetch all users from NoSQL database
- `POST /api/mongodb/users` - Create user in NoSQL database
- `DELETE /api/mongodb/users/[id]` - Delete user from NoSQL database

## 📖 Learning Path

1. **Start with the UI**: Explore the main page to understand the differences
2. **Examine Connection Files**: Study `lib/supabase.ts` and `lib/mongodb.ts`
3. **Review API Routes**: Understand how CRUD operations work
4. **Run the SQL Script**: See how SQL tables are created
5. **Experiment**: Try adding new fields, tables, or operations

## 🤝 Contributing

This is an educational project. Feel free to:
- Add more database examples
- Improve error handling
- Add more CRUD operations
- Enhance the UI
- Add more detailed comments

## 📝 License

This project is for educational purposes. Use it to learn and teach others about database connections!
