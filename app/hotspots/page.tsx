import type { Metadata } from "next"
import Hotspots from "@/components/hotspots"

export const metadata: Metadata = {
  title: "Hotspots | SendMe Admin",
  description: "View and manage delivery hotspots",
}

export default function HotspotsPage() {
  return <Hotspots />
}
