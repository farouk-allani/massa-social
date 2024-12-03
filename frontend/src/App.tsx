import "./App.css";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { themeSettings } from "./theme";
import { RootState } from "./redux/store";
import ConnectWalletModal from "./components/ConnectWalletModal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/homePage";
import ProfilePage from "./components/profilePage";

function App() {
  const mode = useSelector((state: RootState) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ConnectWalletModal />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
