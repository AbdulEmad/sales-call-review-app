import React, { useEffect, useState } from "react";

function CallList({ onSelectCall }) {
  const [calls, setCalls] = useState([]);
  const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${backendApiUrl}/calls`)
      .then((res) => res.json())
      .then((data) => setCalls(data))
      .catch((err) => console.error("Error fetching calls:", err));
  }, [backendApiUrl]);

  return (
    <div style={{ width: "300px" }}>
      <h2>Previous Calls</h2>
      <ul>
        {calls.map((call) => (
          <li key={call.call_id}>
            <button onClick={() => onSelectCall(call.call_id)}>
              Call {call.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CallList;
