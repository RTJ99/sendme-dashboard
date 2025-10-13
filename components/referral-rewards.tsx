"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, CreditCard, Edit, Plus, Save, Trash2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export default function ReferralRewards() {
  const [activeTab, setActiveTab] = useState("structures")
  const [isAddingTier, setIsAddingTier] = useState(false)
  const [isAddingBonus, setIsAddingBonus] = useState(false)
  const [isAddingPromotion, setIsAddingPromotion] = useState(false)
  const [isAddingMilestone, setIsAddingMilestone] = useState(false)
  const [date, setDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  // Sample data for reward structures
  const rewardStructures = [
    {
      id: 1,
      name: "Standard Referral",
      description: "Basic referral reward for all riders",
      baseAmount: 25,
      active: true,
      paymentType: "Cash",
      eligibility: "All riders",
      createdAt: "2023-05-15",
    },
    {
      id: 2,
      name: "Premium Referral",
      description: "Enhanced rewards for premium bike referrals",
      baseAmount: 50,
      active: true,
      paymentType: "Cash",
      eligibility: "Verified riders",
      createdAt: "2023-06-20",
    },
    {
      id: 3,
      name: "Tiered Rewards",
      description: "Volume-based rewards that increase with referral count",
      baseAmount: 20,
      active: false,
      paymentType: "Account Credit",
      eligibility: "All riders",
      createdAt: "2023-07-10",
    },
  ]

  // Sample data for tiers
  const tiers = [
    { id: 1, name: "Starter", minReferrals: 1, maxReferrals: 5, reward: 20 },
    { id: 2, name: "Bronze", minReferrals: 6, maxReferrals: 15, reward: 30 },
    { id: 3, name: "Silver", minReferrals: 16, maxReferrals: 30, reward: 40 },
    { id: 4, name: "Gold", minReferrals: 31, maxReferrals: 50, reward: 50 },
    { id: 5, name: "Platinum", minReferrals: 51, maxReferrals: null, reward: 75 },
  ]

  // Sample data for bonuses
  const bonuses = [
    {
      id: 1,
      name: "First-Time Rider Bonus",
      description: "Extra bonus when referring a first-time rider",
      amount: 15,
      type: "Fixed",
      condition: "Referred user is a new rider",
      active: true,
    },
    {
      id: 2,
      name: "Premium Bike Bonus",
      description: "Bonus for referring riders who select premium bikes",
      amount: 25,
      type: "Fixed",
      condition: "Referred rider selects a premium bike model",
      active: true,
    },
    {
      id: 3,
      name: "Quick Activation Bonus",
      description: "Bonus if referred rider activates within 48 hours",
      amount: 10,
      type: "Fixed",
      condition: "Referred rider activates account within 48 hours",
      active: false,
    },
  ]

  // Sample data for promotions
  const promotions = [
    {
      id: 1,
      name: "Summer Boost",
      description: "Increased referral rewards for summer season",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      bonusType: "Percentage",
      bonusAmount: 25,
      active: true,
      status: "Active",
    },
    {
      id: 2,
      name: "Holiday Special",
      description: "Special holiday referral bonus",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      bonusType: "Fixed",
      bonusAmount: 20,
      active: true,
      status: "Scheduled",
    },
    {
      id: 3,
      name: "Spring Campaign",
      description: "Spring referral promotion",
      startDate: "2023-03-01",
      endDate: "2023-04-30",
      bonusType: "Percentage",
      bonusAmount: 15,
      active: false,
      status: "Ended",
    },
  ]

  // Sample data for milestones
  const milestones = [
    {
      id: 1,
      name: "First 5 Referrals",
      description: "Bonus for reaching 5 successful referrals",
      threshold: 5,
      reward: 50,
      type: "One-time",
      active: true,
    },
    {
      id: 2,
      name: "10 Referrals Club",
      description: "Bonus for reaching 10 successful referrals",
      threshold: 10,
      reward: 100,
      type: "One-time",
      active: true,
    },
    {
      id: 3,
      name: "25 Referrals Elite",
      description: "Elite status bonus at 25 referrals",
      threshold: 25,
      reward: 250,
      type: "One-time",
      active: true,
    },
  ]

  // Sample data for preview scenarios
  const previewScenarios = [
    {
      id: 1,
      name: "New Rider Referral",
      description: "Standard referral of a new rider",
      baseReward: 25,
      bonuses: [{ name: "First-Time Rider Bonus", amount: 15 }],
      totalReward: 40,
    },
    {
      id: 2,
      name: "Premium Bike Referral",
      description: "Referral for a premium bike during summer promotion",
      baseReward: 50,
      bonuses: [
        { name: "Premium Bike Bonus", amount: 25 },
        { name: "Summer Boost (25%)", amount: 18.75 },
      ],
      totalReward: 93.75,
    },
    {
      id: 3,
      name: "10th Referral Milestone",
      description: "A rider's 10th successful referral",
      baseReward: 30,
      bonuses: [{ name: "10 Referrals Club", amount: 100 }],
      totalReward: 130,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <div className="flex-1 space-y-4 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Referral Rewards & Bonuses</h2>
            <p className="text-muted-foreground">Customize and manage your referral program incentives</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/referrals">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Referrals
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="structures" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="structures">Reward Structures</TabsTrigger>
            <TabsTrigger value="tiers">Tiered Rewards</TabsTrigger>
            <TabsTrigger value="bonuses">Bonus Rules</TabsTrigger>
            <TabsTrigger value="promotions">Seasonal Promotions</TabsTrigger>
            <TabsTrigger value="preview">Reward Preview</TabsTrigger>
          </TabsList>

          {/* Reward Structures Tab */}
          <TabsContent value="structures" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Manage Reward Structures</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                    <Plus className="mr-2 h-4 w-4" /> Add Reward Structure
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Create New Reward Structure</DialogTitle>
                    <DialogDescription>Define a new reward structure for your referral program</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Structure Name</Label>
                      <Input id="name" placeholder="e.g., Premium Referral" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe this reward structure" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="baseAmount">Base Reward Amount ($)</Label>
                        <Input id="baseAmount" type="number" placeholder="25" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="paymentType">Payment Type</Label>
                        <Select defaultValue="cash">
                          <SelectTrigger id="paymentType">
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit">Account Credit</SelectItem>
                            <SelectItem value="points">Reward Points</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="eligibility">Eligibility</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="eligibility">
                          <SelectValue placeholder="Select eligibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Riders</SelectItem>
                          <SelectItem value="verified">Verified Riders</SelectItem>
                          <SelectItem value="premium">Premium Riders</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="active" defaultChecked />
                      <Label htmlFor="active">Active</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancel
                    </Button>
                    <Button className="bg-[#32443E] hover:bg-[#3a5049]">Create Structure</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {rewardStructures.map((structure) => (
                <Card key={structure.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle>{structure.name}</CardTitle>
                        {structure.active ? (
                          <Badge className="bg-[#86E30F] text-[#32443E]">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{structure.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Base Amount</p>
                        <p className="text-lg font-bold text-[#32443E]">${structure.baseAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Payment Type</p>
                        <p>{structure.paymentType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Eligibility</p>
                        <p>{structure.eligibility}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-gray-500">
                    Created on {new Date(structure.createdAt).toLocaleDateString()}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tiered Rewards Tab */}
          <TabsContent value="tiers" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Tiered Reward System</h3>
              <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={() => setIsAddingTier(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Tier
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Volume-Based Reward Tiers</CardTitle>
                <CardDescription>
                  Configure rewards that increase based on the number of successful referrals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tier Name</TableHead>
                      <TableHead>Min Referrals</TableHead>
                      <TableHead>Max Referrals</TableHead>
                      <TableHead>Reward Amount ($)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tiers.map((tier) => (
                      <TableRow key={tier.id}>
                        <TableCell className="font-medium">{tier.name}</TableCell>
                        <TableCell>{tier.minReferrals}</TableCell>
                        <TableCell>{tier.maxReferrals || "Unlimited"}</TableCell>
                        <TableCell>${tier.reward}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {isAddingTier && (
                      <TableRow>
                        <TableCell>
                          <Input placeholder="Tier Name" className="h-8" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="Min" className="h-8" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="Max" className="h-8" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" placeholder="Amount" className="h-8" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" className="h-8 text-green-600">
                              <Save className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-red-500"
                              onClick={() => setIsAddingTier(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Riders will automatically receive the reward amount based on their tier level.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Reset to Default</Button>
                  <Button className="bg-[#32443E] hover:bg-[#3a5049]">Save Changes</Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Bonus Rules Tab */}
          <TabsContent value="bonuses" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Bonus Rules Engine</h3>
              <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={() => setIsAddingBonus(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Bonus Rule
              </Button>
            </div>

            <div className="grid gap-4">
              {bonuses.map((bonus) => (
                <Card key={bonus.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle>{bonus.name}</CardTitle>
                        {bonus.active ? (
                          <Badge className="bg-[#86E30F] text-[#32443E]">Active</Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{bonus.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bonus Amount</p>
                        <p className="text-lg font-bold text-[#32443E]">
                          {bonus.type === "Percentage" ? `${bonus.amount}%` : `$${bonus.amount}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bonus Type</p>
                        <p>{bonus.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Condition</p>
                        <p>{bonus.condition}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center space-x-2">
                      <Switch id={`active-${bonus.id}`} checked={bonus.active} />
                      <Label htmlFor={`active-${bonus.id}`}>{bonus.active ? "Active" : "Inactive"}</Label>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {isAddingBonus && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardHeader>
                    <CardTitle>
                      <Input placeholder="Bonus Rule Name" className="text-lg font-bold" />
                    </CardTitle>
                    <CardDescription>
                      <Textarea placeholder="Describe this bonus rule" className="mt-2" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="bonusAmount">Bonus Amount</Label>
                        <Input id="bonusAmount" type="number" placeholder="Amount" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="bonusType">Bonus Type</Label>
                        <Select defaultValue="fixed">
                          <SelectTrigger id="bonusType" className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="condition">Condition</Label>
                        <Input id="condition" placeholder="e.g., First-time rider" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="newBonusActive" defaultChecked />
                      <Label htmlFor="newBonusActive">Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsAddingBonus(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#32443E] hover:bg-[#3a5049]">Save Bonus Rule</Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Seasonal Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Seasonal Promotions</h3>
              <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={() => setIsAddingPromotion(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Promotion
              </Button>
            </div>

            <div className="grid gap-4">
              {promotions.map((promo) => (
                <Card key={promo.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle>{promo.name}</CardTitle>
                        <Badge
                          className={
                            promo.status === "Active"
                              ? "bg-[#86E30F] text-[#32443E]"
                              : promo.status === "Scheduled"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-500 text-white"
                          }
                        >
                          {promo.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{promo.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bonus Amount</p>
                        <p className="text-lg font-bold text-[#32443E]">
                          {promo.bonusType === "Percentage" ? `${promo.bonusAmount}%` : `$${promo.bonusAmount}`}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bonus Type</p>
                        <p>{promo.bonusType}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Start Date</p>
                        <p>{new Date(promo.startDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">End Date</p>
                        <p>{new Date(promo.endDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center space-x-2">
                      <Switch id={`active-promo-${promo.id}`} checked={promo.active} />
                      <Label htmlFor={`active-promo-${promo.id}`}>{promo.active ? "Active" : "Inactive"}</Label>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {isAddingPromotion && (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardHeader>
                    <CardTitle>
                      <Input placeholder="Promotion Name" className="text-lg font-bold" />
                    </CardTitle>
                    <CardDescription>
                      <Textarea placeholder="Describe this promotion" className="mt-2" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="bonusAmount">Bonus Amount</Label>
                        <Input id="bonusAmount" type="number" placeholder="Amount" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="bonusType">Bonus Type</Label>
                        <Select defaultValue="percentage">
                          <SelectTrigger id="bonusType" className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                              <Calendar className="mr-2 h-4 w-4" />
                              {date ? format(date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                              <Calendar className="mr-2 h-4 w-4" />
                              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="newPromoActive" defaultChecked />
                      <Label htmlFor="newPromoActive">Active</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsAddingPromotion(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-[#32443E] hover:bg-[#3a5049]">Save Promotion</Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </div>

            {/* Milestone Bonuses Section */}
            <div className="mt-8">
              <div className="flex justify-between mb-4">
                <h3 className="text-lg font-medium">Milestone Bonuses</h3>
                <Button className="bg-[#32443E] hover:bg-[#3a5049]" onClick={() => setIsAddingMilestone(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Milestone
                </Button>
              </div>

              <div className="grid gap-4">
                {milestones.map((milestone) => (
                  <Card key={milestone.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CardTitle>{milestone.name}</CardTitle>
                          {milestone.active ? (
                            <Badge className="bg-[#86E30F] text-[#32443E]">Active</Badge>
                          ) : (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{milestone.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Referral Threshold</p>
                          <p className="text-lg font-bold text-[#32443E]">{milestone.threshold} referrals</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Reward Amount</p>
                          <p className="text-lg font-bold text-[#32443E]">${milestone.reward}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Bonus Type</p>
                          <p>{milestone.type}</p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex items-center space-x-2">
                        <Switch id={`active-milestone-${milestone.id}`} checked={milestone.active} />
                        <Label htmlFor={`active-milestone-${milestone.id}`}>
                          {milestone.active ? "Active" : "Inactive"}
                        </Label>
                      </div>
                    </CardFooter>
                  </Card>
                ))}

                {isAddingMilestone && (
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardHeader>
                      <CardTitle>
                        <Input placeholder="Milestone Name" className="text-lg font-bold" />
                      </CardTitle>
                      <CardDescription>
                        <Textarea placeholder="Describe this milestone bonus" className="mt-2" />
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="threshold">Referral Threshold</Label>
                          <Input id="threshold" type="number" placeholder="Number of referrals" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="milestoneReward">Reward Amount ($)</Label>
                          <Input id="milestoneReward" type="number" placeholder="Amount" className="mt-1" />
                        </div>
                        <div>
                          <Label htmlFor="milestoneType">Bonus Type</Label>
                          <Select defaultValue="one-time">
                            <SelectTrigger id="milestoneType" className="mt-1">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="one-time">One-time</SelectItem>
                              <SelectItem value="recurring">Recurring</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="newMilestoneActive" defaultChecked />
                        <Label htmlFor="newMilestoneActive">Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsAddingMilestone(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-[#32443E] hover:bg-[#3a5049]">Save Milestone</Button>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Reward Preview Tab */}
          <TabsContent value="preview" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Reward Preview Tool</h3>
              <Button className="bg-[#32443E] hover:bg-[#3a5049]">
                <Plus className="mr-2 h-4 w-4" /> Create New Scenario
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Test Reward Scenarios</CardTitle>
                <CardDescription>Preview how rewards will be calculated in different scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {previewScenarios.map((scenario) => (
                    <Collapsible key={scenario.id} className="border rounded-md">
                      <CollapsibleTrigger className="flex w-full items-center justify-between p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{scenario.name}</h4>
                          <Badge variant="outline">${scenario.totalReward}</Badge>
                        </div>
                        <ChevronRight className="h-5 w-5 transition-transform ui-open:rotate-90" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="px-4 pb-4">
                        <div className="rounded-md bg-gray-50 p-4">
                          <p className="mb-2 text-sm text-gray-600">{scenario.description}</p>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Base Reward:</span>
                              <span className="font-medium">${scenario.baseReward}</span>
                            </div>
                            <Separator />
                            {scenario.bonuses.map((bonus, index) => (
                              <div key={index} className="flex items-center justify-between">
                                <span>{bonus.name}:</span>
                                <span className="font-medium">${bonus.amount}</span>
                              </div>
                            ))}
                            <Separator />
                            <div className="flex items-center justify-between">
                              <span className="font-bold">Total Reward:</span>
                              <span className="font-bold text-[#32443E]">${scenario.totalReward}</span>
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  Use this tool to test how your reward structures and bonuses will work together.
                </div>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" /> Export Scenarios
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
