import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NoPage from "./Pages/NoPage";
import Profile from "./Pages/Profile";
import SingleAuctionItem from "./Pages/SingleAuctionItem";
import AddAuction from './Pages/AddAuction';
import AuctionList from './Pages/AuctionList';
import LogoutPage from './Pages/LogoutPage';  // Import the LogoutPage component
import { UserProvider } from './context/UserContext'; // User authentication context
import { AuctionProvider } from './context/AuctionContext'; // Auction context provider

function App() {
  return (
    <BrowserRouter>
      {/* Wrapping components inside context providers */}
      <UserProvider>
        <AuctionProvider>
          <Routes>
            {/* Main layout wrapping all pages */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} /> {/* Home page */}
              <Route path="login" element={<Login />} /> {/* Login page */}
              <Route path="register" element={<Register />} /> {/* Register page */}
              <Route path="profile" element={<Profile />} /> {/* Profile page */}
              <Route path="auction-list" element={<AuctionList />} /> {/* Auction list page */}
              <Route path="add-auction" element={<AddAuction />} /> {/* Add auction page */}
              <Route path="auction/:id" element={<SingleAuctionItem />} /> {/* Single auction item page */}
              <Route path="logout" element={<LogoutPage />} /> {/* Logout page */}
              <Route path="*" element={<NoPage />} /> {/* Page not found */}
            </Route>
          </Routes>
        </AuctionProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
