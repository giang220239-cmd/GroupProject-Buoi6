import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "./features/usersSlice";
import Header from "./Header";
import UserList from "./UserList";
import AddUser from "./AddUser";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Profile from "./Profile";
import Admin from "./Admin";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import "./UserManagement.css";
import axios from "axios"; // Import axios để sử dụng
import ProtectedRoute from "./ProtectedRoute";
import RefreshTokenDemo from "./RefreshTokenDemo";

function App() {
  const dispatch = useDispatch();
  const users = useSelector((s) => s.users.items);
  const usersStatus = useSelector((s) => s.users.status);
  const usersError = useSelector((s) => s.users.error);

  // Axios interceptor for token refresh
  // Register interceptor once to avoid duplicate handlers on re-renders
  React.useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        try {
          const originalRequest = error.config;
          const status = error?.response?.status;
          if (status === 401 && originalRequest) {
            // Prevent retrying the same request too many times
            const retryKey = `retry_${originalRequest.url}`;
            const retries = parseInt(
              sessionStorage.getItem(retryKey) || "0",
              10
            );
            if (retries >= 2) {
              return Promise.reject(error);
            }
            originalRequest._retry = true;
            sessionStorage.setItem(retryKey, String(retries + 1));
            try {
              const { data } = await axios.post(
                "http://localhost:8080/api/auth/refresh",
                {
                  refreshToken: localStorage.getItem("refreshToken"),
                }
              );
              localStorage.setItem("accessToken", data.accessToken);
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${data.accessToken}`;
              // clear retry counter for this request
              try {
                const retryKey = `retry_${originalRequest.url}`;
                sessionStorage.removeItem(retryKey);
              } catch (e) {}
              return axios(originalRequest);
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              // Clear local auth state
              localStorage.clear();
              // Avoid redirect loops: only redirect if not already on /login and throttle redirects
              try {
                const now = Date.now();
                const last = parseInt(
                  sessionStorage.getItem("lastRedirect") || "0",
                  10
                );
                const onLogin = window.location.pathname === "/login";
                if (!onLogin && now - last > 5000) {
                  sessionStorage.setItem("lastRedirect", String(now));
                  window.location.href = "/login";
                }
              } catch (e) {
                // ignore
              }
            }
          }
        } catch (e) {
          // If error doesn't have expected shape, just fallthrough
          console.error("Interceptor error:", e);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  useEffect(() => {
    if (usersStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [usersStatus, dispatch]);

  return (
    <Router>
      <div className="app-container">
        <Header totalUsers={users.length} />
        <Routes>
          <Route
            path="/"
            element={
              <UserList
                users={users}
                loading={usersStatus === "loading"}
                usersError={usersError}
                onUsersChange={null}
                refreshUsers={() => dispatch(fetchUsers())}
              />
            }
          />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/demo" element={<RefreshTokenDemo />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
