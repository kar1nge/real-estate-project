import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/inquiries/create/";

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