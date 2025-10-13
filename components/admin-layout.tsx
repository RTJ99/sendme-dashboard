"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import {
  Bell,
  Calendar,
  ChevronDown,
  CreditCard,
  FileText,
  Gift,
  HelpCircle,
  Home,
  LogOut,
  Map,
  Package,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react"
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

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user, logout } = useAuth()

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleLogout = () => {
    logout()
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
            <img src="/images/sendme-logo.png" alt="SendMe Logo" className="h-8" />
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
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white" asChild>
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
              <Link href="/users">
                <User className="mr-3 h-5 w-5" />
                Users
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white">
                  <Users className="mr-3 h-5 w-5" />
                  Referrals
                  <ChevronDown className="ml-auto h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56 bg-[#3a5049] text-white border-[#32443E]">
                <DropdownMenuItem asChild>
                  <Link href="/referrals" className="cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/referrals/rewards" className="cursor-pointer">
                    <Gift className="mr-2 h-4 w-4" />
                    <span>Rewards & Bonuses</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
              <Link href="/hotspots">
                <Map className="mr-3 h-5 w-5" />
                Hotspots
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-[#3a5049] hover:text-white"
              asChild
            >
              <Link href="/support">
                <HelpCircle className="mr-3 h-5 w-5" />
                Support Tickets
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
                  placeholder="Search riders, bikes..."
                  className="w-full rounded-md border pl-8 md:w-[300px]"
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
                      <AvatarImage src={user?.profileImage?.url || "/placeholder.svg?height=32&width=32"} alt={user?.fullName || "Admin"} />
                      <AvatarFallback>
                        {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || "AD"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.fullName || "Admin"}</DropdownMenuLabel>
                  <DropdownMenuLabel className="text-xs text-gray-500">{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          {(title || description) && (
            <div className="mb-6">
              {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
