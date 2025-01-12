import React, { useEffect, useState } from "react";

function CallList({ onSelectCall }) {
  const [calls, setCalls] = useState([]);

  useEffect(() => {
    fetch(`${process.env.BACKEND_API_URL}/calls`)
      .then((res) => res.json())
      .then((data) => setCalls(data))
      .catch((err) => console.error("Error fetching calls:", err));
  }, []);

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
