<script>
    import "../../style.css"; // Stelle sicher, dass der Pfad zu deiner CSS stimmt
    
    // Hier kommen die Daten aus der +page.server.js an
    let { data } = $props();
</script>

<div class="page-container">
    <a href="/sport" class="back-link">← Zurück zur Übersicht</a>

    <div class="detail-view">
        <div class="detail-image-container">
            <img src={data.sport.image} alt={data.sport.name} class="detail-image" />
            <span class="detail-origin">{data.sport.herkunft}</span>
        </div>

        <div class="detail-content">
            <h1>{data.sport.name}</h1>
            <p class="detail-description">{data.sport.beschreibung}</p>
        </div>
    </div>
</div>

<style>
    /* Spezifisches Styling nur für die Detailseite */
    .back-link {
        display: inline-block;
        margin-bottom: 20px;
        color: #4f46e5;
        text-decoration: none;
        font-weight: 600;
    }
    
    .back-link:hover {
        text-decoration: underline;
    }

    .detail-view {
        background: white;
        border-radius: 24px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        max-width: 800px;
        margin: 0 auto;
    }

    .detail-image-container {
        position: relative;
        width: 100%;
        height: 400px; /* Schön großes Bild für die Detailseite */
    }

    .detail-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .detail-origin {
        position: absolute;
        bottom: 20px;
        left: 20px;
        background: rgba(255,255,255,0.9);
        padding: 8px 16px;
        border-radius: 12px;
        font-weight: bold;
        color: #0f172a;
    }

    .detail-content {
        padding: 40px;
    }

    .detail-content h1 {
        font-size: 2.5rem;
        margin: 0 0 20px 0;
        color: #0f172a;
    }

    .detail-description {
        font-size: 1.1rem;
        line-height: 1.8;
        color: #475569;
    }
</style>