import type { Metadata } from "next"
import SettingsComponent from "@/components/settings"

export const metadata: Metadata = {
  title: "Settings | SendMe Admin Dashboard",
  description: "Configure your SendMe admin dashboard settings",
}

export default function SettingsPage() {
  return <SettingsComponent />
}
