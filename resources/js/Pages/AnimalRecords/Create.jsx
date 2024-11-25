import { useState } from 'react';
import { Link, useForm, Head } from '@inertiajs/react';

export default function Create({ auth, animal }) {
    const getCurrentDate = () => {
        const now = new Date();
        return now.toISOString().split('T')[0]; // Returns "YYYY-MM-DD"
    };

    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().split(':').slice(0, 2).join(':'); // Returns "HH:mm"
    };

    const { data, setData, post, processing, errors } = useForm({
        vet_id: auth.user.id,
        examination_date: getCurrentDate(),
        examination_time: getCurrentTime(),
        examination_type: '',
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Combine date and time into one string
        const combinedDateTime = `${data.examination_date} ${data.examination_time}`;
        // Send the combined datetime as `examination_date`
        post(`/animals/${animal.id}/record/create`, {
            data: {
                ...data,
                examination_date: combinedDateTime, // Combine date and time
            },
            onSuccess: () => {
                window.location.href = `/animals/${animal.id}/record`;
            },
        });
    };

    return (
        <>
            <Head title={`Přidat záznam vyšetření pro ${animal.name}`} />
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
                            href="/examination"
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/examination")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Kalendář
                        </Link>
                        <Link
                            href="/request"
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

                <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">
                        Přidat záznam vyšetření
                    </h1>

                    <form onSubmit={handleSubmit}>
                        {/* Animal ID */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                ID zvířete
                            </label>
                            <input
                                type="text"
                                value={animal.id}
                                disabled
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Examination Date */}
                        <div className="mb-4">
                            <label
                                htmlFor="examination_date"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Datum vyšetření*
                            </label>
                            <input
                                type="date"
                                id="examination_date"
                                value={data.examination_date}
                                onChange={(e) =>
                                    setData('examination_date', e.target.value)
                                }
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.examination_date && 'border-red-500'
                                }`}
                            />
                            {errors.examination_date && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.examination_date}
                                </p>
                            )}
                        </div>

                        {/* Examination Time */}
                        <div className="mb-4">
                            <label
                                htmlFor="examination_time"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Čas vyšetření*
                            </label>
                            <input
                                type="time"
                                id="examination_time"
                                value={data.examination_time}
                                onChange={(e) =>
                                    setData('examination_time', e.target.value)
                                }
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.examination_time && 'border-red-500'
                                }`}
                            />
                            {errors.examination_time && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.examination_time}
                                </p>
                            )}
                        </div>

                        {/* Examination Type */}
                        <div className="mb-4">
                            <label
                                htmlFor="examination_type"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Typ vyšetření*
                            </label>
                            <select
                                id="examination_type"
                                value={data.examination_type}
                                onChange={(e) =>
                                    setData('examination_type', e.target.value)
                                }
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.examination_type && 'border-red-500'
                                }`}
                            >
                                <option value="">Vyberte typ</option>
                                <option value="ockovani">Očkování</option>
                                <option value="prohlidka">Prohlídka</option>
                                <option value="lecba">Léčba</option>
                            </select>
                            {errors.examination_type && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.examination_type}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Popis vyšetření
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.description && 'border-red-500'
                                }`}
                                rows="4"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={`/animals/${animal.id}/record`}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                Zrušit
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
                            >
                                {processing ? 'Odesílání...' : 'Vytvořit'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
