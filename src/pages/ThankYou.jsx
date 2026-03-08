import { useApp } from "../context/AppContext";

export default function ThankYou({ onReset }) {
  const { student, logout } = useApp();

  return (
    <div className="auth-card center">
      <div className="success-anim">
        <svg viewBox="0 0 80 80" fill="none">
          <circle
            cx="40"
            cy="40"
            r="38"
            stroke="var(--accent)"
            strokeWidth="3"
            className="check-circle"
          />
          <path
            d="M22 40l13 13 23-26"
            stroke="var(--accent)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="check-tick"
          />
        </svg>
      </div>
      <h2>Survey Complete!</h2>
      <p className="auth-subtitle">
        Thank you{student?.name ? `, ${student.name}` : ""}. Your responses have
        been recorded and will help improve lab conditions.
      </p>
      <div className="info-chip">
        <span>Group</span>
        <strong>{student?.experiment_group || "—"}</strong>
      </div>
      <button
        className="btn-primary"
        onClick={() => {
          logout();
          onReset();
        }}
      >
        Done
      </button>
    </div>
  );
}
