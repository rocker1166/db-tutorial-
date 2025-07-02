"use client"

import { useState, useCallback, useEffect, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Database, Leaf, Plus, Search, Trash2 } from "lucide-react"

interface User {
  id?: string
  _id?: string
  name: string
  email: string
  age: number
  created_at?: string
  createdAt?: string
}

// Memoized UserForm component to prevent unnecessary re-renders
const UserForm = memo(function UserForm({
  database,
  newUser,
  setNewUser,
  loading,
  createUser,
  fetchUsers
}: {
  database: "supabase" | "mongodb"
  newUser: { name: string; email: string; age: string }
  setNewUser: (user: { name: string; email: string; age: string }) => void
  loading: boolean
  createUser: (database: "supabase" | "mongodb") => void
  fetchUsers: (database: "supabase" | "mongodb") => void
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor={`name-${database}`}>Name</Label>
          <Input
            id={`name-${database}`}
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Enter name"
          />
        </div>
        <div>
          <Label htmlFor={`email-${database}`}>Email</Label>
          <Input
            id={`email-${database}`}
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Enter email"
          />
        </div>
        <div>
          <Label htmlFor={`age-${database}`}>Age</Label>
          <Input
            id={`age-${database}`}
            type="number"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
            placeholder="Enter age"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => createUser(database)} disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
        <Button variant="outline" onClick={() => fetchUsers(database)} disabled={loading}>
          <Search className="w-4 h-4 mr-2" />
          Fetch Users
        </Button>
      </div>
    </div>
  )
})

export default function DatabaseTutorial() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", age: "" })
  const [activeTab, setActiveTab] = useState<"supabase" | "mongodb">("supabase")

  // Fetch users when tab changes
  useEffect(() => {
    fetchUsers(activeTab)
  }, [activeTab])

  // Generic function to fetch users from either database
  const fetchUsers = useCallback(async (database: "supabase" | "mongodb") => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${database}/users`)
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error(`Error fetching users from ${database}:`, error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Generic function to create user in either database
  const createUser = useCallback(
    async (database: "supabase" | "mongodb") => {
      if (!newUser.name || !newUser.email || !newUser.age) {
        alert("Please fill all fields")
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/${database}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newUser.name,
            email: newUser.email,
            age: Number.parseInt(newUser.age),
          }),
        })

        if (response.ok) {
          setNewUser({ name: "", email: "", age: "" })
          fetchUsers(database) // Refresh the list
        }
      } catch (error) {
        console.error(`Error creating user in ${database}:`, error)
      } finally {
        setLoading(false)
      }
    },
    [newUser, fetchUsers]
  )

  // Generic function to delete user from either database
  const deleteUser = useCallback(async (database: "supabase" | "mongodb", userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/${database}/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchUsers(database) // Refresh the list
      }
    } catch (error) {
      console.error(`Error deleting user from ${database}:`, error)
    } finally {
      setLoading(false)
    }
  }, [fetchUsers])

  const UserList = useCallback(({ database }: { database: "supabase" | "mongodb" }) => (
    <div className="space-y-2">
      {users.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No users found. Add some users or fetch from database.</p>
      ) : (
        users.map((user) => (
          <div key={user.id || user._id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">
                {user.email} • Age: {user.age}
              </p>
              <p className="text-xs text-muted-foreground">Created: {user.created_at || user.createdAt}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteUser(database, user.id || user._id!)}
              disabled={loading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))
      )}
    </div>
  ), [users, loading, deleteUser])

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Database Connection Tutorial</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Learn how to connect and work with SQL (Supabase) and NoSQL (MongoDB) databases
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Database className="w-4 h-4 mr-1" />
            SQL Database (Supabase)
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Leaf className="w-4 h-4 mr-1" />
            NoSQL Database (MongoDB)
          </Badge>
        </div>
      </div>

      <Tabs 
        defaultValue="supabase" 
        className="w-full"
        onValueChange={(value) => setActiveTab(value as "supabase" | "mongodb")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="supabase" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Supabase (SQL)
          </TabsTrigger>
          <TabsTrigger value="mongodb" className="flex items-center gap-2">
            <Leaf className="w-4 h-4" />
            MongoDB (NoSQL)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supabase">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Supabase (PostgreSQL) - SQL Database
              </CardTitle>
              <CardDescription>
                Supabase is a PostgreSQL database with real-time features. It uses structured tables with defined
                schemas. Perfect for applications requiring ACID compliance and complex relationships.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserForm 
                database="supabase"
                newUser={newUser}
                setNewUser={setNewUser}
                loading={loading}
                createUser={createUser}
                fetchUsers={fetchUsers}
              />
              <UserList database="supabase" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mongodb">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                MongoDB - NoSQL Database
              </CardTitle>
              <CardDescription>
                MongoDB is a document-based NoSQL database that stores data in flexible, JSON-like documents. Great for
                applications with evolving schemas and rapid development.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <UserForm 
                database="mongodb"
                newUser={newUser}
                setNewUser={setNewUser}
                loading={loading}
                createUser={createUser}
                fetchUsers={fetchUsers}
              />
              <UserList database="mongodb" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Key Similarities & Differences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-600">Similarities</h3>
              <ul className="space-y-2 text-sm">
                <li>• Both require client initialization</li>
                <li>• Both support CRUD operations</li>
                <li>• Both can handle async operations</li>
                <li>• Both provide connection pooling</li>
                <li>• Both support indexing for performance</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-600">Key Differences</h3>
              <ul className="space-y-2 text-sm">
                <li>• SQL uses structured tables vs NoSQL uses documents</li>
                <li>• SQL requires predefined schema vs NoSQL is schema-flexible</li>
                <li>• SQL uses JOIN operations vs NoSQL uses embedded documents</li>
                <li>• SQL is ACID compliant vs NoSQL prioritizes availability</li>
                <li>• SQL uses SQL query language vs NoSQL uses method chaining</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}