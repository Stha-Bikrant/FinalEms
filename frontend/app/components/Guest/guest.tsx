"use client";
import { useState } from "react";
import { useEMSContext } from "@/app/context/EMSContext";

export default function GuestPanel() {
  const { contract } = useEMSContext();
  const [caseNumber, setCaseNumber] = useState("");
  const [caseDetails, setCaseDetails] = useState<any>(null);
  const [caseEvidences, setCaseEvidences] = useState<[string[], string[]]>([[], []]);

  const getCaseDetails = async () => {
    if (!contract || !caseNumber) {
      alert("Please enter a valid case number or ensure contract is connected.");
      return;
    }
    try {
      const details = await contract.getCaseDetails(caseNumber);
      setCaseDetails(details);
    } catch (error) {
      console.error("Error fetching case details:", error);
      alert("Failed to fetch case details.");
    }
  };

  const getCaseEvidences = async () => {
    if (!contract || !caseNumber) {
      alert("Please enter a valid case number or ensure contract is connected.");
      return;
    }
    try {
      const evidences = await contract.getCaseEvidences(caseNumber);
      setCaseEvidences([evidences[0], evidences[1]]);
    } catch (error) {
      console.error("Error fetching case evidences:", error);
      alert("Failed to fetch case evidences.");
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-xl">
      <h2 className="text-xl font-bold mb-4">Guest Panel</h2>

      <h3>Get Case Details</h3>
      <input type="text" placeholder="Case Number" className="p-2 mb-2 w-full bg-gray-700 rounded" value={caseNumber} onChange={(e) => setCaseNumber(e.target.value)} />
      <button onClick={getCaseDetails} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition">Get Case Details</button>
      {caseDetails && (
        <div className="mt-4 p-2 bg-gray-700 rounded">
          <p><strong>Case Number:</strong> {caseDetails[0]}</p>
          <p><strong>Description:</strong> {caseDetails[1]}</p>
          <p><strong>Total Evidences:</strong> {caseDetails[2]}</p>
          <p><strong>Timestamp:</strong> {caseDetails[3]}</p>
          <p><strong>Status:</strong> {caseDetails[4]}</p>
        </div>
      )}

      <h3>Get Case Evidences</h3>
      <button onClick={getCaseEvidences} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition">Get Case Evidences</button>
      {caseEvidences[0].length > 0 && (
        <div className="mt-4 p-2 bg-gray-700 rounded">
          {caseEvidences[0].map((type, index) => (
            <p key={index}><strong>{type}:</strong> {caseEvidences[1][index]}</p>
          ))}
        </div>
      )}
    </div>
  );
}
