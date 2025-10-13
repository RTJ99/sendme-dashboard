"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Download, Filter, Info, MapPin } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function Hotspots() {
  const [timeRange, setTimeRange] = useState("week")

  // Mock data for hotspot areas
  const hotspotAreas = [
    {
      id: 1,
      name: "Downtown Business District",
      requestVolume: 1240,
      activeRiders: 18,
      avgResponseTime: "4.2 min",
      change: "+12%",
      status: "high",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: 2,
      name: "University Campus",
      requestVolume: 980,
      activeRiders: 12,
      avgResponseTime: "5.8 min",
      change: "+8%",
      status: "high",
      coordinates: { lat: 40.7294, lng: -73.9986 },
    },
    {
      id: 3,
      name: "Central Park Area",
      requestVolume: 760,
      activeRiders: 10,
      avgResponseTime: "6.5 min",
      change: "+5%",
      status: "medium",
      coordinates: { lat: 40.7829, lng: -73.9654 },
    },
    {
      id: 4,
      name: "Financial District",
      requestVolume: 680,
      activeRiders: 8,
      avgResponseTime: "7.2 min",
      change: "-3%",
      status: "medium",
      coordinates: { lat: 40.7075, lng: -74.0113 },
    },
    {
      id: 5,
      name: "Midtown Shopping Center",
      requestVolume: 520,
      activeRiders: 6,
      avgResponseTime: "8.1 min",
      change: "+15%",
      status: "medium",
      coordinates: { lat: 40.7549, lng: -73.984 },
    },
    {
      id: 6,
      name: "Residential Heights",
      requestVolume: 420,
      activeRiders: 5,
      avgResponseTime: "9.3 min",
      change: "+2%",
      status: "low",
      coordinates: { lat: 40.8075, lng: -73.9626 },
    },
  ]

  // Mock data for time-based analytics
  const timeAnalytics = {
    hourly: [
      { hour: "6 AM", requests: 45 },
      { hour: "8 AM", requests: 120 },
      { hour: "10 AM", requests: 85 },
      { hour: "12 PM", requests: 150 },
      { hour: "2 PM", requests: 95 },
      { hour: "4 PM", requests: 110 },
      { hour: "6 PM", requests: 180 },
      { hour: "8 PM", requests: 130 },
      { hour: "10 PM", requests: 70 },
    ],
    recommendations: [
      {
        id: 1,
        area: "Downtown Business District",
        currentBikes: 18,
        recommendedBikes: 25,
        deficit: 7,
        priority: "high",
      },
      {
        id: 2,
        area: "University Campus",
        currentBikes: 12,
        recommendedBikes: 18,
        deficit: 6,
        priority: "high",
      },
      {
        id: 3,
        area: "Central Park Area",
        currentBikes: 10,
        recommendedBikes: 14,
        deficit: 4,
        priority: "medium",
      },
      {
        id: 4,
        area: "Financial District",
        currentBikes: 8,
        recommendedBikes: 10,
        deficit: 2,
        priority: "low",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-amber-500"
      case "low":
        return "bg-emerald-500"
      default:
        return "bg-slate-500"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300"
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-300"
      case "low":
        return "bg-emerald-100 text-emerald-800 border-emerald-300"
      default:
        return "bg-slate-100 text-slate-800 border-slate-300"
    }
  }

  const getChangeColor = (change: string) => {
    return change.startsWith("+") ? "text-emerald-600" : "text-red-600"
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Delivery Hotspots</h2>
          <p className="text-muted-foreground">Analyze high-demand areas and optimize bike allocation</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
          <Button asChild size="sm" className="h-8 gap-1 bg-[#32443E] hover:bg-[#3a5049]">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="map" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="map">Heatmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-8 w-[150px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="map" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#32443E]">4,820</div>
                <p className="text-xs text-gray-500">+8.2% from last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Active Hotspots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#32443E]">6</div>
                <p className="text-xs text-gray-500">2 high priority areas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Avg. Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-[#32443E]">6.8 min</div>
                <p className="text-xs text-gray-500">-0.5 min from last week</p>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Delivery Hotspot Heatmap</CardTitle>
              <CardDescription>Visualization of high-demand areas based on delivery request volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/placeholder-uw7zh.png"
                    alt="Delivery Hotspot Heatmap"
                    className="h-full w-full object-cover"
                  />
                  {hotspotAreas.map((area) => (
                    <div
                      key={area.id}
                      className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-red-500 bg-opacity-70 text-white"
                      style={{
                        left: `${30 + area.id * 10}%`,
                        top: `${20 + area.id * 8}%`,
                        opacity: area.status === "high" ? 0.9 : area.status === "medium" ? 0.7 : 0.5,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <MapPin className="h-5 w-5" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-red-500 opacity-90"></span>
                  <span className="text-sm">High demand</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-amber-500 opacity-70"></span>
                  <span className="text-sm">Medium demand</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-emerald-500 opacity-50"></span>
                  <span className="text-sm">Low demand</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Hotspot Areas</CardTitle>
                <CardDescription>Detailed breakdown of high-demand delivery areas</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Request Volume</TableHead>
                    <TableHead>Active Riders</TableHead>
                    <TableHead>Avg. Response</TableHead>
                    <TableHead>Change</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotspotAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>{area.requestVolume}</TableCell>
                      <TableCell>{area.activeRiders}</TableCell>
                      <TableCell>{area.avgResponseTime}</TableCell>
                      <TableCell className={getChangeColor(area.change)}>{area.change}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className={`mr-2 h-2 w-2 rounded-full ${getStatusColor(area.status)}`}></div>
                          <span className="capitalize">{area.status}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request Volume by Time of Day</CardTitle>
              <CardDescription>Hourly breakdown of delivery requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <div className="flex h-full w-full flex-col">
                  <div className="flex h-full items-end gap-2">
                    {timeAnalytics.hourly.map((hour, i) => (
                      <div key={i} className="relative flex w-full flex-col items-center">
                        <div
                          className="w-full rounded-t bg-[#32443E]"
                          style={{ height: `${(hour.requests / 180) * 100}%` }}
                        ></div>
                        <span className="mt-2 text-xs">{hour.hour}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Peak hours: 12 PM and 6 PM</div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Info className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Distribution by Area</CardTitle>
                <CardDescription>Percentage of total requests by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotspotAreas.slice(0, 4).map((area) => (
                    <div key={area.id}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium">{area.name}</div>
                        <div className="text-sm text-gray-500">{Math.round((area.requestVolume / 4820) * 100)}%</div>
                      </div>
                      <Progress
                        value={Math.round((area.requestVolume / 4820) * 100)}
                        className="h-2 bg-gray-200"
                        indicatorClassName={
                          area.status === "high"
                            ? "bg-red-500"
                            : area.status === "medium"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Time Analysis</CardTitle>
                <CardDescription>Average response times by area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotspotAreas.slice(0, 4).map((area) => (
                    <div key={area.id}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="text-sm font-medium">{area.name}</div>
                        <div className="text-sm text-gray-500">{area.avgResponseTime}</div>
                      </div>
                      <Progress
                        // Invert the value so shorter times show more progress
                        value={Math.round(100 - (Number.parseInt(area.avgResponseTime) / 10) * 100)}
                        className="h-2 bg-gray-200"
                        indicatorClassName={
                          Number.parseInt(area.avgResponseTime) < 5
                            ? "bg-emerald-500"
                            : Number.parseInt(area.avgResponseTime) < 7
                              ? "bg-amber-500"
                              : "bg-red-500"
                        }
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bike Allocation Recommendations</CardTitle>
              <CardDescription>Suggested bike distribution based on demand patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Area</TableHead>
                    <TableHead>Current Bikes</TableHead>
                    <TableHead>Recommended</TableHead>
                    <TableHead>Deficit</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeAnalytics.recommendations.map((rec) => (
                    <TableRow key={rec.id}>
                      <TableCell className="font-medium">{rec.area}</TableCell>
                      <TableCell>{rec.currentBikes}</TableCell>
                      <TableCell>{rec.recommendedBikes}</TableCell>
                      <TableCell className="font-medium text-red-600">+{rec.deficit}</TableCell>
                      <TableCell>
                        <Badge className={`border ${getPriorityColor(rec.priority)}`}>{rec.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" className="bg-[#32443E] hover:bg-[#3a5049]">
                          Allocate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Total additional bikes needed: <strong>19</strong>
              </div>
              <Button variant="outline">View All Areas</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Insights</CardTitle>
              <CardDescription>Key findings and recommendations for bike allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <h4 className="mb-2 font-medium text-amber-800">Peak Hour Alert</h4>
                  <p className="text-sm text-amber-700">
                    Downtown Business District experiences a 35% increase in requests between 12-2 PM. Consider
                    temporary reallocation of 5-7 bikes during this window.
                  </p>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                  <h4 className="mb-2 font-medium text-emerald-800">Efficiency Opportunity</h4>
                  <p className="text-sm text-emerald-700">
                    Reallocating 3 bikes from Residential Heights to University Campus could improve overall response
                    times by approximately 18%.
                  </p>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-2 font-medium text-blue-800">Upcoming Event</h4>
                  <p className="text-sm text-blue-700">
                    Central Park concert this weekend will likely increase demand by 40-50%. Prepare to allocate 8-10
                    additional bikes to this area.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-[#32443E] hover:bg-[#3a5049]">Generate Allocation Plan</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
