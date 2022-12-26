// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers } = require('hardhat');
const { WHITELIST_CONTRACT_ADDRESS } = require('../constants');

const convertMetadataToUrl = async (metadata) => {
  const metadataString = JSON.stringify(metadata);
  const metadataBuffer = Buffer.from(metadataString);
  const metadataBase64 = metadataBuffer.toString('base64');
  const metadataUrl = `data:application/json;base64,${metadataBase64}`;
  return metadataUrl;
};

async function main() {
  const whitelistContract = WHITELIST_CONTRACT_ADDRESS;

  const cryptoDevsContract = await ethers.getContractFactory('CryptoDevs');

  const metadata = {
    name: 'CryptoDevs',
    description:
      'CryptoDevs is a collection of 10,000 unique generative NFTs on the Ethereum blockchain.',
    image:
      'https://cf-images.us-east-1.prod.boltdns.net/v1/static/5359769168001/b74b48f9-6c13-452e-8776-ea1ab9074953/74b9774e-a415-4499-8f1a-26e5e0940ecd/1280x720/match/image.jpg',
    // external_url: 'https://cryptodevs.xyz',
    attributes: [
      {
        trait_type: 'Background',
        value: 'Blue',
      },
    ],
  };

  const metadataURL = await convertMetadataToUrl(metadata);

  try {
    const deployedContract = await cryptoDevsContract.deploy(
      metadataURL,
      whitelistContract
    );

    await deployedContract.deployed();

    console.log('CryptoDevs deployed to:', deployedContract.address);
  } catch (error) {
    console.error(error);
  }

  // CryptoDevs deployed to: 0xD331564DafcED3A4383bcD1b148E12A7EAC47b01
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
