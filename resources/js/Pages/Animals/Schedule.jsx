import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function Schedule({ schedule, animalId }) {
    const [events, setEvents] = useState(
        schedule.map((item) => ({
            id: item.id,
            title: item.user_id ? "Rezervováno" : "Dostupné",
            start: item.start,
            end: item.end,
            backgroundColor: item.user_id ? "#b30000" : "#00b300", // Red for booked, green for available
            extendedProps: { available: item.available, user_id: item.user_id },
        }))
    );

    const handleEventClick = async (info) => {
        const event = info.event;

        if (event.extendedProps.user_id) {
            // Cancel Booking
            if (confirm("Chcete tuto rezervaci zrušit?")) {
                try {
                    const response = await axios.post(
                        `/animals/${animalId}/cancelTermin`,
                        { booking_id: event.id }
                    );

                    if (response.data.success) {
                        setEvents((prev) => prev.filter((e) => e.id !== event.id));
                        alert(response.data.message);
                    }
                } catch (error) {
                    alert(
                        error.response?.data?.message || "Chyba při rušení rezervace."
                    );
                }
            }
        } else {
            // Book Available Slot
            if (confirm("Chcete tento čas rezervovat?")) {
                try {
                    const response = await axios.post(`/animals/${animalId}/bookTermin`, {
                        start: event.start.toISOString(),
                        end: event.end.toISOString(),
                    });

                    if (response.data.success) {
                        setEvents((prev) =>
                            prev.map((e) =>
                                e.id === event.id
                                    ? {
                                          ...e,
                                          title: "Rezervováno",
                                          backgroundColor: "#b30000",
                                          extendedProps: { ...e.extendedProps, user_id: true },
                                      }
                                    : e
                            )
                        );
                        alert(response.data.message);
                    }
                } catch (error) {
                    alert(
                        error.response?.data?.message || "Chyba při rezervaci času."
                    );
                }
            }
        }
    };

    return (
        <>
            <Head title="Schedule" />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="flex justify-between items-center p-6">
                    <Link href={route('animals.list')} className="text-gray-700 px-4 py-2">
                        Zpět na seznam zvířat
                    </Link>
                </header>

                <main className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Harmonogram</h1>

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        events={events}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                    />
                </main>
            </div>
        </>
    );
}
