import { create } from "zustand";
import api from "../lib/axios";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuth: false,
  loading: false,
  error: null,

  // =====================
  // REGISTER
  // =====================
  register: async (name, email, password) => {
    set({ loading: true, error: null });

    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (!res.data.success) {
        throw new Error("Registration failed");
      }

      const success = await get().fetchUser();
      if(!success){
        set({loading: false});
        return false;
      }
      return true;
    } catch (err) {
      set({
        user: null,
        isAuth: false,
        loading: false,
        error: err.response?.data?.message || "Registration failed",
      });
      return false;
    }
  },

  // =====================
  // LOGIN
  // =====================
  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (!res.data.success) {
        throw new Error("Login failed");
      }

      const success  = await get().fetchUser();
      if(!success){
        set({loading: false});
        return false;
      }
      return true;
    } catch (err) {
      set({
        user: null,
        isAuth: false,
        loading: false,
        error: err.response?.data?.message || "Login failed",
      });
      return false;
    }
  },

  // =====================
  // FETCH USER (HYDRATE)
  // =====================
  fetchUser: async () => {
    try {
      const res = await api.get("/api/auth/data");

      if (!res.data.userData) {
        throw new Error("No user data");
      }

      set({
        user: res.data.userData,
        isAuth: true,
        loading: false,
        error: null,
      });

      return true;
    } catch {
      set({
        user: null,
        isAuth: false,
        loading: false,
      });

      return false;
    }
  },

  // =====================
  // LOGOUT
  // =====================
  logout: async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      set({
        user: null,
        isAuth: false,
        error: null,
      });
    }
  },

  // =====================
  // HELPERS
  // =====================
  getUserName: () => get().user?.name || "",

  getProfileInitial: () => {
    const name = get().user?.name;
    return name ? name.charAt(0).toUpperCase() : "";
  },
}));

export default useAuthStore;
