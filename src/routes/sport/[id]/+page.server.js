import {getSportById} from "$lib/server/db.js";
import { error } from '@sveltejs/kit';

// params enthält die Werte aus der URL (z.B. params.id)
export async function load({ params }) {
    // Rufe unsere neue Datenbank-Funktion auf
    const sportDetail = await getSportById(params.id);

    // Wenn die ID in der Datenbank nicht existiert, werfen wir einen 404 Fehler
    if (!sportDetail) {
        error(404, 'Sportart nicht gefunden');
    }

    // Gib die Daten an die Svelte-Seite weiter
    return {
        sport: sportDetail
    };
}