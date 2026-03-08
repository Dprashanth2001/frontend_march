import { useState } from "react";
import { adminLogin, addAdmin } from "../api";
import { useApp } from "../context/AppContext";

export default function AdminLogin({ onLogin }) {
  const { setAdmin } = useApp();
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  // Register form state
  const [regForm, setRegForm] = useState({
    admin_id: "",
    name: "",
    email: "",
    password: "",
    confirm: "",
    labs_managed: "",
  });

  const switchTab = (t) => {
    setTab(t);
    setError("");
    setSuccessMsg("");
  };

  // ── Login ────────────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    if (!loginForm.email || !loginForm.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await adminLogin(loginForm.email.trim(), loginForm.password);
      setAdmin(res);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Register ─────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (
      !regForm.admin_id ||
      !regForm.name ||
      !regForm.email ||
      !regForm.password
    ) {
      setError("Please fill in all required fields.");
      return;
    }
    if (regForm.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (regForm.password !== regForm.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await addAdmin({
        admin_id: regForm.admin_id.trim(),
        name: regForm.name.trim(),
        email: regForm.email.trim(),
        password: regForm.password,
        labs_managed: regForm.labs_managed
          ? regForm.labs_managed
              .split(",")
              .map((l) => l.trim())
              .filter(Boolean)
          : [],
      });
      setSuccessMsg("Account created! You can now sign in.");
      setRegForm({
        admin_id: "",
        name: "",
        email: "",
        password: "",
        confirm: "",
        labs_managed: "",
      });
      setTimeout(() => switchTab("login"), 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card" style={{ maxWidth: 460 }}>
      <div className="auth-icon admin-icon">⚙️</div>
      <h2>Admin Portal</h2>
      <p className="auth-subtitle">Manage lab sessions and devices</p>

      {/* Tab switcher */}
      <div className="admin-auth-tabs">
        <button
          className={`admin-auth-tab ${tab === "login" ? "active" : ""}`}
          onClick={() => switchTab("login")}
          type="button"
        >
          Sign In
        </button>
        <button
          className={`admin-auth-tab ${tab === "register" ? "active" : ""}`}
          onClick={() => switchTab("register")}
          type="button"
        >
          Register
        </button>
      </div>

      {/* ── Login Form ── */}
      {tab === "login" && (
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) =>
                setLoginForm({ ...loginForm, email: e.target.value })
              }
              placeholder="admin@lab.edu"
              autoFocus
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
              placeholder="••••••••"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign In →"}
          </button>
          <p className="auth-switch-hint">
            New admin?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => switchTab("register")}
            >
              Create an account
            </button>
          </p>
        </form>
      )}

      {/* ── Register Form ── */}
      {tab === "register" && (
        <form onSubmit={handleRegister}>
          <div className="field-row">
            <div className="field">
              <label>
                Full Name <span className="req">*</span>
              </label>
              <input
                value={regForm.name}
                onChange={(e) =>
                  setRegForm({ ...regForm, name: e.target.value })
                }
                placeholder="Dr. Jane Smith"
                autoFocus
              />
            </div>
            <div className="field narrow">
              <label>
                Admin ID <span className="req">*</span>
              </label>
              <input
                value={regForm.admin_id}
                onChange={(e) =>
                  setRegForm({ ...regForm, admin_id: e.target.value })
                }
                placeholder="ADM001"
              />
            </div>
          </div>
          <div className="field">
            <label>
              Email <span className="req">*</span>
            </label>
            <input
              type="email"
              value={regForm.email}
              onChange={(e) =>
                setRegForm({ ...regForm, email: e.target.value })
              }
              placeholder="admin@lab.edu"
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>
                Password <span className="req">*</span>
              </label>
              <input
                type="password"
                value={regForm.password}
                onChange={(e) =>
                  setRegForm({ ...regForm, password: e.target.value })
                }
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="field">
              <label>
                Confirm Password <span className="req">*</span>
              </label>
              <input
                type="password"
                value={regForm.confirm}
                onChange={(e) =>
                  setRegForm({ ...regForm, confirm: e.target.value })
                }
                placeholder="Re-enter password"
              />
            </div>
          </div>
          <div className="field">
            <label>
              Labs Managed{" "}
              <span className="muted">(comma-separated, optional)</span>
            </label>
            <input
              value={regForm.labs_managed}
              onChange={(e) =>
                setRegForm({ ...regForm, labs_managed: e.target.value })
              }
              placeholder="LAB_A, LAB_B"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          {successMsg && <p className="success-msg">{successMsg}</p>}
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Create Account →"}
          </button>
          <p className="auth-switch-hint">
            Already registered?{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => switchTab("login")}
            >
              Sign in
            </button>
          </p>
        </form>
      )}
    </div>
  );
}
