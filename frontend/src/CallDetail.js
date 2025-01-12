import React, { useState, useEffect } from "react";

function CallDetail({ callId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [callData, setCallData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchCallData = async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${backendApiUrl}/calls/${callId}`);
        if (!resp.ok) throw new Error("Failed to fetch call data");
        const data = await resp.json();
        setCallData(data);
        setError("");
        setQuestion("");
        setAnswer("");
      } catch (err) {
        console.error("Error fetching call details:", err);
        setError("Could not load call details");
      } finally {
        setLoading(false);
      }
    };
    fetchCallData();
  }, [callId]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    try {
      const resp = await fetch(`${backendApiUrl}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ call_id: callId, question }),
      });

      if (!resp.ok) {
        throw new Error(`Failed to fetch answer: ${resp.status} ${resp.statusText}`);
      }

      const data = await resp.json();
      setAnswer(data.answer);
      setQuestion("");
    } catch (err) {
      console.error("Error fetching answer:", err);
      setAnswer("Error fetching answer");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (!callData) {
    return <div>No call data available.</div>;
  }

  return (
    <div className="flex flex-col p-6 bg-gray-50 min-h-screen space-y-6">
      {error && <p className="text-red-600 font-semibold">{error}</p>}
      {!callData && !error && (
        <div className="flex justify-center items-center min-h-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
          <p className="ml-4 text-gray-600">Loading call details...</p>
        </div>
      )}

      {callData && (
        <>
          {/* Call Metadata */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-blue-700">
              {callData.call_metadata.title}
            </h2>
            <p className="text-gray-700 mt-2">
              <strong>Duration:</strong>{" "}
              {Math.floor(callData.call_metadata.duration / 60)} minutes,{" "}
              {callData.call_metadata.duration % 60} seconds
            </p>
            <p className="text-gray-700">
              <strong>Started At:</strong> {formatDate(callData.call_metadata.start_time)}
            </p>

            <h4 className="mt-6 text-lg font-semibold text-gray-800">
              Parties Involved
            </h4>
            <ul className="list-disc pl-6 mt-2">
              {callData.call_metadata.parties.map((party, index) => (
                <li key={index} className="text-gray-700" style={{ listStyleType: 'none' }}>
                  <strong>{party.name}</strong> ({party.email})
                </li>
              ))}
            </ul>
          </div>

          {/* Transcript in its own scrollable box */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <strong className="text-gray-800">Transcript:</strong>
            <div
              className="bg-gray-100 p-4 rounded-lg mt-2 max-h-60 overflow-y-auto shadow-inner border border-gray-300 text-sm leading-relaxed text-gray-700"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {callData.transcript?.text || "No transcript available"}
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-4 mb-4">
            <strong className="block text-lg mb-2">Call Summary:</strong>
            <p className="text-gray-700">{callData.inference_results.call_summary}</p>
          </div>
        </>
      )}

      {/* Q&A Section */}
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <label className="block text-gray-700 font-semibold mb-2">
          Ask a question about this call:
        </label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring focus:ring-blue-300 
                     shadow-sm mb-4"
          rows="4"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          aria-label="Question Input"
        />
        <button
          onClick={handleAsk}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg 
                     hover:bg-blue-700 focus:outline-none focus:ring-4 
                     focus:ring-blue-300 transition"
          aria-label="Submit Question"
        >
          Ask
        </button>
      </div>

      {/* Display the answer */}
      {answer && (
        <div className="mt-6 bg-white p-6 shadow-lg rounded-lg">
          <strong className="block text-gray-800 text-lg">Answer:</strong>
          <p className="text-gray-700 mt-2">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default CallDetail;
