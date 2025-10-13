import DriverDetail from "@/components/driver-detail"
import ProtectedRoute from "@/components/protected-route"

export default function RiderProfilePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <DriverDetail />
    </ProtectedRoute>
  )
}