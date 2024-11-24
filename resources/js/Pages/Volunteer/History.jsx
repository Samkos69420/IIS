import { useEffect, useState } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import axios from 'axios';

export default function VolunteerHistory() {
    const { auth } = usePage().props; // Access user info from Inertia
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Fetch borrowing history data for the authenticated user
        axios
            .get('/volunteer/history')
            .then((response) => {
                setHistory(response.data.history || []);
            })
            .catch((error) => {
                console.error('Error fetching history:', error);
                setHistory([]); 
            });
    }, []);

    return (
        <>
            <Head title="Volunteer History" />
            <div className="min-h-screen bg-gray-100">
                {/* Sticky Navbar */}
                <header className="flex justify-between items-center p-6">
                    <Link href="/" className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    <nav className="flex gap-4">
                    <Link
                        href="/animals"
                        className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                            window.location.pathname.includes('/animals') ? 'underline font-bold' : ''
                        }`}
                    >
                        Zvířata
                    </Link>
                    <Link
                        href="/volunteer/history"
                        className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                            window.location.pathname.includes('/volunteer/history') ? 'underline font-bold' : ''
                        }`}
                    >
                        Historie
                    </Link>
                    </nav>
                    <div>
                        {auth?.user ? (
                            <Link
                                href={route('profile.edit')}
                                className="font-semibold text-gray-600 hover:text-gray-900"
                            >
                                {auth.user.name}
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="font-semibold text-gray-600 hover:text-gray-900"
                                >
                                    Přihlášení
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="ml-4 font-semibold text-gray-600 hover:text-gray-900"
                                >
                                    Registrace
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                {/* History Table */}
                <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
                    <h1 className="text-xl font-bold mb-4">Historie půjčování zvířat</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Jméno zvířete</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Druh</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Datum půjčení</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Datum vrácení</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Poznámky</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.length > 0 ? (
                                    history.map((entry, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {entry.animal?.name || 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {entry.animal?.kind || 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {new Date(entry.start).toLocaleDateString('cs-CZ')}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {entry.end
                                                    ? new Date(entry.end).toLocaleDateString('cs-CZ')
                                                    : 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">{entry.notes || 'Žádné'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="border border-gray-300 px-4 py-2 text-center">
                                            Žádná data k zobrazení.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </main>
            </div>
        </>
    );
}
