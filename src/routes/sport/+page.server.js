import { getSports, createSport, deleteSport } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export async function load() { 
    return {
        sports: await getSports() 
    };
}

export const actions = {
    create: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session || session.user.role !== 'admin') {
            throw error(403, 'Zugriff verweigert.');
        }

        const data = await request.formData();
        
        // 1. Das Bild aus dem Formular holen
        const imageFile = data.get('image');
        let imageStr = '/placeholder.jpg'; // Standardbild

        // 2. Prüfen, ob wirklich ein Bild hochgeladen wurde (Größe > 0)
        if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
            // Bild in ein Buffer (Rohdaten) und dann in einen Base64-String umwandeln
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            imageStr = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
        }
        
        const newSport = {
            name: data.get('name'),
            herkunft: data.get('herkunft'),
            beschreibung: data.get('beschreibung'),
            image: imageStr // Hier wird jetzt der Base64-String oder das Placeholder-Bild gespeichert
        };

        await createSport(newSport);
        return { success: true };
    },

    delete: async ({ request, locals }) => {
        const session = await locals.auth();
        if (!session || session.user.role !== 'admin') {
            throw error(403, 'Zugriff verweigert.');
        }

        const formData = await request.formData();
        const id = formData.get('id'); 
        await deleteSport(id);

        return { deleted: true };
    }
};