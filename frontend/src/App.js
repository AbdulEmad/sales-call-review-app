import React, { useState } from "react";
import CallList from "./CallList";
import CallDetail from "./CallDetail";
import "./App.css";

function App() {
  const [selectedCallId, setSelectedCallId] = useState(null);

  return (
    <div className="App">
      <h1>Sales Call Review</h1>
      <div style={{ display: "flex", gap: "2rem" }}>
        <CallList onSelectCall={setSelectedCallId} />
        {selectedCallId && <CallDetail callId={selectedCallId} />}
      </div>
    </div>
  );
}

export default App;
