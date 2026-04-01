// routes/your-page/+page.js
export const load = async () => {
    // Hier könntest du auch ein fetch() zu einer API machen
    const nutritions =
        [
            { "name": "Apfel", "kalorien": 52, "kohlenhydrate": 14.0, "protein": 0.3, "fett": 0.2, "image": "/apfel.jpg" },
            { "name": "Hähnchenbrust", "kalorien": 165, "kohlenhydrate": 0.0, "protein": 31.0, "fett": 3.6, "image": "/haehnchenbrust.jpg" },
            { "name": "Lachs", "kalorien": 208, "kohlenhydrate": 0.0, "protein": 20.0, "fett": 13.0, "image": "/lachs.jpg" },
            { "name": "Haferflocken", "kalorien": 389, "kohlenhydrate": 66.0, "protein": 17.0, "fett": 7.0, "image": "/haferflocken.jpg" },
            { "name": "Banane", "kalorien": 89, "kohlenhydrate": 23.0, "protein": 1.1, "fett": 0.3, "image": "/banane.jpg" },
            { "name": "Brokkoli", "kalorien": 34, "kohlenhydrate": 7.0, "protein": 2.8, "fett": 0.4, "image": "/brokkoli.jpg" },
            { "name": "Eier", "kalorien": 155, "kohlenhydrate": 1.1, "protein": 13.0, "fett": 11.0, "image": "/eier.jpg" },
            { "name": "Avocado", "kalorien": 160, "kohlenhydrate": 9.0, "protein": 2.0, "fett": 15.0, "image": "/avocado.jpg" },
            { "name": "Reis", "kalorien": 130, "kohlenhydrate": 28.0, "protein": 2.7, "fett": 0.3, "image": "/reis.jpg" },
            { "name": "Mandeln", "kalorien": 579, "kohlenhydrate": 22.0, "protein": 21.0, "fett": 49.0, "image": "/mandeln.jpg" },
            { "name": "Magerquark", "kalorien": 68, "kohlenhydrate": 4.0, "protein": 12.0, "fett": 0.3, "image": "/magerquark.jpg" },
            { "name": "Kartoffeln", "kalorien": 77, "kohlenhydrate": 17.0, "protein": 2.0, "fett": 0.1, "image": "/kartoffeln.jpg" },
            { "name": "Rindersteak", "kalorien": 250, "kohlenhydrate": 0.0, "protein": 26.0, "fett": 15.0, "image": "/rindersteak.jpg" },
            { "name": "Griechischer Joghurt", "kalorien": 115, "kohlenhydrate": 3.0, "protein": 10.0, "fett": 5.0, "image": "/joghurt.jpg" },
            { "name": "Linsen", "kalorien": 116, "kohlenhydrate": 20.0, "protein": 9.0, "fett": 0.4, "image": "/linsen.jpg" }
        ];

    return {
        nutritions: nutritions
    };
};