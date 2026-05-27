import clientPromise from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';

export const load = async (event) => {
    const session = await event.locals.auth();
    if (!session || !session.user) throw redirect(302, '/login');

    const client = await clientPromise;
    const db = client.db('pt_sport_nutrition');
    const weightCollection = db.collection('weight_entries');
    const goalCollection = db.collection('user_goals');

    const userEntries = await weightCollection.find({ userId: session.user.id }).sort({ date: -1 }).toArray();
    const formattedHistory = userEntries.map(entry => ({
        id: entry._id.toString(),
        date: entry.date,
        weight: entry.weight
    }));

    const userGoals = await goalCollection.find({ userId: session.user.id }).sort({ startDate: -1 }).toArray();
    const formattedGoals = userGoals.map(goal => ({
        id: goal._id.toString(),
        title: goal.title,
        startDate: goal.startDate,
        endDate: goal.endDate,
        targetWeight: goal.targetWeight,
        color: goal.color || "#bfdbfe" // NEU: Farbe laden (mit Fallback, falls noch keine da ist)
    }));

    return { weightHistory: formattedHistory, goals: formattedGoals };
};

export const actions = {
    create: async (event) => {
        const session = await event.locals.auth();
        if (!session || !session.user) return { success: false, error: 'Nicht autorisiert' };

        const formData = await event.request.formData();
        const date = formData.get('date');
        const weight = formData.get('weight');

        if (!date || !weight) return { success: false, error: 'Datum oder Gewicht fehlt' };

        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');
        const weightCollection = db.collection('weight_entries');

        await weightCollection.insertOne({
            userId: session.user.id,
            date: date,
            weight: parseFloat(weight),
            createdAt: new Date()
        });
        return { success: true };
    },

    delete: async (event) => {
        const session = await event.locals.auth();
        if (!session || !session.user) return { success: false, error: 'Nicht autorisiert' };

        const formData = await event.request.formData();
        const entryId = formData.get('id');

        if (!entryId) return { success: false, error: 'ID fehlt' };

        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');
        await db.collection('weight_entries').deleteOne({ _id: new ObjectId(entryId), userId: session.user.id });

        return { success: true };
    },

    update: async (event) => {
        const session = await event.locals.auth();
        if (!session || !session.user) return { success: false, error: 'Nicht autorisiert' };

        const formData = await event.request.formData();
        const entryId = formData.get('id');
        const date = formData.get('date');
        const weight = formData.get('weight');

        if (!entryId || !date || !weight) return { success: false, error: 'Daten fehlen' };

        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');
        await db.collection('weight_entries').updateOne(
            { _id: new ObjectId(entryId), userId: session.user.id },
            { $set: { date: date, weight: parseFloat(weight) } }
        );

        return { success: true };
    },

    saveGoal: async (event) => {
        const session = await event.locals.auth();
        if (!session || !session.user) return { success: false, error: 'Nicht autorisiert' };

        const formData = await event.request.formData();
        const title = formData.get('title');
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        const targetWeight = formData.get('targetWeight');
        const color = formData.get('color'); // NEU: Farbe auslesen

        if (!title || !startDate || !endDate || !targetWeight) return { success: false, error: 'Daten für das Ziel fehlen.' };
        if (startDate > endDate) return { success: false, error: 'Das Startdatum darf nicht nach dem Enddatum liegen.' };

        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');
        const goalCollection = db.collection('user_goals');

        const conflictingGoal = await goalCollection.findOne({
            userId: session.user.id,
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        });

        if (conflictingGoal) return { success: false, error: `Überschneidung! Zeitraum kollidiert mit der Phase "${conflictingGoal.title}".` };

        await goalCollection.insertOne({
            userId: session.user.id,
            title: title,
            startDate: startDate,
            endDate: endDate,
            targetWeight: parseFloat(targetWeight),
            color: color, // NEU: Farbe speichern
            createdAt: new Date()
        });

        return { success: true };
    },

    updateGoal: async (event) => {
        const session = await event.locals.auth();
        if (!session || !session.user) return { success: false, error: 'Nicht autorisiert' };

        const formData = await event.request.formData();
        const goalId = formData.get('id');
        const title = formData.get('title');
        const startDate = formData.get('startDate');
        const endDate = formData.get('endDate');
        const targetWeight = formData.get('targetWeight');
        const color = formData.get('color'); // NEU: Farbe auslesen

        if (!goalId || !title || !startDate || !endDate || !targetWeight) return { success: false, error: 'Daten fehlen.' };
        if (startDate > endDate) return { success: false, error: 'Das Startdatum darf nicht nach dem Enddatum liegen.' };

        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');
        const goalCollection = db.collection('user_goals');

        const conflictingGoal = await goalCollection.findOne({
            userId: session.user.id,
            _id: { $ne: new ObjectId(goalId) },
            startDate: { $lte: endDate },
            endDate: { $gte: startDate }
        });

        if (conflictingGoal) return { success: false, error: `Änderung abgelehnt! Kollidiert mit Phase "${conflictingGoal.title}".` };

        await goalCollection.updateOne(
            { _id: new ObjectId(goalId), userId: session.user.id },
            { $set: { title: title, startDate: startDate, endDate: endDate, targetWeight: parseFloat(targetWeight), color: color } } // NEU: Farbe updaten
        );

        return { success: true };
    },

    deleteGoal: async (event) => {
        const session = await event.locals.auth();
        if (!session || !session.user) return { success: false, error: 'Nicht autorisiert' };

        const formData = await event.request.formData();
        const goalId = formData.get('id');
        if (!goalId) return { success: false, error: 'ID fehlt.' };

        const client = await clientPromise;
        const db = client.db('pt_sport_nutrition');
        await db.collection('user_goals').deleteOne({ _id: new ObjectId(goalId), userId: session.user.id });

        return { success: true };
    }
};