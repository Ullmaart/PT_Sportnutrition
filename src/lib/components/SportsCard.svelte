<script>
    // NEU: Wir nehmen eine Funktion 'onDelete' als Prop entgegen
    let { item, isAdmin = false, onDelete } = $props();
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

            {#if isAdmin}
                <button type="button" class="delete-btn" onclick={() => onDelete(item._id, item.name)}>
                    Löschen
                </button>
            {/if}
        </div>
    </div>
</div>