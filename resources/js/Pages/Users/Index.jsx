import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import axios from "axios";

export default function UsersIndex({ users, roleFilter }) {
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [searchTerm, setSearchTerm] = useState("");

    // Filter users by search term
    const displayedUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteUser = async (userId) => {
        if (!confirm("Opravdu chcete tohoto uživatele smazat?")) return;
    
        try {
            const response = await axios.post(`/users/${userId}/delete`);
            if (response.data.success) {
                setFilteredUsers((prev) => prev.filter((user) => user.id !== userId));
                alert(response.data.message);
            } else {
                alert("Nastala chyba při mazání uživatele.");
            }
        } catch (error) {
            console.error("Chyba při mazání uživatele:", error);
            alert("Chyba při mazání uživatele.");
        }
    };

    const handleCreateUser = () => {
        if (roleFilter) {
            window.location.href = `/users/create?role=${roleFilter}`;
        } else {
            alert("Nelze vytvořit uživatele bez určené role.");
        }
    };

    return (
        <>
            <Head title={`Uživatelé${roleFilter ? ` - ${roleFilter}` : ""}`} />
            <div className="min-h-screen bg-gray-100">
                {/* Header */}
                <header className="flex justify-between items-center p-6">
                    <Link href={route('home')} className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>
                    <Link href={route('users.list')} className="text-gray-700 px-4 py-2">
                        Všichni uživatelé
                    </Link>
                </header>

                {/* Main Content */}
                <main className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow">
                    <h1 className="text-2xl font-bold mb-6">
                        Uživatelé{roleFilter ? ` - ${roleFilter}` : ""}
                    </h1>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Hledat uživatele podle jména..."
                            className="w-full px-4 py-2 border rounded-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Users Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border px-4 py-2 text-left">Jméno</th>
                                    <th className="border px-4 py-2 text-left">Email</th>
                                    <th className="border px-4 py-2 text-left">Role</th>
                                    <th className="border px-4 py-2 text-left">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedUsers.length > 0 ? (
                                    displayedUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-100 transition">
                                            <td className="border px-4 py-2">
                                                <Link
                                                    href={route('users.edit', { id: user.id })}
                                                    className="text-blue-500 underline"
                                                >
                                                    {user.name}
                                                </Link>
                                            </td>
                                            <td className="border px-4 py-2">{user.email}</td>
                                            <td className="border px-4 py-2">
                                                {user.roles.map((role) => role.name).join(", ")}
                                            </td>
                                            <td className="border px-4 py-2 flex gap-2">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded"
                                                >
                                                    Smazat
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="text-center text-gray-500 py-4"
                                        >
                                            Žádní uživatelé nenalezeni.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Add New User */}
                    <div className="mt-4 text-center">
                        <button
                            onClick={handleCreateUser}
                            className="px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-500 transition"
                        >
                            Přidat uživatele
                        </button>
                    </div>
                </main>
            </div>
        </>
    );
}
