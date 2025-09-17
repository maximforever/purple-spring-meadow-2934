import axios from "axios";
import { ICompanyBatchResponse, ICollection } from "../types";

const BASE_URL = import.meta.env.DEV ? "http://localhost:8000" : import.meta.env.VITE_API_BASE_URL;

export async function getCompanies(
  offset?: number,
  limit?: number,
): Promise<ICompanyBatchResponse> {
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
    console.error("Error fetching collections metadata:", error);
    throw error;
  }
}

export async function addCompaniesToCollection({
  collectionId,
  companyIds,
}: {
  collectionId: string;
  companyIds: number[];
}): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await axios.post(`${BASE_URL}/collections/${collectionId}/add-companies`, {
      company_ids: companyIds,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding companies to collection:", error);
    throw error;
  }
}

export async function addAllCompaniesToCollection({
  fromCollectionId,
  toCollectionId,
}: {
  fromCollectionId: string;
  toCollectionId: string;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const url = `${BASE_URL}/collections/${fromCollectionId}/add-all-companies/${toCollectionId}/`;
    const response = await axios.post(url, {});

    return response.data;
  } catch (error) {
    console.error("Error adding companies to collection:", error);
    throw error;
  }
}
