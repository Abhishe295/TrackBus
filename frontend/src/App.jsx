import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useThemeStore } from "./lib/useTheme.js";
import useAuthStore from "./store/useAuthStore";

import LoginPage from "./Pages/LoginPage";
import HomePage from "./Pages/HomePage";
import ThemePage from "./Pages/ThemePage";
import BusPage from "./Pages/BusPage.jsx";

function App() {
  const { theme } = useThemeStore();
  const fetchUser = useAuthStore((s) => s.fetchUser);

  // 🔑 Rehydrate auth from cookie on refresh
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="relative h-full w-full" data-theme={theme}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path = "/bus/:busNumber" element={<BusPage/>}/>
        <Route path="/theme" element={<ThemePage />} />
      </Routes>
    </div>
  );
}

export default App;
