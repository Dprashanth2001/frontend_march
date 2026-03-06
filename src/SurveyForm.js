import React, { useState } from "react";

function SurveyForm() {
  const [formData, setFormData] = useState({
    student_id: "",
    q1: 1,
    q2: 1,
    q3: 1,
    q4: "Yes",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://backend-march.onrender.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      console.error(err);
      setMessage("Error submitting data");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Survey Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Student ID: </label>
          <input
            type="text"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Q1 (1-5): </label>
          <input
            type="number"
            name="q1"
            value={formData.q1}
            min="1"
            max="5"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Q2 (1-5): </label>
          <input
            type="number"
            name="q2"
            value={formData.q2}
            min="1"
            max="5"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Q3 (1-5): </label>
          <input
            type="number"
            name="q3"
            value={formData.q3}
            min="1"
            max="5"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Q4: </label>
          <select name="q4" value={formData.q4} onChange={handleChange}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Not Sure">Not Sure</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SurveyForm;
