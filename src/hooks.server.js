// src/hooks.server.js
import { SvelteKitAuth } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import clientPromise from '$lib/server/db';
import { AUTH_SECRET } from '$env/static/private';
import bcrypt from 'bcryptjs';

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

                console.log("--- LOGIN ERFOLGREICH ---");
                return {
                    id: user._id.toString(),
                    name: user.firstname, 
                    username: user.username,
                    email: user.email
                };
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            // 1. Direkt nach dem Login: Packe die Nutzerdaten in das Token
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            // 2. Bei jedem Seitenaufruf: Gib diese Daten an dein Frontend weiter
            if (token && session.user) {
                session.user.id = token.id;
                session.user.username = token.username;
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