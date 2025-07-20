import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Login.css"; // Make sure this is imported

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome to NexusShare</h2>
        <p className="login-subtitle">Sign in to your account</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="login-input"
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="login-input"
          />

          <button type="submit" disabled={loading} className="login-button">
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="login-footer">
            <Link to="/register" className="register-link">
              Don't have an account? Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
