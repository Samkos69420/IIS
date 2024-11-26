import { useState, useEffect } from "react";
import { Link, Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function Schedule({ auth, schedule, animalId }) {
    const [events, setEvents] = useState([]);

    const userRoles = auth?.user?.roles || [];

    // Fetch events from the backend
    const fetchEvents = async () => {
        try {
            const response = await axios.get(`/animals/${animalId}/schedule-volunteer`);

            // Check if the response includes schedule data
            if (!response.data || !response.data.schedule) {
                throw new Error("Schedule data is missing in the response.");
            }

            // Map the schedule to FullCalendar events
            const updatedSchedule = response.data.schedule.map((item) => ({
                id: item.id,
                title: item.user_id
                    ? `${item.approved ? "Rezervováno" : "Vyřizuje se"} (${
                          item.user?.name || "Neznámý uživatel"
                      })`
                    : "Dostupné",
                start: item.start,
                end: item.end,
                backgroundColor: item.user_id
                    ? item.approved
                        ? "#b30000" // Red for approved
                        : "#ffcc00" // Yellow for pending approval
                    : "#00b300", // Green for available
                extendedProps: {
                    available: item.available,
                    user_id: item.user_id,
                    user_name: item.user?.name || null,
                    approved: item.approved,
                },
            }));

            setEvents(updatedSchedule);
        } catch (error) {
            console.error("Error fetching events:", error);
            alert("Chyba při načítání událostí.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEventClick = async (info) => {
        const event = info.event;
        const eventId = event.id;

        if (event.extendedProps.user_id) {
            // Check if the logged-in user is the same as the event's user
            if (auth.user.id !== event.extendedProps.user_id) {
                alert("Nemáte oprávnění zrušit tuto rezervaci.");
                return;
            }

            // Cancel Booking
            if (confirm("Chcete tuto rezervaci zrušit?")) {
                try {
                    const response = await axios.post(`/booking/${eventId}/cancelTermin`);

                    if (response.data.success) {
                        fetchEvents(); // Refresh events
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
                    const response = await axios.post(`/booking/${eventId}/bookTermin`);

                    if (response.data.success) {
                        fetchEvents(); // Refresh events
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
                    <Link href="/" className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex gap-4">
                        <Link
                            href="/volunteer/history"
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/volunteer/history")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Zvířata
                        </Link>
                        <Link
                            href="/volunteer/history"
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/volunteer/history")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Historie
                        </Link>
                    </nav>

                    {/* User Info */}
                    <div>
                        {auth?.user ? (
                            <Link
                                href={route("profile.edit")}
                                className="font-semibold text-gray-600 hover:text-gray-900"
                            >
                                {auth.user.name}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="font-semibold text-gray-600 hover:text-gray-900"
                                >
                                    Přihlášení
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="ml-4 font-semibold text-gray-600 hover:text-gray-900"
                                >
                                    Registrace
                                </Link>
                            </>
                        )}
                    </div>
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
