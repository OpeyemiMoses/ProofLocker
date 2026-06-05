const API =
  process.env.REACT_APP_API_URL ||
  "https://prooflocker-1.onrender.com";

/**
 * Core RPC wrapper
 */
export const suiRPC = async (method, params = []) => {
  const response = await fetch(`${API}/api/sui-rpc`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ method, params }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "RPC call failed");
  }

  return data.result;
};

/**
 * NETWORK STATS
 */
export const getNetworkStats = async () => {
  return await suiRPC("suix_getLatestSuiSystemState", []);
};

/**
 * CHECKPOINT
 */
export const getLatestCheckpoint = async () => {
  return await suiRPC("sui_getLatestCheckpointSequenceNumber", []);
};

/**
 * WALLET OBJECTS
 */
export const getWalletObjects = async (address) => {
  return await suiRPC("suix_getOwnedObjects", [
    address,
    { options: { showContent: true, showDisplay: true } },
  ]);
};

/**
 * CASE OBJECTS (on-chain)
 */
export const getWalletCases = async (address) => {
  return await suiRPC("suix_getOwnedObjects", [
    address,
    {
      filter: {
        StructType:
          "0xd94de82bc25cd0cd9f9bb2d4912c1f6aa979b97f407751cc2856d534c4e45efe::cases::Case",
      },
      options: {
        showContent: true,
        showDisplay: true,
      },
    },
  ]);
};

/**
 * TRANSACTIONS
 */
export const getWalletTransactions = async (address) => {
  return await suiRPC("suix_queryTransactionBlocks", [
    {
      filter: { FromAddress: address },
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
      },
    },
    null,
    5,
    true,
  ]);
};

/**
 * SINGLE TX
 */
export const getTransaction = async (digest) => {
  return await suiRPC("sui_getTransactionBlock", [
    digest,
    {
      showInput: true,
      showEffects: true,
      showEvents: true,
      showTimestamp: true,
    },
  ]);
};

/**
 * VERIFY TX
 */
export const verifyTransaction = async (digest) => {
  try {
    const tx = await getTransaction(digest);
    return !!tx;
  } catch (err) {
    return false;
  }
};