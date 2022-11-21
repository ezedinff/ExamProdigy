import { GraphQLClient } from "graphql-request";

const HYGRAPH_URL = process.env.NEXT_PUBLIC_HYGRAPH_URL || "";
const HYGRAPH_API_KEY = process.env.NEXT_PUBLIC_HYGRAPH_API_KEY || "";

export default new GraphQLClient(HYGRAPH_URL, { headers: { "Authorization": `Bearer ${HYGRAPH_API_KEY}` } });