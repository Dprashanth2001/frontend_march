import { useState, useEffect } from "react";
import {
  createSession,
  endSession,
  listSessions,
  listDevices,
  addDevice,
  getSessionResponses,
} from "../api";
import { useApp } from "../context/AppContext";

// ── Device Picker ────────────────────────────────────────────────────────────
// Shows all registered devices of a given type as clickable chips.
// Falls back to a manual comma-separated input if none are registered.
function DevicePicker({ type, allDevices, selected, onChange }) {
  const [manualInput, setManualInput] = useState("");
  const filtered = allDevices.filter((d) => d.type === type);
  const icon = type === "indoor" ? "🏠" : "🌤️";
  const color = type === "indoor" ? "var(--admin-accent)" : "var(--accent)";
  const dimColor = type === "indoor" ? "var(--admin-dim)" : "var(--accent-dim)";

  const toggle = (id) => {
    onChange(
      selected.includes(id)
        ? selected.filter((x) => x !== id)
        : [...selected, id],
    );
  };

  const addManual = () => {
    const ids = manualInput
      .split(",")
      .map((s) => parseInt(s.trim()))
      .filter((n) => !isNaN(n) && !selected.includes(n));
    if (ids.length) onChange([...selected, ...ids]);
    setManualInput("");
  };

  return (
    <div className="device-picker">
      <div className="device-picker-header">
        <span>{icon}</span>
        <span style={{ color }} className="device-picker-type">
          {type.charAt(0).toUpperCase() + type.slice(1)} Devices
        </span>
        {selected.length > 0 && (
          <span
            className="device-count-badge"
            style={{ background: dimColor, color }}
          >
            {selected.length} selected
          </span>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="device-chip-grid">
          {filtered.map((d) => {
            const active = selected.includes(d.device_id);
            return (
              <button
                key={d.device_id}
                type="button"
                className={`device-chip ${active ? "active" : ""} ${type}`}
                onClick={() => toggle(d.device_id)}
              >
                <span className="device-chip-id">#{d.device_id}</span>
                {d.name && <span className="device-chip-name">{d.name}</span>}
                {d.location && (
                  <span className="device-chip-loc">{d.location}</span>
                )}
                {active && <span className="device-chip-check">✓</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="device-picker-empty">
          No {type} devices registered yet. Enter IDs manually below.
        </p>
      )}

      {/* Manual entry — always shown so admin can type IDs like 1192, 1193 */}
      <div className="device-manual-row">
        <input
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
          placeholder={`e.g. 1192, 1193`}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addManual())
          }
        />
        <button type="button" className="btn-secondary" onClick={addManual}>
          Add
        </button>
      </div>

      {selected.length > 0 && (
        <div className="selected-ids">
          {selected.map((id) => (
            <span key={id} className={`id-tag ${type}`}>
              #{id}
              <button type="button" onClick={() => toggle(id)}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Session Panel ────────────────────────────────────────────────────────────
// Convert datetime-local value "2025-03-08T09:00" → "08-03-2025 09:00:00"
function datetimeToStamp(val) {
  if (!val) return null;
  const [datePart, timePart] = val.split("T");
  const [y, m, d] = datePart.split("-");
  return `${d}-${m}-${y} ${timePart}:00`;
}

function SessionPanel({ admin }) {
  const [labId, setLabId] = useState("");
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [responses, setResponses] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    session_id: "",
    session_name: "",
    occupancy: "",
    start_time: "",
    end_time: "",
    ac_status: "OFF",
    ac_temperature: "",
    ac_mode: "",
    windows: "Closed",
    doors: "Closed",
    ceiling_fan: "Off",
    ventilation_strategy: "",
  });

  const [indoorDevices, setIndoorDevices] = useState([]); // selected indoor IDs
  const [outdoorDevices, setOutdoorDevices] = useState([]); // selected outdoor IDs

  // Load all registered devices on mount for the picker
  useEffect(() => {
    listDevices()
      .then(setAllDevices)
      .catch(() => {});
  }, []);

  const fetchSessions = async () => {
    if (!labId.trim()) return;
    try {
      const data = await listSessions(labId.trim());
      setSessions(data);
      const active = data.find((s) => s.status === "active");
      setActiveSession(active || null);
      if (active) {
        const resp = await getSessionResponses(active.session_id);
        setResponses(resp);
      } else {
        setResponses([]);
      }
    } catch (err) {
      setMsg("✗ " + err.message);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!labId.trim()) {
      setMsg("✗ Please enter a Lab ID first.");
      return;
    }
    if (!form.session_id.trim()) {
      setMsg("✗ Session ID is required.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      const allSelected = [...new Set([...indoorDevices, ...outdoorDevices])];
      await createSession({
        session_id: form.session_id.trim(),
        session_name: form.session_name.trim() || null,
        lab_id: labId.trim(),
        start_time: form.start_time ? datetimeToStamp(form.start_time) : null,
        end_time: form.end_time ? datetimeToStamp(form.end_time) : null,
        occupancy: form.occupancy !== "" ? parseInt(form.occupancy) : null,
        ac_status: form.ac_status,
        ac_temperature:
          form.ac_temperature !== "" ? parseFloat(form.ac_temperature) : null,
        ac_mode: form.ac_mode || null,
        windows: form.windows,
        doors: form.doors,
        ceiling_fan: form.ceiling_fan,
        ventilation_strategy: form.ventilation_strategy.trim() || null,
        status: "active",
        created_by: admin.admin_id,
        // ✅ Device arrays
        indoor_devices: indoorDevices,
        outdoor_devices: outdoorDevices,
        devices: allSelected,
      });
      setMsg("✓ Session created successfully");
      // Reset form
      setForm({
        session_id: "",
        session_name: "",
        occupancy: "",
        start_time: "",
        end_time: "",
        ac_status: "OFF",
        ac_temperature: "",
        ac_mode: "",
        windows: "Closed",
        doors: "Closed",
        ceiling_fan: "Off",
        ventilation_strategy: "",
      });
      setIndoorDevices([]);
      setOutdoorDevices([]);
      await fetchSessions();
    } catch (err) {
      setMsg("✗ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnd = async (session_id) => {
    setLoading(true);
    try {
      await endSession(session_id);
      setMsg("✓ Session ended");
      await fetchSessions();
    } catch (err) {
      setMsg("✗ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h3>Session Management</h3>

      <div className="field-row">
        <div className="field">
          <label>Lab ID</label>
          <input
            value={labId}
            onChange={(e) => setLabId(e.target.value)}
            placeholder="e.g. LAB_A"
            onKeyDown={(e) => e.key === "Enter" && fetchSessions()}
          />
        </div>
        <button className="btn-secondary" onClick={fetchSessions}>
          Load
        </button>
      </div>

      {activeSession && (
        <div className="active-session-banner">
          <div>
            <strong>🟢 Active:</strong>{" "}
            {activeSession.session_name || activeSession.session_id}
            <span className="badge">{responses.length} responses</span>
            {activeSession.indoor_devices?.length > 0 && (
              <span
                className="badge"
                style={{
                  background: "var(--admin-dim)",
                  color: "var(--admin-accent)",
                }}
              >
                🏠 {activeSession.indoor_devices.join(", ")}
              </span>
            )}
            {activeSession.outdoor_devices?.length > 0 && (
              <span className="badge">
                🌤️ {activeSession.outdoor_devices.join(", ")}
              </span>
            )}
          </div>
          <button
            className="btn-danger"
            onClick={() => handleEnd(activeSession.session_id)}
          >
            End Session
          </button>
        </div>
      )}

      {!activeSession && (
        <form onSubmit={handleCreate} className="subform">
          <p className="subform-title">Create New Session</p>

          {/* Basic info */}
          <div className="field-row">
            <div className="field">
              <label>
                Session ID <span className="req">*</span>
              </label>
              <input
                value={form.session_id}
                onChange={(e) =>
                  setForm({ ...form, session_id: e.target.value })
                }
                placeholder="SES_001"
              />
            </div>
            <div className="field">
              <label>Session Name</label>
              <input
                value={form.session_name}
                onChange={(e) =>
                  setForm({ ...form, session_name: e.target.value })
                }
                placeholder="Morning Lab"
              />
            </div>
          </div>

          {/* Schedule */}
          <div className="schedule-section">
            <p className="subform-title" style={{ marginBottom: 10 }}>
              📅 Schedule
            </p>
            <div className="field-row">
              <div className="field">
                <label>Start Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={form.start_time}
                  onChange={(e) =>
                    setForm({ ...form, start_time: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label>End Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={form.end_time}
                  onChange={(e) =>
                    setForm({ ...form, end_time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Environment */}
          <div className="field-row">
            <div className="field narrow">
              <label>Occupancy</label>
              <input
                type="number"
                value={form.occupancy}
                onChange={(e) =>
                  setForm({ ...form, occupancy: e.target.value })
                }
                placeholder="30"
              />
            </div>
            <div className="field narrow">
              <label>AC Temp (°C)</label>
              <input
                type="number"
                value={form.ac_temperature}
                onChange={(e) =>
                  setForm({ ...form, ac_temperature: e.target.value })
                }
                placeholder="24"
              />
            </div>
            <div className="field narrow">
              <label>AC Status</label>
              <select
                value={form.ac_status}
                onChange={(e) =>
                  setForm({ ...form, ac_status: e.target.value })
                }
              >
                <option>ON</option>
                <option>OFF</option>
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field narrow">
              <label>AC Mode</label>
              <select
                value={form.ac_mode}
                onChange={(e) => setForm({ ...form, ac_mode: e.target.value })}
              >
                <option value="">— None —</option>
                <option value="cooling">Cooling</option>
                <option value="heating">Heating</option>
                <option value="fan">Fan Only</option>
                <option value="dry">Dry</option>
                <option value="auto">Auto</option>
              </select>
            </div>
          </div>
          <div className="field-row">
            <div className="field narrow">
              <label>Windows</label>
              <select
                value={form.windows}
                onChange={(e) => setForm({ ...form, windows: e.target.value })}
              >
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="field narrow">
              <label>Doors</label>
              <select
                value={form.doors}
                onChange={(e) => setForm({ ...form, doors: e.target.value })}
              >
                <option>Open</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="field narrow">
              <label>Ceiling Fan</label>
              <select
                value={form.ceiling_fan}
                onChange={(e) =>
                  setForm({ ...form, ceiling_fan: e.target.value })
                }
              >
                <option>On</option>
                <option>Off</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label>Ventilation Strategy</label>
            <input
              value={form.ventilation_strategy}
              onChange={(e) =>
                setForm({ ...form, ventilation_strategy: e.target.value })
              }
              placeholder="e.g. Full Vent, No Vent"
            />
          </div>

          {/* ✅ Device pickers */}
          <div className="device-pickers-section">
            <p className="subform-title" style={{ marginBottom: 12 }}>
              Assign Devices
            </p>
            <div className="device-pickers-grid">
              <DevicePicker
                type="indoor"
                allDevices={allDevices}
                selected={indoorDevices}
                onChange={setIndoorDevices}
              />
              <DevicePicker
                type="outdoor"
                allDevices={allDevices}
                selected={outdoorDevices}
                onChange={setOutdoorDevices}
              />
            </div>
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : "Create Session"}
          </button>
        </form>
      )}

      {msg && (
        <p className={`msg ${msg.startsWith("✓") ? "success" : "error-msg"}`}>
          {msg}
        </p>
      )}

      {sessions.length > 0 && (
        <div className="sessions-table-wrap">
          <p className="subform-title">All Sessions</p>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Indoor</th>
                <th>Outdoor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.session_id}>
                  <td>{s.session_id}</td>
                  <td>{s.session_name || "—"}</td>
                  <td>
                    <span className="time-range">{s.start_time || "—"}</span>
                  </td>
                  <td>
                    <span className="time-range">{s.end_time || "—"}</span>
                  </td>
                  <td>
                    {s.indoor_devices?.length > 0 ? (
                      s.indoor_devices.map((id) => (
                        <span
                          key={id}
                          className="id-tag indoor"
                          style={{ marginRight: 4 }}
                        >
                          #{id}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    {s.outdoor_devices?.length > 0 ? (
                      s.outdoor_devices.map((id) => (
                        <span
                          key={id}
                          className="id-tag outdoor"
                          style={{ marginRight: 4 }}
                        >
                          #{id}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-chip ${s.status}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Device Panel ─────────────────────────────────────────────────────────────
function DevicePanel() {
  const [devices, setDevices] = useState([]);
  const [form, setForm] = useState({
    device_id: "",
    name: "",
    type: "indoor",
    location: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    listDevices()
      .then(setDevices)
      .catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await addDevice({
        ...form,
        device_id: parseInt(form.device_id),
        api_enabled: true,
      });
      setMsg("✓ Device added");
      const updated = await listDevices();
      setDevices(updated);
      setForm({ device_id: "", name: "", type: "indoor", location: "" });
    } catch (err) {
      setMsg("✗ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <h3>Device Management</h3>
      <form onSubmit={handleAdd} className="subform">
        <p className="subform-title">Register New Device</p>
        <div className="field-row">
          <div className="field narrow">
            <label>
              Device ID <span className="req">*</span>
            </label>
            <input
              type="number"
              value={form.device_id}
              onChange={(e) => setForm({ ...form, device_id: e.target.value })}
              placeholder="1192"
              required
            />
          </div>
          <div className="field">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Lab A Indoor Sensor"
            />
          </div>
        </div>
        <div className="field-row">
          <div className="field narrow">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
          <div className="field">
            <label>Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Lab A"
            />
          </div>
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? <span className="spinner" /> : "Add Device"}
        </button>
      </form>

      {msg && (
        <p className={`msg ${msg.startsWith("✓") ? "success" : "error-msg"}`}>
          {msg}
        </p>
      )}

      <div className="sessions-table-wrap">
        <p className="subform-title">Registered Devices ({devices.length})</p>
        {devices.length === 0 ? (
          <p className="empty-state">No devices registered yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.device_id}>
                  <td>#{d.device_id}</td>
                  <td>{d.name || "—"}</td>
                  <td>
                    <span className={`status-chip ${d.type}`}>{d.type}</span>
                  </td>
                  <td>{d.location || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Dashboard Shell ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { admin, adminLogout } = useApp();
  const [tab, setTab] = useState("sessions");

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-brand">
          <span>🔬</span>
          <span>Lab Survey Admin</span>
        </div>
        <div className="admin-user">
          <span>👤 {admin?.name}</span>
          <button className="btn-ghost small" onClick={adminLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="admin-content">
        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === "sessions" ? "active" : ""}`}
            onClick={() => setTab("sessions")}
          >
            📅 Sessions
          </button>
          <button
            className={`tab-btn ${tab === "devices" ? "active" : ""}`}
            onClick={() => setTab("devices")}
          >
            📡 Devices
          </button>
        </div>

        {tab === "sessions" && <SessionPanel admin={admin} />}
        {tab === "devices" && <DevicePanel />}
      </div>
    </div>
  );
}
