"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useDrivers } from "@/hooks/useDashboard"
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
import { Loader2, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, User, MapPin, Car, Star, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api"
import AdminLayout from "@/components/admin-layout"

interface Driver {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    profileImage?: {
      url: string;
      publicId: string;
    };
  };
  vehicleType: string;
  vehicleModel: string;
  vehicleColor: string;
  licensePlate: string;
  licenseNumber: string;
  address?: string;
  isAvailable: boolean;
  isOnline: boolean;
  rating: number;
  totalTrips: number;
  status: 'pending' | 'approved' | 'suspended' | 'rejected';
  totalEarnings: number;
  pendingEarnings: number;
  createdAt: string;
  updatedAt: string;
}

export default function RidersPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [onlineFilter, setOnlineFilter] = useState("all")
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingDriver, setDeletingDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch drivers with filters
  const { drivers, pagination, loading: driversLoading, error: driversError, refetch } = useDrivers({
    page: 1,
    limit: 50,
    search: searchTerm,
    status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
    isOnline: onlineFilter === "true" ? true : onlineFilter === "false" ? false : undefined
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500"
      case "pending":
        return "bg-amber-500"
      case "suspended":
        return "bg-red-500"
      case "rejected":
        return "bg-gray-500"
      default:
        return "bg-slate-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-emerald-500 text-white">Approved</Badge>
      case "pending":
        return <Badge className="bg-amber-500 text-white">Pending</Badge>
      case "suspended":
        return <Badge className="bg-red-500 text-white">Suspended</Badge>
      case "rejected":
        return <Badge className="bg-gray-500 text-white">Rejected</Badge>
      default:
        return <Badge className="bg-slate-500 text-white">{status}</Badge>
    }
  }

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver)
    setIsEditDialogOpen(true)
  }

  const handleDeleteDriver = (driver: Driver) => {
    setDeletingDriver(driver)
    setIsDeleteDialogOpen(true)
  }

  const handleUpdateDriver = async (updatedData: Partial<Driver>) => {
    if (!editingDriver) return

    setLoading(true)
    setError("")

    try {
      const response = await apiClient.request(`/drivers/${editingDriver._id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      })

      if (response.success) {
        setIsEditDialogOpen(false)
        setEditingDriver(null)
        refetch()
      } else {
        setError(response.message || 'Failed to update driver')
      }
    } catch (err) {
      setError('An error occurred while updating the driver')
      console.error('Update driver error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDriverStatus = async (driverId: string, status: string, suspensionReason?: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await apiClient.request(`/drivers/${driverId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, suspensionReason })
      })

      if (response.success) {
        refetch()
      } else {
        setError(response.message || 'Failed to update driver status')
      }
    } catch (err) {
      setError('An error occurred while updating driver status')
      console.error('Update status error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDriverConfirm = async () => {
    if (!deletingDriver) return

    setLoading(true)
    setError("")

    try {
      const response = await apiClient.request(`/drivers/${deletingDriver._id}`, {
        method: 'DELETE'
      })

      if (response.success) {
        setIsDeleteDialogOpen(false)
        setDeletingDriver(null)
        refetch()
      } else {
        setError(response.message || 'Failed to delete driver')
      }
    } catch (err) {
      setError('An error occurred while deleting the driver')
      console.error('Delete driver error:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredDrivers = drivers?.filter((driver: Driver) => {
    const matchesSearch = !searchTerm || 
      driver.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licensePlate.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  }) || []

  return (
    <AdminLayout 
      title="Riders Management" 
      description="Manage your drivers and their information"
    >
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="flex items-center justify-end">
          <Badge variant="outline" className="text-sm">
            {pagination?.totalDrivers || 0} Total Drivers
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
                  placeholder="Search drivers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="online">Online Status</Label>
              <Select value={onlineFilter} onValueChange={setOnlineFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All drivers</SelectItem>
                  <SelectItem value="true">Online</SelectItem>
                  <SelectItem value="false">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                onClick={refetch}
                disabled={driversLoading}
                className="w-full"
              >
                {driversLoading ? (
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

      {/* Drivers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Drivers</CardTitle>
          <CardDescription>
            Showing {filteredDrivers.length} of {pagination?.totalDrivers || 0} drivers
          </CardDescription>
        </CardHeader>
        <CardContent>
          {driversLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading drivers...</span>
            </div>
          ) : driversError ? (
            <Alert variant="destructive">
              <AlertDescription>
                Error loading drivers: {driversError}
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
                    <TableHead>Driver</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Online</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Trips</TableHead>
                    <TableHead>Earnings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDrivers.map((driver: Driver) => (
                    <TableRow key={driver._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage 
                              src={driver.userId.profileImage?.url || "/placeholder.svg"} 
                              alt={driver.userId.fullName} 
                            />
                            <AvatarFallback>
                              {driver.userId.fullName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{driver.userId.fullName}</div>
                            <div className="text-sm text-gray-500">{driver.userId.email}</div>
                            <div className="text-sm text-gray-500">{driver.userId.phoneNumber}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Car className="h-4 w-4 mr-1" />
                            {driver.vehicleType} - {driver.vehicleModel}
                          </div>
                          <div className="text-sm text-gray-500">
                            {driver.vehicleColor} • {driver.licensePlate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(driver.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`h-2 w-2 rounded-full mr-2 ${driver.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          <span className="text-sm">{driver.isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>{driver.rating.toFixed(1)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{driver.totalTrips}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${driver.totalEarnings.toLocaleString()}
                          </div>
                          {driver.pendingEarnings > 0 && (
                            <div className="text-xs text-amber-600">
                              ${driver.pendingEarnings.toLocaleString()} pending
                            </div>
                          )}
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
                            <DropdownMenuItem onClick={() => handleEditDriver(driver)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Driver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateDriverStatus(driver._id, 'approved')}
                              disabled={driver.status === 'approved'}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleUpdateDriverStatus(driver._id, 'suspended')}
                              disabled={driver.status === 'suspended'}
                            >
                              <User className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDriver(driver)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
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

      {/* Edit Driver Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Driver</DialogTitle>
            <DialogDescription>
              Update driver information and settings
            </DialogDescription>
          </DialogHeader>
          {editingDriver && (
            <EditDriverForm 
              driver={editingDriver}
              onSave={handleUpdateDriver}
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
            <DialogTitle>Delete Driver</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this driver? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deletingDriver && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium">{deletingDriver.userId.fullName}</div>
                <div className="text-sm text-gray-500">{deletingDriver.userId.email}</div>
                <div className="text-sm text-gray-500">{deletingDriver.licensePlate}</div>
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
                  onClick={handleDeleteDriverConfirm}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete Driver
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

// Edit Driver Form Component
interface EditDriverFormProps {
  driver: Driver;
  onSave: (data: Partial<Driver>) => void;
  onCancel: () => void;
  loading: boolean;
}

function EditDriverForm({ driver, onSave, onCancel, loading }: EditDriverFormProps) {
  const [formData, setFormData] = useState({
    vehicleType: driver.vehicleType,
    vehicleModel: driver.vehicleModel,
    vehicleColor: driver.vehicleColor,
    licensePlate: driver.licensePlate,
    licenseNumber: driver.licenseNumber,
    address: driver.address || '',
    isAvailable: driver.isAvailable,
    isOnline: driver.isOnline
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleType">Vehicle Type</Label>
          <Input
            id="vehicleType"
            value={formData.vehicleType}
            onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vehicleModel">Vehicle Model</Label>
          <Input
            id="vehicleModel"
            value={formData.vehicleModel}
            onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vehicleColor">Vehicle Color</Label>
          <Input
            id="vehicleColor"
            value={formData.vehicleColor}
            onChange={(e) => setFormData({ ...formData, vehicleColor: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber}
          onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          rows={3}
        />
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
