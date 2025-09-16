import axios from "axios";
import { ICompanyBatchResponse, ICollection } from "../types";

const BASE_URL = import.meta.env.DEV ? "http://localhost:8000" : import.meta.env.VITE_API_BASE_URL;

export async function getCompanies(
  offset?: number,
  limit?: number,
): Promise<ICompanyBatchResponse> {
  debugger;
  try {
    const response = await axios.get(`${BASE_URL}/companies`, {
      params: {
        offset,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

export async function getCollectionsById(
  id: string,
  offset?: number,
  limit?: number,
): Promise<ICollection> {
  debugger;
  try {
    const response = await axios.get(`${BASE_URL}/collections/${id}`, {
      params: {
        offset,
        limit,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}

export async function getCollectionsMetadata(): Promise<ICollection[]> {
  try {
    const response = await axios.get(`${BASE_URL}/collections`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
}
