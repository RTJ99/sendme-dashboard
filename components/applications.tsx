"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useDrivers } from "@/hooks/useDashboard"
import {
  Bell,
  Calendar,
  Clock,
  FileText,
  Filter,
  Home,
  Package,
  Search,
  Settings,
  Users,
  X,
  Check,
  XCircle,
  CreditCard,
  UserCheck,
  UserX,
  Shield,
  Car,
  Star,
  DollarSign,
  MapPin,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function Applications() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("newest")
  const [currentTab, setCurrentTab] = useState("all")

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // Fetch drivers data
  const { drivers, loading: driversLoading, error: driversError, refetch } = useDrivers({
    page: 1,
    limit: 50,
    search: searchQuery,
  })

  // Handle filtering based on verification status
  const filteredDrivers = drivers?.filter((driver: any) => {
    // Filter by tab based on verification status
    if (currentTab === "pending") {
      return !driver.userId?.isVerified
    } else if (currentTab === "approved") {
      return driver.userId?.isVerified
    }
    // "all" tab shows all drivers
    return true
  }) || []

  // Calculate status counts
  const statusCounts = {
    all: drivers?.length || 0,
    pending: drivers?.filter((driver: any) => !driver.userId?.isVerified).length || 0,
    approved: drivers?.filter((driver: any) => driver.userId?.isVerified).length || 0,
  }

  const getVerificationStatus = (isVerified: boolean) => {
    return isVerified ? "verified" : "pending"
  }

  const getVerificationColor = (isVerified: boolean) => {
    return isVerified ? "bg-emerald-500" : "bg-amber-500"
  }

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <UserCheck className="mr-2 h-4 w-4 text-emerald-500" />
    ) : (
      <Clock className="mr-2 h-4 w-4 text-amber-500" />
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-500"
    if (rating >= 3.5) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#32443E] text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/">
              <img src="/images/sendme-logo.png" alt="SendMe Logo" className="h-8" />
            </Link>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden text-white hover:bg-[#3a5049]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
              asChild
            >
              <Link href="/">
                <Home className="mr-3 h-5 w-5" />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
              asChild
            >
              <Link href="/riders">
                <Users className="mr-3 h-5 w-5" />
                Riders
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start bg-[#86E30F] text-[#32443E] hover:bg-[#a1ff3a]"
              asChild
            >
              <Link href="/applications">
                <FileText className="mr-3 h-5 w-5" />
                Applications
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
              asChild
            >
              <Link href="/payments">
                <CreditCard className="mr-3 h-5 w-5" />
                Payments
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
              asChild
            >
              <Link href="/referrals">
                <Users className="mr-3 h-5 w-5" />
                Referrals
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
              asChild
            >
              <Link href="/inventory">
                <Package className="mr-3 h-5 w-5" />
                Inventory
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
              asChild
            >
              <Link href="/settings">
                <Settings className="mr-3 h-5 w-5" />
                Settings
              </Link>
            </Button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search drivers..."
                  className="w-full rounded-md border pl-8 md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="mr-2">
                <Calendar className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Applications Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Driver Applications</h1>
                <p className="text-gray-600">Manage and verify driver applications</p>
              </div>
              <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                <FileText className="mr-2 h-4 w-4" />
                Export Drivers
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.all}</div>
                  <div className="rounded-full bg-gray-100 p-2">
                    <Users className="h-5 w-5 text-[#32443E]" />
                  </div>
                </div>
                <Progress value={100} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.pending}</div>
                  <div className="rounded-full bg-amber-100 p-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <Progress
                  value={statusCounts.all > 0 ? (statusCounts.pending / statusCounts.all) * 100 : 0}
                  className="mt-2 h-2"
                  indicatorClassName="bg-amber-500"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Verified Drivers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.approved}</div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <UserCheck className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <Progress
                  value={statusCounts.all > 0 ? (statusCounts.approved / statusCounts.all) * 100 : 0}
                  className="mt-2 h-2"
                  indicatorClassName="bg-emerald-500"
                />
              </CardContent>
            </Card>
          </div>

          {/* Drivers Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle>Driver List</CardTitle>
                  <CardDescription>Manage all driver applications and verifications</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </div>
              </div>

              <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
                  <TabsTrigger value="approved">Verified ({statusCounts.approved})</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              {driversLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#32443E] mx-auto mb-2"></div>
                    <p className="text-gray-500">Loading drivers...</p>
                  </div>
                </div>
              ) : driversError ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-center text-red-500">
                    <p>Error loading drivers: {driversError}</p>
                    <Button onClick={() => refetch()} className="mt-2" variant="outline">
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Driver</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No drivers found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDrivers.map((driver: any) => (
                        <TableRow key={driver._id}>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="mr-2 h-8 w-8">
                                <AvatarImage 
                                  src={driver.userId?.profileImage?.url || "/placeholder.svg"} 
                                  alt={driver.userId?.fullName || "Driver"} 
                                />
                                <AvatarFallback>
                                  {(driver.userId?.fullName || "D").charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{driver.userId?.fullName || "Unknown Driver"}</div>
                                <div className="text-xs text-gray-500">{driver.userId?.email || "No email"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Car className="mr-2 h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium">{driver.vehicleType} - {driver.vehicleModel}</div>
                                <div className="text-xs text-gray-500">{driver.licensePlate}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                              {driver.address || "Not specified"}
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(driver.createdAt)}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`mr-2 h-2 w-2 rounded-full ${getVerificationColor(driver.userId?.isVerified)}`}></div>
                              <span className="capitalize">{getVerificationStatus(driver.userId?.isVerified)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Star className="mr-1 h-4 w-4 text-yellow-500" />
                              <span className={`font-medium ${getRatingColor(driver.rating || 0)}`}>
                                {driver.rating ? driver.rating.toFixed(1) : "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  Review
                                </Button>
                              </DialogTrigger>
                            <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Driver Review: {driver.userId?.fullName || "Unknown Driver"}</DialogTitle>
                                <DialogDescription>
                                  Review and verify {driver.userId?.fullName || "this driver"}&apos;s application
                                </DialogDescription>
                              </DialogHeader>

                              <div className="mt-4 space-y-6">
                                {/* Driver Info */}
                                <div>
                                  <h3 className="mb-3 text-lg font-semibold">Driver Information</h3>
                                  <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="mb-4 flex items-center">
                                      <Avatar className="mr-4 h-12 w-12">
                                        <AvatarImage
                                          src={driver.userId?.profileImage?.url || "/placeholder.svg"}
                                          alt={driver.userId?.fullName || "Driver"}
                                        />
                                        <AvatarFallback>
                                          {(driver.userId?.fullName || "D").charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <div className="text-lg font-semibold">{driver.userId?.fullName || "Unknown Driver"}</div>
                                        <div className="flex items-center">
                                          <div
                                            className={`mr-2 h-2 w-2 rounded-full ${getVerificationColor(
                                              driver.userId?.isVerified,
                                            )}`}
                                          ></div>
                                          <span className="capitalize">{getVerificationStatus(driver.userId?.isVerified)}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="grid gap-3 md:grid-cols-2">
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Email Address</div>
                                        <div>{driver.userId?.email || "No email"}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Phone Number</div>
                                        <div>{driver.userId?.phoneNumber || "No phone"}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Location</div>
                                        <div>{driver.address || "Not specified"}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Date Joined</div>
                                        <div>{formatDate(driver.createdAt)}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Vehicle Info */}
                                <div>
                                  <h3 className="mb-3 text-lg font-semibold">Vehicle Information</h3>
                                  <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Vehicle Type</div>
                                        <div className="font-semibold">{driver.vehicleType || "Not specified"}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Vehicle Model</div>
                                        <div>{driver.vehicleModel || "Not specified"}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">License Plate</div>
                                        <div>{driver.licensePlate || "Not specified"}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Vehicle Year</div>
                                        <div>{driver.vehicleYear || "Not specified"}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Performance Stats */}
                                <div>
                                  <h3 className="mb-3 text-lg font-semibold">Performance Statistics</h3>
                                  <div className="rounded-lg bg-gray-50 p-4">
                                    <div className="grid gap-3 md:grid-cols-2">
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Rating</div>
                                        <div className="flex items-center">
                                          <Star className="mr-1 h-4 w-4 text-yellow-500" />
                                          <span className={`font-semibold ${getRatingColor(driver.rating || 0)}`}>
                                            {driver.rating ? driver.rating.toFixed(1) : "N/A"}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Total Trips</div>
                                        <div className="font-semibold">{driver.totalTrips || 0}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Total Earnings</div>
                                        <div className="font-semibold">${(driver.totalEarnings || 0).toLocaleString()}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-500">Pending Earnings</div>
                                        <div className="font-semibold">${(driver.pendingEarnings || 0).toLocaleString()}</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <Separator />

                                {/* Verification Actions */}
                                {!driver.userId?.isVerified && (
                                  <div>
                                    <h3 className="mb-3 text-lg font-semibold">Verification Actions</h3>
                                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                                      <Button variant="outline" className="border-red-500 text-red-500">
                                        <UserX className="mr-2 h-4 w-4" />
                                        Reject Driver
                                      </Button>
                                      <Button variant="outline">Request More Information</Button>
                                      <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                                        <UserCheck className="mr-2 h-4 w-4" />
                                        Verify Driver
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <strong>{filteredDrivers.length}</strong> of <strong>{statusCounts.all}</strong>{" "}
                drivers
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={filteredDrivers.length < 10}>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  )
}
