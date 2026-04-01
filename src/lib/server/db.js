import { MongoClient } from 'mongodb';
import { DB_URI } from '$env/static/private'; // Lädt die URL aus der .env Datei [cite: 163]
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(DB_URI); // [cite: 164]
await client.connect(); // Stellt die Verbindung her [cite: 165]

// Wähle hier den Namen deiner Datenbank
const db = client.db('pt_sport_nutrition'); // [cite: 166]

async function getSports() { // Die Funktion muss asynchron sein [cite: 167, 196]
    let sports = [];
    try {
        const collection = db.collection('sport'); // Wählt die Tabelle 'sports' [cite: 170]
        const query = {}; // Leeres Query bedeutet: "Hol mir alle Einträge" [cite: 170]
        
        // await wartet, bis die Datenbank geantwortet hat [cite: 195]
        sports = await collection.find(query).toArray(); // [cite: 172]
        
        // WICHTIG FÜR DEINE DETAILSEITE:
        // MongoDB IDs sind spezielle Objekte. SvelteKit braucht aber Strings (Text).
        // Wir wandeln die _id jedes Eintrags in einen String um [cite: 178, 179]
        sports.forEach(sport => {
            sport._id = sport._id.toString(); 
        });
    } catch (error) {
        console.error("Datenbankfehler:", error); // [cite: 182]
    }
    return sports; // [cite: 184]
}

async function getSportById(id) {
    let sport = null;
    try {
        const collection = db.collection('sport');
        
        // Wir suchen exakt den einen Eintrag mit dieser _id
        // WICHTIG: Die ID muss in ein ObjectId umgewandelt werden
        const query = { _id: new ObjectId(id) }; 
        
        sport = await collection.findOne(query);
        
        if (sport) {
            sport._id = sport._id.toString(); // Auch hier wieder zu Text machen
        }
    } catch (error) {
        console.error("Fehler beim Laden der Details:", error);
    }
    return sport;
}

async function createSport(sportData) {
    try {
        const collection = db.collection('sport');
        // insertOne fügt das neue Dokument ein und generiert automatisch eine _id
        await collection.insertOne(sportData);
        return true;
    } catch (error) {
        console.error("Fehler beim Speichern:", error);
        return false;
    }
}

async function deleteSport(id) {
    await db.collection('sport').deleteOne({ _id: new ObjectId(id) });
}

// Exportiert die Funktion, damit wir sie auf der Seite nutzen können [cite: 186]
export default { getSports, getSportById, createSport, deleteSport };