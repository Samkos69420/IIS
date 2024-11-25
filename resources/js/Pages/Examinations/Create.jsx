import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function Create({auth, examinationRequests }) {
    const [requests, setRequests] = useState(examinationRequests); // Maintain state for requests
    const [selectedRequest, setSelectedRequest] = useState("");
    const [processing, setProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Filter requests to include only those without existing examinations
    const availableRequests = requests.filter((request) => !request.examination);

    // Map requests with examinations to calendar events
    const events = requests
        .filter((request) => request.examination) // Only include requests with scheduled examinations
        .map((request) => ({
            id: request.examination?.id || "",
            title: `${request.animal.name} (${request.description || "Bez popisu"})`,
            start: request.examination?.examination, // Examination date
            allDay: true, // Full-day events
            extendedProps: {
                animal: request.animal.name,
                description: request.description,
            },
        }));

    const handleDateClick = async (info) => {
        if (!selectedRequest) {
            alert("Vyberte žádost před výběrem data.");
            return;
        }

        const selectedDate = info.dateStr;

        if (confirm(`Naplánovat vyšetření na ${selectedDate}?`)) {
            setProcessing(true);
            setErrorMessage("");

            try {
                const response = await axios.post(`/examination/create`, {
                    request_id: selectedRequest,
                    examination: selectedDate,
                });

                if (response.data.success) {
                    alert(response.data.message);

                    // Remove the used request from the list
                    setRequests((prevRequests) =>
                        prevRequests.filter((request) => request.id !== selectedRequest)
                    );

                    // Reset the selected request
                    setSelectedRequest("");
                }
            } catch (error) {
                setErrorMessage(
                    error.response?.data?.message || "Chyba při vytváření vyšetření."
                );
            } finally {
                setProcessing(false);
            }
        }
    };

    const handleEventClick = (info) => {
        const examId = info.event.id;
        if (examId) {
            window.location.href = `/examination/${examId}/edit`;
        }
    };

    return (
        <>
            <Head title="Naplánovat Vyšetření" />
            <div className="min-h-screen bg-gray-100">
            <header className="flex justify-between items-center p-6">
                    <Link href={route('home')} className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    <nav className="flex gap-4">
                        <Link
                            href={route('animals.list')}
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/animals")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Zvířata
                        </Link>
                        <Link
                            href={route('examination.index')}
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/examination")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Kalendář
                        </Link>
                        <Link
                            href={route('requests.index')}
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/request")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Vyšetření
                        </Link>
                    </nav>
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
                    <h1 className="text-2xl font-bold mb-6">Naplánovat Vyšetření</h1>

                    {errorMessage && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    {/* Examination Requests Dropdown */}
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-2">
                            Vyberte Žádost
                        </label>
                        <select
                            value={selectedRequest}
                            onChange={(e) => setSelectedRequest(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            {!selectedRequest && (
                                <option value="">Vyberte žádost...</option>
                            )}
                            {availableRequests.map((request) => (
                                <option key={request.id} value={request.id}>
                                    {request.animal.name} - {request.description || "Bez popisu"}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Calendar */}
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        dateClick={handleDateClick}
                        events={events} // Pass events to FullCalendar
                        eventClick={handleEventClick} // Handle clicking on events
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth",
                        }}
                    />
                </main>
            </div>
        </>
    );
}
