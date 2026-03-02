import Typesense from "typesense";

export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: "f8g1svtrc4xbjdnwp-1.a1.typesense.net",
      port: 443,
      protocol: "https",
    },
  ],
  apiKey: "Xg7wAqjDID1kNSMTKflrnm6JFm070Evb", // Search-only API key
  connectionTimeoutSeconds: 2,
});