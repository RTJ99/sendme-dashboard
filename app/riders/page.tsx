import RidersPage from "@/components/riders-page"
import ProtectedRoute from "@/components/protected-route"

export default function Riders() {
  return (
    <ProtectedRoute requiredRole="admin">
      <RidersPage />
    </ProtectedRoute>
  )
}
