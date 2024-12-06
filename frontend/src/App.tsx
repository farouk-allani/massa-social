import "./App.css";
import { useMemo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTheme } from "@mui/material/styles";
import {
  Backdrop,
  CircularProgress,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { themeSettings } from "./theme";
import { AppDispatch, RootState } from "./redux/store";
import ConnectWalletModal from "./components/ConnectWalletModal";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./components/homePage";
import ProfilePage from "./components/profilePage";
import { checkUserProfile } from "./redux/slices/userSlice";
import ProfileSetupPage from "./components/ProfileSetupPage";

function App() {
  const mode = useSelector((state: RootState) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch<AppDispatch>();
  const { currentWallet, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      if (currentWallet && connectedAccount) {
        await dispatch(checkUserProfile());
        setIsCheckingProfile(false);
      }
    };
    checkProfile();
  }, [currentWallet, connectedAccount, dispatch]);

  // if (isCheckingProfile) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ConnectWalletModal />
            {/* <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 9999,
              }}
              open={isCheckingProfile}
            >
              <CircularProgress color="inherit" />
            </Backdrop> */}
            <Routes>
              {/* <Route path="/" element={<HomePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} /> */}

              {user === null && isCheckingProfile == false ? (
                <Route path="/*" element={<ProfileSetupPage />} />
              ) : (
                <>
                  <Route path="/" element={<HomePage />} />

                  <Route path="/profile/:userId" element={<ProfilePage />} />
                </>
              )}
            </Routes>
          </ThemeProvider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
