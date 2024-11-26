import { useState } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import axios from "axios";

export default function Animals({ initialAnimals }) {
    const { auth } = usePage().props;

    const [animals, setAnimals] = useState(initialAnimals);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAnimal, setSelectedAnimal] = useState(null);

    const userRoles = auth?.user?.roles || [];

    const loadMoreAnimals = async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await axios.get(`/animals?page=${page + 1}`);
            const newAnimals = response.data.data;

            if (newAnimals.length === 0) {
                setHasMore(false);
            } else {
                setAnimals((prev) => [...prev, ...newAnimals]);
                setPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error("Error fetching more animals:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAnimals = animals.filter((animal) =>
        animal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteAnimal = async (animalId) => {
        if (!confirm("Opravdu chcete toto zvíře smazat?")) return;

        try {
            const response = await axios.post(`/animals/${animalId}/delete`);
            if (response.data.success) {
                setAnimals((prev) => prev.filter((animal) => animal.id !== animalId));
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Chyba při mazání zvířete:", error);
            alert("Chyba při mazání zvířete.");
        }
    };

    const handleCreateRequest = (animalId) => {
        window.location.href = `/animals/${animalId}/createrequest`;
    };

    const handleAddAnimal = () => {
        window.location.href = `/animals/create`;
    };

    const handleEditAnimal = (animalId) => {
        window.location.href = `/animals/${animalId}/edit`;
    };

    const handleViewPlan = (animalId) => {
        window.location.href = `/animals/${animalId}/planWalks`;
    };

    const handleBorrowClick = async (animalId) => {
        if (userRoles.includes("Volunteer")) {
            window.location.href = `/animals/${animalId}/schedule-volunteer`;
        } else if (auth.user) {
            try {
                const response = await axios.post("/apply");
    
                if (response.data.success) {
                    alert(response.data.message);
                } else {
                    alert(response.data.message); // Shows a message if already pending or can't apply
                }
            } catch (error) {
                alert(
                    error.response?.data?.message ||
                    "An error occurred while applying for approval."
                );
            }
        } else {
            window.location.href = "/register";
        }
    };
    

    return (
        <>
            <Head title="Animals" />
            <div className="min-h-screen bg-gray-100">
                {/* Sticky Navbar */}
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
                        {userRoles.includes("Vet") && (
                            <>
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
                            </>
                        )}
                        {userRoles.includes("Volunteer") && (
                        <Link
                            href="/volunteer/history"
                            className={`text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition ${
                                window.location.pathname.includes("/volunteer/history")
                                    ? "underline font-bold"
                                    : ""
                            }`}
                        >
                            Historie
                        </Link>
                        )}
                        {userRoles.includes("CareTaker") && (
                        <>
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
                        </>                            
                        )}
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

                {/* Search Bar for Caretaker and Vet */}
                {(userRoles.includes("CareTaker") || userRoles.includes("Vet")) && (
                    <div className="max-w-7xl mx-auto p-4">
                        <input
                            type="text"
                            placeholder="Vyhledat zvíře..."
                            className="w-full px-4 py-2 border rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                )}

                {/* Role-specific content */}
                {userRoles.includes("CareTaker") ? (
                    <>
                        {/* Animal Table for Caretakers */}
                        <main className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
                            <table className="min-w-full border border-gray-300 text-sm">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">ID</th>
                                        <th className="border px-4 py-2 text-left">Jméno</th>
                                        <th className="border px-4 py-2 text-left">Plemeno</th>
                                        <th className="border px-4 py-2 text-left">Věk</th>
                                        <th className="border px-4 py-2 text-left">Akce</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAnimals.length > 0 ? (
                                        filteredAnimals.map((animal) => (
                                            <tr
                                                key={animal.id}
                                                className="hover:bg-gray-100 transition"
                                            >
                                                <td className="border px-4 py-2">{animal.id}</td>
                                                <td
                                                    className="border px-4 py-2 text-blue-500 cursor-pointer"
                                                    onClick={() => handleEditAnimal(animal.id)}
                                                >
                                                    {animal.name}
                                                </td>
                                                <td className="border px-4 py-2">{animal.breed}</td>
                                                <td className="border px-4 py-2">{animal.age}</td>
                                                <td className="border px-4 py-2 flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleCreateRequest(animal.id)
                                                        }
                                                        className="px-2 py-1 bg-blue-500 text-white rounded"
                                                    >
                                                        Vyšetření
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleViewPlan(animal.id)
                                                        }
                                                        className="px-2 py-1 bg-green-500 text-white rounded"
                                                    >
                                                        Plán
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteAnimal(animal.id)
                                                        }
                                                        className="px-2 py-1 bg-red-500 text-white rounded"
                                                    >
                                                        -
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center text-gray-500 py-4"
                                            >
                                                Žádné záznamy nenalezeny.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Add New Animal */}
                            <div className="mt-4 text-center">
                                <button
                                    onClick={handleAddAnimal}
                                    className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-500 transition"
                                >
                                    +
                                </button>
                            </div>
                        </main>
                    </>
                ) : userRoles.includes("Vet") ? (
                    <>
                        {/* Animal List for Vets */}
                        <main className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
                            <table className="min-w-full border border-gray-300 text-sm">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border px-4 py-2 text-left">Jméno</th>
                                        <th className="border px-4 py-2 text-left">Druh</th>
                                        <th className="border px-4 py-2 text-left">Věk</th>
                                        <th className="border px-4 py-2 text-left">Pohlaví</th>
                                        <th className="border px-4 py-2 text-left">Kastrovaný</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAnimals.length > 0 ? (
                                        filteredAnimals.map((animal) => (
                                            <tr
                                                key={animal.id}
                                                className="hover:bg-gray-100 transition"
                                            >
                                                <td className="border px-4 py-2">
                                                    <Link
                                                        href={`/animals/${animal.id}/record`}
                                                        className="text-blue-500 underline"
                                                    >
                                                        {animal.name}
                                                    </Link>
                                                </td>
                                                <td className="border px-4 py-2">{animal.kind}</td>
                                                <td className="border px-4 py-2">{animal.age}</td>
                                                <td className="border px-4 py-2">{animal.gender}</td>
                                                <td className="border px-4 py-2">
                                                    {animal.neutered ? "Ano" : "Ne"}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="text-center text-gray-500 py-4"
                                            >
                                                Žádné záznamy nenalezeny.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </main>
                    </>
                ) : (
                    /* Default Animals Grid */
                    <main className="max-w-70xl mx-auto p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAnimals.map((animal) => (
                                <div
                                    key={animal.id}
                                    className="flex bg-white shadow rounded-lg overflow-hidden hover:bg-gray-200 transition cursor-pointer"
                                    onClick={() => setSelectedAnimal(animal)}
                                >
                                    <img
                                        src={('storage/' + animal.photo_url) || "/placeholder.jpg"}
                                        alt={animal.name}
                                        className="w-1/3 object-cover"
                                    />
                                    <div className="p-4 flex flex-col justify-between">
                                        <p className="font-semibold">Jméno: {animal.name}</p>
                                        <p>Druh: {animal.kind}</p>
                                        <p>Věk: {animal.age}</p>
                                        <p>Pohlaví: {animal.gender}</p>
                                        <p>Kastrovaný: {animal.neutered ? "Ano" : "Ne"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {hasMore && (
                            <div className="mt-6 text-center">
                                <button
                                    onClick={loadMoreAnimals}
                                    disabled={loading}
                                    className="px-6 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700 transition"
                                >
                                    {loading ? "Načítání..." : "Více"}
                                </button>
                            </div>
                        )}
                    </main>
                )}

                {/* Modal */}
                {selectedAnimal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                        <div
                            className="bg-white rounded-lg shadow-lg overflow-hidden p-6 relative"
                            style={{
                                width: "90%",
                                maxWidth: "900px",
                                maxHeight: "85%",
                                overflowY: "auto",
                            }}
                        >
                            <button
                                onClick={() => setSelectedAnimal(null)}
                                className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full"
                            >
                                ×
                            </button>
                            <div className="flex flex-col md:flex-row">
                                <div className="flex justify-center items-center mb-4 md:mb-0 md:w-1/2">
                                    <img
                                        src={'storage/' + selectedAnimal.photo_url || "/placeholder.jpg"}
                                        alt={selectedAnimal.name}
                                        className="max-w-full h-auto object-contain rounded-lg"
                                    />
                                </div>
                                <div className="md:w-1/2 p-4">
                                    <h2 className="text-3xl font-bold mb-4">
                                        {selectedAnimal.name}
                                    </h2>
                                    <p>
                                        <strong>ID:</strong> {selectedAnimal.id}
                                    </p>
                                    <p>
                                        <strong>Druh:</strong> {selectedAnimal.kind}
                                    </p>
                                    <p>
                                        <strong>Věk:</strong> {selectedAnimal.age}
                                    </p>
                                    <p>
                                        <strong>Pohlaví:</strong> {selectedAnimal.gender}
                                    </p>
                                    <p>
                                        <strong>Kastrovaný:</strong>{" "}
                                        {selectedAnimal.neutered ? "Ano" : "Ne"}
                                    </p>
                                    <p>
                                        <strong>Popis:</strong>{" "}
                                        {selectedAnimal.description || "Není k dispozici"}
                                    </p>
                                    {!(userRoles.includes("CareTaker") || userRoles.includes("Vet") || userRoles.includes("Admin")) && (
                                        <button
                                            onClick={() => handleBorrowClick(selectedAnimal.id)}
                                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500 transition"
                                        >
                                            Zapůjčit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
