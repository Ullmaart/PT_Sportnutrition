// src/hooks.server.js
import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import clientPromise from '$lib/server/db';
import { AUTH_SECRET } from '$env/static/private';
import bcrypt from 'bcryptjs';
import { db } from "$lib/server/db";

export const { handle } = SvelteKitAuth({
    // WICHTIG: Die Zeile mit 'adapter: ...' haben wir komplett gelöscht!

    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "Benutzername", type: "text" },
                password: { label: "Passwort", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null; 
                }

                const client = await clientPromise;
                const db = client.db('pt_sport_nutrition');
                const user = await db.collection('users').findOne({ username: credentials.username });

                if (!user) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                
                if (!isValid) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.firstname, 
                    username: user.username,
                    email: user.email,
                    role: user.role
                };
            }
        })
    ],

    trustHost: true,

    callbacks: {
        // 1. Der Türsteher: Prüft VOR dem Login, ob der Nutzer rein darf
        async signIn({ user }) {
            // Die gleiche funktionierende DB-Verbindung wie bei 'authorize' aufbauen:
            const client = await clientPromise;
            const db = client.db('pt_sport_nutrition');
            
            // Nutzer in der Datenbank suchen (anhand der E-Mail)
            const existingUser = await db.collection("users").findOne({ email: user.email });

            // Prüfen, ob der Nutzer existiert und freigeschaltet ist
            if (existingUser && existingUser.isApproved === true) {
                return true; // Login erlauben, weiter zu Schritt 2
            } else {
                // Login blockieren und auf eine Info-Seite umleiten
                return "/freischaltung-ausstehend"; 
            }
        },

        // 2. Direkt nach dem erfolgreichen Login: Packe die Nutzerdaten in das Token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.role = user.role;
            }
            return token;
        },

        // 3. Bei jedem Seitenaufruf: Gib diese Daten an dein Frontend weiter
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
                session.user.role = token.role;
            }
            return session;
        }
    },

    session: {
        strategy: 'jwt'
    },

    secret: AUTH_SECRET,

    

    pages: {
        signIn: '/login'
    }
});