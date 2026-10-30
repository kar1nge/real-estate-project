import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const API_URL = `${API_BASE_URL}inquiries/create/`;

export interface CreateInquiryData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    property?: number | null;
}

export async function createInquiry(
    data: CreateInquiryData
): Promise<void> {
    await axios.post(API_URL, data);
}
