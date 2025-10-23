import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import usersReducer from "./features/usersSlice";
import axios from "axios";

// Read token from localStorage so axios can be primed on load
const token = localStorage.getItem("accessToken");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
  // explicitly enable devTools in non-production so Redux DevTools extension works
  devTools: process.env.NODE_ENV !== "production",
});

// Expose store in development for easy inspection from the browser console
if (process.env.NODE_ENV !== "production") {
  try {
    // friendly aliases for quick debugging
    window.__APP_STORE__ = store;
    window.__APP_GET_STATE__ = store.getState.bind(store);
    window.__APP_DISPATCH__ = store.dispatch.bind(store);
  } catch (e) {
    // ignore in non-browser environments
  }
}

export default store;
