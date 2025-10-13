"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useUsers } from "@/hooks/useDashboard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, User, UserCheck, UserX, Shield, Mail, Phone, Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api"
import AdminLayout from "@/components/admin-layout"

interface User {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: 'admin' | 'driver' | 'client';
  isVerified: boolean;
  profileImage?: {
    url: string;
    publicId: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [verificationFilter, setVerificationFilter] = useState("all")
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null)

  // Fetch users with filters
  const { users, pagination, loading: usersLoading, error: usersError, refetch } = useUsers({
    page: 1,
    limit: 50,
    search: searchTerm,
    role: roleFilter !== "all" ? roleFilter : undefined
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500"
      case "driver":
        return "bg-blue-500"
      case "client":
        return "bg-gray-500"
      default:
        return "bg-slate-500"
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-red-500 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case "driver":
        return (
          <Badge className="bg-blue-500 text-white">
            <UserCheck className="w-3 h-3 mr-1" />
            Driver
          </Badge>
        )
      case "client":
        return (
          <Badge className="bg-gray-500 text-white">
            <User className="w-3 h-3 mr-1" />
            User
          </Badge>
        )
      default:
        return <Badge className="bg-slate-500 text-white">{role}</Badge>
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setDeletingUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleUpdateUser = async (updatedData: Partial<User>) => {
    if (!editingUser) return

    setLoading(true)
    setError("")

    try {
      const response = await apiClient.request(`/users/${editingUser._id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      })

      if (response.success) {
        setIsEditDialogOpen(false)
        setEditingUser(null)
        refetch()
      } else {
        setError(response.message || 'Failed to update user')
      }
    } catch (err) {
      setError('An error occurred while updating the user')
      console.error('Update user error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setRoleUpdateLoading(userId)
    try {
      const response = await apiClient.updateUserRole(userId, newRole)
      if (response.success) {
        refetch()
      } else {
        setError(response.message || 'Failed to update user role')
      }
    } catch (err) {
      setError('An error occurred while updating user role')
      console.error('Update role error:', err)
    } finally {
      setRoleUpdateLoading(null)
    }
  }

  const handleDeleteUserConfirm = async () => {
    if (!deletingUser) return

    setLoading(true)
    setError("")

    try {
      const response = await apiClient.request(`/users/${deletingUser._id}`, {
        method: 'DELETE'
      })

      if (response.success) {
        setIsDeleteDialogOpen(false)
        setDeletingUser(null)
        refetch()
      } else {
        setError(response.message || 'Failed to delete user')
      }
    } catch (err) {
      setError('An error occurred while deleting the user')
      console.error('Delete user error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users?.filter((user: User) => {
    const matchesSearch = !searchTerm || 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesVerification = verificationFilter === "all" || 
      (verificationFilter === "verified" && user.isVerified) ||
      (verificationFilter === "unverified" && !user.isVerified)
    
    return matchesSearch && matchesVerification
  }) || []

  return (
    <AdminLayout 
      title="Users Management" 
      description="Manage all users, their roles, and account information"
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="flex items-center justify-end space-x-4">
          <Badge variant="outline" className="text-sm">
            {pagination?.totalUsers || 0} Total Users
          </Badge>
          <Badge variant="outline" className="text-sm">
            {users?.filter(u => u.role === 'client').length || 0} Regular Users
          </Badge>
          <Badge variant="outline" className="text-sm">
            {users?.filter(u => u.role === 'driver').length || 0} Drivers
          </Badge>
          <Badge variant="outline" className="text-sm">
            {users?.filter(u => u.isVerified).length || 0} Verified
          </Badge>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={() => setError("")}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    <SelectItem value="client">Users</SelectItem>
                    <SelectItem value="driver">Drivers</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification">Verification</Label>
                <Select value={verificationFilter} onValueChange={setVerificationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All users" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All users</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button 
                  variant="outline" 
                  onClick={refetch}
                  disabled={usersLoading}
                  className="w-full"
                >
                  {usersLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Filter className="h-4 w-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Showing {filteredUsers.length} of {pagination?.totalUsers || 0} users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <span>Loading users...</span>
              </div>
            ) : usersError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Error loading users: {usersError}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={refetch}
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: User) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage 
                                src={user.profileImage?.url || "/placeholder.svg"} 
                                alt={user.fullName} 
                              />
                              <AvatarFallback>
                                {user.fullName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getRoleBadge(user.role)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm">
                              <Mail className="h-4 w-4 mr-1" />
                              {user.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 mr-1" />
                              {user.phoneNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {user.isVerified ? (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 border-amber-600">
                                <UserX className="w-3 h-3 mr-1" />
                                Unverified
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit User
                              </DropdownMenuItem>
                              {user.role === 'client' && (
                                <DropdownMenuItem 
                                  onClick={() => handleRoleUpdate(user._id, 'driver')}
                                  disabled={roleUpdateLoading === user._id}
                                >
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  {roleUpdateLoading === user._id ? 'Updating...' : 'Make Driver'}
                                </DropdownMenuItem>
                              )}
                              {user.role === 'driver' && (
                                <DropdownMenuItem 
                                  onClick={() => handleRoleUpdate(user._id, 'client')}
                                  disabled={roleUpdateLoading === user._id}
                                >
                                  <UserX className="mr-2 h-4 w-4" />
                                  {roleUpdateLoading === user._id ? 'Updating...' : 'Make User'}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit User Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and settings
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <EditUserForm 
                user={editingUser}
                onSave={handleUpdateUser}
                onCancel={() => setIsEditDialogOpen(false)}
                loading={loading}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {deletingUser && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="font-medium">{deletingUser.fullName}</div>
                  <div className="text-sm text-gray-500">{deletingUser.email}</div>
                  <div className="text-sm text-gray-500">{deletingUser.phoneNumber}</div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDeleteDialogOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteUserConfirm}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete User
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}

// Edit User Form Component
interface EditUserFormProps {
  user: User;
  onSave: (data: Partial<User>) => void;
  onCancel: () => void;
  loading: boolean;
}

function EditUserForm({ user, onSave, onCancel, loading }: EditUserFormProps) {
  const [formData, setFormData] = useState({
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    isVerified: user.isVerified
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isVerified"
          checked={formData.isVerified}
          onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="isVerified">Verified Account</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Save Changes
        </Button>
      </div>
    </form>
  )
}
