"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Calendar,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Download,
  FileText,
  Filter,
  Home,
  Package,
  Printer,
  RefreshCw,
  Search,
  Settings,
  Users,
  X,
  Check,
  AlertCircle,
  Clock,
  Ban,
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
import { Separator } from "@/components/ui/separator"
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart } from "recharts"
import { ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"

export default function Payments() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const handleViewPayment = (payment: any) => {
    setSelectedPayment(payment)
  }

  // Mock data for payments
  const paymentsData = [
    {
      id: "PAY-1001",
      riderId: "1",
      riderName: "Alex Johnson",
      riderEmail: "alex.johnson@example.com",
      amount: 2450.0,
      date: "2023-07-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for July 2023",
      trips: 156,
      hours: 87,
      fees: 122.5,
      tax: 245.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1002",
      riderId: "2",
      riderName: "Maria Garcia",
      riderEmail: "maria.garcia@example.com",
      amount: 1980.0,
      date: "2023-07-01",
      status: "pending",
      method: "Direct Deposit",
      description: "Monthly payment for July 2023",
      trips: 132,
      hours: 74,
      fees: 99.0,
      tax: 198.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1003",
      riderId: "3",
      riderName: "David Kim",
      riderEmail: "david.kim@example.com",
      amount: 1340.0,
      date: "2023-07-01",
      status: "failed",
      method: "Direct Deposit",
      description: "Monthly payment for July 2023",
      trips: 89,
      hours: 52,
      fees: 67.0,
      tax: 134.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1004",
      riderId: "4",
      riderName: "Sarah Williams",
      riderEmail: "sarah.williams@example.com",
      amount: 3015.0,
      date: "2023-07-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for July 2023",
      trips: 201,
      hours: 112,
      fees: 150.75,
      tax: 301.5,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1005",
      riderId: "5",
      riderName: "James Brown",
      riderEmail: "james.brown@example.com",
      amount: 2670.0,
      date: "2023-07-01",
      status: "pending",
      method: "Direct Deposit",
      description: "Monthly payment for July 2023",
      trips: 178,
      hours: 98,
      fees: 133.5,
      tax: 267.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1006",
      riderId: "6",
      riderName: "Jennifer Lee",
      riderEmail: "jennifer.lee@example.com",
      amount: 1950.0,
      date: "2023-07-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for July 2023",
      trips: 112,
      hours: 65,
      fees: 97.5,
      tax: 195.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1007",
      riderId: "1",
      riderName: "Alex Johnson",
      riderEmail: "alex.johnson@example.com",
      amount: 2380.0,
      date: "2023-06-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for June 2023",
      trips: 149,
      hours: 82,
      fees: 119.0,
      tax: 238.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1008",
      riderId: "2",
      riderName: "Maria Garcia",
      riderEmail: "maria.garcia@example.com",
      amount: 1850.0,
      date: "2023-06-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for June 2023",
      trips: 123,
      hours: 68,
      fees: 92.5,
      tax: 185.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1009",
      riderId: "4",
      riderName: "Sarah Williams",
      riderEmail: "sarah.williams@example.com",
      amount: 2890.0,
      date: "2023-06-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for June 2023",
      trips: 192,
      hours: 106,
      fees: 144.5,
      tax: 289.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1010",
      riderId: "5",
      riderName: "James Brown",
      riderEmail: "james.brown@example.com",
      amount: 2520.0,
      date: "2023-06-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for June 2023",
      trips: 168,
      hours: 93,
      fees: 126.0,
      tax: 252.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1011",
      riderId: "7",
      riderName: "Robert Wilson",
      riderEmail: "robert.wilson@example.com",
      amount: 1230.0,
      date: "2023-06-01",
      status: "completed",
      method: "Direct Deposit",
      description: "Monthly payment for June 2023",
      trips: 67,
      hours: 41,
      fees: 61.5,
      tax: 123.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "PAY-1012",
      riderId: "8",
      riderName: "Linda Martinez",
      riderEmail: "linda.martinez@example.com",
      amount: 2120.0,
      date: "2023-07-01",
      status: "pending",
      method: "Direct Deposit",
      description: "Monthly payment for July 2023",
      trips: 92,
      hours: 58,
      fees: 106.0,
      tax: 212.0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Monthly payment data for chart
  const monthlyPaymentData = [
    { month: "Jan", amount: 42500, riders: 25 },
    { month: "Feb", amount: 48200, riders: 28 },
    { month: "Mar", amount: 53800, riders: 31 },
    { month: "Apr", amount: 61200, riders: 35 },
    { month: "May", amount: 68500, riders: 38 },
    { month: "Jun", amount: 72300, riders: 40 },
    { month: "Jul", amount: 78400, riders: 42 },
  ]

  // Filter and sort payments
  const filteredPayments = paymentsData
    .filter((payment) => {
      // Filter by status
      if (activeFilter !== "all" && payment.status !== activeFilter) {
        return false
      }

      // Filter by tab
      if (currentTab !== "all") {
        const currentMonth = new Date().getMonth()
        const paymentMonth = new Date(payment.date).getMonth()

        if (currentTab === "current" && paymentMonth !== currentMonth) {
          return false
        } else if (currentTab === "previous" && paymentMonth !== currentMonth - 1) {
          return false
        }
      }

      // Filter by date range
      if (dateRange?.from && dateRange?.to) {
        const paymentDate = new Date(payment.date)
        if (paymentDate < dateRange.from || paymentDate > dateRange.to) {
          return false
        }
      }

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          payment.id.toLowerCase().includes(query) ||
          payment.riderName.toLowerCase().includes(query) ||
          payment.riderEmail.toLowerCase().includes(query) ||
          payment.status.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by column
      let comparison = 0
      switch (sortColumn) {
        case "id":
          comparison = a.id.localeCompare(b.id)
          break
        case "riderName":
          comparison = a.riderName.localeCompare(b.riderName)
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500"
      case "pending":
        return "bg-amber-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="mr-2 h-4 w-4 text-emerald-500" />
      case "pending":
        return <Clock className="mr-2 h-4 w-4 text-amber-500" />
      case "failed":
        return <Ban className="mr-2 h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="mr-2 h-4 w-4 text-slate-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const statusCounts = {
    all: paymentsData.length,
    completed: paymentsData.filter((payment) => payment.status === "completed").length,
    pending: paymentsData.filter((payment) => payment.status === "pending").length,
    failed: paymentsData.filter((payment) => payment.status === "failed").length,
  }

  const totalAmount = paymentsData.reduce((sum, payment) => sum + payment.amount, 0)
  const completedAmount = paymentsData
    .filter((payment) => payment.status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0)
  const pendingAmount = paymentsData
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0)

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
              variant="secondary"
              className="w-full justify-start bg-[#86E30F] text-[#32443E] hover:bg-[#a1ff3a]"
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
                  placeholder="Search payments..."
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

        {/* Payments Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                <p className="text-gray-600">Manage and process rider payments</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="border-[#32443E] text-[#32443E]">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                  <CircleDollarSign className="mr-2 h-4 w-4" />
                  Process Payments
                </Button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{formatCurrency(totalAmount)}</div>
                  <div className="rounded-full bg-gray-100 p-2">
                    <CreditCard className="h-5 w-5 text-[#32443E]" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {statusCounts.all} payments to {new Set(paymentsData.map((p) => p.riderId)).size} riders
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{formatCurrency(completedAmount)}</div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <Progress
                  value={(completedAmount / totalAmount) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-emerald-500"
                />
                <div className="mt-1 text-xs text-gray-500">{statusCounts.completed} payments processed</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{formatCurrency(pendingAmount)}</div>
                  <div className="rounded-full bg-amber-100 p-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <Progress
                  value={(pendingAmount / totalAmount) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-amber-500"
                />
                <div className="mt-1 text-xs text-gray-500">{statusCounts.pending} payments awaiting processing</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">
                    {formatCurrency(
                      paymentsData.filter((p) => p.status === "failed").reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </div>
                  <div className="rounded-full bg-red-100 p-2">
                    <Ban className="h-5 w-5 text-red-500" />
                  </div>
                </div>
                <Progress
                  value={(statusCounts.failed / statusCounts.all) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-red-500"
                />
                <div className="mt-1 text-xs text-gray-500">{statusCounts.failed} payments failed</div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Analytics */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Analytics</CardTitle>
                <CardDescription>Monthly payment trends and rider count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full">
                  <ChartContainer className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={monthlyPaymentData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" stroke="#32443E" />
                        <YAxis yAxisId="right" orientation="right" stroke="#86E30F" />
                        <Tooltip
                          formatter={(value: any, name: any) => {
                            if (name === "amount") {
                              return [formatCurrency(value), "Total Amount"]
                            }
                            return [value, "Riders"]
                          }}
                        />
                        <Bar yAxisId="left" dataKey="amount" name="amount" fill="#32443E" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="riders" fill="#86E30F" radius={[4, 4, 0, 0]} />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend className="mt-4 justify-center">
                    <ChartLegendItem name="Total Amount ($)" color="#32443E" />
                    <ChartLegendItem name="Riders" color="#86E30F" />
                  </ChartLegend>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payments Table */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle>Payment Transactions</CardTitle>
                  <CardDescription>View and manage all payment transactions</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <DatePickerWithRange className="w-auto" dateRange={dateRange} onDateRangeChange={setDateRange} />
                  <Select value={activeFilter} onValueChange={setActiveFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    More Filters
                  </Button>
                </div>
              </div>

              <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Payments</TabsTrigger>
                  <TabsTrigger value="current">Current Month</TabsTrigger>
                  <TabsTrigger value="previous">Previous Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("id")}>
                        Payment ID
                        {sortColumn === "id" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("riderName")}>
                        Rider
                        {sortColumn === "riderName" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("amount")}>
                        Amount
                        {sortColumn === "amount" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("date")}>
                        Date
                        {sortColumn === "date" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("status")}>
                        Status
                        {sortColumn === "status" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No payments found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarImage src={payment.avatar || "/placeholder.svg"} alt={payment.riderName} />
                              <AvatarFallback>{payment.riderName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{payment.riderName}</div>
                              <div className="text-xs text-gray-500">{payment.riderEmail}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(payment.status)}`}></div>
                            <span className="capitalize">{payment.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{payment.method}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewPayment(payment)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                              {payment.status === "pending" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Process Payment</DropdownMenuItem>
                                </>
                              )}
                              {payment.status === "failed" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Retry Payment</DropdownMenuItem>
                                </>
                              )}
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
                Showing <strong>{filteredPayments.length}</strong> of <strong>{statusCounts.all}</strong> payments
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={filteredPayments.length < 10}>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Payment Details Dialog */}
          {selectedPayment && (
            <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
              <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Payment Details: {selectedPayment.id}</DialogTitle>
                  <DialogDescription>
                    Payment information for {selectedPayment.riderName} on {formatDate(selectedPayment.date)}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                  {/* Payment Status */}
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(selectedPayment.status)}
                        <span className="text-lg font-semibold capitalize">{selectedPayment.status}</span>
                      </div>
                      <Badge
                        className={`${
                          selectedPayment.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedPayment.status === "pending"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selectedPayment.method}
                      </Badge>
                    </div>

                    <div className="flex flex-col items-center justify-center">
                      <div className="text-3xl font-bold">{formatCurrency(selectedPayment.amount)}</div>
                      <div className="text-sm text-gray-500">{selectedPayment.description}</div>
                    </div>
                  </div>

                  {/* Rider Information */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Rider Information</h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="mb-4 flex items-center">
                        <Avatar className="mr-4 h-12 w-12">
                          <AvatarImage
                            src={selectedPayment.avatar || "/placeholder.svg"}
                            alt={selectedPayment.riderName}
                          />
                          <AvatarFallback>{selectedPayment.riderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-lg font-semibold">{selectedPayment.riderName}</div>
                          <div className="text-sm text-gray-500">{selectedPayment.riderEmail}</div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium text-gray-500">Rider ID</div>
                          <div>{selectedPayment.riderId}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Total Trips</div>
                          <div>{selectedPayment.trips}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Hours Worked</div>
                          <div>{selectedPayment.hours} hours</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">Payment Date</div>
                          <div>{formatDate(selectedPayment.date)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Breakdown */}
                  <div>
                    <h3 className="mb-3 text-lg font-semibold">Payment Breakdown</h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Base Earnings</span>
                          <span>
                            {formatCurrency(selectedPayment.amount - selectedPayment.fees - selectedPayment.tax)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Platform Fees</span>
                          <span>-{formatCurrency(selectedPayment.fees)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tax Withholding</span>
                          <span>-{formatCurrency(selectedPayment.tax)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold">
                          <span>Total Payment</span>
                          <span>{formatCurrency(selectedPayment.amount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:space-x-3 sm:space-y-0">
                    <Button variant="outline" className="flex items-center">
                      <Download className="mr-2 h-4 w-4" />
                      Download Receipt
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <Printer className="mr-2 h-4 w-4" />
                      Print Details
                    </Button>
                    {selectedPayment.status === "pending" && (
                      <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                        <CircleDollarSign className="mr-2 h-4 w-4" />
                        Process Payment
                      </Button>
                    )}
                    {selectedPayment.status === "failed" && (
                      <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Retry Payment
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Bulk Payment Processing Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="hidden">Trigger</div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Process Bulk Payments</DialogTitle>
                <DialogDescription>
                  Process payments for multiple riders at once. This will initiate payment for all selected riders.
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
                  <div className="flex items-start">
                    <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">You are about to process 4 payments</p>
                      <p className="text-sm">Total amount: $8,220.00</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Payment Method</h4>
                  <Select defaultValue="direct-deposit">
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="direct-deposit">Direct Deposit (ACH)</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Payment Date</h4>
                  <div className="flex items-center">
                    <Input type="date" className="w-full" defaultValue={new Date().toISOString().split("T")[0]} />
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">Payment Description</h4>
                  <Input placeholder="e.g., Monthly payment for July 2023" />
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button variant="outline">Cancel</Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="bg-[#32443E] hover:bg-[#3a5049]">Process Payments</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Payment Processing</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are about to process payments totaling $8,220.00 to 4 riders. This action cannot be undone.
                        Are you sure you want to continue?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction className="bg-[#32443E] hover:bg-[#3a5049]">
                        Confirm Processing
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
