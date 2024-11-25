import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react"; 
import dayGridPlugin from "@fullcalendar/daygrid"; 
import timeGridPlugin from "@fullcalendar/timegrid"; 
import interactionPlugin from "@fullcalendar/interaction"; 
import axios from "axios";

export default function PlanWalks({ plan, animalId }) {
    const [events, setEvents] = useState(
        plan.map((walk) => ({
            id: walk.id,
            title: walk.available ? "Dostupné" : "Nedostupné",
            start: walk.start,
            end: walk.end,
            backgroundColor: walk.available ? "#00b300" : "#b30000", // Green for available, red for unavailable
        }))
    );

    const handleDateSelect = async (selectionInfo) => {
        const title = confirm("Chcete označit tento čas jako dostupný?");
        const available = title ? true : false;

        try {
            const response = await axios.post(`/animals/${animalId}/planWalks`, {
                start: selectionInfo.startStr.split('+')[0],
                end: selectionInfo.endStr.split('+')[0],
                available,
            });

            if (response.data.success) {
                setEvents([
                    ...events,
                    {
                        id: response.data.walkPlan.id,
                        title: available ? "Dostupné" : "Nedostupné",
                        start: response.data.walkPlan.start,
                        end: response.data.walkPlan.end,
                        backgroundColor: available ? "#00b300" : "#b30000",
                    },
                ]);
                alert(response.data.error);
            }
        } catch (error) {
            alert(
                error.response?.data?.error || "Chyba při ukládání plánování procházky."
            );
        }
    };

    return (
        <>
            <Head title="Plan Walks" />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="flex justify-between items-center p-6">
                    <Link href={route('animals.list')} className="text-gray-700 px-4 py-2">
                        Zpět na seznam zvířat
                    </Link>
                </header>

                <main className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Plánování procházky</h1>

                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        selectable
                        events={events}
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
