"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import ContractAddress from "@/contracts/contract-address.json";
import abi from "@/contracts/EMS.json";

// Define the context type for the EMS contract
interface User {
  userAddress: string;
  userRole: "Auditor" | "Guest" |"Unknown";
  userStatus: "Inactive" | "Active";
  isRegistered: boolean;
  assignedCaseNumbers: number[];
  totalAssignedCases: number;
  timestamp: number;
}

// Define Evidence interface
interface Evidence {
  typeOfEvidence: string;
  evidenceData: string;
}

// Define CaseStatus Enum 
type CaseStatus = "Initialised" | "Open" | "Closed";

// Define Case interface
interface Case {
  caseNumber: number;
  caseDescription: string;
  totalCaseEvidences: number;
  timestamp: number;
  caseStatus: CaseStatus;
  evidences: Evidence[];
}

interface EMSContextType {
  account: string | null;
  userAuth: string;
  contract: any;

  // Wallet Connection
  connectWallet: () => Promise<void>;

  // User Management
  registerUser: (address: string, role: number) => Promise<void>;
  activateUser: (address: string) => Promise<void>;
  deactivateUser: (address: string) => Promise<void>;
//   checkUserRole: (address: string) => Promise<"Auditor" | "Guest" |"Unknown">;
  getUserCases: (address: string) => Promise<number[]>;
  assignCaseToUser: (address: string, caseNumber: number) => Promise<void>;
  getUserDetails: (address: string) => Promise<User>;

  // Case Management
  updateCase: (caseNumber: number, description: string) => Promise<void>;
  openCase: (caseNumber: number) => Promise<void>;
  closeCase: (caseNumber: number) => Promise<void>;
  getCaseDetails: (caseNumber: number) => Promise<Case>;

  // Evidence Management
  addEvidenceToCase: (
    caseNumber: number,
    typeOfEvidence: string,
    evidenceData: string
  ) => Promise<void>;
  getCaseEvidences: (caseNumber: number) => Promise<Evidence[]>;
}

// Create context
const EMSContext = createContext<EMSContextType | null>(null);

// Define provider props type
interface EMSProviderProps {
  children: ReactNode;
}

export const EMSProvider: React.FC<EMSProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [userAuth, setUserAuth] = useState<string>("Unknown");
  const [contract, setContract] = useState<any>(null);

  const CONTRACT_ADDRESS = ContractAddress.EMS;
  const CONTRACT_ABI = abi.abi;

  // Connect Wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const address = await signer.getAddress();

      setAccount(address);
      setContract(contractInstance);
      await checkUserAuthentication(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // Register User
  const registerUser = async (userAddress: string, role: number) => {
    if (!contract){return} ;
    try {
      const tx = await contract.registerUser(userAddress, role);
      await tx.wait();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

const checkUserAuthentication = async (userAddress: string) => {
    if (!contract) {return "Unknown"}; // Ensure contract is available
  
    try {
        const isAdmin = await contract.owner();
        const isAuditor = await contract.isAuditor(userAddress);
        const isGuestUser = await contract.isGuestUser(userAddress);

        if (userAddress.toLowerCase() === isAdmin.toLowerCase()) {
            setUserAuth("Admin");
          } else if (isAuditor) {
            setUserAuth("Auditor");
          } else if (isGuestUser) {
            setUserAuth("Guest");
          } else {
            setUserAuth("Unknown");
          }
    }
    catch (error) {
        console.error("Error checking role:", error);
      }
  };
  
  
  // Activate Userreturn
  const activateUser = async (userAddress: string) => {
    if (!contract){return} ;
    try {
      const tx = await contract.activateUser(userAddress);
      await tx.wait();
    } catch (error) {
      console.error("Error activating user:", error);
    }
  };

  // Deactivate User
  const deactivateUser = async (userAddress: string) => {
    if (!contract){return} ;
    try {
      const tx = await contract.deactivateUser(userAddress);
      await tx.wait();
    } catch (error) {
      console.error("Error deactivating user:", error);
    }
  };

//   const checkUserRole = async (userAddress: string) => {
//     if (!contract) {return "Unknown"}; // Ensure contract is available
//     try {
//         const tx = await contract.checkUserRole(userAddress);
//         await tx.wait();;
//     }
//     catch (error) {
//         console.error("Error checking User Role:", error);
//       }
//   };
  

  // Get User Cases
  const getUserCases = async (userAddress: string) => {
    if (!contract) {return []};
    return await contract.getUserCases(userAddress);
  };

  // Get User Details
  const getUserDetails = async (userAddress: string) => {
    if (!contract){ return {} as User};
    return await contract.users(userAddress);
  };

  //Case update
  const updateCase = async (caseNumber: number, description: string) => {
    if (!contract) {return} ;
    try {
        const tx = await contract.updateCase(caseNumber, description);
        await tx.wait();
      } catch (error) {
        console.error("Error updating Case:", error);
      }

  }
//   updateCase: (caseNumber: number, description: string) => Promise<void>;
// openCase: (caseNumber: number) => Promise<void>;

  const openCase = async(caseNumber: number) => {
    if (!contract) {return} ;
    try {
        const tx = await contract.openCase(caseNumber);
        await tx.wait();
      } catch (error) {
        console.error("Error updating Case:", error);
      }
  }

  const closeCase = async(caseNumber: number) => {
    if (!contract) {return} ;
    try {
        const tx = await contract.closeCase(caseNumber);
        await tx.wait();
      } catch (error) {
        console.error("Error updating Case:", error);
      }
  }

  // Get Case Details
  const getCaseDetails = async (caseNumber: number) => {
    if (!contract) { return {} as Case};
    return await contract.getCaseDetails(caseNumber);
  };

  // Assign Case to User
  const assignCaseToUser = async (userAddress: string, caseNumber: number) => {
    if (!contract) {return};
    try {
      const tx = await contract.assignCaseToUser(userAddress, caseNumber);
      await tx.wait();
    } catch (error) {
      console.error("Error assigning case:", error);
    }
  };

  const addEvidenceToCase = async (caseNumber: number, typeOfEvidence: string, evidenceData: string ) => {
    if (!contract) {return} ;
    try {
        const tx = await contract.addEvidenceToCase(caseNumber, typeOfEvidence, evidenceData);
        await tx.wait();
      } catch (error) {
        console.error("Error updating Case:", error);
      }

  }

  const getCaseEvidences = async (caseNumber: number) => {
    if (!contract) { return {} as Evidence};
    return await contract.getCaseEvidences(caseNumber);
  };


  useEffect(() => {
    const initContract = async () => {
      if (!window.ethereum) {return alert("Please install MetaMask!")};
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contractInstance);
    };
    initContract();
  }, []);

  return (
    <EMSContext.Provider
      value={{
        account,
        userAuth,
        contract,
        connectWallet,
        registerUser,
        activateUser,
        deactivateUser,
        assignCaseToUser,
        // checkUserRole,
        getUserCases,
        getUserDetails,
        getCaseDetails,
        updateCase,
        openCase,
        closeCase,
        addEvidenceToCase,
        getCaseEvidences

      }}
    >
      {children}
    </EMSContext.Provider>
  );
};

// Hook to use the context
export const useEMSContext = () => {
  const context = useContext(EMSContext);
  if (!context) {
    throw new Error("useEMSContext must be used within an EMSProvider");
  }
  return context;
};
