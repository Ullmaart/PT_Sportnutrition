import { DB_URI } from '$env/static/private';
import { MongoClient, ObjectId } from 'mongodb';

if (!DB_URI) {
    throw new Error('Bitte definiere DB_URI in deiner .env Datei');
}

const options = {};
let client;
let clientPromise;

// --- VERBINDUNGSAUFBAU (Optimiert für Auth.js & Entwicklung) ---
if (process.env.NODE_ENV === 'development') {
    // Verhindert das Atlas-Limit Problem während der Entwicklung
    if (!global._mongoClientPromise) {
        client = new MongoClient(DB_URI, options);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(DB_URI, options);
    clientPromise = client.connect();
}

// Hilfsfunktion, um direkt auf die DB zuzugreifen für deine CRUD-Funktionen
async function getDb() {
    const connectedClient = await clientPromise;
    return connectedClient.db('pt_sport_nutrition');
}

// --- DEINE FUNKTIONEN (angepasst an das neue System) ---

export async function getSports() {
    try {
        const db = await getDb();
        const sports = await db.collection('sport').find({}).toArray();
        return sports.map(sport => ({ ...sport, _id: sport._id.toString() }));
    } catch (error) {
        console.error("Datenbankfehler:", error);
        return [];
    }
}

export async function getSportById(id) {
    try {
        const db = await getDb();
        const sport = await db.collection('sport').findOne({ _id: new ObjectId(id) });
        return sport ? { ...sport, _id: sport._id.toString() } : null;
    } catch (error) {
        return null;
    }
}

export async function createSport(sportData) {
    try {
        const db = await getDb();
        await db.collection('sport').insertOne(sportData);
        return true;
    } catch (error) {
        return false;
    }
}

export async function deleteSport(id) {
    const db = await getDb();
    await db.collection('sport').deleteOne({ _id: new ObjectId(id) });
}

// WICHTIG: Wir exportieren das clientPromise für Auth.js
export default clientPromise;