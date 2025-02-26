// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EMS is Ownable {
    address Admin = msg.sender;

    constructor() Ownable(Admin) {}

    //Structures
    //Users
    struct User {
        address userAddress;
        UserRole userRole;
        UserStatus userStatus;
        bool isRegistered;
        uint[] assignedCaseNumbers;
        uint totalAssignedCases;
        uint timestamp;
    }

    // Enum for User Role & Status
    enum UserRole {
        Auditor,
        Guest
    }
    enum UserStatus {
        Inactive,
        Active
    }

    //State Variables
    //For User
    uint public totalAuditors = 0;
    uint public totalGuests = 0;
    uint public totalRegisteredUsers = 0;

    //mapping
    mapping(address => User) public users;

    //event
    event UserRegistered(address indexed auditor);
    event CaseAssigned(address indexed auditor, uint indexed _caseNumber);

    //modifier
    //User Modifier
    //Modifier to check if the input address is valid
    modifier isValidAddress(address _userAddress) {
        require(_userAddress != address(0), "User Address cant be empty");
        _;
    }

    //Modifier to check if user is registered
    modifier isRegisteredUser(address _userAddress) {
        require(
            users[_userAddress].isRegistered == true,
            "User is Not Registered"
        );
        _;
    }

    //Modifier to check UserStatus
    modifier isActiveUser(address _userAddress) {
        require(
            users[_userAddress].userStatus == UserStatus.Active,
            "User is Not Active"
        );
        _;
    }

    // Modifier To Check If The Caller Is Auditor/
    modifier isAuditor(address _userAddress) {
        require(
            users[_userAddress].userRole == UserRole.Auditor,
            "User is not an auditor"
        );
        _;
    }

    // Modifier to check if the caller is the assigned auditor for a case
    modifier onlyAssignedUser(address _userAddress, uint _caseNumber) {
        bool isAssigned = false;
        for (
            uint i = 0;
            i < users[_userAddress].assignedCaseNumbers.length;
            i++
        ) {
            if (users[_userAddress].assignedCaseNumbers[i] == _caseNumber) {
                isAssigned = true;
                break;
            }
        }
        require(isAssigned, "Auditor is not assigned to this case");
        _;
    }

    // Modifier to check if the user is an Auditor and assigned to a case
    modifier isAssignedAuditor(address _userAddress, uint _caseNumber) {
        require(
            users[_userAddress].userRole == UserRole.Auditor,
            "User is not an auditor"
        );

        bool isAssigned = false;
        for (
            uint i = 0;
            i < users[_userAddress].assignedCaseNumbers.length;
            i++
        ) {
            if (users[_userAddress].assignedCaseNumbers[i] == _caseNumber) {
                isAssigned = true;
                break;
            }
        }

        require(isAssigned, "User is not assigned to this case");
        _;
    }

    //Admin Functions
    //User Management

    //function to register user
    function registerUser(
        address _userAddress,
        UserRole _userRole
    ) external onlyOwner isValidAddress(_userAddress) {
        // Check if auditor is already registered (to avoid increasing totalAuditors)
        require(
            users[_userAddress].isRegistered == false,
            "User is  Already Registered"
        );
        users[_userAddress] = User({
            userAddress: _userAddress,
            userRole: _userRole,
            userStatus: UserStatus.Inactive,
            isRegistered: true,
            assignedCaseNumbers: new uint[](0),
            totalAssignedCases: 0,
            timestamp: block.timestamp
        });

        // Increment the appropriate counter
        if (_userRole == UserRole.Auditor) {
            totalAuditors++;
        } else if (_userRole == UserRole.Guest) {
            totalGuests++;
        }
        totalRegisteredUsers++;

        emit UserRegistered(_userAddress);
    }

    //Function to Activate User
    function activateUser(
        address _userAddress
    )
        external
        onlyOwner
        isValidAddress(_userAddress)
        isRegisteredUser(_userAddress)
    {
        users[_userAddress].userStatus = UserStatus.Active;
    }

    //Function to Deactivate User
    function deactivateUser(
        address _userAddress
    )
        external
        onlyOwner
        isValidAddress(_userAddress)
        isRegisteredUser(_userAddress)
    {
        users[_userAddress].userStatus = UserStatus.Inactive;
    }

    // Function to check if User role is an auditor or guest
    function checkUserRole(
        address _userAddress
    )
        external
        view
        onlyOwner
        isValidAddress(_userAddress)
        isRegisteredUser(_userAddress)
        returns (UserRole)
    {
        return users[_userAddress].userRole;
    }

    // Function to assign cases to users according to role (Only Admin)
    function assignCaseToUser(
        address _userAddress,
        uint _caseNumber
    )
        external
        onlyOwner
        isRegisteredUser(_userAddress)
        isActiveUser(_userAddress)
    {
        users[_userAddress].assignedCaseNumbers.push(_caseNumber);
        users[_userAddress].totalAssignedCases++;

        emit CaseAssigned(_userAddress, _caseNumber);
    }

    //Function to get User Cases
    function getUserCases(
        address _userAddress
    ) external view returns (uint[] memory) {
        User storage user = users[_userAddress];
        // Return the assigned case numbers for this auditor, or an empty array if none exist.
        return user.assignedCaseNumbers;
    }

    //User Functions
    //Structure
    //Case
    struct Case {
        uint caseNumber;
        string caseDescription;
        uint256 totalCaseEvidences;
        uint timestamp;
        CaseStatus caseStatus;
        Evidence[] evidences;
    }
    //Enum for case Status
    enum CaseStatus {
        Initialised,
        Open,
        Closed
    }

    //State Variables for Case
    //For Cases
    uint totalSystemCases = 0;

    //Structure
    //Evidence
    struct Evidence {
        string typeOfEvidence; // (e.g., "document", "photo", etc.)
        string evidenceData;
    }

    //State variable for Evidences
    uint totalSystemEvidences = 0;

    //mapping for evidence
    mapping(uint256 => Case) public cases;
    mapping(uint256 => Evidence) public evidences;

    //Function to update cases
    function updateCase(
        uint _caseNumber,
        string memory _caseDescription
    ) external isAssignedAuditor(msg.sender, _caseNumber) {
        require(cases[_caseNumber].caseNumber == 0, "Case already exists");

        //Get storage reference for the case
        Case storage newCase = cases[_caseNumber];

        //Assign values individually
        newCase.caseNumber = _caseNumber;
        newCase.caseDescription = _caseDescription;
        newCase.caseStatus = CaseStatus.Initialised;
        newCase.timestamp = block.timestamp;
        newCase.totalCaseEvidences = 0; // Start with zero evidence
        totalSystemCases++; // Increment case count
    }

    //function to open case
    function openCase(
        uint _caseNumber
    ) external isAssignedAuditor(msg.sender, _caseNumber) {
        cases[_caseNumber].caseStatus = CaseStatus.Open;
    }

    //function to close case
    function closeCase(
        uint _caseNumber
    ) external isAssignedAuditor(msg.sender, _caseNumber) {
        cases[_caseNumber].caseStatus = CaseStatus.Closed;
    }

    //function to get Case Details
    function getCaseDetails(
        uint _caseNumber
    )
        external
        view
        isAssignedAuditor(msg.sender, _caseNumber)
        onlyAssignedUser(msg.sender, _caseNumber)
        returns (uint, string memory, uint, uint, CaseStatus)
    {
        require(cases[_caseNumber].caseNumber != 0, "Case does not exist");

        Case storage caseData = cases[_caseNumber];

        return (
            caseData.caseNumber,
            caseData.caseDescription,
            caseData.totalCaseEvidences,
            caseData.timestamp,
            caseData.caseStatus
        );
    }

    //Evidences
    //Function to Add Evidences to Case
    function addEvidenceToCase(
        uint _caseNumber,
        string memory _typeOfEvidence,
        string memory _evidenceData
    ) external isAssignedAuditor(msg.sender, _caseNumber) {
        require(cases[_caseNumber].caseNumber != 0, "Case does not exist");
        require(
            cases[_caseNumber].caseStatus == CaseStatus.Open,
            "Case is not open for evidence submission"
        );

        //Get storage reference for the case
        Case storage caseData = cases[_caseNumber];

        //Push new evidence to the case's evidence array
        caseData.evidences.push(
            Evidence({
                typeOfEvidence: _typeOfEvidence,
                evidenceData: _evidenceData
            })
        );

        //Increment total evidences count
        caseData.totalCaseEvidences++;
        totalSystemEvidences++;
    }

    //function to Get Case Evidences
    function getCaseEvidences(
        uint _caseNumber
    )
        external
        view
        isAssignedAuditor(msg.sender, _caseNumber)
        onlyAssignedUser(msg.sender, _caseNumber)
        returns (string[] memory, string[] memory)
    {
        require(cases[_caseNumber].caseNumber != 0, "Case does not exist");

        Case storage caseData = cases[_caseNumber];

        uint evidenceCount = caseData.evidences.length;

        string[] memory evidenceTypes = new string[](evidenceCount);
        string[] memory evidenceData = new string[](evidenceCount);

        for (uint i = 0; i < evidenceCount; i++) {
            evidenceTypes[i] = caseData.evidences[i].typeOfEvidence;
            evidenceData[i] = caseData.evidences[i].evidenceData;
        }

        return (evidenceTypes, evidenceData);
    }
}
