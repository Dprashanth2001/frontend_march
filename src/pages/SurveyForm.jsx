// import { useState, useEffect } from "react";
// import { submitSurvey, fetchSensorData } from "../api";
// import { useApp } from "../context/AppContext";

// // ── CO2 annotation ──────────────────────────────────────────────────────────
// function getCO2Info(ppm) {
//   if (!ppm && ppm !== 0) return null;
//   if (ppm <= 400)
//     return { label: "Good", color: "#00e676", bg: "rgba(0,230,118,0.15)" };
//   if (ppm <= 1000)
//     return { label: "Moderate", color: "#ffea00", bg: "rgba(255,234,0,0.15)" };
//   if (ppm <= 1500)
//     return {
//       label: "Satisfactory",
//       color: "#ff9100",
//       bg: "rgba(255,145,0,0.15)",
//     };
//   if (ppm <= 2000)
//     return { label: "Poor", color: "#ff1744", bg: "rgba(255,23,68,0.15)" };
//   if (ppm <= 5000)
//     return { label: "Very Poor", color: "#d500f9", bg: "rgba(213,0,249,0.15)" };
//   return { label: "Severe", color: "#4a1612", bg: "rgba(255,109,0,0.18)" };
// }

// const CO2_LEVELS = [
//   { label: "Good", range: "≤ 400 ppm", color: "#00e676" },
//   { label: "Moderate", range: "401–1000 ppm", color: "#ffea00" },
//   { label: "Satisfactory", range: "1001–1500 ppm", color: "#ff9100" },
//   { label: "Poor", range: "1501–2000 ppm", color: "#ff1744" },
//   { label: "Very Poor", range: "2001–5000 ppm", color: "#d500f9" },
//   { label: "Severe", range: "> 5000 ppm", color: "#ab0000" },
// ];

// const CO2_CAUSES = [
//   {
//     icon: "😮‍💨",
//     text: "Shortness of breath",
//   },
//   {
//     icon: "😵",
//     text: "Dizziness",
//   },
//   {
//     icon: "🧠",
//     text: "Difficulty thinking clearly",
//   },
//   {
//     icon: "👀",
//     text: "Reduced attention during experiments",
//   },
// ];

// // ── Single metric card ──────────────────────────────────────────────────────
// function MetricCard({ icon, label, value, unit, annotation }) {
//   return (
//     <div
//       className="metric-card"
//       style={annotation ? { borderColor: annotation.color + "55" } : {}}
//     >
//       <div className="metric-top">
//         <span className="metric-icon">{icon}</span>
//         <span className="metric-label">{label}</span>
//       </div>
//       <p className="metric-value">
//         {value ?? "—"}
//         {value != null && <span className="metric-unit"> {unit}</span>}
//       </p>
//       {annotation && (
//         <span
//           className="metric-badge"
//           style={{ color: annotation.color, background: annotation.bg }}
//         >
//           ● {annotation.label}
//         </span>
//       )}
//     </div>
//   );
// }

// // ── Device data panel (indoor + outdoor) ───────────────────────────────────
// function SensorPanel({ indoorData, outdoorData }) {
//   return (
//     <div className="sensor-panel">
//       <p className="sensor-panel-title">
//         <span>🌡️</span> Current Lab Conditions
//         <span className="sensor-live-dot" title="Live data" />
//       </p>

//       {indoorData && (
//         <div className="sensor-section">
//           <p className="sensor-section-label">🏠 Indoor</p>
//           <div className="metrics-grid">
//             <MetricCard
//               icon="🌡️"
//               label="Temperature"
//               value={indoorData.data?.temperature}
//               unit="°C"
//             />
//             <MetricCard
//               icon="💧"
//               label="Humidity"
//               value={indoorData.data?.humidity}
//               unit="%"
//             />
//             <MetricCard
//               icon="💨"
//               label="CO₂"
//               value={indoorData.data?.co2}
//               unit="ppm"
//               annotation={getCO2Info(indoorData.data?.co2)}
//             />
//           </div>
//         </div>
//       )}

//       {outdoorData && (
//         <div className="sensor-section">
//           <p className="sensor-section-label">🌤️ Outdoor</p>
//           <div className="metrics-grid">
//             <MetricCard
//               icon="🌡️"
//               label="Temperature"
//               value={outdoorData.data?.temperature}
//               unit="°C"
//             />
//             <MetricCard
//               icon="💧"
//               label="Humidity"
//               value={outdoorData.data?.humidity}
//               unit="%"
//             />
//             <MetricCard
//               icon="💨"
//               label="CO₂"
//               value={outdoorData.data?.co2}
//               unit="ppm"
//               annotation={getCO2Info(outdoorData.data?.co2)}
//             />
//           </div>
//         </div>
//       )}

//       <p className="sensor-timestamp">
//         Last updated: {indoorData?.timestamp || outdoorData?.timestamp || "—"}
//       </p>

//       {/* CO₂ legend */}
//       <div className="co2-legend">
//         <p className="co2-legend-title">CO₂ Level Guide</p>
//         <div className="co2-legend-grid">
//           {CO2_LEVELS.map((l) => (
//             <div key={l.label} className="co2-legend-item">
//               <span
//                 className="co2-dot"
//                 style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }}
//               />
//               <span className="co2-legend-label" style={{ color: l.color }}>
//                 {l.label}
//               </span>
//               <span className="co2-legend-range">{l.range}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* CO₂ causes */}
//       <div className="co2-causes">
//         <p className="co2-legend-title">Main Causes of High CO₂</p>
//         {CO2_CAUSES.map((c, i) => (
//           <div key={i} className="co2-cause-row">
//             <span className="co2-cause-icon">{c.icon}</span>
//             <p className="co2-cause-text">{c.text}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── Scale selector ──────────────────────────────────────────────────────────
// const SCALE_LABELS = {
//   1: "Very Poor",
//   2: "Poor",
//   3: "Neutral",
//   4: "Good",
//   5: "Excellent",
// };

// function ScaleSelector({ value, onChange, question, icon }) {
//   return (
//     <div className="survey-question">
//       <div className="q-header">
//         <span className="q-icon">{icon}</span>
//         <p>{question}</p>
//       </div>
//       <div className="scale-row">
//         {[1, 2, 3, 4, 5].map((n) => (
//           <button
//             key={n}
//             type="button"
//             className={`scale-btn ${value === n ? "selected" : ""}`}
//             onClick={() => onChange(n)}
//           >
//             <span className="scale-num">{n}</span>
//             <span className="scale-label">{SCALE_LABELS[n]}</span>
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// const VENT_OPTIONS = [
//   "Open windows",
//   "Open door",
//   "Turn on fan",
//   "Turn on AC",
//   "No change needed",
// ];

// // ── Main SurveyForm ─────────────────────────────────────────────────────────
// export default function SurveyForm({ onDone }) {
//   const { student, sessionId, sessionData } = useApp();
//   const isControl = student?.experiment_group === "control";

//   const [answers, setAnswers] = useState({
//     q1_air_freshness: null,
//     q2_thermal_comfort: null,
//     q3_alertness: null,
//     q3_concentration: null,
//     q4_need_ventilation: "",
//     q5_ventilation_preference: "",
//   });

//   const [sensorLoading, setSensorLoading] = useState(false);
//   const [sensorError, setSensorError] = useState("");
//   const [indoorData, setIndoorData] = useState(null);
//   const [outdoorData, setOutdoorData] = useState(null);

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [step, setStep] = useState(0);

//   // Fetch sensor data for control group on mount
//   useEffect(() => {
//     if (!isControl) return;
//     if (!sessionData) return;

//     const indoorIds = sessionData.indoor_devices || [];
//     const outdoorIds = sessionData.outdoor_devices || [];
//     if (indoorIds.length === 0 && outdoorIds.length === 0) return;

//     setSensorLoading(true);
//     setSensorError("");

//     fetchSensorData()
//       .then((map) => {
//         // Pick first available indoor device that has data
//         for (const id of indoorIds) {
//           if (map[id]?.data) {
//             setIndoorData(map[id]);
//             break;
//           }
//         }
//         // Pick first available outdoor device that has data
//         for (const id of outdoorIds) {
//           if (map[id]?.data) {
//             setOutdoorData(map[id]);
//             break;
//           }
//         }
//       })
//       .catch(() => setSensorError("Could not load sensor data."))
//       .finally(() => setSensorLoading(false));
//   }, [isControl, sessionData]);

//   const steps = [
//     {
//       title: "Air & Thermal Comfort",
//       subtitle: "How does the environment feel right now?",
//       content: (
//         <>
//           <ScaleSelector
//             icon="🌬️"
//             question="How fresh does the air feel in this room?"
//             value={answers.q1_air_freshness}
//             onChange={(v) => setAnswers({ ...answers, q1_air_freshness: v })}
//           />
//           <ScaleSelector
//             icon="🌡️"
//             question="How comfortable is the temperature right now?"
//             value={answers.q2_thermal_comfort}
//             onChange={(v) => setAnswers({ ...answers, q2_thermal_comfort: v })}
//           />
//         </>
//       ),
//       valid: answers.q1_air_freshness && answers.q2_thermal_comfort,
//     },
//     {
//       title: "Focus & Alertness",
//       subtitle: "Reflect on your mental state in this environment.",
//       content: (
//         <>
//           <ScaleSelector
//             icon="⚡"
//             question="How alert and energised do you feel?"
//             value={answers.q3_alertness}
//             onChange={(v) => setAnswers({ ...answers, q3_alertness: v })}
//           />
//           <ScaleSelector
//             icon="🎯"
//             question="How well are you able to concentrate?"
//             value={answers.q3_concentration}
//             onChange={(v) => setAnswers({ ...answers, q3_concentration: v })}
//           />
//         </>
//       ),
//       valid: answers.q3_alertness && answers.q3_concentration,
//     },
//     {
//       title: "Ventilation Preference",
//       subtitle: "Share your ventilation needs.",
//       content: (
//         <>
//           <div className="survey-question">
//             <div className="q-header">
//               <span className="q-icon">💨</span>
//               <p>Do you feel the room needs better ventilation?</p>
//             </div>
//             <div className="radio-group">
//               {["Yes", "No", "Not Sure"].map((opt) => (
//                 <label
//                   key={opt}
//                   className={`radio-pill ${answers.q4_need_ventilation === opt ? "active" : ""}`}
//                 >
//                   <input
//                     type="radio"
//                     name="q4"
//                     value={opt}
//                     checked={answers.q4_need_ventilation === opt}
//                     onChange={() =>
//                       setAnswers({ ...answers, q4_need_ventilation: opt })
//                     }
//                   />
//                   {opt}
//                 </label>
//               ))}
//             </div>
//           </div>

//           {answers.q4_need_ventilation === "Yes" && (
//             <div className="survey-question">
//               <div className="q-header">
//                 <span className="q-icon">🪟</span>
//                 <p>What would you prefer to improve ventilation?</p>
//               </div>
//               <div className="checkbox-group">
//                 {VENT_OPTIONS.map((opt) => (
//                   <label
//                     key={opt}
//                     className={`check-pill ${answers.q5_ventilation_preference === opt ? "active" : ""}`}
//                   >
//                     <input
//                       type="radio"
//                       name="q5"
//                       value={opt}
//                       checked={answers.q5_ventilation_preference === opt}
//                       onChange={() =>
//                         setAnswers({
//                           ...answers,
//                           q5_ventilation_preference: opt,
//                         })
//                       }
//                     />
//                     {opt}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}
//         </>
//       ),
//       valid: answers.q4_need_ventilation !== "",
//     },
//   ];

//   const currentStep = steps[step];

//   const handleNext = () => {
//     if (!currentStep.valid) {
//       setError("Please answer all questions before continuing.");
//       return;
//     }
//     setError("");
//     setStep((s) => s + 1);
//   };

//   const handleSubmit = async () => {
//     if (!currentStep.valid) {
//       setError("Please answer all questions.");
//       return;
//     }
//     if (!student?.student_id) {
//       setError("Session expired. Please log in again.");
//       return;
//     }
//     if (!sessionId) {
//       setError("No active session found. Please log in again.");
//       return;
//     }

//     setLoading(true);
//     setError("");
//     try {
//       await submitSurvey({
//         student_id: student.student_id,
//         session_id: sessionId,
//         experiment_group: student.experiment_group || "unassigned",
//         q1_air_freshness: answers.q1_air_freshness ?? null,
//         q2_thermal_comfort: answers.q2_thermal_comfort ?? null,
//         q3_alertness: answers.q3_alertness ?? null,
//         q3_concentration: answers.q3_concentration ?? null,
//         q4_need_ventilation: answers.q4_need_ventilation || null,
//         q5_ventilation_preference: answers.q5_ventilation_preference || null,
//         // Snapshot the sensor readings shown to control group
//         device_data: isControl && indoorData ? indoorData.data : {},
//         outdoor_device_data: isControl && outdoorData ? outdoorData.data : {},
//       });
//       onDone();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="survey-card">
//       {/* Progress bar */}
//       <div className="progress-bar-wrap">
//         {steps.map((_, i) => (
//           <div key={i} className={`progress-seg ${i <= step ? "done" : ""}`} />
//         ))}
//       </div>

//       <div className="survey-header">
//         <div className="survey-header-top">
//           <span className="step-badge">
//             Step {step + 1} of {steps.length}
//           </span>
//           {isControl && (
//             <span className="group-badge control">Live Data Enabled</span>
//           )}
//         </div>
//         <h2>{currentStep.title}</h2>
//         <p className="auth-subtitle">{currentStep.subtitle}</p>
//       </div>

//       {/* Sensor panel — control group only, shown on every step */}
//       {isControl && (
//         <div className="sensor-panel-wrap">
//           {sensorLoading && (
//             <div className="sensor-loading">
//               <span
//                 className="spinner"
//                 style={{ borderTopColor: "var(--accent)" }}
//               />
//               <span>Fetching sensor data…</span>
//             </div>
//           )}
//           {sensorError && <p className="sensor-error">⚠️ {sensorError}</p>}
//           {!sensorLoading && !sensorError && (indoorData || outdoorData) && (
//             <SensorPanel indoorData={indoorData} outdoorData={outdoorData} />
//           )}
//           {!sensorLoading && !sensorError && !indoorData && !outdoorData && (
//             <p className="sensor-error">
//               ⚠️ No sensor data available for this session's devices.
//             </p>
//           )}
//         </div>
//       )}

//       <div className="survey-body">{currentStep.content}</div>

//       {error && <p className="error-msg">{error}</p>}

//       <div className="survey-footer">
//         {step > 0 && (
//           <button
//             className="btn-ghost"
//             onClick={() => {
//               setStep((s) => s - 1);
//               setError("");
//             }}
//           >
//             ← Back
//           </button>
//         )}
//         {step < steps.length - 1 ? (
//           <button className="btn-primary" onClick={handleNext}>
//             Next →
//           </button>
//         ) : (
//           <button
//             className="btn-primary"
//             onClick={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? <span className="spinner" /> : "Submit Survey ✓"}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { submitSurvey, fetchSensorData } from "../api";
import { useApp } from "../context/AppContext";

// ── CO2 annotation ──────────────────────────────────────────────────────────
function getCO2Info(ppm) {
  if (!ppm && ppm !== 0) return null;
  if (ppm <= 400)
    return { label: "Good", color: "#00e676", bg: "rgba(0,230,118,0.15)" };
  if (ppm <= 1000)
    return { label: "Moderate", color: "#ffea00", bg: "rgba(255,234,0,0.15)" };
  if (ppm <= 1500)
    return {
      label: "Satisfactory",
      color: "#ff9100",
      bg: "rgba(255,145,0,0.15)",
    };
  if (ppm <= 2000)
    return { label: "Poor", color: "#ff1744", bg: "rgba(255,23,68,0.15)" };
  if (ppm <= 5000)
    return { label: "Very Poor", color: "#d500f9", bg: "rgba(213,0,249,0.15)" };
  return { label: "Severe", color: "#ff6d00", bg: "rgba(255,109,0,0.18)" };
}

const CO2_LEVELS = [
  { label: "Good", range: "≤ 400 ppm", color: "#00e676" },
  { label: "Moderate", range: "401–1000 ppm", color: "#ffea00" },
  { label: "Satisfactory", range: "1001–1500 ppm", color: "#ff9100" },
  { label: "Poor", range: "1501–2000 ppm", color: "#ff1744" },
  { label: "Very Poor", range: "2001–5000 ppm", color: "#d500f9" },
  { label: "Severe", range: "> 5000 ppm", color: "#ff6d00" },
];

const CO2_CAUSES = [
  {
    icon: "🧑‍🤝‍🧑",
    text: "Human respiration — each person exhales ~200ml of CO₂ per minute, raising indoor levels quickly in crowded rooms.",
  },
  {
    icon: "🚗",
    text: "Vehicle emissions & outdoor air — traffic fumes infiltrate through windows, doors, and ventilation systems.",
  },
  {
    icon: "🔥",
    text: "Combustion appliances — gas stoves, heaters, and burners produce CO₂ directly inside the space.",
  },
];

// ── Single metric card ──────────────────────────────────────────────────────
function MetricCard({ icon, label, value, unit, annotation }) {
  return (
    <div
      className="metric-card"
      style={annotation ? { borderColor: annotation.color + "55" } : {}}
    >
      <div className="metric-top">
        <span className="metric-icon">{icon}</span>
        <span className="metric-label">{label}</span>
      </div>
      <p className="metric-value">
        {value ?? "—"}
        {value != null && <span className="metric-unit"> {unit}</span>}
      </p>
      {annotation && (
        <span
          className="metric-badge"
          style={{ color: annotation.color, background: annotation.bg }}
        >
          ● {annotation.label}
        </span>
      )}
    </div>
  );
}

// ── Device data panel (indoor + outdoor) ───────────────────────────────────
function SensorPanel({ indoorData, outdoorData }) {
  return (
    <div className="sensor-panel">
      <p className="sensor-panel-title">
        <span>🌡️</span> Current Lab Conditions
        <span className="sensor-live-dot" title="Live data" />
      </p>

      {indoorData && (
        <div className="sensor-section">
          <p className="sensor-section-label">🏠 Indoor</p>
          <div className="metrics-grid">
            <MetricCard
              icon="🌡️"
              label="Temperature"
              value={indoorData.data?.temperature}
              unit="°C"
            />
            <MetricCard
              icon="💧"
              label="Humidity"
              value={indoorData.data?.humidity}
              unit="%"
            />
            <MetricCard
              icon="💨"
              label="CO₂"
              value={indoorData.data?.co2}
              unit="ppm"
              annotation={getCO2Info(indoorData.data?.co2)}
            />
          </div>
        </div>
      )}

      {outdoorData && (
        <div className="sensor-section">
          <p className="sensor-section-label">🌤️ Outdoor</p>
          <div className="metrics-grid">
            <MetricCard
              icon="🌡️"
              label="Temperature"
              value={outdoorData.data?.temperature}
              unit="°C"
            />
            <MetricCard
              icon="💧"
              label="Humidity"
              value={outdoorData.data?.humidity}
              unit="%"
            />
            <MetricCard
              icon="💨"
              label="CO₂"
              value={outdoorData.data?.co2}
              unit="ppm"
              annotation={getCO2Info(outdoorData.data?.co2)}
            />
          </div>
        </div>
      )}

      <p className="sensor-timestamp">
        Last updated: {indoorData?.timestamp || outdoorData?.timestamp || "—"}
      </p>

      {/* CO₂ legend */}
      <div className="co2-legend">
        <p className="co2-legend-title">CO₂ Level Guide</p>
        <div className="co2-legend-grid">
          {CO2_LEVELS.map((l) => (
            <div key={l.label} className="co2-legend-item">
              <span
                className="co2-dot"
                style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }}
              />
              <span className="co2-legend-label" style={{ color: l.color }}>
                {l.label}
              </span>
              <span className="co2-legend-range">{l.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CO₂ causes */}
      <div className="co2-causes">
        <p className="co2-legend-title">Main Causes of High CO₂</p>
        {CO2_CAUSES.map((c, i) => (
          <div key={i} className="co2-cause-row">
            <span className="co2-cause-icon">{c.icon}</span>
            <p className="co2-cause-text">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Scale selector ──────────────────────────────────────────────────────────
const SCALE_LABELS = {
  1: "Very Poor",
  2: "Poor",
  3: "Neutral",
  4: "Good",
  5: "Excellent",
};

function ScaleSelector({ value, onChange, question, icon }) {
  return (
    <div className="survey-question">
      <div className="q-header">
        <span className="q-icon">{icon}</span>
        <p>{question}</p>
      </div>
      <div className="scale-row">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`scale-btn ${value === n ? "selected" : ""}`}
            onClick={() => onChange(n)}
          >
            <span className="scale-num">{n}</span>
            <span className="scale-label">{SCALE_LABELS[n]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const VENT_OPTIONS = [
  "Open windows",
  "Open door",
  "Turn on fan",
  "Turn on AC",
  "No change needed",
];

// ── Main SurveyForm ─────────────────────────────────────────────────────────
export default function SurveyForm({ onDone }) {
  const { student, sessionId, sessionInstanceId, sessionData } = useApp();
  const isControl = student?.experiment_group === "control";

  const [answers, setAnswers] = useState({
    q1_air_freshness: null,
    q2_thermal_comfort: null,
    q3_alertness: null,
    q3_concentration: null,
    q4_need_ventilation: "",
    q5_ventilation_preference: "",
  });

  const [sensorLoading, setSensorLoading] = useState(false);
  const [sensorError, setSensorError] = useState("");
  const [indoorData, setIndoorData] = useState(null);
  const [outdoorData, setOutdoorData] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  // Fetch sensor data for control group on mount
  useEffect(() => {
    if (!isControl) return;
    if (!sessionData) return;

    const indoorIds = sessionData.indoor_devices || [];
    const outdoorIds = sessionData.outdoor_devices || [];
    if (indoorIds.length === 0 && outdoorIds.length === 0) return;

    setSensorLoading(true);
    setSensorError("");

    fetchSensorData()
      .then((map) => {
        // Pick first available indoor device that has data
        for (const id of indoorIds) {
          if (map[id]?.data) {
            setIndoorData(map[id]);
            break;
          }
        }
        // Pick first available outdoor device that has data
        for (const id of outdoorIds) {
          if (map[id]?.data) {
            setOutdoorData(map[id]);
            break;
          }
        }
      })
      .catch(() => setSensorError("Could not load sensor data."))
      .finally(() => setSensorLoading(false));
  }, [isControl, sessionData]);

  const steps = [
    {
      title: "Air & Thermal Comfort",
      subtitle: "How does the environment feel right now?",
      content: (
        <>
          <ScaleSelector
            icon="🌬️"
            question="How fresh does the air feel in this room?"
            value={answers.q1_air_freshness}
            onChange={(v) => setAnswers({ ...answers, q1_air_freshness: v })}
          />
          <ScaleSelector
            icon="🌡️"
            question="How comfortable is the temperature right now?"
            value={answers.q2_thermal_comfort}
            onChange={(v) => setAnswers({ ...answers, q2_thermal_comfort: v })}
          />
        </>
      ),
      valid: answers.q1_air_freshness && answers.q2_thermal_comfort,
    },
    {
      title: "Focus & Alertness",
      subtitle: "Reflect on your mental state in this environment.",
      content: (
        <>
          <ScaleSelector
            icon="⚡"
            question="How alert and energised do you feel?"
            value={answers.q3_alertness}
            onChange={(v) => setAnswers({ ...answers, q3_alertness: v })}
          />
          <ScaleSelector
            icon="🎯"
            question="How well are you able to concentrate?"
            value={answers.q3_concentration}
            onChange={(v) => setAnswers({ ...answers, q3_concentration: v })}
          />
        </>
      ),
      valid: answers.q3_alertness && answers.q3_concentration,
    },
    {
      title: "Ventilation Preference",
      subtitle: "Share your ventilation needs.",
      content: (
        <>
          <div className="survey-question">
            <div className="q-header">
              <span className="q-icon">💨</span>
              <p>Do you feel the room needs better ventilation?</p>
            </div>
            <div className="radio-group">
              {["Yes", "No", "Not Sure"].map((opt) => (
                <label
                  key={opt}
                  className={`radio-pill ${answers.q4_need_ventilation === opt ? "active" : ""}`}
                >
                  <input
                    type="radio"
                    name="q4"
                    value={opt}
                    checked={answers.q4_need_ventilation === opt}
                    onChange={() =>
                      setAnswers({ ...answers, q4_need_ventilation: opt })
                    }
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {answers.q4_need_ventilation === "Yes" && (
            <div className="survey-question">
              <div className="q-header">
                <span className="q-icon">🪟</span>
                <p>What would you prefer to improve ventilation?</p>
              </div>
              <div className="checkbox-group">
                {VENT_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className={`check-pill ${answers.q5_ventilation_preference === opt ? "active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="q5"
                      value={opt}
                      checked={answers.q5_ventilation_preference === opt}
                      onChange={() =>
                        setAnswers({
                          ...answers,
                          q5_ventilation_preference: opt,
                        })
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          )}
        </>
      ),
      valid: answers.q4_need_ventilation !== "",
    },
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (!currentStep.valid) {
      setError("Please answer all questions before continuing.");
      return;
    }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!currentStep.valid) {
      setError("Please answer all questions.");
      return;
    }
    if (!student?.student_id) {
      setError("Session expired. Please log in again.");
      return;
    }
    if (!sessionId) {
      setError("No active session found. Please log in again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await submitSurvey({
        student_id: student.student_id,
        session_id: sessionId,
        session_instance_id: sessionInstanceId || null,
        experiment_group: student.experiment_group || "unassigned",
        q1_air_freshness: answers.q1_air_freshness ?? null,
        q2_thermal_comfort: answers.q2_thermal_comfort ?? null,
        q3_alertness: answers.q3_alertness ?? null,
        q3_concentration: answers.q3_concentration ?? null,
        q4_need_ventilation: answers.q4_need_ventilation || null,
        q5_ventilation_preference: answers.q5_ventilation_preference || null,
        // Snapshot the sensor readings shown to control group
        device_data: isControl && indoorData ? indoorData.data : {},
        outdoor_device_data: isControl && outdoorData ? outdoorData.data : {},
      });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-card">
      {/* Progress bar */}
      <div className="progress-bar-wrap">
        {steps.map((_, i) => (
          <div key={i} className={`progress-seg ${i <= step ? "done" : ""}`} />
        ))}
      </div>

      <div className="survey-header">
        <div className="survey-header-top">
          <span className="step-badge">
            Step {step + 1} of {steps.length}
          </span>
          {isControl && (
            <span className="group-badge control">Live Data Enabled</span>
          )}
        </div>
        <h2>{currentStep.title}</h2>
        <p className="auth-subtitle">{currentStep.subtitle}</p>
      </div>

      {/* Sensor panel — control group only, shown on every step */}
      {isControl && (
        <div className="sensor-panel-wrap">
          {sensorLoading && (
            <div className="sensor-loading">
              <span
                className="spinner"
                style={{ borderTopColor: "var(--accent)" }}
              />
              <span>Fetching sensor data…</span>
            </div>
          )}
          {sensorError && <p className="sensor-error">⚠️ {sensorError}</p>}
          {!sensorLoading && !sensorError && (indoorData || outdoorData) && (
            <SensorPanel indoorData={indoorData} outdoorData={outdoorData} />
          )}
          {!sensorLoading && !sensorError && !indoorData && !outdoorData && (
            <p className="sensor-error">
              ⚠️ No sensor data available for this session's devices.
            </p>
          )}
        </div>
      )}

      <div className="survey-body">{currentStep.content}</div>

      {error && <p className="error-msg">{error}</p>}

      <div className="survey-footer">
        {step > 0 && (
          <button
            className="btn-ghost"
            onClick={() => {
              setStep((s) => s - 1);
              setError("");
            }}
          >
            ← Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button className="btn-primary" onClick={handleNext}>
            Next →
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : "Submit Survey ✓"}
          </button>
        )}
      </div>
    </div>
  );
}
