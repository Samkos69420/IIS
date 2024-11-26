import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function PlanWalks({ auth, plan, animalId }) {
    const [events, setEvents] = useState(
        plan.map((walk) => ({
            id: walk.id,
            title: walk.available ? "Dostupné" : "Nedostupné",
            start: walk.start,
            end: walk.end,
            backgroundColor: walk.available ? "#00b300" : "#b30000", // Green for available, red for unavailable
        }))
    );

    const userRoles = auth?.user?.roles || [];

    const fetchEvents = async () => {
        try {
            const response = await axios.get(`/animals/${animalId}/planWalks`);
            const updatedPlan = response.data.plan || [];
            setEvents(
                updatedPlan.map((walk) => ({
                    id: walk.id,
                    title: walk.available ? "Dostupné" : "Nedostupné",
                    start: walk.start,
                    end: walk.end,
                    backgroundColor: walk.available ? "#00b300" : "#b30000",
                }))
            );
        } catch (error) {
            console.error("Chyba při načítání plánů procházek:", error);
            alert("Chyba při načítání plánů procházek.");
        }
    };

    const handleDateSelect = async (selectionInfo) => {
        const available = true;

        try {
            const response = await axios.post(`/animals/${animalId}/planWalks`, {
                start: selectionInfo.startStr.split("+")[0],
                end: selectionInfo.endStr.split("+")[0],
                available,
            });

            if (response.data.success) {
                // Add the new event without refetching all events
                setEvents((prevEvents) => [
                    ...prevEvents,
                    {
                        id: response.data.walkPlan.id,
                        title: available ? "Dostupné" : "Nedostupné",
                        start: response.data.walkPlan.start,
                        end: response.data.walkPlan.end,
                        backgroundColor: available ? "#00b300" : "#b30000",
                    },
                ]);
            }
        } catch (error) {
            console.error("Chyba při ukládání plánování procházky:", error);
            alert(
                error.response?.data?.message || "Chyba při ukládání plánování procházky."
            );
        }
    };

    const handleEventClick = async (info) => {
        const eventId = info.event.id;

      // todo if (!confirm("Opravdu chcete odstranit tento termín?")) return;

        try {
            const response = await axios.post(`/booking/${eventId}/delete`, {
                id: eventId,
            });

            if (response.data.success) {
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event.id !== parseInt(eventId))
                );
             //  todo alert(response.data.message);
            }
        } catch (error) {
            console.error("Chyba při mazání termínu:", error);
            alert(
                error.response?.data?.message || "Chyba při mazání termínu."
            );
        }
    };

    return (
        <>
            <Head title="Plan Walks" />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="flex justify-between items-center p-6">
                    <Link href="/" className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>

                    {/* Navigation Links */}
                    <nav className="flex gap-4">
                        <Link
                            href="/animals"
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/animals")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Zvířata
                        </Link>
                        <Link
                            href="/approvevolunteers"
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/approvevolunteers")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Dobrovolníci 
                        </Link>
                        <Link
                            href="/booking"
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/booking")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Rezervace
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
                    <h1 className="text-2xl font-bold mb-6">Plánování procházky</h1>

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        selectable
                        events={events}
                        eventClick={handleEventClick}
                        select={handleDateSelect}
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
