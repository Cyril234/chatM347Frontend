import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/SignUp.tsx'
import ChatPage from './pages/ChatPage.tsx'
import ProtectedRoute from './routes/ProtectedRoute.tsx'
import { ChatProvider } from './context/ChatProvider.tsx'

export default function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ChatPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChatProvider>
  )
}
