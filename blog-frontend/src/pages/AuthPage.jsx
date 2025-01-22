import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container, Box, Grid, Link } from "@mui/material";
import { useAuth } from "../context/authContext";

function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSignup, setIsSignup] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();  // Извлекаем метод login из контекста

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup
      ? "http://localhost:3000/users/register"
      : "http://localhost:3000/users/login";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(isSignup ? "User registered successfully!" : "Login successful!");
        if (!isSignup) {
          login();  // Вызовите login при успешном входе
          navigate("/home");
        }
      } else {
        setMessage(data.message || (isSignup ? "Registration failed" : "Login failed"));
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
          padding: 3,
          borderRadius: 1,
          boxShadow: 3,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5">{isSignup ? "Sign Up" : "Login"}</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", marginTop: "20px" }}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            {isSignup ? "Register" : "Login"}
          </Button>
        </form>
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <Link
              href="#"
              variant="body2"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
        {message && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default AuthPage;