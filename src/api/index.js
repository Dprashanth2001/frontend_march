const BASE_URL = process.env.REACT_APP_API_BASE_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

// Auth
export const loginStudent = (student_id, lab_id) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ student_id, lab_id }),
  });

export const registerStudent = (payload) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

// Survey
export const submitSurvey = (payload) =>
  request("/survey/submit", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getSessionResponses = (session_id) =>
  request(`/survey/session/${session_id}`);

// Session
export const createSession = (payload) =>
  request("/session/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getActiveSession = (lab_id) =>
  request(`/session/active/${lab_id}`);

export const endSession = (session_id) =>
  request(`/session/end/${session_id}`, { method: "PATCH" });

export const listSessions = (lab_id) => request(`/session/list/${lab_id}`);

// Device
export const addDevice = (payload) =>
  request("/device/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const listDevices = () => request("/device/list");

export const getDevice = (device_id) => request(`/device/${device_id}`);

// Admin
export const adminLogin = (email, password) =>
  request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const addAdmin = (payload) =>
  request("/admin/add", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const listAdmins = () => request("/admin/list");

// External sensor API
const SENSOR_API_URL = process.env.REACT_APP_SENSOR_API_URL;
const SENSOR_API_KEY = process.env.REACT_APP_SENSOR_API_KEY;

console.log(SENSOR_API_KEY, SENSOR_API_URL);

export const fetchSensorData = async () => {
  const res = await fetch(SENSOR_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: SENSOR_API_KEY }),
  });
  if (!res.ok) throw new Error("Failed to fetch sensor data");
  const json = await res.json();
  // Return as a map: { [device_id]: deviceDataObject }
  const map = {};
  (json.data || []).forEach((entry) => {
    if (entry?.data?.data) map[entry._id] = entry.data;
  });
  return map;
};
