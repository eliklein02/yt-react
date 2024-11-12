import React from "react";
import HomePage from "./HomePage";
import FormPage from "./FormPage";
import WatchPage from "./WatchPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../styles/index.css";
import Logout from "./Logout";
import ChannelPage from "./ChannelPage";
import ProfilePage from "./ProfilePage";
import FavoritesPage from "./FavoritesPage";
import EditProfilePage from "./EditProfilePage";
import ServerErrorPage from "./ServerErrorPage";
import RandomPage from "./RandomPage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<FormPage accountState="logging in" />} />
        <Route
          path="/register"
          element={<FormPage accountState="registering" />}
        />
        <Route path="/logout" element={<Logout />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/channel" element={<ChannelPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/edit" element={<EditProfilePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/random" element={<RandomPage />} />
        <Route path="/server_error" element={<ServerErrorPage />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
