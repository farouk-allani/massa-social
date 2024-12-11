// src/components/CreatePage.tsx

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";
import WidgetWrapper from "../WidgetWrapper";

const categories = [
  "Technology",
  "Art",
  "Gaming",
  "Music",
  "Education",
  "Business",
  "Health",
  "Lifestyle",
  "Other",
];

const CreatePage = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;

  const [pageName, setPageName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [moderators, setModerators] = useState<string[]>([""]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleModeratorChange = (index: number, value: string) => {
    const newModerators = [...moderators];
    newModerators[index] = value;
    setModerators(newModerators);
  };

  const addModerator = () => {
    setModerators([...moderators, ""]);
  };

  const removeModerator = (index: number) => {
    const newModerators = [...moderators];
    newModerators.splice(index, 1);
    setModerators(newModerators);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!pageName.trim()) newErrors.pageName = "Page name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!category) newErrors.category = "Category is required.";
    // Optional: Validate moderator wallet addresses if provided
    moderators.forEach((mod, idx) => {
      if (mod && !/^0x[a-fA-F0-9]{40}$/.test(mod)) {
        newErrors[`moderator_${idx}`] = "Invalid wallet address.";
      }
    });
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Prepare data to send to blockchain
    const pageData = {
      pageName,
      description,
      category,
      image, // You might need to handle image uploads differently for blockchain
      moderators: moderators.filter((mod) => mod.trim() !== ""),
    };

    // For now, just log the data and show a toast
    console.log("Page Data:", pageData);
    setOpenSnackbar(true);

    // Reset form or navigate as needed
    // navigate(`/pages/${newPageId}`);

    setIsSubmitting(false);
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        padding="2rem 6%"
        sx={{ minHeight: "calc(100vh - 64px)" }} // Adjust height based on Navbar height
      >
        <Box
          width={{ xs: "100%", sm: "80%", md: "60%" }}
          display="flex"
          flexDirection="column"
          gap="2rem"
        >
          <WidgetWrapper>
            <Typography
              variant="h5"
              color={dark}
              fontWeight="500"
              mb="1.5rem"
              textAlign="center"
            >
              Create a New Page
            </Typography>
            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap="1rem">
                {/* Page Name */}
                <TextField
                  label="Page Name"
                  variant="outlined"
                  fullWidth
                  value={pageName}
                  onChange={(e) => setPageName(e.target.value)}
                  error={Boolean(errors.pageName)}
                  helperText={errors.pageName}
                />

                {/* Description */}
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                />

                {/* Category */}
                <TextField
                  select
                  label="Category"
                  variant="outlined"
                  fullWidth
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  error={Boolean(errors.category)}
                  helperText={errors.category}
                >
                  {categories.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Image Upload */}
                <Button variant="outlined" component="label" fullWidth>
                  {image ? "Change Image" : "Upload Image (Optional)"}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  />
                </Button>
                {image && (
                  <Typography variant="body2" color={medium}>
                    Selected File: {image.name}
                  </Typography>
                )}

                {/* Moderators */}
                <Box>
                  <Typography variant="h6" color={dark} mb="0.5rem">
                    Moderators (Optional)
                  </Typography>
                  {moderators.map((mod, index) => (
                    <Box
                      key={index}
                      display="flex"
                      alignItems="center"
                      gap="0.5rem"
                      mb="0.5rem"
                    >
                      <TextField
                        label={`Moderator ${index + 1} Wallet Address`}
                        variant="outlined"
                        fullWidth
                        value={mod}
                        onChange={(e) =>
                          handleModeratorChange(index, e.target.value)
                        }
                        error={Boolean(errors[`moderator_${index}`])}
                        helperText={errors[`moderator_${index}`]}
                      />
                      {moderators.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeModerator(index)}
                        >
                          <RemoveCircleOutline />
                        </IconButton>
                      )}
                      {index === moderators.length - 1 && (
                        <IconButton color="primary" onClick={addModerator}>
                          <AddCircleOutline />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Submit Button */}
                <Box display="flex" justifyContent="center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      textTransform: "none",
                      color: palette.background.alt,
                      backgroundColor: palette.primary.main,
                      borderRadius: "3rem",
                      width: "fit-content",
                      paddingX: "1.5rem",
                    }}
                  >
                    <AddCircleOutline sx={{ marginRight: "5px" }} />
                    {isSubmitting ? "Creating..." : "Create Page"}
                  </Button>
                </Box>
              </Box>
            </form>
          </WidgetWrapper>
        </Box>
      </Box>

      {/* Snackbar for Success Message */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Page created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreatePage;
