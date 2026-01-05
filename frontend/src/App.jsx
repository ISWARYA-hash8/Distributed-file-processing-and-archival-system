import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import MyFilesPage from "./pages/MyFilesPage";
import ArchivedFilesPage from "./pages/ArchivedFiles";
import { isLoggedIn } from "./utils/auth";
import Layout from "./layouts/Layout";

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="myfiles" element={<MyFilesPage />} />
          <Route path="archived" element={<ArchivedFilesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
