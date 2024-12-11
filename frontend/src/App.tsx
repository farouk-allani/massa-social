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
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/homePage";
import ProfilePage from "./components/profilePage";
import { checkUserProfile } from "./redux/slices/userSlice";
import ProfileSetupPage from "./components/ProfileSetupPage";
// import { useNavigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import { useNavigate } from "react-router-dom";
import CreatePage from "./components/createPagePage";

function App() {
  const mode = useSelector((state: RootState) => state.user.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const dispatch = useDispatch<AppDispatch>();
  const { currentWallet, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [isCheckingProfile, setIsCheckingProfile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("currentWallet&&&&", currentWallet);
    console.log("connectedAccount&&&&&", connectedAccount);
    const checkProfile = async () => {
      if (currentWallet && connectedAccount?.address) {
        setIsCheckingProfile(true);
        await dispatch(checkUserProfile());
        setIsCheckingProfile(false);
        navigate("/home");
      }
    };
    checkProfile();
  }, [currentWallet, connectedAccount, dispatch]);

  return (
    <>
      <div className="App">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* <ConnectWalletModal /> */}
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 9999,
            }}
            open={isCheckingProfile}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            {/* {user === null && isCheckingProfile == false ? ( */}
            <Route path="/profile-setup" element={<ProfileSetupPage />} />

            <Route path="/home" element={<HomePage />} />

            <Route path="/profile/:userId" element={<ProfilePage />} />
            <Route path="/create-page" element={<CreatePage />} />
          </Routes>
        </ThemeProvider>
      </div>
    </>
  );
}

export default App;
