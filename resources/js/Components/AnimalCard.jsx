import React from 'react';

export default function AnimalCard({ name, species, age, weight, gender, neutered, description, image }) {
    return (
        <div className="max-w-xs rounded overflow-hidden shadow-lg m-4 bg-white">
            <img className="w-full" src={image} alt={`${name}`} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Jméno: {name}</div>
                <ul className="text-gray-700 text-base">
                    <li>Druh: {species}</li>
                    <li>Věk: {age}</li>
                    <li>Váha: {weight}</li>
                    <li>Pohlaví: {gender}</li>
                    <li>Kastrát: {neutered ? 'ano' : 'ne'}</li>
                    <li>Popis: {description || 'Není k dispozici'}</li>
                </ul>
            </div>
        </div>
    );
}
