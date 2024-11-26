import { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function Bookings({ bookings: initialBookings, animalId }) {
    const [events, setEvents] = useState(
        initialBookings.map((booking) => ({
            id: booking.id,
            title:
                booking.status === "accepted"
                    ? `Přijmuto (${booking.user?.name || "Neznámý uživatel"})`
                    : booking.status === "rejected"
                    ? `Odmítnuto (${booking.user?.name || "Neznámý uživatel"})`
                    : booking.status === "pending"
                    ? `Vyřizuje se (${booking.user?.name || "Neznámý uživatel"})`
                    : "Dostupné",
            start: booking.start,
            end: booking.end,
            backgroundColor:
                booking.status === "accepted"
                    ? "#00b300" // Green for accepted
                    : booking.status === "rejected"
                    ? "#b30000" // Red for rejected
                    : booking.status === "pending"
                    ? "#f1c40f" // Yellow for pending
                    : "#00b300", // Green for available
            extendedProps: { status: booking.status, user: booking.user },
        }))
    );

    useEffect(() => {
        const preventContextMenu = (e) => e.preventDefault();
        document.addEventListener("contextmenu", preventContextMenu);
        return () =>
            document.removeEventListener("contextmenu", preventContextMenu);
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`/animals/${animalId}/booking`);
            if (response.data.success) {
                setEvents(
                    response.data.bookings.map((booking) => ({
                        id: booking.id,
                        title:
                            booking.status === "accepted"
                                ? `Rezervováno (${booking.user?.name || "Neznámý uživatel"})`
                                : booking.status === "rejected"
                                ? `Odmítnuto (${booking.user?.name || "Neznámý uživatel"})`
                                : booking.status === "pending"
                                ? `Vyřizuje se (${booking.user?.name || "Neznámý uživatel"})`
                                : "Dostupné",
                        start: booking.start,
                        end: booking.end,
                        backgroundColor:
                            booking.status === "accepted"
                                ? "#00b300" // Green for accepted
                                : booking.status === "rejected"
                                ? "#b30000" // Red for rejected
                                : booking.status === "pending"
                                ? "#f1c40f" // Yellow for pending
                                : "#00b300", // Green for available
                        extendedProps: { status: booking.status, user: booking.user },
                    }))
                );
            }
        } catch (error) {
            alert("Chyba při načítání událostí.");
        }
    };

    const handleLeftClick = async (info) => {
        const bookingId = info.event.id;

        if (info.event.extendedProps.status === "pending") {
            if (confirm("Chcete schválit tuto rezervaci?")) {
                try {
                    const response = await axios.post(`/booking/${bookingId}/approve`);
                    if (response.data.success) {
                        await fetchEvents();
                    }
                } catch (error) {
                    alert("Chyba při schvalování rezervace.");
                }
            }
        }
    };

    const handleRightClick = async (info) => {
        const bookingId = info.event.id;

        if (info.event.extendedProps.status === "pending") {
            if (confirm("Chcete odmítnout tuto rezervaci?")) {
                try {
                    const response = await axios.post(`/booking/${bookingId}/decline`);
                    if (response.data.success) {
                        await fetchEvents();
                    }
                } catch (error) {
                    alert("Chyba při odmítnutí rezervace.");
                }
            }
        }
    };

    return (
        <>
            <Head title="Rezervace" />
            <div className="min-h-screen bg-gray-100">
                <header className="flex justify-between items-center p-6">
                    <Link href="/booking" className="text-gray-700 px-4 py-2">
                        Zpět na seznam rezervací
                    </Link>
                </header>

                <main className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Rezervace pro zvíře</h1>

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        events={events}
                        eventClick={(info) => {
                            if (info.jsEvent.button === 0) {
                                handleLeftClick(info);
                            }
                        }}
                        eventDidMount={(info) => {
                            info.el.addEventListener("contextmenu", (e) => {
                                e.preventDefault();
                                handleRightClick(info);
                            });
                        }}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay",
                        }}
                        eventContent={(info) => (
                            <div>
                                <b>{info.timeText}</b>
                                <i>{info.event.title}</i>
                            </div>
                        )}
                    />
                </main>
            </div>
        </>
    );
}
