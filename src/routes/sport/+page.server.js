// src/routes/sport/+page.server.js
import db from "$lib/server/db.js"; // Importiert unsere neue DB-Datei [cite: 176]

export async function load() { // [cite: 177]
    return {
        // Ruft die Funktion auf und speichert das Ergebnis in 'sports' [cite: 188]
        sports: await db.getSports() 
    };
}

export const actions = {
    create: async ({ request }) => {
        // Zieht alle eingegebenen Daten aus dem Request
        const data = await request.formData();
        
        // Baut das neue Sport-Objekt zusammen
        const newSport = {
            name: data.get('name'),
            herkunft: data.get('herkunft'),
            beschreibung: data.get('beschreibung'),
            image: data.get('image') || '/placeholder.jpg' // Fallback-Bild, falls nichts eingegeben wird
        };

        // Speichert es in der Datenbank
        await db.createSport(newSport);

        // Gibt eine Erfolgsmeldung ans Frontend zurück
        return { success: true };
    },

    delete: async ({ request }) => {
        const formData = await request.formData();
        const id = formData.get('id'); 

        // NEU: Wir rufen einfach die Funktion aus deiner db.js auf!
        await db.deleteSport(id);

        return { success: true };
    }
};
