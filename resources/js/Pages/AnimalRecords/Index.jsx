import { useState } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';

export default function AnimalRecords({ animal, records }) {
    const { auth } = usePage().props; // Access user info from Inertia

    return (
        <>
            <Head title={`Records for ${animal.name}`} />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
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

                {/* Animal Details */}
                <main className="max-w-5xl mx-auto p-6">
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Animal Image */}
                            <div className="flex-shrink-0 w-full md:w-1/3">
                                <img
                                    src={animal.photo_url || '/placeholder.jpg'}
                                    alt={animal.name}
                                    className="w-full object-contain rounded-lg"
                                />
                            </div>

                            {/* Animal Info */}
                            <div className="flex-grow">
                                <h1 className="text-2xl font-bold mb-4">
                                    {animal.name}
                                </h1>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p>
                                            <strong>Plemeno:</strong> {animal.breed}
                                        </p>
                                        <p>
                                            <strong>Věk:</strong> {animal.age}
                                        </p>
                                        <p>
                                            <strong>Váha:</strong> {animal.weight}
                                        </p>
                                        <p>
                                            <strong>Pohlaví:</strong>{' '}
                                            {animal.gender}
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>Váha:</strong> {animal.weight}{' '}
                                            kg
                                        </p>
                                        <p>
                                            <strong>Kastrovaný:</strong>{' '}
                                            {animal.neutered ? 'Ano' : 'Ne'}
                                        </p>
                                        <p>
                                            <strong>ID:</strong> {animal.id}
                                        </p>
                                    </div>
                                </div>
                                <p className="mt-4">
                                    <strong>Popis:</strong>{' '}
                                    {animal.description || 'Není k dispozici'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Records Section */}
                    <div className="bg-white shadow overflow-hidden rounded-lg">
                        <h2 className="text-xl font-bold p-6">
                            Vyšetření:
                        </h2>
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                                        Datum vyšetření
                                    </th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                                        Typ vyšetření
                                    </th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                                        Popis
                                    </th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">
                                        Veterinář
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length > 0 ? (
                                    records.map((record) => (
                                        <tr key={record.id} className="hover:bg-gray-100">
                                            <td className="py-3 px-6 text-sm text-gray-700">
                                                {record.examination_date}
                                            </td>
                                            <td className="py-3 px-6 text-sm text-gray-700">
                                                {record.examination_type}
                                            </td>
                                            <td className="py-3 px-6 text-sm text-gray-700">
                                                {record.description}
                                            </td>
                                            <td className="py-3 px-6 text-sm text-gray-700">
                                                {record.vet?.name || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center py-6 text-gray-500"
                                        >
                                            Žádné záznamy nenalezeny.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Add Record Button */}
                    <div className="flex justify-end mt-4">
                        <Link
                            href={route('records.createForm', { id: animal.id })}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full shadow hover:bg-blue-500 transition"
                        >
                            +
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
