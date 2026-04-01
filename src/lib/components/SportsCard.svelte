<!-- Kommentar für eine neue Version 1.0 
    Github Testing!
-->
<script>
    import { enhance } from "$app/forms";
    // Wir nehmen ein einzelnes Sport-Item entgegen
    let { item } = $props();
</script>

<div class="frame">
    <div class="sport-card">
        <div class="card-image-container">
            <img src={item.image} alt={item.name} class="card-image" />
        </div>

        <div class="card-header">
            <span class="origin-tag">{item.herkunft}</span>
        </div>

        <div class="sport-content">
            <h3>{item.name}</h3>
            <p class="description">{item.beschreibung}</p>
        </div>

        <div class="card-footer">
            <a href="/sport/{item._id}" class="action-btn">Mehr erfahren</a>

            <form
                method="POST"
                action="?/delete"
                use:enhance={({ cancel }) => {
                    // 1. Das hier passiert VOR dem Senden an den Server
                    if (
                        !confirm(`Möchtest du "${item.name}" wirklich löschen?`)
                    ) {
                        cancel();
                    }

                    // 2. Das hier passiert NACHDEM der Server geantwortet hat
                    return async ({ update }) => {
                        await update(); // <-- DAS ist die Magie! Lädt die Daten im Hintergrund neu, ohne Reload.
                    };
                }}
            >
                <input type="hidden" name="id" value={item._id} />
                <button type="submit" class="delete-btn">Löschen</button>
            </form>
        </div>
    </div>
</div>
