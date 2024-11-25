import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, animals }) {
    const userRoles = auth?.user?.roles || [];
    const [selectedAnimal, setSelectedAnimal] = useState(null); // State for selected animal

    const handleBorrowClick = (animalId) => {
        if (auth?.user?.role === 'Volunteer') {
            window.location.href = `/animals/${animalId}/schedule-volunteer`;
        } else {
            window.location.href = '/register';
        }
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gray-100">
                <header className="flex justify-between items-center p-6">
                    <Link href={route('home')} className="text-gray-700 px-4 py-2">
                        Zvířecí útulek
                    </Link>

                    <nav className="flex gap-4">
                        <Link href={route('animals.list')} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                            Zvířata
                        </Link>
                        {userRoles.includes("Volunteer") && (
                            <Link href={route('volunteer.history')} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                Historie
                            </Link>
                        )}
                        {userRoles.includes("Vet") && (
                            <>
                            <Link href={route('examination.index')} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                Vyšetření
                            </Link>
                            <Link href={route('requests.index')} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                Žádosti
                            </Link>
                            </>
                        )}
                        {userRoles.includes("CareTaker") && (
                            <>
                                <Link href="/animals/plan" className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                    Rozvrh
                                </Link>
                                <Link href={route('volunteers.approveList')} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                    Dobrovolníci
                                </Link>
                                <Link href={route('requests.index')} className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                    Žádosti
                                </Link>
                            </>
                        )}
                        {userRoles.includes("Admin") && (
                            <>
                                <Link href="/users?role=CareTaker" className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                    Pečovatelé
                                </Link>
                                <Link href="/users?role=Vet" className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                    Veterináři
                                </Link>
                                <Link href="/users?role=Volunteer" className="text-gray-700 hover:bg-gray-200 px-4 py-2 rounded transition">
                                    Dobrovolníci
                                </Link>
                            </>
                        )}
                    </nav>

                    <div>
                        {auth?.user ? (
                            <Link href={route('profile.edit')} className="font-semibold text-gray-600 hover:text-gray-900">
                                {auth.user.name}
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="font-semibold text-gray-600 hover:text-gray-900">
                                    Přihlášení
                                </Link>
                                <Link href={route('register')} className="ml-4 font-semibold text-gray-600 hover:text-gray-900">
                                    Registrace
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                <main className="max-w-7xl mx-auto p-6">
                    <h1 className="text-2xl text-center mb-6">
                        Vítejte na stránce útulku pro opuštěná zvířata
                    </h1>
                    <p className="text-center text-gray-500 mb-6">*smyšlená adresa telefon email etc*</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {animals.map((animal) => (
                            <div
                                key={animal.id}
                                className="flex bg-white shadow rounded-lg overflow-hidden hover:bg-gray-200 transition cursor-pointer"
                                onClick={() => setSelectedAnimal(animal)}
                            >
                                <img src={('storage/' + animal.photo_url) || '/placeholder.jpg'} alt={animal.name} className="w-1/3 object-cover" />
                                <div className="p-4 flex flex-col justify-between">
                                    <p className="font-semibold">Jméno: {animal.name}</p>
                                    <p>Druh: {animal.kind}</p>
                                    <p>Věk: {animal.age}</p>
                                    <p>Pohlaví: {animal.gender}</p>
                                    <p>Kastrovaný: {animal.neutered ? 'Ano' : 'Ne'}</p>
                                    <p>Popis: {animal.description || 'Není k dispozici'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <Link href={route('animals.list')} className="px-6 py-2 bg-gray-800 text-white rounded shadow hover:bg-gray-700 transition">
                            Více
                        </Link>
                    </div>
                </main>

                {/* Modal */}
                {selectedAnimal && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
                        <div
                            className="bg-white rounded-lg shadow-lg overflow-hidden p-6 relative"
                            style={{
                                width: '90%',
                                maxWidth: '900px',
                                maxHeight: '85%',
                                overflowY: 'auto',
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

                                    <img src={('storage/' + selectedAnimal.photo_url) || '/placeholder.jpg'} alt={selectedAnimal.name} className="max-w-full h-auto object-contain rounded-lg" />
                                </div>
                                <div className="md:w-1/2 p-4">
                                    <h2 className="text-3xl font-bold mb-4">{selectedAnimal.name}</h2>
                                    <p><strong>ID:</strong> {selectedAnimal.id}</p>
                                    <p><strong>Druh:</strong> {selectedAnimal.kind}</p>
                                    <p><strong>Věk:</strong> {selectedAnimal.age}</p>
                                    <p><strong>Pohlaví:</strong> {selectedAnimal.gender}</p>
                                    <p><strong>Kastrovaný:</strong> {selectedAnimal.neutered ? 'Ano' : 'Ne'}</p>
                                    <p><strong>Popis:</strong> {selectedAnimal.description || 'Není k dispozici'}</p>
                                    <button
                                        onClick={() => handleBorrowClick(selectedAnimal.id)}
                                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-500 transition"
                                    >
                                        Zapůjčit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
