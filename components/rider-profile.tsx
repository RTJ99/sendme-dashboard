"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BadgeCheck,
  Bike,
  Calendar,
  Check,
  ChevronRight,
  CircleDollarSign,
  Clock,
  Download,
  Edit,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldAlert,
  Star,
  User,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

interface RiderProfileProps {
  rider: any
}

export default function RiderProfile({ rider }: RiderProfileProps) {
  const router = useRouter()
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageSent, setMessageSent] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500"
      case "suspended":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
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

  const handleSendMessage = () => {
    setMessageSent(true)
    setTimeout(() => {
      setMessageDialogOpen(false)
      setMessageSent(false)
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Rider Profile</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="flex items-center" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Message
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Send Message to {rider.name}</DialogTitle>
                  <DialogDescription>This message will be sent as an SMS and email to the rider.</DialogDescription>
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
                        <Textarea id="message" placeholder="Type your message here" className="h-32" />
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-7xl p-4 md:p-6">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Left Column - Profile & Metrics */}
          <div className="space-y-6 md:col-span-1">
            {/* Profile Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Rider Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={rider.profileImage || "/placeholder.svg"} alt={rider.name} />
                    <AvatarFallback>{rider.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-xl font-bold">{rider.name}</h3>
                  <div className="mt-1 flex items-center">
                    <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(rider.status)}`}></div>
                    <span className="capitalize">{rider.status}</span>
                    {rider.status === "suspended" && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-2">
                            <ShieldAlert className="mr-1 h-3 w-3 text-red-500" />
                            <span className="text-xs">View Reason</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Account Suspended</AlertDialogTitle>
                            <AlertDialogDescription>
                              This rider has been suspended due to expired insurance documentation. They have been
                              notified to update their insurance to resume operations.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Close</AlertDialogCancel>
                            <AlertDialogAction className="bg-[#32443E] hover:bg-[#3a5049]">
                              Contact Rider
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start">
                    <Mail className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Email</div>
                      <div className="text-sm text-gray-500">{rider.email}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm text-gray-500">{rider.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-gray-500">{rider.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Joined</div>
                      <div className="text-sm text-gray-500">{formatDate(rider.joinDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <User className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium">Emergency Contact</div>
                      <div className="text-sm text-gray-500">{rider.emergencyContact}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Verification Documents</h4>
                  {rider.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-gray-500" />
                        <span className="text-sm">{doc.name}</span>
                      </div>
                      {doc.verified ? (
                        <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                          <Check className="mr-1 h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-amber-500 text-amber-500">
                          <Clock className="mr-1 h-3 w-3" /> Pending
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" className="flex items-center">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">Rating</span>
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{rider.rating}/5.0</span>
                    </div>
                  </div>
                  <Progress value={rider.rating * 20} className="h-2" indicatorClassName="bg-amber-400" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-xs font-medium text-gray-500">Total Trips</div>
                    <div className="text-xl font-bold text-[#32443E]">{rider.trips}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <div className="text-xs font-medium text-gray-500">Total Earnings</div>
                    <div className="text-xl font-bold text-[#32443E]">{rider.income.total}</div>
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Monthly Performance</span>
                    <span className="text-xs text-gray-500">Last 30 days</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs">Completed Trips</span>
                        <span className="text-xs font-medium">28</span>
                      </div>
                      <Progress value={87} className="h-1" indicatorClassName="bg-[#86E30F]" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs">On-Time Deliveries</span>
                        <span className="text-xs font-medium">95%</span>
                      </div>
                      <Progress value={95} className="h-1" indicatorClassName="bg-[#DCE30F]" />
                    </div>
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs">Customer Satisfaction</span>
                        <span className="text-xs font-medium">92%</span>
                      </div>
                      <Progress value={92} className="h-1" indicatorClassName="bg-[#86E30F]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Bike */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Assigned Bike</CardTitle>
              </CardHeader>
              <CardContent>
                {rider.assignedBike ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bike className="mr-2 h-5 w-5 text-[#86E30F]" />
                        <div>
                          <div className="font-medium">{rider.assignedBike.model}</div>
                          <div className="text-sm text-gray-500">ID: {rider.assignedBike.id}</div>
                        </div>
                      </div>
                      <Badge className="bg-[#86E30F] text-[#32443E]">Active</Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Assigned Date</span>
                        <span className="text-sm">{formatDate(rider.assignedBike.assignedDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Condition</span>
                        <span className="text-sm">{rider.assignedBike.condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Last Inspection</span>
                        <span className="text-sm">{formatDate(rider.assignedBike.lastInspection)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        Schedule Service
                      </Button>
                      <Button size="sm" className="bg-[#32443E] hover:bg-[#3a5049]">
                        View Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="mb-3 rounded-full bg-gray-100 p-3">
                      <Bike className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="mb-4 text-center text-sm text-gray-500">No bike currently assigned to this rider.</p>
                    <Button className="w-full bg-[#32443E] hover:bg-[#3a5049]">Assign Bike</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="trips">
              <TabsList className="mb-4 grid w-full grid-cols-4">
                <TabsTrigger value="trips">Trip History</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="referrals">Referrals</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              {/* Trip History Tab */}
              <TabsContent value="trips" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Recent Trips</CardTitle>
                    <div className="flex items-center">
                      <Badge className="bg-[#32443E]">{rider.tripHistory.length} Total Trips</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Trip ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead>Distance</TableHead>
                          <TableHead>Earnings</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rider.tripHistory.map((trip: any) => (
                          <TableRow key={trip.id}>
                            <TableCell className="font-medium">{trip.id}</TableCell>
                            <TableCell>{formatDate(trip.date)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="text-xs text-gray-500">From:</div>
                                <div className="ml-1">{trip.pickup}</div>
                                <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />
                                <div className="text-xs text-gray-500">To:</div>
                                <div className="ml-1">{trip.dropoff}</div>
                              </div>
                            </TableCell>
                            <TableCell>{trip.distance}</TableCell>
                            <TableCell>{trip.earnings}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                                {trip.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing <strong>{Math.min(5, rider.tripHistory.length)}</strong> of{" "}
                      <strong>{rider.tripHistory.length}</strong> trips
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Trip Analytics</CardTitle>
                    <CardDescription>Performance and earnings overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Average Trip Distance</div>
                        <div className="mt-1 text-2xl font-bold text-[#32443E]">2.9 miles</div>
                        <div className="mt-1 text-xs text-gray-500">Based on last 30 days</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Average Earnings/Trip</div>
                        <div className="mt-1 text-2xl font-bold text-[#32443E]">$18.25</div>
                        <div className="mt-1 text-xs text-gray-500">Based on last 30 days</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Peak Activity Time</div>
                        <div className="mt-1 text-2xl font-bold text-[#32443E]">5PM - 7PM</div>
                        <div className="mt-1 text-xs text-gray-500">Most active hours</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payments Tab */}
              <TabsContent value="payments" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Income Overview</CardTitle>
                      <CardDescription>Current earnings and payment status</CardDescription>
                    </div>
                    <div className="flex items-center">
                      <div className={`mr-2 h-2 w-2 rounded-full ${getPaymentStatusColor(rider.paymentStatus)}`}></div>
                      <div className="capitalize">{rider.paymentStatus}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Total Earnings</div>
                        <div className="mt-1 text-2xl font-bold text-[#32443E]">{rider.income.total}</div>
                        <div className="mt-1 text-xs text-gray-500">Lifetime earnings</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Last Month</div>
                        <div className="mt-1 text-2xl font-bold text-[#32443E]">{rider.income.lastMonth}</div>
                        <div className="mt-1 text-xs text-gray-500">Previous 30 days</div>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-4">
                        <div className="text-sm font-medium text-gray-500">Pending Payment</div>
                        <div className="mt-1 text-2xl font-bold text-[#32443E]">{rider.income.pending}</div>
                        <div className="mt-1 text-xs text-gray-500">To be processed</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Payment History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment Method</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rider.paymentHistory.map((payment: any) => (
                          <TableRow key={payment.id}>
                            <TableCell className="font-medium">{payment.id}</TableCell>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>{payment.type}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <div
                                  className={`mr-2 h-2 w-2 rounded-full ${getPaymentStatusColor(payment.status)}`}
                                ></div>
                                <span className="capitalize">{payment.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-8 px-2">
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Transactions
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Payment Settings</CardTitle>
                    <CardDescription>Banking and payment preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center">
                          <CircleDollarSign className="mr-3 h-5 w-5 text-[#32443E]" />
                          <div>
                            <div className="font-medium">Primary Bank Account</div>
                            <div className="text-sm text-gray-500">Chase Bank ••••4532</div>
                          </div>
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700">Default</Badge>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center">
                          <Calendar className="mr-3 h-5 w-5 text-[#32443E]" />
                          <div>
                            <div className="font-medium">Payment Schedule</div>
                            <div className="text-sm text-gray-500">Monthly (1st of each month)</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Change
                        </Button>
                      </div>

                      <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center">
                          <FileText className="mr-3 h-5 w-5 text-[#32443E]" />
                          <div>
                            <div className="font-medium">Tax Documents</div>
                            <div className="text-sm text-gray-500">W-9 form submitted</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Referrals Tab */}
              <TabsContent value="referrals" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Referral Program</CardTitle>
                    <CardDescription>Track referrals and commissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {rider.referrals.length > 0 ? (
                      <div className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="text-sm font-medium text-gray-500">Total Referrals</div>
                            <div className="mt-1 text-2xl font-bold text-[#32443E]">{rider.referrals.length}</div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="text-sm font-medium text-gray-500">Total Commission</div>
                            <div className="mt-1 text-2xl font-bold text-[#32443E]">
                              $
                              {rider.referrals
                                .reduce((total: number, ref: any) => {
                                  return total + Number.parseFloat(ref.commission.replace("$", "").replace(",", ""))
                                }, 0)
                                .toFixed(2)}
                            </div>
                          </div>
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="text-sm font-medium text-gray-500">Referral Code</div>
                            <div className="mt-1 text-xl font-bold text-[#32443E]">
                              SEND-{rider.name.split(" ")[0].toUpperCase()}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="mb-3 font-medium">Referred Riders</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Commission</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {rider.referrals.map((referral: any, index: number) => (
                                <TableRow key={index}>
                                  <TableCell>{referral.name}</TableCell>
                                  <TableCell>{formatDate(referral.date)}</TableCell>
                                  <TableCell>
                                    <Badge className="bg-emerald-100 text-emerald-700 capitalize">
                                      {referral.status}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>{referral.commission}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="mb-3 rounded-full bg-gray-100 p-3">
                          <UserPlus className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="mb-1 text-center font-medium">No Referrals Yet</h3>
                        <p className="mb-4 text-center text-sm text-gray-500">
                          This rider hasn't referred anyone to the platform.
                        </p>
                        <Button className="bg-[#32443E] hover:bg-[#3a5049]">Send Referral Link</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notes Tab */}
              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle>Administrative Notes</CardTitle>
                    <Button size="sm" className="bg-[#32443E] hover:bg-[#3a5049]">
                      <Edit className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {rider.notes.length > 0 ? (
                      <div className="space-y-4">
                        {rider.notes.map((note: any, index: number) => (
                          <div key={index} className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{note.author}</div>
                              <div className="text-sm text-gray-500">{formatDate(note.date)}</div>
                            </div>
                            <p className="mt-2 text-sm">{note.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="mb-3 rounded-full bg-gray-100 p-3">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-center text-sm text-gray-500">
                          No administrative notes have been added for this rider.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Activity Timeline</CardTitle>
                    <CardDescription>Recent account activities and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                          <Bike className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Bike Assignment</div>
                            <div className="text-xs text-gray-500">
                              {rider.assignedBike ? formatDate(rider.assignedBike.assignedDate) : "N/A"}
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {rider.assignedBike
                              ? `Assigned bike ${rider.assignedBike.id} (${rider.assignedBike.model})`
                              : "No bike currently assigned"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100">
                          <BadgeCheck className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Account Verification</div>
                            <div className="text-xs text-gray-500">{formatDate(rider.joinDate)}</div>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            Completed identity verification and background check
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                          <FileText className="h-4 w-4 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Contract Signed</div>
                            <div className="text-xs text-gray-500">{formatDate(rider.joinDate)}</div>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">Signed rider agreement and terms of service</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-purple-100">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">Account Created</div>
                            <div className="text-xs text-gray-500">{formatDate(rider.joinDate)}</div>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">Rider account was created</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
