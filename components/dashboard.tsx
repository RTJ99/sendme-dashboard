"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useDashboard, useDrivers, useUsers } from "@/hooks/useDashboard"
import { apiClient } from "@/lib/api"
import {
  Filter,
  UserCheck,
  UserX,
  Shield,
  User,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Import the fixed chart components
import { ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import AdminLayout from "@/components/admin-layout"

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [roleUpdateLoading, setRoleUpdateLoading] = useState<string | null>(null)
  const router = useRouter()
  const { user } = useAuth()
  const { stats, notifications, loading, error, refetch } = useDashboard()
  
  // Fetch real driver data for active riders section
  const { drivers, loading: driversLoading, error: driversError, refetch: refetchDrivers } = useDrivers({
    page: 1,
    limit: 10, // Show top 10 drivers
    // No status filter - show all drivers like the riders page
  })

  // Fetch all users (including non-drivers)
  const { users, loading: usersLoading, error: usersError, refetch: refetchUsers } = useUsers({
    page: 1,
    limit: 10, // Show top 10 users
  })

  // Use real data from API or fallback to mock data
  const revenueData = stats?.monthlyRevenue?.map((item: any) => ({
    name: new Date(item._id.year, item._id.month - 1).toLocaleDateString('en-US', { month: 'short' }),
    revenue: item.revenue || 0,
    trips: item.trips || 0
  })) || [
    { name: "Jan", revenue: 4000, trips: 240 },
    { name: "Feb", revenue: 3000, trips: 198 },
    { name: "Mar", revenue: 5000, trips: 280 },
    { name: "Apr", revenue: 4500, trips: 250 },
    { name: "May", revenue: 6000, trips: 320 },
    { name: "Jun", revenue: 5500, trips: 290 },
    { name: "Jul", revenue: 7000, trips: 350 },
  ]

  // Use real driver data from API or fallback to mock data
  const riders = drivers?.map((driver: any) => ({
    id: driver._id,
    name: driver.userId?.fullName || "Unknown Driver",
    location: driver.address || "Location not specified",
    status: driver.status || (driver.isOnline ? "active" : "offline"), // Use actual status from driver data
    trips: driver.totalTrips || 0,
    income: `$${(driver.totalEarnings || 0).toLocaleString()}`,
    paymentStatus: driver.pendingEarnings > 0 ? "pending" : "paid",
    avatar: driver.userId?.profileImage?.url || "/placeholder.svg?height=40&width=40",
    rating: driver.rating || 0,
    vehicleInfo: `${driver.vehicleType} - ${driver.vehicleModel}`,
    licensePlate: driver.licensePlate,
  })) || [
    {
      id: "1",
      name: "Alex Johnson",
      location: "New York",
      status: "active",
      trips: 156,
      income: "$2,450",
      paymentStatus: "paid",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      vehicleInfo: "Bike - City Cruiser",
      licensePlate: "ABC-123",
    },
    {
      id: "2",
      name: "Maria Garcia",
      location: "Chicago",
      status: "active",
      trips: 132,
      income: "$1,980",
      paymentStatus: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.6,
      vehicleInfo: "Bike - Mountain Pro",
      licensePlate: "DEF-456",
    },
    {
      id: "3",
      name: "David Kim",
      location: "Los Angeles",
      status: "suspended",
      trips: 89,
      income: "$1,340",
      paymentStatus: "overdue",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.2,
      vehicleInfo: "Bike - Urban Commuter",
      licensePlate: "GHI-789",
    },
    {
      id: "4",
      name: "Sarah Williams",
      location: "Miami",
      status: "active",
      trips: 201,
      income: "$3,015",
      paymentStatus: "paid",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      vehicleInfo: "Bike - Delivery Max",
      licensePlate: "JKL-012",
    },
    {
      id: "5",
      name: "James Brown",
      location: "Dallas",
      status: "active",
      trips: 178,
      income: "$2,670",
      paymentStatus: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
      vehicleInfo: "Bike - Eco Rider",
      licensePlate: "MNO-345",
    },
  ]

  // Use real data from API or fallback to mock data
  const applications = stats?.recentActivity?.applications?.map((app: any) => ({
    id: app._id,
    name: app.user?.fullName || "Unknown",
    location: app.city || "Unknown",
    date: new Date(app.createdAt).toISOString().split('T')[0],
    status: app.status
  })) || [
    { id: 1, name: "Thomas Lee", location: "Boston", date: "2023-07-15", status: "pending" },
    { id: 2, name: "Emma Wilson", location: "Seattle", date: "2023-07-14", status: "pending" },
    { id: 3, name: "Michael Davis", location: "Austin", date: "2023-07-13", status: "pending" },
  ]

  const inventory = [
    { id: "BK-001", model: "City Cruiser", status: "assigned", assignedTo: "Alex Johnson" },
    { id: "BK-002", model: "Mountain Pro", status: "available", assignedTo: null },
    { id: "BK-003", model: "Urban Commuter", status: "maintenance", assignedTo: null },
    { id: "BK-004", model: "Delivery Max", status: "assigned", assignedTo: "Sarah Williams" },
    { id: "BK-005", model: "Eco Rider", status: "available", assignedTo: null },
  ]


  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
      case "active":
        return "bg-emerald-500"
      case "suspended":
        return "bg-red-500"
      case "pending":
        return "bg-amber-500"
      case "rejected":
        return "bg-gray-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-slate-500"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500"
      case "pending":
        return "bg-amber-500"
      case "overdue":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getInventoryStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500"
      case "assigned":
        return "bg-blue-500"
      case "maintenance":
        return "bg-amber-500"
      default:
        return "bg-slate-500"
    }
  }

  // Handle role updates
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    setRoleUpdateLoading(userId)
    try {
      const response = await apiClient.updateUserRole(userId, newRole)
      if (response.success) {
        // Refresh both users and drivers data
        refetchUsers()
        refetchDrivers()
      }
    } catch (err) {
      console.error('Failed to update user role:', err)
    } finally {
      setRoleUpdateLoading(null)
    }
  }

  // Combine drivers and users for display
  const allUsers = [
    ...(drivers?.map((driver: any) => ({
      id: driver._id,
      name: driver.userId?.fullName || "Unknown Driver",
      email: driver.userId?.email || "",
      phone: driver.userId?.phoneNumber || "",
      location: driver.address || "Location not specified",
      status: driver.status || (driver.isOnline ? "active" : "offline"),
      role: "driver",
      trips: driver.totalTrips || 0,
      income: `$${(driver.totalEarnings || 0).toLocaleString()}`,
      paymentStatus: driver.pendingEarnings > 0 ? "pending" : "paid",
      avatar: driver.userId?.profileImage?.url || "/placeholder.svg?height=40&width=40",
      rating: driver.rating || 0,
      vehicleInfo: `${driver.vehicleType} - ${driver.vehicleModel}`,
      licensePlate: driver.licensePlate,
      isVerified: driver.userId?.isVerified || false,
      createdAt: driver.createdAt,
    })) || []),
    ...(users?.filter((user: any) => user.role !== 'driver' && user.role !== 'admin').map((user: any) => ({
      id: user._id,
      name: user.fullName || "Unknown User",
      email: user.email || "",
      phone: user.phoneNumber || "",
      location: "Not specified",
      status: "inactive",
      role: user.role,
      trips: 0,
      income: "$0",
      paymentStatus: "N/A",
      avatar: user.profileImage?.url || "/placeholder.svg?height=40&width=40",
      rating: 0,
      vehicleInfo: "N/A",
      licensePlate: "N/A",
      isVerified: user.isVerified || false,
      createdAt: user.createdAt,
    })) || [])
  ]

  const filteredRiders = activeFilter === "all" ? allUsers : allUsers.filter((rider) => rider.status === activeFilter)
  const filteredByRole = userRoleFilter === "all" ? filteredRiders : filteredRiders.filter((user) => user.role === userRoleFilter)

  return (
    <AdminLayout 
      title="SendMe Dashboard" 
      description={`Welcome back, ${user?.fullName || "Admin"}. Here's what's happening today.`}
    >

      {error && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading dashboard data: {error}
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
        </div>
      )}

      {driversError && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading drivers data: {driversError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {usersError && (
        <div className="mb-6">
          <Alert variant="destructive">
            <AlertDescription>
              Error loading users data: {usersError}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Key Metrics */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Riders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-[#32443E]">
                {loading ? "..." : stats?.overview?.activeDrivers || 0}
              </div>
              <Badge className="ml-2 bg-[#86E30F] text-[#32443E]">+12%</Badge>
            </div>
            <p className="mt-2 text-xs text-gray-500">Online drivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-[#32443E]">
                {loading ? "..." : stats?.overview?.pendingApplications || 0}
              </div>
              <Badge className="ml-2 bg-amber-500 text-white">New</Badge>
            </div>
            <p className="mt-2 text-xs text-gray-500">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Parcels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-[#32443E]">
                {loading ? "..." : stats?.overview?.totalParcels || 0}
              </div>
              <Badge className="ml-2 bg-[#DCE30F] text-[#32443E]">-5%</Badge>
            </div>
            <p className="mt-2 text-xs text-gray-500">All time deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-[#32443E]">
                {loading ? "..." : `$${(stats?.overview?.totalRevenue || 0).toLocaleString()}`}
              </div>
              <Badge className="ml-2 bg-[#86E30F] text-[#32443E]">+18%</Badge>
            </div>
            <p className="mt-2 text-xs text-gray-500">All time revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trip & Income Analytics</CardTitle>
            <CardDescription>Monthly overview of trips and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full">
              <ChartContainer className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={revenueData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#32443E" />
                    <YAxis yAxisId="right" orientation="right" stroke="#86E30F" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="revenue" fill="#32443E" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="trips" fill="#86E30F" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <ChartLegend className="mt-4 justify-center">
                <ChartLegendItem name="Revenue ($)" color="#32443E" />
                <ChartLegendItem name="Trips" color="#86E30F" />
              </ChartLegend>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Status</CardTitle>
            <CardDescription>Overview of rider payment status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-medium">Paid</div>
                  <div className="text-sm text-gray-500">68%</div>
                </div>
                <Progress value={68} className="h-2 bg-gray-200" indicatorClassName="bg-emerald-500" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-medium">Pending</div>
                  <div className="text-sm text-gray-500">24%</div>
                </div>
                <Progress value={24} className="h-2 bg-gray-200" indicatorClassName="bg-amber-500" />
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <div className="text-sm font-medium">Overdue</div>
                  <div className="text-sm text-gray-500">8%</div>
                </div>
                <Progress value={8} className="h-2 bg-gray-200" indicatorClassName="bg-red-500" />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-4 font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-[#32443E] hover:bg-[#3a5049]">Send Reminders</Button>
                <Button variant="outline" className="border-[#32443E] text-[#32443E]">
                  View All Payments
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users & Drivers Table */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Users & Drivers Overview</CardTitle>
            <CardDescription>Manage all users and drivers, change roles</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="all" onValueChange={setUserRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="driver">Drivers</SelectItem>
                <SelectItem value="client">Users</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {(driversLoading || usersLoading) ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#32443E] mx-auto mb-2"></div>
                <span className="text-gray-500">Loading users and drivers...</span>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User/Driver</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Trips</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredByRole.map((rider) => (
                  <TableRow key={rider.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={rider.avatar || "/placeholder.svg"} alt={rider.name} />
                          <AvatarFallback>
                            {rider.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{rider.name}</div>
                          <div className="text-sm text-gray-500">{rider.email}</div>
                          <div className="text-xs text-gray-400">{rider.phone}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={rider.role === 'driver' ? 'default' : 'secondary'}
                          className={rider.role === 'driver' ? 'bg-blue-500' : 'bg-gray-500'}
                        >
                          {rider.role === 'driver' ? (
                            <>
                              <UserCheck className="w-3 h-3 mr-1" />
                              Driver
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 mr-1" />
                              User
                            </>
                          )}
                        </Badge>
                        {rider.isVerified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{rider.vehicleInfo}</div>
                        <div className="text-xs text-gray-500">{rider.licensePlate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(rider.status)}`}></div>
                        <span className="capitalize">{rider.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{rider.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500 ml-1">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{rider.trips}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{rider.income}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/riders/${rider.id}`}>View Details</Link>
                          </DropdownMenuItem>
                          {rider.role === 'client' && (
                            <DropdownMenuItem 
                              onClick={() => handleRoleUpdate(rider.id, 'driver')}
                              disabled={roleUpdateLoading === rider.id}
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              {roleUpdateLoading === rider.id ? 'Updating...' : 'Make Driver'}
                            </DropdownMenuItem>
                          )}
                          {rider.role === 'driver' && (
                            <DropdownMenuItem 
                              onClick={() => handleRoleUpdate(rider.id, 'client')}
                              disabled={roleUpdateLoading === rider.id}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              {roleUpdateLoading === rider.id ? 'Updating...' : 'Make User'}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Contact User</DropdownMenuItem>
                          {rider.role === 'driver' && (
                            <DropdownMenuItem className="text-red-600">Suspend Driver</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <strong>{filteredByRole.length}</strong> of <strong>{allUsers.length}</strong> users & drivers
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/riders">View All Drivers</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Applications and Inventory */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pending Applications</CardTitle>
            <CardDescription>Recent financing applications awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.location}</TableCell>
                    <TableCell>{new Date(app.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Application Review</SheetTitle>
                            <SheetDescription>
                              Review and approve financing application for {app.name}
                            </SheetDescription>
                          </SheetHeader>
                          <div className="mt-6 space-y-4">
                            <div>
                              <h4 className="mb-2 font-medium">Applicant Information</h4>
                              <div className="rounded-md bg-gray-50 p-3">
                                <p>
                                  <strong>Name:</strong> {app.name}
                                </p>
                                <p>
                                  <strong>Location:</strong> {app.location}
                                </p>
                                <p>
                                  <strong>Applied:</strong> {new Date(app.date).toLocaleDateString()}
                                </p>
                                <p>
                                  <strong>Credit Score:</strong> 720
                                </p>
                                <p>
                                  <strong>Employment:</strong> Full-time
                                </p>
                              </div>
                            </div>
                            <Separator />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Reject</Button>
                              <Button className="bg-[#32443E] hover:bg-[#3a5049]">Approve</Button>
                            </div>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Applications
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bike Inventory</CardTitle>
            <CardDescription>Current bike inventory and assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((bike) => (
                  <TableRow key={bike.id}>
                    <TableCell className="font-medium">{bike.id}</TableCell>
                    <TableCell>{bike.model}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`mr-2 h-2 w-2 rounded-full ${getInventoryStatusColor(bike.status)}`}></div>
                        <span className="capitalize">{bike.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>{bike.assignedTo || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Manage Inventory
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminLayout>
  )
}
