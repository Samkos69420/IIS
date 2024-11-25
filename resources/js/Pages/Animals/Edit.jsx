import { useState } from "react";
import { Link, Head, useForm } from "@inertiajs/react";
import axios from "axios";

export default function Edit({ animal }) {
    const [data, setData] = useState({
        name: animal.name,
        kind: animal.kind,
        age: animal.age,
        gender: animal.gender,
        description: animal.description || "",
        date_found: animal.date_found,
        where_found: animal.where_found,
        photo: null, // File input
    });

    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        setProcessing(true);
        try {
            const response = await axios.post(`/animals/${animal.id}/edit`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                alert(response.data.message);
                window.location.href = "/animals";
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert("Nastala chyba při aktualizaci záznamu.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title={`Upravit ${animal.name}`} />
            <div className="min-h-screen bg-gray-100">
                <header className="flex justify-between items-center p-6">
                    <Link href={route('home')} className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    <Link
                        href={route('animals.list')}
                        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition"
                    >
                        Zpět
                    </Link>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Upravit informace o zvířeti</h1>
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Jméno
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData({ ...data, name: e.target.value })}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.name && "border-red-500"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-2">{errors.name[0]}</p>
                            )}
                        </div>

                        {/* Kind */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Druh
                            </label>
                            <select
                                value={data.kind}
                                onChange={(e) => setData({ ...data, kind: e.target.value })}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.kind && "border-red-500"
                                }`}
                            >
                                <option value="dog">Pes</option>
                                <option value="cat">Kočka</option>
                                <option value="rabbit">Králík</option>
                            </select>
                            {errors.kind && (
                                <p className="text-red-500 text-sm mt-2">{errors.kind[0]}</p>
                            )}
                        </div>

                        {/* Age */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Věk</label>
                            <input
                                type="number"
                                value={data.age}
                                onChange={(e) => setData({ ...data, age: e.target.value })}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.age && "border-red-500"
                                }`}
                            />
                            {errors.age && (
                                <p className="text-red-500 text-sm mt-2">{errors.age[0]}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Pohlaví
                            </label>
                            <select
                                value={data.gender}
                                onChange={(e) => setData({ ...data, gender: e.target.value })}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.gender && "border-red-500"
                                }`}
                            >
                                <option value="male">Muž</option>
                                <option value="female">Žena</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-sm mt-2">{errors.gender[0]}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Popis
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData({ ...data, description: e.target.value })
                                }
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.description && "border-red-500"
                                }`}
                                rows="4"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.description[0]}
                                </p>
                            )}
                        </div>

                        {/* Date Found */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Datum nalezení
                            </label>
                            <input
                                type="date"
                                value={data.date_found}
                                onChange={(e) =>
                                    setData({ ...data, date_found: e.target.value })
                                }
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.date_found && "border-red-500"
                                }`}
                            />
                            {errors.date_found && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.date_found[0]}
                                </p>
                            )}
                        </div>

                        {/* Where Found */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Kde bylo nalezeno
                            </label>
                            <input
                                type="text"
                                value={data.where_found}
                                onChange={(e) =>
                                    setData({ ...data, where_found: e.target.value })
                                }
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.where_found && "border-red-500"
                                }`}
                            />
                            {errors.where_found && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.where_found[0]}
                                </p>
                            )}
                        </div>

                        {/* Photo */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Fotka
                            </label>
                            <input
                                type="file"
                                onChange={(e) => setData({ ...data, photo: e.target.files[0] })}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.photo && "border-red-500"
                                }`}
                            />
                            {errors.photo && (
                                <p className="text-red-500 text-sm mt-2">{errors.photo[0]}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('animals.list')}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                Zrušit
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
                            >
                                {processing ? "Odesílání..." : "Uložit změny"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
