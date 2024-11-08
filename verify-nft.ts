import {
    findMetadataPda,

  verifyCollectionV1,
    mplTokenMetadata,
  } from "@metaplex-foundation/mpl-token-metadata";
  
  import {
    airdropIfRequired,
    getExplorerLink,
    getKeypairFromFile,
  } from "@solana-developers/helpers";
  
  import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
  
  import { Connection, LAMPORTS_PER_SOL, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
  import {
    generateSigner,
    keypairIdentity,
    percentAmount,
    publicKey
  } from "@metaplex-foundation/umi";

const connection = new Connection(clusterApiUrl('devnet'));

// Define the secret key as a Uint8Array with parentheses
const userSecretKey = Uint8Array.from([
  215, 123, 244, 185, 134, 135, 79, 35, 221, 122, 157, 121, 205, 194, 84, 214,
  113, 68, 24, 255, 55, 86, 232, 74, 235, 8, 10, 49, 250, 191, 191, 235,
  1, 104, 125, 238, 171, 101, 184, 214, 106, 232, 231, 82, 43, 118, 255, 109,
  203, 69, 22, 43, 40, 237, 139, 19, 229, 124, 19, 149, 37, 246, 12, 40
]);

// Use the secret key to create the Keypair
const userKeypair = Keypair.fromSecretKey(userSecretKey);
console.log(userKeypair.publicKey.toString());

await airdropIfRequired(
    connection,
    userKeypair.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
);

console.log(connection.getBalance(userKeypair.publicKey))

const umi = createUmi(connection.rpcEndpoint);
umi.use(mplTokenMetadata());
const umiUser = umi.eddsa.createKeypairFromSecretKey(userKeypair.secretKey);
umi.use(keypairIdentity(umiUser)); // setup umi instance for user

const collectionAddress = publicKey("GCffZ9Cz6TyhWzbw77MB2jJhjVuGZVahmgK9nZ9oWyZB");
const nftAddress = publicKey("HoFU8mU3rNWTyrRwFY3obTjkA4EPyHP98NFBrvVweYq3");

const transaction = await verifyCollectionV1(umi,{
    metadata: findMetadataPda(umi, {mint: nftAddress}),
    collectionMint: collectionAddress,
    authority: umi.identity
})

transaction.sendAndConfirm(umi)

console.log(
    `✅ NFT ${nftAddress} verified as member of collection ${collectionAddress}! See Explorer at ${getExplorerLink(
      "address",
      nftAddress,
      "devnet"
    )}`
  );