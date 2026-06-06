const WALRUS_PUBLISHER = "https://publisher.walrus.space";
const WALRUS_AGGREGATOR = "https://aggregator.walrus.space";

// Upload a file to Walrus, returns blob ID
export const uploadToWalrus = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const response = await fetch(`${WALRUS_PUBLISHER}/v1/blobs`, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: arrayBuffer,
  });

  if (!response.ok) throw new Error("Walrus upload failed");

  const data = await response.json();

  // Walrus returns either newlyCreated or alreadyCertified
  const blobId =
    data?.newlyCreated?.blobObject?.blobId ||
    data?.alreadyCertified?.blobId;

  if (!blobId) throw new Error("No blob ID returned");

  return blobId;
};

// Retrieve a file from Walrus by blob ID
export const getFromWalrus = async (blobId) => {
  const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`);
  if (!response.ok) throw new Error("Walrus fetch failed");
  return response;
};

// Build a public Walrus URL for a blob
export const walrusUrl = (blobId) =>
  `${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`;

// Upload a JSON object to Walrus as a manifest
export const uploadManifest = async (data) => {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: "application/json" });
  const arrayBuffer = await blob.arrayBuffer();

  const response = await fetch(`${WALRUS_PUBLISHER}/v1/blobs`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: arrayBuffer,
  });

  if (!response.ok) throw new Error("Manifest upload failed");

  const result = await response.json();
  const blobId =
    result?.newlyCreated?.blobObject?.blobId ||
    result?.alreadyCertified?.blobId;

  if (!blobId) throw new Error("No blob ID returned for manifest");
  return blobId;
};

// Fetch a JSON manifest from Walrus by blob ID
export const fetchManifest = async (blobId) => {
  const response = await fetch(`${WALRUS_AGGREGATOR}/v1/blobs/${blobId}`);
  if (!response.ok) throw new Error("Manifest fetch failed");
  return await response.json();
};