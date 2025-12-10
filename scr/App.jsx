import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RootLayout } from './components/RootLayout.jsx'
import { Home } from './components/Home.jsx'
import { About } from './components/About.jsx'
import { SomethingList } from './components/SomethingList.jsx'
import { SomethingDetails } from './components/SomethingDetails.jsx'
import { Login } from './components/Login.jsx'
import { Signup } from './components/Signup.jsx'
import { Profile } from './components/Profile.jsx'
import { Favorites } from './components/Favorites.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="items" element={<SomethingList />} />
          <Route path="items/:id" element={<SomethingDetails />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App


