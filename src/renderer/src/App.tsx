import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ipcRenderer } from "electron";
import { session } from "@electron/remote";
import NavBar from "./components/Navbar2";
import Home from "./pages/Home";
import Contest from "./pages/Contests";
import Attempt from "./pages/ContestAttempt";
import { useEffect, useState } from "react";
export default function App(): JSX.Element {
  const [cookies, setCookies] = useState<{ cb_auth?: string; one_auth?: string }>({});
  useEffect(() => {
    async function getCookies() {
      const cbAuthCookie = await session.defaultSession.cookies.get({ name: "cb_auth" });
      const oneAuthCookie = await session.defaultSession.cookies.get({ name: "one_auth" });

      setCookies({
        cb_auth: cbAuthCookie.length ? cbAuthCookie[0].value : null,
        one_auth: oneAuthCookie.length ? oneAuthCookie[0].value : null,
      });
    }

    getCookies();
  }, []);

  return (
    <Router>
      <NavBar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contests/:id" element={<Contest />} />
          <Route path="/contests/:contestId/attempt/:contentId" element={<Attempt />} />
        </Routes>
      </div>
    </Router>
  );
}
