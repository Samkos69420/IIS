import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";

export default function Create({auth}) {
    const [formData, setFormData] = useState({
        name: "",
        breed: "",
        age: "",
        weight: "",
        neutered: false,
        gender: "",
        description: "",
        date_found: new Date().toISOString().split("T")[0],
        where_found: "",
        photo_url: null,
    });

    const userRoles = auth?.user?.roles || [];
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});
        setErrorMessage("");

        try {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            const response = await axios.post(`/animals/create`, formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                alert(response.data.message);
                window.location.href = "/animals"; // Redirect back to animals page
            }
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setErrorMessage(error.response.data.message);
            } else {
                setErrorMessage("Nastala neočekávaná chyba. Prosím zkuste to znovu.");
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Přidat zvíře" />
            <div className="min-h-screen bg-gray-100">
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
                    <h1 className="text-2xl font-bold mb-6">Přidat zvíře</h1>

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
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.name ? "border-red-500" : ""
                                }`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                        </div>

                        {/* Breed */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Plemeno</label>
                            <input
                                type="text"
                                name="breed"
                                value={formData.breed}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.breed ? "border-red-500" : ""
                                }`}
                            />
                            {errors.breed && <p className="text-red-500 text-sm mt-2">{errors.breed}</p>}
                        </div>

                        {/* Age */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Věk</label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.age ? "border-red-500" : ""
                                }`}
                            />
                            {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
                        </div>

                        {/* Weight */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Hmotnost (kg)</label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.weight ? "border-red-500" : ""
                                }`}
                            />
                            {errors.weight && <p className="text-red-500 text-sm mt-2">{errors.weight}</p>}
                        </div>

                        {/* Neutered */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Kastrovaný</label>
                            <input
                                type="checkbox"
                                name="neutered"
                                checked={formData.neutered}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            Ano
                        </div>

                        {/* Gender */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Pohlaví</label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.gender ? "border-red-500" : ""
                                }`}
                            >
                                {formData.gender === "" && <option value="">Vyberte pohlaví</option>}
                                <option value="male">Samec</option>
                                <option value="female">Samice</option>
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm mt-2">{errors.gender}</p>}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Popis</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.description ? "border-red-500" : ""
                                }`}
                            ></textarea>
                            {errors.description && <p className="text-red-500 text-sm mt-2">{errors.description}</p>}
                        </div>

                        {/* Date Found */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Datum nálezu</label>
                            <input
                                type="date"
                                name="date_found"
                                value={formData.date_found}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.date_found ? "border-red-500" : ""
                                }`}
                            />
                            {errors.date_found && (
                                <p className="text-red-500 text-sm mt-2">{errors.date_found}</p>
                            )}
                        </div>

                        {/* Where Found */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Místo nálezu</label>
                            <input
                                type="text"
                                name="where_found"
                                value={formData.where_found}
                                onChange={handleInputChange}
                                className={`w-full border-gray-300 rounded-lg shadow-sm ${
                                    errors.where_found ? "border-red-500" : ""
                                }`}
                            />
                            {errors.where_found && <p className="text-red-500 text-sm mt-2">{errors.where_found}</p>}
                        </div>

                        {/* Photo */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Fotografie</label>
                            <input
                                type="file"
                                name="photo_url"
                                onChange={handleInputChange}
                                className="w-full border-gray-300 rounded-lg shadow-sm"
                            />
                            {errors.photo_url && (
                                <p className="text-red-500 text-sm mt-2">{errors.photo_url}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4">
                            <Link
                                href="/animals"
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400"
                            >
                                Zrušit
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500"
                            >
                                {processing ? "Odesílání..." : "Odeslat"}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    );
}
