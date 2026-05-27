import clientPromise from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const load = async ({ locals }) => {
    const session = await locals.auth();
    
    if (!session || !session.user) {
        throw redirect(302, '/');
    }

    const client = await clientPromise;
    const db = client.db('pt_sport_nutrition');
    
    const currentUser = await db.collection('users').findOne({ email: session.user.email });

    if (!currentUser || currentUser.role !== 'admin') {
        throw redirect(302, '/');
    }

    // Lade ALLE Nutzer, AUSSER den aktuell eingeloggten Admin (Selbstschutz vor Löschung)
    const allUsers = await db.collection('users')
        .find({ _id: { $ne: currentUser._id } })
        .sort({ createdAt: -1 }) // Neueste Nutzer zuerst
        .toArray();

    return {
        users: JSON.parse(JSON.stringify(allUsers))
    };
};

export const actions = {
    approve: async ({ request }) => {
        const data = await request.formData();
        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');

        await db.collection('users').updateOne(
            { _id: new ObjectId(data.get('id')) },
            { $set: { isApproved: true } }
        );
        return { success: true };
    },

    suspend: async ({ request }) => {
        const data = await request.formData();
        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');

        // Setzt den Status wieder auf false (gesperrt)
        await db.collection('users').updateOne(
            { _id: new ObjectId(data.get('id')) },
            { $set: { isApproved: false } }
        );
        return { success: true };
    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');

        // Löscht den Nutzer komplett aus der Datenbank
        await db.collection('users').deleteOne(
            { _id: new ObjectId(data.get('id')) }
        );
        return { success: true };
    }
};