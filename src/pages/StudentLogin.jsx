import { useState } from "react";
import { loginStudent, getActiveSession } from "../api";
import { useApp } from "../context/AppContext";

export default function StudentLogin({ onLogin, onNeedRegister }) {
  const { setLabId, setSessionId, setSessionData, setStudent } = useApp();
  const [studentId, setStudentId] = useState("");
  const [labIdLocal, setLabIdLocal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!studentId.trim() || !labIdLocal.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginStudent(studentId.trim(), labIdLocal.trim());
      setLabId(labIdLocal.trim());
      setSessionId(res.session_id);

      // Fetch full session object so SurveyForm can access device arrays
      try {
        const session = await getActiveSession(labIdLocal.trim());
        setSessionData(session);
      } catch (_) {}

      if (res.exists && !res.needs_extra_info) {
        setStudent(res.student);
        onLogin();
      } else if (res.exists && res.needs_extra_info) {
        setStudent({ student_id: studentId, lab_id: labIdLocal });
        onNeedRegister({ partial: true });
      } else {
        setStudent({ student_id: studentId, lab_id: labIdLocal });
        onNeedRegister({ partial: false });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-icon">🧪</div>
      <h2>Lab Entry</h2>
      <p className="auth-subtitle">Sign in to begin your session survey</p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Student ID</label>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. STU2024001"
            autoFocus
          />
        </div>
        <div className="field">
          <label>Lab ID</label>
          <input
            value={labIdLocal}
            onChange={(e) => setLabIdLocal(e.target.value)}
            placeholder="e.g. LAB_A"
          />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : "Continue →"}
        </button>
      </form>
    </div>
  );
}
