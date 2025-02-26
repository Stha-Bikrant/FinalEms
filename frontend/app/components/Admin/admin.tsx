"use client";
import { useState } from "react";
import { useEMSContext } from "@/app/context/EMSContext";


export default function AdminDashboard() {
      const { contract } = useEMSContext();
  const [userAddress, setUserAddress] = useState("");
  const [activateUserAddress, setActivateUserAddress] = useState("");
  const [caseUserAddress, setCaseUserAddress] = useState("");
  const [userRole, setUserRole] = useState(0); // User role as number (0 = Auditor, 1 = Guest)
  const [caseNumber, setCaseNumber] = useState("");


  // Function to Register User
  const registerUser = async () => {
    if (!userAddress) {
      alert("Please enter a valid user address.");
      return;
    }
    if (contract) {
        try {
          const tx = await contract.register(caseUserAddress,caseNumber);
          await tx.wait();
          alert("Case Updated successfully");
        } catch (error) {
          console.error("Error Updating Case:", error);
        }
      }
    alert(`User registered successfully as ${userRole === 0 ? "Auditor" : "Guest"}`);
  };

  const activateUser = () => {
    if (!activateUserAddress) {
      alert("Please enter a valid user address.");
      return;
    }
    alert("User Activated successfully");
  };

  const assignCaseToUser = async() => {
    if (!caseUserAddress || !caseNumber) {
        if (contract) {
            try {
              const tx = await contract.assignCaseToUser(userAddress,userRole);
              await tx.wait();
              alert("Case Updated successfully");
            } catch (error) {
              console.error("Error Updating Case:", error);
            }
          }
      alert("Please enter a valid user address and case number.");
      return;
    }
    alert("User Assigned case successfully");
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded-xl">
      <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
      
      <h3>Register Users</h3>
      <input
        type="text"
        placeholder="User Address"
        className="p-2 mb-2 w-full bg-gray-700 rounded"
        value={userAddress}
        onChange={(e) => setUserAddress(e.target.value)}
      />
      <select
        className="p-2 mb-2 w-full bg-gray-700 rounded"
        value={userRole}
        onChange={(e) => setUserRole(Number(e.target.value))}
      >
        <option value={0}>Auditor</option>
        <option value={1}>Guest</option>
      </select>
      <button
        onClick={registerUser}
        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition"
      >
        Register User
      </button>

      <h3>Activate Users</h3>
      <input
        type="text"
        placeholder="User Address"
        className="p-2 mb-2 w-full bg-gray-700 rounded"
        value={activateUserAddress}
        onChange={(e) => setActivateUserAddress(e.target.value)}
      />
      <button
        onClick={activateUser}
        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition"
      >
        Activate User
      </button>

      <h3>Assign Case To Users</h3>
      <input
        type="text"
        placeholder="User Address"
        className="p-2 mb-2 w-full bg-gray-700 rounded"
        value={caseUserAddress}
        onChange={(e) => setCaseUserAddress(e.target.value)}
      />
      <input
        type="text"
        placeholder="Case Number"
        className="p-2 mb-2 w-full bg-gray-700 rounded"
        value={caseNumber}
        onChange={(e) => setCaseNumber(e.target.value)}
      />
      <button
        onClick={assignCaseToUser}
        className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-700 transition"
      >
        Assign Case
      </button>
    </div>
  );
}
