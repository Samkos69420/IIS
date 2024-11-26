import { useState } from 'react';
import { Link, usePage, Head } from '@inertiajs/react';
import axios from 'axios';

export default function Create({ vets, animal_id}) {
    const { auth } = usePage().props;

    const [formData, setFormData] = useState({
        animal_id: animal_id,
        vet_id: '',
        description: '',
    });

    const userRoles = auth?.user?.roles || [];
    const [processing, setProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const response = await axios.post(`/animals/createrequest`, {
                ...formData,
                creation_date: new Date().toISOString().split('T')[0], // Automatically set the creation date in YYYY-MM-DD format
            });

            if (response.data.success) {
                alert(response.data.message);
                window.location.href = '/animals'; // Redirect back to animals page
            }
        } catch (error) {
            console.error("Error creating examination request:", error);
            alert("Chyba při vytváření požadavku.");
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title={`Vytvořit požadavek na vyšetření pro ${animal_id}`} />
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

                <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Vytvořit požadavek na vyšetření</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Animal ID */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                ID zvířete
                            </label>
                            <input
                                type="text"
                                value={formData.animal_id}
                                disabled
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Vet */}
                        <div className="mb-4">
                            <label
                                htmlFor="vet_id"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Vyberte veterináře
                            </label>
                            <select
                                id="vet_id"
                                value={formData.vet_id}
                                onChange={(e) =>
                                    setFormData({ ...formData, vet_id: e.target.value })
                                }
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>
                                    Vyberte veterináře
                                </option>
                                {vets.map((vet) => (
                                    <option key={vet.id} value={vet.id}>
                                        {vet.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Popis požadavku
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                rows="4"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={`/animals`}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                Zrušit
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
                            >
                                {processing ? 'Odesílání...' : 'Odeslat'}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
