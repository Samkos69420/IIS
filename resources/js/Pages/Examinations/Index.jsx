import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";

export default function Index({auth, examinations }) {
    const [errorMessage, setErrorMessage] = useState("");

    // Map examinations into FullCalendar events
    const events = examinations.map((exam) => {
        const animalName = exam.examination_request?.animal?.name || "Neznámé zvíře";
        const description = exam.examination_request?.description;
    
        return {
            id: exam.id,
            title: `${animalName} (${description || "Bez popisu"})`,
            start: exam.examination,
            allDay: true,
            extendedProps: {
                animal: animalName,
                description: description,
            },
        };
    });
    
    
/*

    // Handle clicking on an existing examination todo
    const handleEventClick = (info) => {
        const examId = info.event.id;
        window.location.href = `/examination/${examId}/edit`;
    };

    // Handle deleting an examination
    const handleDeleteExamination = async (examId) => {
        if (!confirm("Opravdu chcete smazat toto vyšetření?")) return;

        try {
            const response = await axios.post(`/examination/${examId}/delete`);
            if (response.data.success) {
                alert(response.data.message);
                window.location.reload(); // Reload to reflect changes
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Chyba při mazání vyšetření."
            );
        }
    };*/

    return (
        <>
            <Head title="Vyšetření" />
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

                <main className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Vyšetření</h1>

                    {errorMessage && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    {/* Calendar */}
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                     //   eventClick={handleEventClick}todo
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
