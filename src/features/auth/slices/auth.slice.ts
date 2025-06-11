import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import apiClient, { setAuthToken } from '@/configs/apiClient';

import type { FormSignUp } from "@/types";

interface User {
  id: string;
  email: string;
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

// Clean initialState - Redux Persist sẽ restore state
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
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
      
      // Set token for API client
      setAuthToken(accessToken);

      return { user, token: accessToken };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.message || "Login failed";
      return rejectWithValue(errorMessage);
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
      
      // Set token for API client
      setAuthToken(accessToken);
      
      return { user, token: accessToken };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.message || "Registration failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Logout async thunk
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear token
      setAuthToken(null);
      return null;
    } catch (error: unknown) {
      setAuthToken(null);
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.message || "Logout failed";
      rejectWithValue(errorMessage);
      return null;
    }
  }
);

// Get current user (verify token)
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      
      if (!token) {
        throw new Error("No token found");
      }

      setAuthToken(token);
      const response = await apiClient.get("/user/me");

      return { user: response.data.data.user, token };
    } catch (error: unknown) {
      setAuthToken(null);
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.message || "Authentication failed";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getUserByToken = createAsyncThunk(
  "auth/getUserByToken",
  async (token: string, { rejectWithValue }) => {
    try {
      console.log('🚀 Calling getUserByToken with:', token);
      
      // Set token for this request
      setAuthToken(token);
      
      const response = await apiClient.get("/user/me");
      console.log('✅ API response:', response.data);
      
      if (!response.data?.data) {
        throw new Error("User data not found in response");
      }
      
      return { 
        user: response.data.data, 
        token 
      };
    } catch (error: unknown) {
      console.error('❌ getUserByToken error:', error);
      
      // Clear token on error
      setAuthToken(null);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as any)?.response?.data?.message || "Failed to fetch user by token";
      return rejectWithValue(errorMessage);
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
      setAuthToken(null);
    },
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
    },
    // Action để khôi phục token khi app reload từ persist
    restoreAuth: (state) => {
      if (state.token) {
        setAuthToken(state.token);
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
      })
      .addCase(getUserByToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserByToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getUserByToken.rejected, (state) => {
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