// src/App.jsx

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { LocaleProvider } from "./context/LocaleContext";
import MainLayout from "./layouts/MainLayout";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen text-slate-900">
              <MainLayout>
                <AppRoutes />
              </MainLayout>

              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 2500,
                  style: {
                    borderRadius: "14px",
                    background: "#0f172a",
                    color: "#fff",
                    padding: "12px 16px",
                    fontSize: "14px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#14b8a6",
                      secondary: "#ffffff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#ef4444",
                      secondary: "#ffffff",
                    },
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </LocaleProvider>
    </ThemeProvider>
  );
}

export default App;
