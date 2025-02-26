// "use client";
// import { useEMSContext } from "@/app/context/EMSContext";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// // Admin Dashboard
// export const AdminDashboard = () => {
//   const { contract } = useEMSContext();
//   const [userAddress, setUserAddress] = useState("");
//   const [userRole, setUserRole] = useState("auditor");
  
//   const registerUser = async () => {
//     if (contract) {
//       try {
//         const tx = await contract.registerUser(userAddress, userRole);
//         await tx.wait();
//         alert("User registered successfully");
//       } catch (error) {
//         console.error("Error registering user:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-800 text-white rounded-xl">
//       <h2 className="text-xl font-bold">Admin Dashboard</h2>
//       <Input
//         placeholder="User Address"
//         value={userAddress}
//         onChange={(e) => setUserAddress(e.target.value)}
//       />
//       <select
//         className="p-2 bg-gray-700 rounded"
//         value={userRole}
//         onChange={(e) => setUserRole(e.target.value)}
//       >
//         <option value="auditor">Auditor</option>
//         <option value="guest">Guest</option>
//       </select>
//       <Button onClick={registerUser}>Register User</Button>
//     </div>
//   );
// };

// // Auditor Panel
// export const AuditorPanel = () => {
//   const { contract } = useEMSContext();
//   const [caseId, setCaseId] = useState("");
//   const [evidence, setEvidence] = useState("");

//   const addEvidence = async () => {
//     if (contract) {
//       try {
//         const tx = await contract.addEvidence(caseId, evidence);
//         await tx.wait();
//         alert("Evidence added successfully");
//       } catch (error) {
//         console.error("Error adding evidence:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-800 text-white rounded-xl">
//       <h2 className="text-xl font-bold">Auditor Panel</h2>
//       <Input
//         placeholder="Case ID"
//         value={caseId}
//         onChange={(e) => setCaseId(e.target.value)}
//       />
//       <Input
//         placeholder="Evidence Description"
//         value={evidence}
//         onChange={(e) => setEvidence(e.target.value)}
//       />
//       <Button onClick={addEvidence}>Add Evidence</Button>
//     </div>
//   );
// };

// // Guest Panel
// export const GuestPanel = () => {
//   const { contract } = useEMSContext();
//   const [caseId, setCaseId] = useState("");
//   const [caseDetails, setCaseDetails] = useState(null);

//   const fetchCaseDetails = async () => {
//     if (contract) {
//       try {
//         const details = await contract.getCaseDetails(caseId);
//         setCaseDetails(details);
//       } catch (error) {
//         console.error("Error fetching case details:", error);
//       }
//     }
//   };

//   return (
//     <div className="p-4 bg-gray-800 text-white rounded-xl">
//       <h2 className="text-xl font-bold">Guest Panel</h2>
//       <Input
//         placeholder="Case ID"
//         value={caseId}
//         onChange={(e) => setCaseId(e.target.value)}
//       />
//       <Button onClick={fetchCaseDetails}>Get Case Details</Button>
//       {caseDetails && (
//         <div className="mt-4 p-2 bg-gray-700 rounded">
//           <p>Case ID: {caseDetails.caseId}</p>
//           <p>Description: {caseDetails.description}</p>
//         </div>
//       )}
//     </div>
//   );
// };
