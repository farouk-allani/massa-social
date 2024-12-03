import React from "react";
import { Container, Button, Stack, Typography } from "@mui/material";
import { SUPPORTED_MASSA_WALLETS } from "../constants";

interface SelectMassaWalletProps {
  onClick: (providerName: SUPPORTED_MASSA_WALLETS) => void;
}

const walletsConfig = [
  {
    name: "Massa-Station",
    walletType: SUPPORTED_MASSA_WALLETS.MASSASTATION,
    imgSrc: "/assets/images/massa-station.png", // Replace with actual path
    imgAlt: "Massa Station logo",
  },
  {
    name: "Bearby",
    walletType: SUPPORTED_MASSA_WALLETS.BEARBY,
    imgSrc: "/assets/images/bearby.png", // Replace with actual path
    imgAlt: "Bearby logo",
  },
];

const SelectMassaWallet = ({ onClick }: SelectMassaWalletProps) => {
  return (
    <Container maxWidth="lg">
      {/* Optional heading */}
      {/* <Typography variant="h4" align="center" gutterBottom>
        Select your wallet
      </Typography> */}
      <Stack direction="column" spacing={2}>
        {walletsConfig.map((wallet) => (
          <Button
            key={wallet.name}
            variant="outlined"
            fullWidth
            onClick={() => onClick(wallet.walletType)}
            sx={{
              height: 55,
              borderColor: "#CAD1D9",
              backgroundColor: "#FFF",
              "&:hover": {
                backgroundColor: "#FDFDFD",
              },
              borderRadius: 1,
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              textTransform: "none",
              transition: "background-color 0.3s",
            }}
          >
            <img
              src={wallet.imgSrc}
              alt={wallet.imgAlt}
              style={{ width: 24, height: 24, marginRight: 12 }}
            />
            <Typography variant="body1" component="span">
              {`Use ${wallet.name}`}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Container>
  );
};

export default SelectMassaWallet;
