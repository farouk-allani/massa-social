import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWallet, setWallet } from "../redux/slices/accountSlice";
import SelectMassaWallet from "./SelectMassaWallet";
import { AppDispatch, RootState } from "../redux/store";
import { Wallet, WalletName } from "@massalabs/wallet-provider";

type Props = {};

const ConnectWalletModal = (props: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentWallet, wallets, isFetching, connectedAccount } = useSelector(
    (state: RootState) => state.account
  );
  // const [selectedWalletName, setSelectedWalletName] = useState(
  //   currentWallet?.name()
  // );
  if ((!currentWallet && !isFetching) || (currentWallet && !connectedAccount)) {
    return (
      <>
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            // backgroundColor: "rgba(156, 156, 171, 0.5)",
            backgroundColor: "white",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography
              variant="h2"
              sx={{ mb: 2, color: (theme) => theme.palette.primary.main }}
            >
              Welcome to MassaNet
            </Typography>
            <Typography variant="h3" sx={{ mb: 4 }}>
              The first fully on-chain social network built on the Massa
              blockchain. Connect, share, and engage with others in a
              decentralized way.
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              // border: "1px solid #d3d3d3",
              padding: "24px",
              maxWidth: "500px",
              width: "100%",
              mx: { xs: "20px", sm: "0" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 3,
                flexDirection: "column",
              }}
            >
              {/* <h1>Select wallet</h1> */}
              <SelectMassaWallet
                onClick={(walletName) => {
                  console.log(
                    "Selected wallet loking for name exactly:",
                    walletName
                  );
                  // setSelectedWalletName(walletName as unknown as WalletName);
                  const wallet = wallets.find(
                    (w: Wallet) =>
                      w.name() === (walletName as unknown as WalletName)
                  );
                  console.log("Available wallets:", wallets);
                  console.log("Selected wallet:", wallet?.name());
                  if (wallet) {
                    dispatch(setWallet(wallet));
                  } else {
                    alert("Please launch your Massa wallet.");
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </>
    );
  }
  return null;
};

export default ConnectWalletModal;

// import { Box, Typography, Button } from "@mui/material";
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { setProvider } from "../redux/slices/accountSlice";
// import SelectMassaWallet from "./SelectMassaWallet";
// import { SUPPORTED_MASSA_WALLETS } from "../constants";
// import { AppDispatch, RootState } from "../redux/store";

// type Props = {};

// const ConnectWalletModal = (props: Props) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { currentProvider, providers, isFetching, connectedAccount } =
//     useSelector((state: RootState) => state.account);
//   const [selectedProvider, setSelectedProvider] = useState<
//     SUPPORTED_MASSA_WALLETS | undefined
//   >(currentProvider?.name() as SUPPORTED_MASSA_WALLETS);

//   if (
//     (!currentProvider && !isFetching) ||
//     (currentProvider && !connectedAccount)
//   ) {
//     return (
//       <Box
//         sx={{
//           position: "fixed",
//           inset: 0,
//           backgroundColor: (theme) =>
//             theme.palette.mode === "dark"
//               ? "rgba(0, 0, 0, 0.8)"
//               : "rgba(255, 255, 255, 0.8)",
//           zIndex: 1300,
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Box
//           sx={{
//             backgroundColor: (theme) => theme.palette.background.alt,
//             color: (theme) => theme.palette.text.primary,
//             borderRadius: "12px",
//             padding: { xs: "24px", sm: "48px" },
//             textAlign: "center",
//             boxShadow: 3,
//             maxWidth: "600px",
//             width: "90%",
//           }}
//         >
//           <Typography
//             variant="h2"
//             sx={{ mb: 2, color: (theme) => theme.palette.primary.main }}
//           >
//             Welcome to MassaNet
//           </Typography>
//           <Typography variant="body1" sx={{ mb: 4 }}>
//             The first fully on-chain social network built on the Massa
//             blockchain. Connect, share, and engage with others in a
//             decentralized way.
//           </Typography>
//           <SelectMassaWallet
//             onClick={(providerName) => {
//               setSelectedProvider(providerName);
//               const provider = providers.find((p) => p.name() === providerName);
//               if (provider) {
//                 dispatch(setProvider(provider));
//               } else {
//                 alert("Launch your Massa wallet");
//               }
//             }}
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{
//               mt: 3,
//               textTransform: "none",
//               fontSize: "16px",
//               fontWeight: "bold",
//               borderRadius: "8px",
//               px: 3,
//               py: 1.5,
//             }}
//           >
//             Connect Wallet
//           </Button>
//         </Box>
//       </Box>
//     );
//   }
//   return null;
// };

// export default ConnectWalletModal;
