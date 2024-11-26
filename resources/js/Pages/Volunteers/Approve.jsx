import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";

export default function Approve({auth, volunteers }) {
    const [pendingVolunteers, setPendingVolunteers] = useState(volunteers);

    const handleApprove = async (id) => {
        try {
            const response = await axios.post(`/approvevolunteers/${id}/approve`);
            if (response.data.success) {
                setPendingVolunteers((prev) =>
                    prev.filter((volunteer) => volunteer.id !== id)
                );
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred while approving.");
        }
    };

    const handleDeny = async (id) => {
        try {
            const response = await axios.post(`/approvevolunteers/${id}/deny`);
            if (response.data.success) {
                setPendingVolunteers((prev) =>
                    prev.filter((volunteer) => volunteer.id !== id)
                );
                alert(response.data.message);
            }
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred while denying.");
        }
    };

    return (
        <>
            <Head title="Approve Volunteers" />
            <div className="min-h-screen bg-gray-100">
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

                <main className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Schválení dobrovolníků</h1>
                    {pendingVolunteers.length > 0 ? (
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Jméno</th>
                                    <th className="border px-4 py-2 text-left">Email</th>
                                    <th className="border px-4 py-2 text-left">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingVolunteers.map((volunteer) => (
                                    <tr
                                        key={volunteer.id}
                                        className="hover:bg-gray-100 transition"
                                    >
                                        <td className="border px-4 py-2">{volunteer.name}</td>
                                        <td className="border px-4 py-2">{volunteer.email}</td>
                                        <td className="border px-4 py-2 flex gap-2">
                                            <button
                                                onClick={() => handleApprove(volunteer.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
                                            >
                                                Schválit
                                            </button>
                                            <button
                                                onClick={() => handleDeny(volunteer.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                                            >
                                                Odmítnout
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500 text-center">
                            Žádní dobrovolníci čekající na schválení.
                        </p>
                    )}
                </main>
            </div>
        </>
    );
}
