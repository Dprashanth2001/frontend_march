import { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import SurveyForm from "./pages/SurveyForm";
import ThankYou from "./pages/ThankYou";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

// Views for student flow
const STUDENT_VIEWS = {
  LOGIN: "login",
  REGISTER: "register",
  SURVEY: "survey",
  DONE: "done",
};

function StudentFlow() {
  const [view, setView] = useState(STUDENT_VIEWS.LOGIN);

  return (
    <div className="page-wrap">
      <div className="page-bg" />
      {view === STUDENT_VIEWS.LOGIN && (
        <StudentLogin
          onLogin={() => setView(STUDENT_VIEWS.SURVEY)}
          onNeedRegister={() => setView(STUDENT_VIEWS.REGISTER)}
        />
      )}
      {view === STUDENT_VIEWS.REGISTER && (
        <StudentRegister onDone={() => setView(STUDENT_VIEWS.SURVEY)} />
      )}
      {view === STUDENT_VIEWS.SURVEY && (
        <SurveyForm onDone={() => setView(STUDENT_VIEWS.DONE)} />
      )}
      {view === STUDENT_VIEWS.DONE && (
        <ThankYou onReset={() => setView(STUDENT_VIEWS.LOGIN)} />
      )}
    </div>
  );
}

function AdminFlow() {
  const { admin } = useApp();
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn || !admin) {
    return (
      <div className="page-wrap admin-bg">
        <div className="page-bg admin-page-bg" />
        <AdminLogin onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }
  return <AdminDashboard />;
}

function AppInner() {
  const [mode, setMode] = useState(null); // null | "student" | "admin"

  if (mode === "student") return <StudentFlow />;
  if (mode === "admin") return <AdminFlow />;

  return (
    <div className="page-wrap">
      <div className="page-bg" />
      <div className="landing-card">
        <div className="landing-logo">🔬</div>
        <h1>Lab Survey System</h1>
        <p>Environmental comfort monitoring for research labs</p>
        <div className="landing-btns">
          <button
            className="btn-primary large"
            onClick={() => setMode("student")}
          >
            I'm a Student
          </button>
          <button
            className="btn-outline large"
            onClick={() => setMode("admin")}
          >
            Admin Portal
          </button>
        </div>
        <p className="landing-foot">
          Enter your Student ID to begin your session survey
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
