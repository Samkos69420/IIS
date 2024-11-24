import { Link, Head, usePage } from '@inertiajs/react';

export default function Requests() {
    const { auth, examination_requests } = usePage().props; // Access user and requests data from Inertia
    const requests = examination_requests.data || []; // Extract requests from paginated data

    return (
        <>
            <Head title="Žádosti" />
            <div className="min-h-screen bg-gray-100">
                {/* Sticky Navbar */}
                <header className="flex justify-between items-center p-6">
                    <Link href="/" className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    <Link
                        href="/animals"
                        className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                            window.location.pathname.includes('/animals') ? 'underline font-bold' : ''
                        }`}
                    >
                        Zvířata
                    </Link>
                    <Link
                        href="/request"
                        className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                            window.location.pathname.includes('/request') ? 'underline font-bold' : ''
                        }`}
                    >
                        Žádosti
                    </Link>
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

                {/* Requests Table */}
                <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
                    <h1 className="text-xl font-bold mb-4">Žádosti</h1>
                    {requests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 text-sm">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Zvíře</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Veterinář</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Datum Žádosti</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Popis</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((request, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {request.animal?.name || 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {request.vet?.name || 'N/A'}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {new Date(request.creation_date).toLocaleDateString('cs-CZ')}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                {request.description || 'Není k dispozici'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">Nemáte žádné žádosti k zobrazení.</p>
                    )}
                </main>
            </div>
        </>
    );
}
