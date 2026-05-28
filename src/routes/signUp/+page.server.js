import bcrypt from 'bcryptjs';
import clientPromise from '$lib/server/db';
import { fail } from '@sveltejs/kit'; // "redirect" wird hier nicht mehr benötigt

export const actions = {
  default: async ({ request }) => {
    // Daten aus deinem Formular auslesen
    const data = await request.formData();
    const firstname = data.get('firstname');
    const lastname = data.get('lastname');
    const email = data.get('email');
    const username = data.get('username');
    const password = data.get('password');
    const reason = data.get('reason');

    const client = await clientPromise;
    const db = client.db('pt_sport_nutrition');
    const usersCollection = db.collection('users');

    // Check: Gibt es den Namen oder die E-Mail schon?
    const existingUser = await usersCollection.findOne({ 
      $or: [{ username: username }, { email: email }] 
    });

    if (existingUser) {
      return fail(400, { error: 'Benutzername oder E-Mail existiert bereits!' });
    }

    // Passwort sicher verschlüsseln
    const hashedPassword = await bcrypt.hash(password, 10);

    // In MongoDB speichern
    await usersCollection.insertOne({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      reason,
      createdAt: new Date(),
      isApproved: false // Standardmäßig auf "nicht freigeschaltet" setzen
    });

    // NEU: Statt eines Redirects geben wir dem Frontend Bescheid, dass es geklappt hat
    return { success: true };
  }
};