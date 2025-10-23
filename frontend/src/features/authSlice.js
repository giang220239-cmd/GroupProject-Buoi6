import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Thunk: login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });
      // Expect backend returns { accessToken, user, refreshToken }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Thunk: refresh token
export const refresh = createAsyncThunk(
  "auth/refresh",
  async ({ refreshToken }, { rejectWithValue }) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/refresh", {
        refreshToken,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      delete axios.defaults.headers.common["Authorization"];
    },
    setCredentials(state, action) {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      if (accessToken) {
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      }
      if (user) localStorage.setItem("user", JSON.stringify(user));
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { accessToken, refreshToken, user } = action.payload;
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.user = user;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        const { accessToken } = action.payload;
        state.accessToken = accessToken;
        localStorage.setItem("accessToken", accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      })
      .addCase(refresh.rejected, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.user = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;
