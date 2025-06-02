import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {apiClient} from "@/configs";
import type { FormSignUp } from "@/types";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
 isAuthenticated: !!localStorage.getItem('token'),
};

// Login async thunk
export const login = createAsyncThunk(
  "auth/login",
  async (
    userData: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/login", userData);
      if (!response.data?.data?.user || !response.data?.data?.token) {
        throw new Error("Invalid response from server");
      }

      const { user, token } = response.data.data;
      const accessToken = token.access_token || token;
      
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return { user, token: accessToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Register async thunk
export const register = createAsyncThunk(
  "auth/register",
  async (
    userData: FormSignUp,
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post("/auth/register", userData);
      if (!response.data?.data?.user || !response.data?.data?.token) {
        throw new Error("Invalid response from server");
      }

      const { user, token } = response.data.data;
      const accessToken = token.access_token || token;
      
      return { user, token: accessToken };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// Logout async thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // await apiClient.post("/auth/logout");
      delete apiClient.defaults.headers.common["Authorization"];
      return null;
    } catch (error) {
      delete apiClient.defaults.headers.common["Authorization"];
      rejectWithValue(error.response?.data?.message || "Logout failed");
      return null;
    }
  }
);

// Get current user (verify token)
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        throw new Error("No token found");
      }

      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await apiClient.get("/user/me");

      return { user: response.data.data.user, token };
    } catch (error) {
      delete apiClient.defaults.headers.common["Authorization"];
      return rejectWithValue(
        error.response?.data?.message || "Authentication failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      delete apiClient.defaults.headers.common["Authorization"];
    },
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
   
    // Action để khôi phục token khi app reload
    restoreAuth: (state) => {
      if (state.token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      // Get current user cases
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { 
  clearError, 
  clearAuth, 
  loginStart, 
  loginSuccess, 
  loginFailure,
  restoreAuth 
} = authSlice.actions;

export default authSlice.reducer;