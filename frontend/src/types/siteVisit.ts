export interface SiteVisitSchedule {
    id: number;
    property_title: string;
    date: string;
    start_time: string;
    end_time: string;
    max_bookings: number;
    remaining_slots: number;
    active: boolean;
    notes: string;
}

export interface CreateSiteVisitBookingData {
    schedule: number;
    visitor_name: string;
    visitor_email: string;
    visitor_phone: string;
    number_of_visitors: number;
    message: string;
}