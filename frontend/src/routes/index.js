import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/HomePage";
import NotFound from "../pages/Home/NotFound";

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/" element={<HomePage />} />
    <Route path="/" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
