import { useState } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import axios from "axios";

export default function Create() {
    const { url } = usePage();
    const queryParams = new URLSearchParams(url.split("?")[1]);
    const roleFilter = queryParams.get("role") || "None";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: roleFilter,
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrorMessage("");
        setErrors({});

        try {
            const response = await axios.post("/users/create", formData);

            if (response.data.success) {
                alert(response.data.message);
                window.location.href = `/users?role=${roleFilter}`;
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.error) {
                setErrorMessage(error.response.data.error); // Show backend-provided error
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message); // Fallback message
            } else {
                setErrorMessage("Nastala neočekávaná chyba. Prosím zkuste to znovu.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Vytvořit uživatele" />
            <div className="min-h-screen bg-gray-100">
                <header className="flex justify-between items-center p-6">
                    <Link href="/" className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    <Link
                        href={`/users?role=${roleFilter}`}
                        className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition"
                    >
                        Zpět na seznam uživatelů
                    </Link>
                </header>

                <main className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h1 className="text-2xl font-bold mb-6">Vytvořit nového uživatele</h1>

                    {errorMessage && (
                        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Jméno</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.name && "border-red-500"
                                }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-2">{errors.name}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.email && "border-red-500"
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Heslo</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.password && "border-red-500"
                                }`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                            )}
                        </div>

                        {/* Role */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Role</label>
                            <input
                                type="text"
                                value={roleFilter}
                                disabled
                                className="w-full border-gray-300 bg-gray-100 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href={`/users?role=${roleFilter}`}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
                            >
                                Zrušit
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition"
                            >
                                {processing ? "Ukládání..." : "Vytvořit"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
