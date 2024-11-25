import { useState } from "react";
import { Link, Head, useForm } from "@inertiajs/react";

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: "", // Empty password field to allow updates only if filled
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/users/${user.id}/edit`, {
            onSuccess: () => {
                alert("Uživatel byl úspěšně upraven.");
                window.location.href = "/users";
            },
            onError: () => {
                alert("Nastala chyba při úpravě uživatele.");đ
            },
        });
    };

    return (
        <>
            <Head title={`Editace uživatele: ${user.name}`} />
            <div className="min-h-screen bg-gray-100">
                <header className="flex justify-between items-center p-6">
                    <Link href={route('home')} className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    <Link
                        href={route('users.list')}
                        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition"
                    >
                        Zpět na seznam uživatelů
                    </Link>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Editace uživatele</h1>
                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Jméno
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.name && "border-red-500"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email && "border-red-500"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">
                                Heslo (nechte prázdné, pokud neměníte)
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password && "border-red-500"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-2">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={route('users.list')}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                Zrušit
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
                            >
                                {processing ? "Ukládání..." : "Uložit"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
