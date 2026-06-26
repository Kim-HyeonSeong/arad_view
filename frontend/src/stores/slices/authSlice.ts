import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: sessionStorage.getItem('access_token'),
  refreshToken: sessionStorage.getItem('refresh_token'),
  isAuthenticated: !!sessionStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      sessionStorage.setItem('access_token', action.payload.accessToken);
      sessionStorage.setItem('refresh_token', action.payload.refreshToken);
    },
    loginFailure(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
    },
    logout(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      sessionStorage.clear();
    },
    updateAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      sessionStorage.setItem('access_token', action.payload);
    },
  },
});

export const { loginSuccess, loginFailure, logout, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
