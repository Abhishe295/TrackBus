import { create } from "zustand";
import api from "../lib/axios";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuth: false,
  loading: false,
  error: null,

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        await get().fetchUser(); // 🔑 hydrate user
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Registration failed",
        loading: false,
      });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        await get().fetchUser(); // 🔑 hydrate user
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || "Login failed",
        loading: false,
      });
    }
  },

  fetchUser: async () => {
    try {
      const res = await api.get("/api/auth/data");

      set({
        user: res.data.userData,
        isAuth: true,
        loading: false,
      });
    } catch {
      set({
        user: null,
        isAuth: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    try {
      await api.post("/api/auth/logout");
      set({
        user: null,
        isAuth: false,
      });
    } catch {}
  },

  getUserName: () => get().user?.name || "",

  getProfileInitial: () => {
    const name = get().user?.name;
    return name ? name.charAt(0).toUpperCase() : "";
  },
}));

export default useAuthStore;
