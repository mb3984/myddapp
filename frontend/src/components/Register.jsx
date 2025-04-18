import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/register",
        {
          email,
          password,
        }
      );

      alert("Registration successful! Please login.");
      navigate("/login");
      console.log(response);
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleRegister}>Register</button>

      {/* Link to login page */}
      <span className="login-prompt">
        Already registered? <Link to="/login">Please login</Link>.
      </span>

      {/* Error alert */}
      {error && <div className="alert">{error}</div>}
    </div>
  );
};

export default Register;
