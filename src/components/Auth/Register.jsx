import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Register.css"; // Import CSS

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await register(
      formData.name,
      formData.email,
      formData.password
    );

    if (!result.success) {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Join NexusShare</h2>
        <p className="register-subtitle">Create your account</p>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          <input
            type="text"
            name="name"
            required
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="register-input"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="register-input"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="register-input"
          />
          <input
            type="password"
            name="confirmPassword"
            required
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="register-input"
          />

          <button type="submit" disabled={loading} className="register-button">
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <div className="register-footer">
            <Link to="/login" className="login-link">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
