import hre from "hardhat";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const ethers = hre.ethers;

async function main() {
  console.log("🚀 Deploying SubscriptionManager to Arbitrum Sepolia...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH\n");

  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️  Low balance! Get testnet ETH from https://faucet.quicknode.com/arbitrum/sepolia\n");
  }

  const SubscriptionManager = await ethers.getContractFactory("SubscriptionManager");
  console.log("⏳ Deploying contract...");
  
  const subscriptionManager = await SubscriptionManager.deploy();
  await subscriptionManager.waitForDeployment();

  const address = await subscriptionManager.getAddress();
  const deploymentTx = subscriptionManager.deploymentTransaction();
  
  console.log("✅ Deployed!\n");
  console.log("📋 Contract Details:");
  console.log("━".repeat(50));
  console.log("Address:     ", address);
  console.log("Network:     ", "Arbitrum Sepolia");
  console.log("Chain ID:    ", "421614");
  console.log("Deployer:    ", deployer.address);
  console.log("Treasury:    ", deployer.address);
  console.log("Platform Fee:", "2.5%");
  console.log("Tx Hash:     ", deploymentTx?.hash);
  console.log("━".repeat(50));

  // Create deployments directory if it doesn't exist
  const deploymentsDir = join(process.cwd(), "deployments");
  mkdirSync(deploymentsDir, { recursive: true });

  // Save deployment info
  const deploymentInfo = {
    network: "arbitrumSepolia",
    chainId: 421614,
    contractAddress: address,
    deployer: deployer.address,
    treasury: deployer.address,
    platformFee: "250", // basis points
    txHash: deploymentTx?.hash,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    explorerUrl: `https://sepolia.arbiscan.io/address/${address}`,
    verifyCommand: `npx hardhat verify --network arbitrumSepolia ${address}`,
  };

  const outputPath = join(deploymentsDir, `arbitrumSepolia-${Date.now()}.json`);
  writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n💾 Deployment info saved to:", outputPath);
  console.log("\n🔍 View on Explorer:");
  console.log(`   ${deploymentInfo.explorerUrl}`);
  console.log("\n📝 Verify Contract:");
  console.log(`   npx hardhat verify --network arbitrumSepolia ${address}`);
  console.log("\n🎉 Deployment Complete!");
  
  // Create frontend directory if it doesn't exist and update .env.local
  const frontendDir = join(process.cwd(), "..", "frontend");
  const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${address}
NEXT_PUBLIC_CHAIN_ID=421614
NEXT_PUBLIC_NETWORK=arbitrumSepolia
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.arbiscan.io
`;
  
  try {
    mkdirSync(frontendDir, { recursive: true });
    writeFileSync(join(frontendDir, ".env.local"), envContent);
    console.log("\n✅ Frontend .env.local updated!");
  } catch (error) {
    console.log("\n⚠️  Could not update frontend .env.local (frontend folder may not exist)");
    console.log("📝 Manual setup - add to your frontend .env.local:");
    console.log(envContent);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });