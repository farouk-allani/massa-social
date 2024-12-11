// ProfileSetupPage.tsx

import {
  Box,
  Button,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile, Profile } from "../../redux/slices/userSlice";
import { AppDispatch, RootState } from "../../redux/store";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar";

const ProfileSetupPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { connectedAccount } = useSelector((state: RootState) => state.account);
  const [name, setName] = useState("");
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarBase64(result);
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      toast.error("Failed to read the selected image.");
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!connectedAccount) {
      toast.error("No connected account");
      return;
    }

    if (!avatarBase64) {
      toast.error("Please upload an avatar image before saving.");
      return;
    }

    console.log("avatar base64", avatarBase64);

    const profileData = new Profile(
      connectedAccount.address,
      name,
      avatarBase64,
      bio
    );

    setLoading(true);

    try {
      await toast.promise(dispatch(updateUserProfile(profileData)).unwrap(), {
        pending: "Saving profile...",
        success: "Profile saved successfully!",
        error: "Failed to save profile.",
      });

      window.location.href = "/home";
      // navigate("/home");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (!connectedAccount) {
  //     console.error("No connected account found, redirecting to /");
  //     navigate("/");
  //   }
  // }, [connectedAccount, navigate]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Navbar />

      <Box
        width="100%"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        bgcolor="#f0f2f5"
      >
        <Box
          width="400px"
          bgcolor="white"
          p="2rem"
          borderRadius="8px"
          boxShadow="0 2px 4px rgba(0,0,0,0.1)"
        >
          <Typography variant="h4" mb="1rem" textAlign="center">
            Set Up Your Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
            />

            {/* Dropzone area for avatar upload */}
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #ccc",
                borderRadius: "8px",
                padding: "1rem",
                textAlign: "center",
                cursor: "pointer",
                my: "1rem",
                backgroundColor: isDragActive ? "#f0f0f0" : "#fff",
              }}
            >
              <input {...getInputProps()} />
              {avatarBase64 ? (
                <Box>
                  <Typography variant="body1" mb={1}>
                    Image selected:
                  </Typography>
                  <img
                    src={avatarBase64}
                    alt="Selected avatar"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  {isDragActive
                    ? "Drop the image here..."
                    : "Drag & drop an avatar image, or click to select"}
                </Typography>
              )}
            </Box>

            <TextField
              label="Bio"
              fullWidth
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              margin="normal"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: "1rem" }}
              disabled={loading}
            >
              Save Profile
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default ProfileSetupPage;
