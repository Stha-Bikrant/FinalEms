const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const emsContract = await ethers.deployContract("EMS");
  const contract_address = await emsContract.getAddress();
  console.log("Contract address:", contract_address);
  saveFrontendFiles(contract_address);
}

function saveFrontendFiles(contract_address) {
  const fs = require("fs");
  const contractsDir = path.join(__dirname, "..", "frontend", "contracts");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ EMS: contract_address }, undefined, 2)
  );

  const EMSArtifact = artifacts.readArtifactSync("EMS");

  fs.writeFileSync(
    path.join(contractsDir, "EMS.json"),
    JSON.stringify(EMSArtifact, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
