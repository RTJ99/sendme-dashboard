import UsersPage from "@/components/users-page"
import ProtectedRoute from "@/components/protected-route"

export default function Users() {
  return (
    <ProtectedRoute requiredRole="admin">
      <UsersPage />
    </ProtectedRoute>
  )
}
