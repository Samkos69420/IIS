import { useState } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import axios from "axios";

export default function Create({auth}) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        kind: '',
        age: '',
        gender: '',
        description: '',
        date_found: '',
        where_found: '',
        photo: null,
    });

    const handleSubmit = (e) => {
    //    e.preventDefault();
       // post('/animals/create');
        axios.post(`/animals/create`);

    };

    return (
        <>
            <Head title="Přidat zvíře" />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="flex justify-between items-center p-6">
                    <Link href="/animals" className="text-gray-700 px-4 py-2">
                        Zpět na seznam zvířat
                    </Link>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Přidat zvíře</h1>

                    <form onSubmit={handleSubmit}>
                        {/* Date Found */}
                        <div className="mb-4">
                            <label
                                htmlFor="date_found"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Datum nálezu
                            </label>
                            <input
                                type="date"
                                id="date_found"
                                value={data.date_found}
                                onChange={(e) => setData('date_found', e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.date_found ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.date_found && (
                                <p className="text-red-500 text-sm mt-2">{errors.date_found}</p>
                            )}
                        </div>

                        {/* Name */}
                        <div className="mb-4">
                            <label
                                htmlFor="name"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Jméno
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.name ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                            )}
                        </div>

                        {/* Kind */}
                        <div className="mb-4">
                            <label
                                htmlFor="kind"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Druh
                            </label>
                            <select
                                id="kind"
                                value={data.kind}
                                onChange={(e) => setData('kind', e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.kind ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Vyberte druh</option>
                                <option value="dog">Pes</option>
                                <option value="cat">Kočka</option>
                                <option value="rabbit">Králík</option>
                            </select>
                            {errors.kind && (
                                <p className="text-red-500 text-sm mt-2">{errors.kind}</p>
                            )}
                        </div>

                        {/* Age */}
                        <div className="mb-4">
                            <label
                                htmlFor="age"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Věk
                            </label>
                            <input
                                type="number"
                                id="age"
                                value={data.age}
                                onChange={(e) => setData('age', e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.age ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.age && (
                                <p className="text-red-500 text-sm mt-2">{errors.age}</p>
                            )}
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label
                                htmlFor="gender"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Pohlaví
                            </label>
                            <select
                                id="gender"
                                value={data.gender}
                                onChange={(e) => setData('gender', e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.gender ? 'border-red-500' : ''
                                }`}
                            >
                                <option value="">Vyberte pohlaví</option>
                                <option value="male">Muž</option>
                                <option value="female">Žena</option>
                            </select>
                            {errors.gender && (
                                <p className="text-red-500 text-sm mt-2">{errors.gender}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label
                                htmlFor="description"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Popis
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.description ? 'border-red-500' : ''
                                }`}
                                rows="4"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-2">{errors.description}</p>
                            )}
                        </div>

                        {/* Where Found */}
                        <div className="mb-4">
                            <label
                                htmlFor="where_found"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Místo nálezu
                            </label>
                            <input
                                type="text"
                                id="where_found"
                                value={data.where_found}
                                onChange={(e) => setData('where_found', e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.where_found ? 'border-red-500' : ''
                                }`}
                            />
                            {errors.where_found && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.where_found}
                                </p>
                            )}
                        </div>

                        {/* Photo */}
                        <div className="mb-4">
                            <label
                                htmlFor="photo"
                                className="block text-gray-700 font-medium mb-2"
                            >
                                Fotografie
                            </label>
                            <input
                                type="file"
                                id="photo"
                                onChange={(e) =>
                                    setData('photo', e.target.files[0])
                                }
                                className="w-full border-gray-300 rounded-lg shadow-sm"
                            />
                            {errors.photo && (
                                <p className="text-red-500 text-sm mt-2">{errors.photo}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href="/animals"
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
