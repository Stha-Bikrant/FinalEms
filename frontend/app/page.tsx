"use client";

import { EMSProvider,useEMSContext  } from "@/app/context/EMSContext";
import AdminDashboard from "@/app/components/Admin/admin";
import AuditorPanel from "@/app/components/Auditor/auditor";
import GuestPanel from "@/app/components/Guest/guest";
import { useEffect } from "react";

const MainPage: React.FC = () => {
  const { userAuth, connectWallet, account } = useEMSContext();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
  <h1 className="text-2xl font-bold mb-4">Evidence Management System</h1>
  {!account ? (
        <button onClick={connectWallet} className="p-2 bg-blue-500 text-white rounded">
          Connect Wallet
        </button>
      ) : (
        <>
       {userAuth === "Admin" && <AdminDashboard />}
       {userAuth === "Auditor" && <AuditorPanel />}
      {userAuth === "Guest" && <GuestPanel />}
       {userAuth === "Unknown" && (
         <div className="flex justify-center items-center h-screen text-xl font-semibold">
          Access Denied: Unauthorized User
        </div>
     )}
        </>
      )}
    </div>
  );
};
// Wrap the entire app with EMSProvider
export default function App() {
  return (
    <EMSProvider>
      <MainPage />
    </EMSProvider>
  );
}