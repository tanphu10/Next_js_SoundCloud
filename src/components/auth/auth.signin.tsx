"use client";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import LockIcon from "@mui/icons-material/Lock";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const AuthSignIn = () => {
  const router = useRouter();
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
  const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

  const [errorUsername, setErrorUsername] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");

  const [openMassage, setOpenMassage] = useState<boolean>(false);
  const [resMessage, setResMessage] = useState<string>("");

  const handleSubmit = async () => {
    setIsErrorUsername(false);
    setIsErrorPassword(false);
    setErrorUsername("");
    setErrorPassword("");
    if (!username) {
      setIsErrorUsername(true);
      setErrorUsername("user name is not empty");
      return;
    }
    if (!password) {
      setIsErrorUsername(true);
      setErrorPassword("user name is not empty");
      return;
    }
    // console.log("check login user >>>>>>> ", username, "pass", password);
    const res = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
    });
    // console.log("check error res >>>>: ", res);
    if (!res?.error) {
      // redirect to home với server
      router.push("/");
    } else {
      setOpenMassage(true);
      setResMessage(res?.error);
    }
  };
  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(to bottom, #ff9aef, #fedac1, #d5e1cf, #b7e6d9)",
        backgroundColor: "#b7e6d9",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Grid
        container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          lg={4}
          sx={{
            boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
          }}
        >
          <div style={{ margin: "20px" }}>
            <Link href="/">Home</Link>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Avatar>
                <LockIcon />
              </Avatar>
              <Typography component="h1">Sign in</Typography>
            </Box>

            <TextField
              onChange={(event) => setUserName(event.target.value)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Username"
              name="username"
              autoFocus
              error={isErrorUsername}
              helperText={errorUsername}
            />
            <TextField
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              error={isErrorPassword}
              helperText={errorPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword === false ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              sx={{
                my: 3,
              }}
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            <Divider>Or using</Divider>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: "25px",
                mt: 3,
              }}
            >
              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
                onClick={() => {
                  signIn("github");
                }}
              >
                <GitHubIcon titleAccess="Login with Github" />
              </Avatar>

              <Avatar
                sx={{
                  cursor: "pointer",
                  bgcolor: "orange",
                }}
                onClick={() => {
                  signIn("google");
                }}
              >
                <GoogleIcon titleAccess="Login with Google" />
              </Avatar>
              <Snackbar
                open={openMassage}
                // autoHideDuration={5000}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  onClose={() => {
                    setOpenMassage(false);
                  }}
                  severity="error"
                  sx={{ width: "100%" }}
                >
                  {resMessage}
                </Alert>
              </Snackbar>
            </Box>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthSignIn;
