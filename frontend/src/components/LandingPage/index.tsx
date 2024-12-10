import React from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import ConnectWalletModal from "../ConnectWalletModal";

type Props = {};

const LandingPage = (props: Props) => {
  const [openConnectWalletModal, setOpenConnectWalletModal] =
    React.useState(false);
  return (
    <>
      <ConnectWalletModal
        openConnectWalletModal={openConnectWalletModal}
        setOpenConnectWalletModal={setOpenConnectWalletModal}
      />
      <AppBar
        position="sticky"
        sx={{
          height: 56,
          backgroundColor: "white",
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <a href="https://massa.net/" style={{ textDecoration: "none" }}>
              <Box
                component="img"
                src="/assets/images/massa.jpg"
                sx={{ width: 40, height: 40, borderRadius: "50%" }}
              />
            </a>
            <Typography
              variant="h3"
              component="a"
              href="https://massa.net/"
              sx={{
                textDecoration: "none",
                color: "text.primary",
                fontWeight: "bold",
              }}
            >
              Massabook
            </Typography>
          </Box>

          {/* Connect Button */}
          <Button
            color="primary"
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              transitionTimingFunction: "ease-in-out",
              transitionProperty:
                "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
              cursor: "pointer",
              fontSize: "0.875rem",
              color: "#fff",
              transitionDuration: ".15s",
              textTransform: "none",
              borderRadius: "8px",
              paddingX: "16px",
              height: "40px",
              fontWeight: "550",
              "&:hover": {
                boxShadow: (theme) =>
                  `0 0 0 .125rem ${theme.palette.primary.main}`,
              },
            }}
            onClick={() => setOpenConnectWalletModal(true)}
          >
            Connect
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
          // backgroundColor: "#F6F6F6",
          border: "1px solid rgba(0, 0, 0, .075)",
        }}
      >
        {/* Heading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: {
              xs: "2.5rem",
              sm: "4.5rem",
              md: "clamp(2.5rem, 10.5vw, 4.5rem)",
            },
            color: (theme) => theme.palette.primary.main,
            // color: "#000",
            letterSpacing: "-0.025em",
            maxWidth: "50rem",
            lineHeight: 1,
            fontFamily:
              '"ABC Social", -apple-system, BlinkMacSystemFont, "avenir next", avenir, "segoe ui", "helvetica neue", helvetica, Ubuntu, roboto, noto, arial, sans-serif',
          }}
        >
          Welcome to Massabook
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontSize: {
              xs: "1.125rem",
              sm: "1.5rem",
              md: "1.125rem",
            },
            color: (theme) => theme.palette.text.secondary,
            maxWidth: "50rem",
            lineHeight: 1.5,
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          The first fully on-chain social network built on the Massa blockchain.
          Connect, share, and engage with others in a decentralized way.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            marginTop: "2rem",
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <Button
            color="primary"
            size="large"
            sx={{
              backgroundColor: (theme) => theme.palette.primary.main,
              transitionTimingFunction: "ease-in-out",
              transitionProperty:
                "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
              cursor: "pointer",
              fontSize: "1.0625rem",
              color: "#fff",
              transitionDuration: ".15s",
              textTransform: "none",
              borderRadius: "16px",
              paddingX: {
                xs: "30px",
                sm: "50px",
              },
              height: "56px",
              width: "auto",
              fontWeight: "550",
              "&:hover": {
                boxShadow: (theme) =>
                  `0 0 0 .125rem ${theme.palette.primary.main}`,
              },
            }}
            onClick={() => setOpenConnectWalletModal(true)}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            href="https://massa.net/"
            sx={{
              backgroundColor: "#FFCCCC",
              transitionTimingFunction: "ease-in-out",
              transitionProperty:
                "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
              cursor: "pointer",
              fontSize: "1.0625rem",
              color: (theme) => theme.palette.primary.main,
              transitionDuration: ".15s",
              textTransform: "none",
              borderRadius: "16px",
              paddingX: {
                xs: "30px",
                sm: "50px",
              },
              height: "56px",
              width: "auto",
              fontWeight: "550",
              borderColor: "#FFCCCC",
              "&:hover": {
                boxShadow: (theme) => `0 0 0 .125rem #FF9999`,
                backgroundColor: "#FF9999",
                borderColor: "#FF9999",
              },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
          backgroundColor: "#fff",
          height: "100vh",
        }}
      ></Box>
    </>
  );
};

export default LandingPage;
