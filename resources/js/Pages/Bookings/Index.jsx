import { useState } from "react";
import { Link, Head } from "@inertiajs/react";

export default function Index({ auth, bookings }) {
    const [errorMessage, setErrorMessage] = useState("");

    const handleBookingClick = (animalId) => {
        window.location.href = `/animals/${animalId}/booking`;
    };

    // Filter out bookings with an undefined or null user
    const filteredBookings = bookings.filter(
        (booking) => booking.user?.name
    );

    return (
        <>
            <Head title="Bookings" />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="flex justify-between items-center p-6">
                    <Link href="/" className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    
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

                {/* Main Content */}
                <main className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6">Čekající rezervace</h2>

                    {errorMessage && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    {filteredBookings.length > 0 ? (
                        <ul className="divide-y divide-gray-300">
                            {filteredBookings.map((booking) => (
                                <li
                                    key={booking.id}
                                    className="flex items-center justify-between p-4 hover:bg-gray-100 cursor-pointer transition"
                                    onClick={() => handleBookingClick(booking.animal.id)}
                                >
                                    <div>
                                        <p className="font-semibold text-lg">
                                            {booking.animal.name || "Neznámé zvíře"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Dobu rezervace: {new Date(booking.start).toLocaleString()} -{" "}
                                            {new Date(booking.end).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className="text-gray-600">
                                        Rezervace od uživatele: {booking.user.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500">Žádné čekající rezervace k zobrazení.</p>
                    )}
                </main>
            </div>
        </>
    );
}
