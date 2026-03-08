import { useState } from "react";
import { registerStudent } from "../api";
import { useApp } from "../context/AppContext";

const HEALTH_OPTIONS = [
  "Asthma",
  "Allergies",
  "Respiratory Issues",
  "Heart Condition",
  "Anxiety",
  "None",
];

export default function StudentRegister({ onDone }) {
  const { student, labId, sessionId, setStudent } = useApp();
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    health_issues: [],
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleHealth = (opt) => {
    setForm((f) => ({
      ...f,
      health_issues: f.health_issues.includes(opt)
        ? f.health_issues.filter((h) => h !== opt)
        : [...f.health_issues, opt],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.age || !form.gender) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await registerStudent({
        student_id: student.student_id,
        lab_id: labId,
        name: form.name.trim(),
        age: parseInt(form.age),
        gender: form.gender,
        health_issues: form.health_issues,
      });
      // res.student has experiment_group assigned by backend — always prefer it
      const updated = res.student || res;
      setStudent({
        ...student,
        ...form,
        ...updated,
        // Ensure experiment_group is never lost
        experiment_group:
          updated.experiment_group ||
          res.experiment_group ||
          student.experiment_group,
      });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card wide">
      <div className="auth-icon">📋</div>
      <h2>Complete Your Profile</h2>
      <p className="auth-subtitle">
        This information helps us analyse environmental comfort
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label>
              Full Name <span className="req">*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              autoFocus
            />
          </div>
          <div className="field narrow">
            <label>
              Age <span className="req">*</span>
            </label>
            <input
              type="number"
              min="10"
              max="80"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="e.g. 21"
            />
          </div>
        </div>

        <div className="field">
          <label>
            Gender <span className="req">*</span>
          </label>
          <div className="radio-group">
            {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
              <label
                key={g}
                className={`radio-pill ${form.gender === g ? "active" : ""}`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={form.gender === g}
                  onChange={() => setForm({ ...form, gender: g })}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Health Conditions (select all that apply)</label>
          <div className="checkbox-group">
            {HEALTH_OPTIONS.map((opt) => (
              <label
                key={opt}
                className={`check-pill ${form.health_issues.includes(opt) ? "active" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={form.health_issues.includes(opt)}
                  onChange={() => toggleHealth(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : "Save & Continue →"}
        </button>
      </form>
    </div>
  );
}
