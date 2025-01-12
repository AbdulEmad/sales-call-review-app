import React, { useEffect, useState } from "react";

function CallList({ onSelectCall }) {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8000";

  useEffect(() => {
    fetch(`${backendApiUrl}/calls`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch calls");
        }
        return res.json();
      })
      .then((data) => {
        setCalls(data);
        setLoading(false);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching calls:", err);
        setError("Could not load calls. Please try again later.");
        setLoading(false);
      });
  }, [backendApiUrl]);

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Previous Calls</h2>

      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      )}

      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <ul className="space-y-3">
          {calls.map((call) => (
            <li key={call.call_id} style={{ listStyleType: 'none' }}>
              <button
                onClick={() => onSelectCall(call.call_id)}
                className="block w-full text-left bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                aria-label={`Select call ${call.title}`}
              >
                <div className="text-gray-800 font-medium">{call.title}</div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && calls.length === 0 && (
        <p className="text-gray-600 text-center">No calls available.</p>
      )}
    </div>
  );
}

export default CallList;
