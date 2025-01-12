import React, { useState } from "react";
import CallList from "./CallList";
import CallDetail from "./CallDetail";
import "./App.css";

function App() {
  const [selectedCallId, setSelectedCallId] = useState(null);

  return (
    <div className="App bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Sales Call Review</h1>
      <div className="flex gap-6">
        <div className="flex-none w-1/3 max-w-xs bg-white shadow-md rounded-lg p-4">
          <CallList onSelectCall={setSelectedCallId} />
        </div>
        {selectedCallId && (
          <div className="flex-1 bg-white shadow-md rounded-lg p-4">
            <CallDetail callId={selectedCallId} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
