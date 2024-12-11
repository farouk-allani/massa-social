import { Typography, Button, Box, Avatar, useTheme } from "@mui/material";
import WidgetWrapper from "../WidgetWrapper";
import FlexBetween from "../FlexBetween";

const SuggestedPagesWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const suggestedPages = [
    {
      name: "Blockchain Enthusiasts",
      description: "A group for blockchain and crypto discussions.",
      avatar: "/assets/images/Blockchain-in-hiring.png",
      pageId: "blockchain-enthusiasts",
    },
    {
      name: "Massa Developers",
      description: "Join the developers building on the Massa Network.",
      avatar: "/assets/images/massa.jpg",
      pageId: "massa-developers",
    },
    {
      name: "Decentralized Art",
      description: "Explore and share art in the decentralized world.",
      avatar: "/assets/images/Blockchain-art-scaled.jpg",
      pageId: "decentralized-art",
    },
  ];

  return (
    <WidgetWrapper>
      <Typography
        color={dark}
        variant="h5"
        fontWeight="500"
        mb={2}
        textAlign="left"
      >
        Suggested Pages
      </Typography>
      {suggestedPages.map((page, index) => (
        <FlexBetween key={index} mb="1rem">
          <Box display="flex" alignItems="center" gap="1rem">
            <Avatar
              alt={page.name}
              src={page.avatar}
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="600"
                textAlign="left"
                color={main}
              >
                {page.name}
              </Typography>
              <Typography color={medium} variant="body2" textAlign="left">
                {page.description}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              textTransform: "none",
              marginLeft: "5px",
            }}
            onClick={() => (window.location.href = `/pages/${page.pageId}`)}
          >
            Follow
          </Button>
        </FlexBetween>
      ))}
    </WidgetWrapper>
  );
};

export default SuggestedPagesWidget;
