import { useEffect, useState, type FormEvent } from "react";
import {
  listVisitBookings, listVisitProperties, listVisitSchedules,
  saveVisitBooking, saveVisitSchedule,
  type VisitBooking, type VisitProperty, type VisitSchedule,
} from "../services/siteVisitManagementService";

const emptySchedule = { real_estate_property: "", date: "", start_time: "10:00", end_time: "11:00", max_bookings: 10, active: true, notes: "" };
const emptyBooking = { schedule: "", visitor_name: "", visitor_email: "", visitor_phone: "", number_of_visitors: 1, message: "", status: "pending", attendance_status: "booked" };
const inputClass = "mt-1 w-full rounded-md border border-[#D8D3CA] bg-white px-3 py-2 text-sm";

export default function SiteVisitManagement() {
  const [schedules, setSchedules] = useState<VisitSchedule[]>([]);
  const [bookings, setBookings] = useState<VisitBooking[]>([]);
  const [properties, setProperties] = useState<VisitProperty[]>([]);
  const [scheduleForm, setScheduleForm] = useState(emptySchedule);
  const [bookingForm, setBookingForm] = useState(emptyBooking);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setError("");
    try {
      const [nextSchedules, nextBookings, nextProperties] = await Promise.all([listVisitSchedules(), listVisitBookings(), listVisitProperties()]);
      setSchedules(nextSchedules);
      setBookings(nextBookings);
      setProperties(nextProperties);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load site visits."); }
  }
  useEffect(() => { void load(); }, []);

  async function createSchedule(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      await saveVisitSchedule({ ...scheduleForm, real_estate_property: Number(scheduleForm.real_estate_property), max_bookings: Number(scheduleForm.max_bookings) });
      setScheduleForm(emptySchedule); setMessage("Viewing schedule created."); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create the schedule."); }
    finally { setSaving(false); }
  }

  async function createBooking(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError(""); setMessage("");
    try {
      await saveVisitBooking({ ...bookingForm, schedule: Number(bookingForm.schedule), number_of_visitors: Number(bookingForm.number_of_visitors) });
      setBookingForm(emptyBooking); setMessage("Site visit booking added."); await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add the booking."); }
    finally { setSaving(false); }
  }

  async function updateBooking(booking: VisitBooking, status: VisitBooking["status"]) {
    setError(""); setMessage("");
    try {
      await saveVisitBooking({ status }, booking.id);
      setMessage(status === "confirmed" ? "Booking confirmed. A confirmation email will be sent when SMTP is configured." : "Booking updated.");
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update booking."); }
  }

  async function toggleSchedule(schedule: VisitSchedule) {
    setError(""); setMessage("");
    try {
      await saveVisitSchedule({ active: !schedule.active }, schedule.id);
      setMessage(schedule.active ? "Viewing time hidden from the website." : "Viewing time is now available on the website.");
      await load();
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update viewing time."); }
  }

  return <main className="min-h-screen px-4 py-10 text-[#232323] sm:px-6"><div className="mx-auto max-w-6xl">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C5A572]">Appointments</p>
    <h1 className="mt-2 font-serif text-4xl">Site Visits</h1>
    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#555]">Publish available viewing times, add bookings made by phone, and confirm requests submitted through the website.</p>
    {error && <p role="alert" className="mt-5 rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}{message && <p role="status" className="mt-5 rounded-md bg-green-50 p-3 text-sm text-green-800">{message}</p>}
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <form onSubmit={createSchedule} className="space-y-4 rounded-xl border border-[#E8E5DF] bg-white p-5">
        <h2 className="font-serif text-2xl">Create a viewing time</h2>
        <label className="block text-sm">Property<select className={inputClass} required value={scheduleForm.real_estate_property} onChange={e => setScheduleForm({...scheduleForm,real_estate_property:e.target.value})}><option value="">Choose a property</option>{properties.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3"><label className="text-sm">Date<input className={inputClass} type="date" required value={scheduleForm.date} onChange={e => setScheduleForm({...scheduleForm,date:e.target.value})}/></label><label className="text-sm">Starts<input className={inputClass} type="time" required value={scheduleForm.start_time} onChange={e => setScheduleForm({...scheduleForm,start_time:e.target.value})}/></label><label className="text-sm">Ends<input className={inputClass} type="time" required value={scheduleForm.end_time} onChange={e => setScheduleForm({...scheduleForm,end_time:e.target.value})}/></label></div>
        <label className="block text-sm">Available bookings<input className={inputClass} type="number" min="1" required value={scheduleForm.max_bookings} onChange={e => setScheduleForm({...scheduleForm,max_bookings:Number(e.target.value)})}/></label>
        <label className="block text-sm">Notes<textarea className={inputClass} rows={2} value={scheduleForm.notes} onChange={e => setScheduleForm({...scheduleForm,notes:e.target.value})}/></label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={scheduleForm.active} onChange={e => setScheduleForm({...scheduleForm,active:e.target.checked})}/>Make available on the website</label>
        <button disabled={saving || !properties.length} className="rounded-md bg-[#232323] px-5 py-2.5 text-sm text-white disabled:opacity-50">Create schedule</button>
      </form>
      <form onSubmit={createBooking} className="space-y-4 rounded-xl border border-[#E8E5DF] bg-white p-5">
        <h2 className="font-serif text-2xl">Add a booking</h2>
        <label className="block text-sm">Viewing time<select className={inputClass} required value={bookingForm.schedule} onChange={e => setBookingForm({...bookingForm,schedule:e.target.value})}><option value="">Choose a schedule</option>{schedules.map(s=><option key={s.id} value={s.id}>{s.property_title} · {s.date} · {s.start_time}</option>)}</select></label>
        <label className="block text-sm">Visitor name<input className={inputClass} required value={bookingForm.visitor_name} onChange={e => setBookingForm({...bookingForm,visitor_name:e.target.value})}/></label>
        <div className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Email<input className={inputClass} type="email" required value={bookingForm.visitor_email} onChange={e => setBookingForm({...bookingForm,visitor_email:e.target.value})}/></label><label className="text-sm">Phone<input className={inputClass} required value={bookingForm.visitor_phone} onChange={e => setBookingForm({...bookingForm,visitor_phone:e.target.value})}/></label></div>
        <label className="block text-sm">Number of visitors<input className={inputClass} type="number" min="1" max="3" value={bookingForm.number_of_visitors} onChange={e => setBookingForm({...bookingForm,number_of_visitors:Number(e.target.value)})}/></label>
        <button disabled={saving || !schedules.length} className="rounded-md border border-[#232323] px-5 py-2.5 text-sm disabled:opacity-50">Add booking</button>
      </form>
    </div>
    <section className="mt-10"><h2 className="font-serif text-3xl">Bookings</h2><div className="mt-4 space-y-3">{bookings.map(b=><article key={b.id} className="flex flex-col gap-4 rounded-xl border border-[#E8E5DF] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="font-medium">{b.visitor_name} · {b.property_title}</h3><p className="mt-1 text-sm text-[#555]">{b.visit_date} {b.start_time}–{b.end_time} · {b.visitor_email} · {b.visitor_phone}</p><p className="mt-1 text-xs uppercase tracking-wide text-[#777]">{b.status}{b.confirmation_sent ? " · email sent" : " · email pending"}</p></div><div className="flex flex-wrap gap-2">{(b.status === "pending" || (b.status === "confirmed" && !b.confirmation_sent)) && <button onClick={()=>void updateBooking(b,"confirmed")} className="rounded-md bg-[#232323] px-4 py-2 text-sm text-white">{b.status === "pending" ? "Confirm" : "Send confirmation"}</button>}{b.status !== "cancelled" && <button onClick={()=>void updateBooking(b,"cancelled")} className="rounded-md border border-[#D8D3CA] px-4 py-2 text-sm">Cancel</button>}</div></article>)}{!bookings.length && <p className="rounded-xl border border-dashed border-[#D8D3CA] p-6 text-sm text-[#666]">No site visit bookings yet.</p>}</div></section>
    <section className="mt-10"><h2 className="font-serif text-3xl">Viewing schedules</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{schedules.map(s=><article key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-[#E8E5DF] bg-white p-4"><div><h3 className="font-medium">{s.property_title}</h3><p className="mt-1 text-sm text-[#555]">{s.date} · {s.start_time}–{s.end_time}</p><p className="mt-1 text-sm text-[#777]">{s.remaining_slots} places remaining · {s.active ? "Visible" : "Hidden"}</p></div><button type="button" onClick={()=>void toggleSchedule(s)} className="shrink-0 rounded-md border border-[#D8D3CA] px-3 py-2 text-xs">{s.active ? "Hide" : "Show"}</button></article>)}</div></section>
  </div></main>;
}
