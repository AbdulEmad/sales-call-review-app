import React, { useState, useEffect } from "react";

function CallDetail({ callId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [callData, setCallData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (callId) {
      fetch(`${process.env.REACT_APP_BACKEND_API_URL}/calls/${callId}`)
        .then((resp) => {
          if (!resp.ok) {
            throw new Error("Failed to fetch call data");
          }
          return resp.json();
        })
        .then((data) => {
          setCallData(data);
          setError("");
        })
        .catch((err) => {
          console.error("Error fetching call details:", err);
          setError("Could not load call details");
        });
    }
  }, [callId]);

  const handleAsk = async () => {
    try {
      const resp = fetch(`${process.env.REACT_APP_BACKEND_API_URL}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_id: callId, question: question }),
      });
      if (!resp.ok) {
        throw new Error("Failed to fetch answer");
      }
      const data = await resp.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error("Error fetching answer:", err);
      setAnswer("Error fetching answer");
    }
  };

  // Render loading/error states or the actual call details
  return (
    <div style={{ flex: 1 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!callData && !error && <p>Loading call details...</p>}

      {callData && (
        <>
          <h2>{callData.call_metadata.title}</h2>
          <p><strong>Duration:</strong> {callData.call_metadata.duration}</p>
          <p><strong>Started At:</strong> {callData.call_metadata.start_time}</p>
          
          <h4>Parties Involved</h4>
          <ul>
            {callData.call_metadata.parties.map((party, index) => (
              <li key={index}>
                <strong>{party.name}</strong> ({party.email})
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1rem" }}>
            <strong>Transcript:</strong>
            <pre style={{ backgroundColor: "#f8f8f8", padding: "10px" }}>
              {callData.transcript?.text || "No transcript available"}
            </pre>
          </div>
        </>
      )}

      <div style={{ marginTop: "2rem" }}>
        <label>
          <strong>Ask a question about this call:</strong>
          <input
            style={{ marginLeft: "10px" }}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </label>
        <button onClick={handleAsk} style={{ marginLeft: "10px" }}>
          Ask
        </button>
      </div>

      {answer && (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

export default CallDetail;
