"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Bike,
  Calendar,
  ChevronDown,
  Clock,
  CreditCard,
  FileText,
  Filter,
  Home,
  MapPin,
  Package,
  Search,
  Settings,
  Star,
  Users,
  X,
  Check,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Add these imports at the top with the other imports
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

export default function Riders() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [sortColumn, setSortColumn] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [selectedRider, setSelectedRider] = useState<any>(null)
  const [messageSent, setMessageSent] = useState(false)

  // Add this state to the component, near the other state variables
  const [addRiderDialogOpen, setAddRiderDialogOpen] = useState(false)

  // Add this schema and form logic before the return statement
  // Form validation schema
  const riderFormSchema = z.object({
    firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
    lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    phone: z.string().min(10, { message: "Please enter a valid phone number." }),
    address: z.string().min(5, { message: "Address must be at least 5 characters." }),
    city: z.string().min(2, { message: "City must be at least 2 characters." }),
    state: z.string().min(2, { message: "State must be at least 2 characters." }),
    zipCode: z.string().min(5, { message: "Zip code must be at least 5 characters." }),
    bikeAssignment: z.enum(["none", "city_cruiser", "urban_commuter", "delivery_max", "eco_rider"]),
    status: z.enum(["active", "inactive"]),
    notes: z.string().optional(),
  })

  // Form setup
  const riderForm = useForm<z.infer<typeof riderFormSchema>>({
    resolver: zodResolver(riderFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      bikeAssignment: "none",
      status: "active",
      notes: "",
    },
  })

  // Form submit handler
  const onSubmitRiderForm = (values: z.infer<typeof riderFormSchema>) => {
    // Here you would typically send this data to your API
    console.log(values)

    // Show success message or handle errors
    setAddRiderDialogOpen(false)

    // Reset the form
    riderForm.reset()

    // For demo purposes, we'll just close the dialog
    // In a real app, you might show a success message or redirect
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleMessageRider = (rider: any) => {
    setSelectedRider(rider)
    setMessageDialogOpen(true)
  }

  const handleSendMessage = () => {
    setMessageSent(true)
    setTimeout(() => {
      setMessageDialogOpen(false)
      setMessageSent(false)
    }, 1500)
  }

  // Mock data for riders
  const ridersData = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York",
      address: "123 Broadway Ave, New York, NY 10001",
      joinDate: "2023-01-15",
      status: "active",
      trips: 156,
      rating: 4.8,
      onlineStatus: "online",
      income: {
        total: "$12,450",
        lastMonth: "$2,450",
        pending: "$320",
      },
      paymentStatus: "paid",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: {
        id: "BK-001",
        model: "City Cruiser",
      },
    },
    {
      id: "2",
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      phone: "+1 (555) 234-5678",
      location: "Chicago",
      address: "456 Michigan Ave, Chicago, IL 60601",
      joinDate: "2023-02-10",
      status: "active",
      trips: 132,
      rating: 4.7,
      onlineStatus: "offline",
      income: {
        total: "$9,980",
        lastMonth: "$1,980",
        pending: "$520",
      },
      paymentStatus: "pending",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: {
        id: "BK-004",
        model: "Urban Commuter",
      },
    },
    {
      id: "3",
      name: "David Kim",
      email: "david.kim@example.com",
      phone: "+1 (555) 345-6789",
      location: "Los Angeles",
      address: "789 Sunset Blvd, Los Angeles, CA 90028",
      joinDate: "2023-01-25",
      status: "suspended",
      trips: 89,
      rating: 4.2,
      onlineStatus: "offline",
      income: {
        total: "$6,340",
        lastMonth: "$1,340",
        pending: "$0",
      },
      paymentStatus: "overdue",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: null,
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "+1 (555) 456-7890",
      location: "Miami",
      address: "123 Ocean Drive, Miami, FL 33139",
      joinDate: "2023-03-05",
      status: "active",
      trips: 201,
      rating: 4.9,
      onlineStatus: "online",
      income: {
        total: "$15,015",
        lastMonth: "$3,015",
        pending: "$420",
      },
      paymentStatus: "paid",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: {
        id: "BK-008",
        model: "Delivery Max",
      },
    },
    {
      id: "5",
      name: "James Brown",
      email: "james.brown@example.com",
      phone: "+1 (555) 567-8901",
      location: "Dallas",
      address: "456 Main St, Dallas, TX 75201",
      joinDate: "2023-02-20",
      status: "active",
      trips: 178,
      rating: 4.6,
      onlineStatus: "busy",
      income: {
        total: "$10,670",
        lastMonth: "$2,670",
        pending: "$380",
      },
      paymentStatus: "pending",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: {
        id: "BK-007",
        model: "Urban Commuter",
      },
    },
    {
      id: "6",
      name: "Jennifer Lee",
      email: "jennifer.lee@example.com",
      phone: "+1 (555) 678-9012",
      location: "Seattle",
      address: "789 Pike St, Seattle, WA 98101",
      joinDate: "2023-04-10",
      status: "active",
      trips: 112,
      rating: 4.5,
      onlineStatus: "online",
      income: {
        total: "$8,450",
        lastMonth: "$1,950",
        pending: "$290",
      },
      paymentStatus: "paid",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: {
        id: "BK-012",
        model: "City Cruiser",
      },
    },
    {
      id: "7",
      name: "Robert Wilson",
      email: "robert.wilson@example.com",
      phone: "+1 (555) 789-0123",
      location: "Boston",
      address: "101 Beacon St, Boston, MA 02116",
      joinDate: "2023-03-15",
      status: "inactive",
      trips: 67,
      rating: 4.3,
      onlineStatus: "offline",
      income: {
        total: "$5,230",
        lastMonth: "$0",
        pending: "$0",
      },
      paymentStatus: "paid",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: null,
    },
    {
      id: "8",
      name: "Linda Martinez",
      email: "linda.martinez@example.com",
      phone: "+1 (555) 890-1234",
      location: "San Francisco",
      address: "456 Market St, San Francisco, CA 94105",
      joinDate: "2023-05-01",
      status: "active",
      trips: 92,
      rating: 4.7,
      onlineStatus: "online",
      income: {
        total: "$7,320",
        lastMonth: "$2,120",
        pending: "$350",
      },
      paymentStatus: "pending",
      profileImage: "/placeholder.svg?height=40&width=40",
      assignedBike: {
        id: "BK-015",
        model: "Eco Rider",
      },
    },
  ]

  // Filter and sort riders
  const filteredRiders = ridersData
    .filter((rider) => {
      // Filter by status
      if (activeFilter !== "all" && rider.status !== activeFilter) {
        return false
      }

      // Filter by tab
      if (currentTab !== "all" && rider.onlineStatus !== currentTab) {
        return false
      }

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          rider.name.toLowerCase().includes(query) ||
          rider.id.toLowerCase().includes(query) ||
          rider.email.toLowerCase().includes(query) ||
          rider.location.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by column
      let comparison = 0
      switch (sortColumn) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "location":
          comparison = a.location.localeCompare(b.location)
          break
        case "trips":
          comparison = a.trips - b.trips
          break
        case "rating":
          comparison = a.rating - b.rating
          break
        case "joinDate":
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
          break
        case "income":
          comparison =
            Number.parseFloat(a.income.lastMonth.replace("$", "").replace(",", "")) -
            Number.parseFloat(b.income.lastMonth.replace("$", "").replace(",", ""))
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500"
      case "inactive":
        return "bg-gray-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getOnlineStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-500"
      case "offline":
        return "bg-gray-500"
      case "busy":
        return "bg-amber-500"
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

  const getDateString = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-500"
    if (rating >= 4.0) return "text-amber-500"
    return "text-slate-500"
  }

  const statusCounts = {
    all: ridersData.length,
    active: ridersData.filter((rider) => rider.status === "active").length,
    suspended: ridersData.filter((rider) => rider.status === "suspended").length,
    inactive: ridersData.filter((rider) => rider.status === "inactive").length,
  }

  const onlineStatusCounts = {
    all: ridersData.length,
    online: ridersData.filter((rider) => rider.onlineStatus === "online").length,
    offline: ridersData.filter((rider) => rider.onlineStatus === "offline").length,
    busy: ridersData.filter((rider) => rider.onlineStatus === "busy").length,
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
              variant="secondary"
              className="w-full justify-start bg-[#86E30F] text-[#32443E] hover:bg-[#a1ff3a]"
              asChild
            >
              <Link href="/riders">
                <Users className="mr-3 h-5 w-5" />
                Riders
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
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
                  placeholder="Search riders..."
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

        {/* Riders Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Riders</h1>
                <p className="text-gray-600">Manage and monitor delivery riders</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  className="border-[#32443E] text-[#32443E]"
                  onClick={() => {
                    /* Export functionality would go here */
                  }}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={() => setAddRiderDialogOpen(true)}>
                  <Users className="mr-2 h-4 w-4" />
                  Add New Rider
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Riders</CardTitle>
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
                <CardTitle className="text-sm font-medium text-gray-500">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.active}</div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <Users className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <Progress
                  value={(statusCounts.active / statusCounts.all) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-emerald-500"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Online Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{onlineStatusCounts.online}</div>
                  <div className="rounded-full bg-[#86E30F]/20 p-2">
                    <Clock className="h-5 w-5 text-[#86E30F]" />
                  </div>
                </div>
                <Progress
                  value={(onlineStatusCounts.online / statusCounts.all) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-[#86E30F]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.suspended}</div>
                  <div className="rounded-full bg-red-100 p-2">
                    <X className="h-5 w-5 text-red-500" />
                  </div>
                </div>
                <Progress
                  value={(statusCounts.suspended / statusCounts.all) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-red-500"
                />
              </CardContent>
            </Card>
          </div>

          {/* Riders Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle>Rider List</CardTitle>
                  <CardDescription>Manage all registered delivery riders</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </div>

              <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Riders</TabsTrigger>
                  <TabsTrigger value="online">Online ({onlineStatusCounts.online})</TabsTrigger>
                  <TabsTrigger value="busy">Busy ({onlineStatusCounts.busy})</TabsTrigger>
                  <TabsTrigger value="offline">Offline ({onlineStatusCounts.offline})</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("name")}>
                        Rider
                        {sortColumn === "name" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("location")}>
                        Location
                        {sortColumn === "location" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("trips")}>
                        Trips
                        {sortColumn === "trips" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("rating")}>
                        Rating
                        {sortColumn === "rating" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("income")}>
                        Income (Last Month)
                        {sortColumn === "income" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Bike</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRiders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No riders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRiders.map((rider) => (
                      <TableRow key={rider.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarImage src={rider.profileImage || "/placeholder.svg"} alt={rider.name} />
                              <AvatarFallback>{rider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{rider.name}</div>
                              <div className="text-xs text-gray-500">{rider.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="mr-1 h-4 w-4 text-gray-400" />
                            {rider.location}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(rider.status)}`}></div>
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${getOnlineStatusColor(rider.onlineStatus)}`}
                            ></div>
                            <span className="capitalize">
                              {rider.status === "active" ? rider.onlineStatus : rider.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{rider.trips}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className={`mr-1 h-4 w-4 ${getRatingColor(rider.rating)} fill-current`} />
                            <span className={`font-medium ${getRatingColor(rider.rating)}`}>{rider.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${getPaymentStatusColor(rider.paymentStatus)}`}
                            ></div>
                            <span>{rider.income.lastMonth}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {rider.assignedBike ? (
                            <div className="flex items-center">
                              <Bike className="mr-1 h-4 w-4 text-[#86E30F]" />
                              <span className="text-sm">{rider.assignedBike.model}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              Not Assigned
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/riders/${rider.id}`}>View Profile</Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMessageRider(rider)}>
                                Message Rider
                              </DropdownMenuItem>
                              <DropdownMenuItem>Assign Bike</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {rider.status === "active" ? (
                                <DropdownMenuItem className="text-red-600">Suspend Rider</DropdownMenuItem>
                              ) : rider.status === "suspended" ? (
                                <DropdownMenuItem className="text-emerald-600">Reactivate Rider</DropdownMenuItem>
                              ) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing <strong>{filteredRiders.length}</strong> of <strong>{statusCounts.all}</strong> riders
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={filteredRiders.length < 8}>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Quick Stats */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Average rider metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Average Rating</span>
                    <span className="text-sm text-gray-500">
                      {(ridersData.reduce((sum, rider) => sum + rider.rating, 0) / ridersData.length).toFixed(1)}
                      /5.0
                    </span>
                  </div>
                  <Progress
                    value={(ridersData.reduce((sum, rider) => sum + rider.rating, 0) / ridersData.length) * 20}
                    className="h-2"
                    indicatorClassName="bg-[#86E30F]"
                  />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Trips per Rider</span>
                    <span className="text-sm text-gray-500">
                      {Math.round(ridersData.reduce((sum, rider) => sum + rider.trips, 0) / ridersData.length)}
                    </span>
                  </div>
                  <Progress value={70} className="h-2" indicatorClassName="bg-[#DCE30F]" />
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Monthly Income</span>
                    <span className="text-sm text-gray-500">
                      $
                      {Math.round(
                        ridersData.reduce(
                          (sum, rider) =>
                            sum + Number.parseFloat(rider.income.lastMonth.replace("$", "").replace(",", "")),
                          0,
                        ) / ridersData.length,
                      ).toLocaleString()}
                    </span>
                  </div>
                  <Progress value={65} className="h-2" indicatorClassName="bg-[#32443E]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location Distribution</CardTitle>
                <CardDescription>Riders by city</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Group riders by location */}
                  {Object.entries(
                    ridersData.reduce(
                      (acc, rider) => {
                        acc[rider.location] = (acc[rider.location] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([location, count]) => (
                      <div key={location}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium">{location}</span>
                          <span className="text-sm text-gray-500">
                            {count} ({Math.round((count / ridersData.length) * 100)}%)
                          </span>
                        </div>
                        <Progress
                          value={(count / ridersData.length) * 100}
                          className="h-2"
                          indicatorClassName="bg-[#32443E]"
                        />
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest rider actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-emerald-100 p-1">
                      <Bike className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Williams started a delivery</p>
                      <p className="text-xs text-gray-500">10 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-amber-100 p-1">
                      <Clock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">James Brown went offline</p>
                      <p className="text-xs text-gray-500">25 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-[#86E30F]/20 p-1">
                      <Star className="h-4 w-4 text-[#86E30F]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alex Johnson received a 5-star rating</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-blue-100 p-1">
                      <Package className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Linda Martinez completed a delivery</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Activities
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>

      {/* Add New Rider Dialog */}
      <Dialog open={addRiderDialogOpen} onOpenChange={setAddRiderDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Rider</DialogTitle>
            <DialogDescription>
              Enter the details for the new rider. They will receive an email to complete their registration.
            </DialogDescription>
          </DialogHeader>

          <Form {...riderForm}>
            <form onSubmit={riderForm.handleSubmit(onSubmitRiderForm)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={riderForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={riderForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={riderForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={riderForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={riderForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={riderForm.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="New York" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={riderForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={riderForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={riderForm.control}
                  name="bikeAssignment"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Bike Assignment</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a bike model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">No Bike Assigned</SelectItem>
                          <SelectItem value="city_cruiser">City Cruiser</SelectItem>
                          <SelectItem value="urban_commuter">Urban Commuter</SelectItem>
                          <SelectItem value="delivery_max">Delivery Max</SelectItem>
                          <SelectItem value="eco_rider">Eco Rider</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>The bike model that will be assigned to this rider.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={riderForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Initial Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="active" />
                            </FormControl>
                            <FormLabel className="font-normal">Active</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="inactive" />
                            </FormControl>
                            <FormLabel className="font-normal">Inactive</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={riderForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional information about this rider"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setAddRiderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" type="submit">
                  Add Rider
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedRider ? `Message ${selectedRider.name}` : "Message Rider"}</DialogTitle>
            <DialogDescription>
              {selectedRider
                ? "Send a direct message to this rider. They will receive it via SMS and app notification."
                : "Send a message to the selected rider."}
            </DialogDescription>
          </DialogHeader>
          {messageSent ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 rounded-full bg-emerald-100 p-3">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-center font-medium">Message sent successfully!</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="Enter message subject" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Type your message here"
                    className="h-32 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={handleSendMessage}>
                  Send Message
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
