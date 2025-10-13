"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, ArrowLeft, Edit, MapPin, Car, Star, DollarSign, Calendar, Phone, Mail, User } from "lucide-react"
import { apiClient } from "@/lib/api"

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

interface Parcel {
  _id: string;
  description: string;
  status: string;
  finalPrice?: number;
  createdAt: string;
  sender: {
    fullName: string;
    email: string;
  };
}

export default function DriverDetail() {
  const params = useParams()
  const router = useRouter()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [recentParcels, setRecentParcels] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (params.id) {
      fetchDriverDetails(params.id as string)
    }
  }, [params.id])

  const fetchDriverDetails = async (driverId: string) => {
    try {
      setLoading(true)
      setError("")

      const response = await apiClient.request(`/drivers/${driverId}`)
      
      if (response.success) {
        setDriver(response.data.driver)
        setRecentParcels(response.data.recentParcels || [])
      } else {
        setError(response.message || 'Failed to fetch driver details')
      }
    } catch (err) {
      setError('An error occurred while fetching driver details')
      console.error('Fetch driver error:', err)
    } finally {
      setLoading(false)
    }
  }

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

  const getParcelStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500"
      case "in_transit":
        return "bg-blue-500"
      case "picked_up":
        return "bg-amber-500"
      case "pending":
        return "bg-gray-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading driver details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!driver) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Driver not found
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => router.back()}
            >
              Go Back
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Details</h1>
            <p className="text-gray-600">View and manage driver information</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/riders`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Driver
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Driver Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={driver.userId.profileImage?.url || "/placeholder.svg"} 
                    alt={driver.userId.fullName} 
                  />
                  <AvatarFallback className="text-lg">
                    {driver.userId.fullName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-xl font-semibold">{driver.userId.fullName}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {driver.userId.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {driver.userId.phoneNumber}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(driver.status)}
                    <div className="flex items-center">
                      <div className={`h-2 w-2 rounded-full mr-2 ${driver.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="text-sm">{driver.isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Vehicle Type</label>
                  <p className="text-lg">{driver.vehicleType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Model</label>
                  <p className="text-lg">{driver.vehicleModel}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Color</label>
                  <p className="text-lg">{driver.vehicleColor}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">License Plate</label>
                  <p className="text-lg font-mono">{driver.licensePlate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">License Number</label>
                  <p className="text-lg font-mono">{driver.licenseNumber}</p>
                </div>
                {driver.address && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-500">Address</label>
                    <p className="text-lg">{driver.address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Parcels */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Deliveries</CardTitle>
              <CardDescription>Last 10 parcels delivered by this driver</CardDescription>
            </CardHeader>
            <CardContent>
              {recentParcels.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentParcels.map((parcel) => (
                      <TableRow key={parcel._id}>
                        <TableCell className="font-medium">{parcel.description}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{parcel.sender.fullName}</div>
                            <div className="text-sm text-gray-500">{parcel.sender.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getParcelStatusColor(parcel.status)}>
                            {parcel.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {parcel.finalPrice ? `$${parcel.finalPrice.toLocaleString()}` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {new Date(parcel.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent deliveries found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-500">{driver.rating.toFixed(1)}</div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{driver.totalTrips}</div>
                <div className="text-sm text-gray-500">Total Trips</div>
              </div>
            </CardContent>
          </Card>

          {/* Earnings Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">
                  ${driver.totalEarnings.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total Earnings</div>
              </div>
              {driver.pendingEarnings > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    ${driver.pendingEarnings.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Pending Earnings</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Account Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Joined:</span>
                <span className="text-sm">{new Date(driver.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Last Updated:</span>
                <span className="text-sm">{new Date(driver.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Availability:</span>
                <Badge variant={driver.isAvailable ? "default" : "secondary"}>
                  {driver.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
