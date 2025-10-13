"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  Filter,
  Home,
  Package,
  Search,
  Settings,
  Users,
  X,
  Copy,
  DollarSign,
  UserPlus,
  Check,
  Share2,
  Mail,
  Smartphone,
  TrendingUp,
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Import the chart components
import { ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart"

export default function Referrals() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTab, setCurrentTab] = useState("all")
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  const [selectedReferrer, setSelectedReferrer] = useState<any>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteSent, setInviteSent] = useState(false)

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

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText("https://sendme.com/refer/ADMIN123")
    setShowCopiedMessage(true)
    setTimeout(() => {
      setShowCopiedMessage(false)
    }, 2000)
  }

  const handleSendInvite = () => {
    setInviteSent(true)
    setTimeout(() => {
      setInviteDialogOpen(false)
      setInviteSent(false)
    }, 1500)
  }

  // Mock data for referrals
  const referralsData = [
    {
      id: "REF-1001",
      referrer: {
        name: "Alex Johnson",
        id: "1",
        email: "alex.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "Thomas Lee",
        email: "thomas.lee@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-15",
      status: "completed",
      commission: "$250",
      paymentStatus: "paid",
    },
    {
      id: "REF-1002",
      referrer: {
        name: "Maria Garcia",
        id: "2",
        email: "maria.garcia@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-14",
      status: "completed",
      commission: "$250",
      paymentStatus: "pending",
    },
    {
      id: "REF-1003",
      referrer: {
        name: "Sarah Williams",
        id: "4",
        email: "sarah.williams@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "Michael Davis",
        email: "michael.davis@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-13",
      status: "pending",
      commission: "$250",
      paymentStatus: "pending",
    },
    {
      id: "REF-1004",
      referrer: {
        name: "James Brown",
        id: "5",
        email: "james.brown@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "Jennifer Smith",
        email: "jennifer.smith@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-12",
      status: "completed",
      commission: "$250",
      paymentStatus: "paid",
    },
    {
      id: "REF-1005",
      referrer: {
        name: "Linda Martinez",
        id: "8",
        email: "linda.martinez@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "Robert Brown",
        email: "robert.brown@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-11",
      status: "expired",
      commission: "$0",
      paymentStatus: "n/a",
    },
    {
      id: "REF-1006",
      referrer: {
        name: "Jennifer Lee",
        id: "6",
        email: "jennifer.lee@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "Patricia Martinez",
        email: "patricia.martinez@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-10",
      status: "completed",
      commission: "$250",
      paymentStatus: "paid",
    },
    {
      id: "REF-1007",
      referrer: {
        name: "Alex Johnson",
        id: "1",
        email: "alex.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "James Johnson",
        email: "james.johnson@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-09",
      status: "pending",
      commission: "$250",
      paymentStatus: "pending",
    },
    {
      id: "REF-1008",
      referrer: {
        name: "David Kim",
        id: "3",
        email: "david.kim@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      referee: {
        name: "Linda Garcia",
        email: "linda.garcia@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2023-07-08",
      status: "expired",
      commission: "$0",
      paymentStatus: "n/a",
    },
  ]

  // Mock data for top referrers
  const topReferrers = [
    { name: "Alex Johnson", count: 5, amount: "$1,250" },
    { name: "Sarah Williams", count: 4, amount: "$1,000" },
    { name: "Maria Garcia", count: 3, amount: "$750" },
    { name: "James Brown", count: 2, amount: "$500" },
    { name: "Jennifer Lee", count: 2, amount: "$500" },
  ]

  // Mock data for referral analytics
  const referralTrends = [
    { month: "Jan", referrals: 12, conversions: 8 },
    { month: "Feb", referrals: 15, conversions: 10 },
    { month: "Mar", referrals: 18, conversions: 12 },
    { month: "Apr", referrals: 22, conversions: 15 },
    { month: "May", referrals: 28, conversions: 20 },
    { month: "Jun", referrals: 32, conversions: 24 },
    { month: "Jul", referrals: 38, conversions: 28 },
  ]

  // Mock data for referral sources
  const referralSources = [
    { name: "Email", value: 45 },
    { name: "SMS", value: 30 },
    { name: "Social", value: 15 },
    { name: "Direct", value: 10 },
  ]

  const COLORS = ["#32443E", "#86E30F", "#DCE30F", "#3a5049"]

  // Filter and sort referrals
  const filteredReferrals = referralsData
    .filter((referral) => {
      // Filter by tab
      if (currentTab !== "all" && referral.status !== currentTab) {
        return false
      }

      // Filter by search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          referral.referrer.name.toLowerCase().includes(query) ||
          referral.referee.name.toLowerCase().includes(query) ||
          referral.id.toLowerCase().includes(query) ||
          referral.referrer.email.toLowerCase().includes(query) ||
          referral.referee.email.toLowerCase().includes(query)
        )
      }

      return true
    })
    .sort((a, b) => {
      // Sort by column
      let comparison = 0
      switch (sortColumn) {
        case "date":
          comparison = new Date(b.date).getTime() - new Date(a.date).getTime()
          break
        case "referrer":
          comparison = a.referrer.name.localeCompare(b.referrer.name)
          break
        case "referee":
          comparison = a.referee.name.localeCompare(b.referee.name)
          break
        case "commission":
          comparison =
            Number.parseFloat(a.commission.replace("$", "").replace(",", "")) -
            Number.parseFloat(b.commission.replace("$", "").replace(",", ""))
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
      case "expired":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500">Completed</Badge>
      case "pending":
        return <Badge className="bg-amber-500">Pending</Badge>
      case "expired":
        return <Badge className="bg-red-500">Expired</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-emerald-500"
      case "pending":
        return "bg-amber-500"
      case "n/a":
        return "bg-gray-500"
      default:
        return "bg-slate-500"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const statusCounts = {
    all: referralsData.length,
    completed: referralsData.filter((ref) => ref.status === "completed").length,
    pending: referralsData.filter((ref) => ref.status === "pending").length,
    expired: referralsData.filter((ref) => ref.status === "expired").length,
  }

  // Calculate total commission
  const totalCommission = referralsData
    .filter((ref) => ref.status === "completed")
    .reduce((sum, ref) => sum + Number.parseFloat(ref.commission.replace("$", "").replace(",", "")), 0)

  // Calculate pending commission
  const pendingCommission = referralsData
    .filter((ref) => ref.status === "pending")
    .reduce((sum, ref) => sum + Number.parseFloat(ref.commission.replace("$", "").replace(",", "")), 0)

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
              variant="secondary"
              className="w-full justify-start bg-[#86E30F] text-[#32443E] hover:bg-[#a1ff3a]"
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
                  placeholder="Search referrals..."
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

        {/* Referrals Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
                <p className="text-gray-600">Manage and track rider referrals</p>
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
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={() => setInviteDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Send Invitation
                </Button>
              </div>
            </div>
          </div>

          {/* Referral Program Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Referral Program</CardTitle>
              <CardDescription>Share your referral link and earn commissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-lg font-semibold">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#32443E] text-white">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Share your referral link</p>
                        <p className="text-sm text-gray-500">Send your unique link to potential riders</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#32443E] text-white">
                        2
                      </div>
                      <div>
                        <p className="font-medium">They sign up and get approved</p>
                        <p className="text-sm text-gray-500">New riders complete the application process</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#32443E] text-white">
                        3
                      </div>
                      <div>
                        <p className="font-medium">You earn commission</p>
                        <p className="text-sm text-gray-500">Receive $250 for each successful referral</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Your Referral Link</h3>
                  <div className="mb-4 flex items-center space-x-2">
                    <Input value="https://sendme.com/refer/ADMIN123" readOnly className="bg-gray-50" />
                    <Button variant="outline" size="icon" onClick={handleCopyReferralLink} className="shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {showCopiedMessage && (
                    <p className="mb-4 text-sm text-emerald-600">
                      <Check className="mr-1 inline-block h-4 w-4" />
                      Copied to clipboard!
                    </p>
                  )}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Share via:</h4>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Mail className="mr-1 h-4 w-4" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Smartphone className="mr-1 h-4 w-4" />
                        SMS
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center">
                        <Share2 className="mr-1 h-4 w-4" />
                        Social
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Referrals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.all}</div>
                  <div className="rounded-full bg-gray-100 p-2">
                    <UserPlus className="h-5 w-5 text-[#32443E]" />
                  </div>
                </div>
                <Progress value={100} className="mt-2 h-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.completed}</div>
                  <div className="rounded-full bg-emerald-100 p-2">
                    <Check className="h-5 w-5 text-emerald-500" />
                  </div>
                </div>
                <Progress
                  value={(statusCounts.completed / statusCounts.all) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-emerald-500"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">{statusCounts.pending}</div>
                  <div className="rounded-full bg-[#86E30F]/20 p-2">
                    <TrendingUp className="h-5 w-5 text-[#86E30F]" />
                  </div>
                </div>
                <Progress
                  value={(statusCounts.pending / statusCounts.all) * 100}
                  className="mt-2 h-2"
                  indicatorClassName="bg-[#86E30F]"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-[#32443E]">${totalCommission.toLocaleString()}</div>
                  <div className="rounded-full bg-amber-100 p-2">
                    <DollarSign className="h-5 w-5 text-amber-500" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span className="font-medium text-amber-500">${pendingCommission.toLocaleString()}</span> pending
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referrals Table */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <div>
                  <CardTitle>Referral History</CardTitle>
                  <CardDescription>Track all referrals and their status</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select defaultValue={sortColumn} onValueChange={setSortColumn}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="referrer">Referrer</SelectItem>
                      <SelectItem value="referee">Referee</SelectItem>
                      <SelectItem value="commission">Commission</SelectItem>
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
                  <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                  <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
                  <TabsTrigger value="expired">Expired ({statusCounts.expired})</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("referrer")}>
                        Referrer
                        {sortColumn === "referrer" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("referee")}>
                        Referee
                        {sortColumn === "referee" && (
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
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <div className="flex cursor-pointer items-center" onClick={() => handleSort("commission")}>
                        Commission
                        {sortColumn === "commission" && (
                          <ChevronDown
                            className={`ml-1 h-4 w-4 transition-transform ${
                              sortDirection === "desc" ? "rotate-180" : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReferrals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        No referrals found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReferrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarImage
                                src={referral.referrer.avatar || "/placeholder.svg"}
                                alt={referral.referrer.name}
                              />
                              <AvatarFallback>{referral.referrer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{referral.referrer.name}</div>
                              <div className="text-xs text-gray-500">{referral.referrer.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Avatar className="mr-2 h-8 w-8">
                              <AvatarImage
                                src={referral.referee.avatar || "/placeholder.svg"}
                                alt={referral.referee.name}
                              />
                              <AvatarFallback>{referral.referee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{referral.referee.name}</div>
                              <div className="text-xs text-gray-500">{referral.referee.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(referral.date)}</TableCell>
                        <TableCell>{getStatusBadge(referral.status)}</TableCell>
                        <TableCell>
                          <span className="font-medium">{referral.commission}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div
                              className={`mr-2 h-2 w-2 rounded-full ${getPaymentStatusColor(referral.paymentStatus)}`}
                            ></div>
                            <span className="capitalize">{referral.paymentStatus}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              {referral.status === "pending" && (
                                <>
                                  <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                  <DropdownMenuItem>Mark as Completed</DropdownMenuItem>
                                </>
                              )}
                              {referral.status === "completed" && referral.paymentStatus === "pending" && (
                                <DropdownMenuItem>Process Payment</DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Cancel Referral</DropdownMenuItem>
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
                Showing <strong>{filteredReferrals.length}</strong> of <strong>{statusCounts.all}</strong> referrals
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled={filteredReferrals.length < 8}>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>

          {/* Analytics and Top Referrers */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Referral Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Analytics</CardTitle>
                <CardDescription>Monthly referral trends and conversion rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={referralTrends}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="referrals" stroke="#32443E" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="conversions" stroke="#86E30F" />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <ChartLegend className="mt-4 justify-center">
                    <ChartLegendItem name="Referrals" color="#32443E" />
                    <ChartLegendItem name="Conversions" color="#86E30F" />
                  </ChartLegend>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
                    <div className="text-2xl font-bold text-[#32443E]">74%</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-sm font-medium text-gray-500">Avg. Time to Convert</div>
                    <div className="text-2xl font-bold text-[#32443E]">3.2 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Referrers */}
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Referrers</CardTitle>
                  <CardDescription>Riders with the most successful referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topReferrers.map((referrer, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#32443E] text-white">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{referrer.name}</div>
                            <div className="text-xs text-gray-500">{referrer.count} referrals</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{referrer.amount}</div>
                          <div className="text-xs text-gray-500">earned</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Referrers
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Referral Sources</CardTitle>
                  <CardDescription>How referrals are being shared</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <ChartContainer>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={referralSources}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {referralSources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Send Invitation Dialog */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Referral Invitation</DialogTitle>
            <DialogDescription>Invite potential riders to join SendMe through your referral link.</DialogDescription>
          </DialogHeader>
          {inviteSent ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-4 rounded-full bg-emerald-100 p-3">
                <Check className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-center font-medium">Invitation sent successfully!</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="invite-method" className="text-sm font-medium">
                    Invitation Method
                  </label>
                  <Select defaultValue="email">
                    <SelectTrigger id="invite-method">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="link">Generate Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="recipient" className="text-sm font-medium">
                    Recipient Email
                  </label>
                  <Input id="recipient" placeholder="email@example.com" type="email" />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Personal Message (Optional)
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Add a personal message to your invitation"
                    className="h-24 resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={handleSendInvite}>
                  Send Invitation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
