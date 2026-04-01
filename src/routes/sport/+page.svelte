<script>
    import SportCard from "$lib/components/SportsCard.svelte";
    import "../style.css"; 

    // 'form' enthält die Rückgabe unserer Action (z.B. success: true)
    let { data, form } = $props();

    // Variable für unser Pop-up
    let dialogElement;

    function openModal() {
        dialogElement.showModal();
    }

    function closeModal() {
        dialogElement.close();
    }
</script>

<div class="page-container sport-theme">
    <header class="page-header">
        <h1>Entdecke Sportarten</h1>
        <p>Finde deine nächste Leidenschaft aus {data.sports.length} Disziplinen</p>
        
        <button class="add-btn" onclick={openModal}>+ Neue Sportart hinzufügen</button>
        
        {#if form?.success}
            <div class="success-message">Erfolgreich hinzugefügt!</div>
        {/if}
    </header>

    <dialog bind:this={dialogElement} class="modal">
        <div class="modal-content">
            <h2>Neue Sportart</h2>
            
            <form method="POST" action="?/create" class="add-form">
                
                <div class="input-group">
                    <label for="name">Name der Sportart</label>
                    <input type="text" id="name" name="name" required />
                </div>

                <div class="input-group">
                    <label for="herkunft">Herkunft</label>
                    <input type="text" id="herkunft" name="herkunft" required />
                </div>

                <div class="input-group">
                    <label for="image">Bild-Pfad (z.B. /yoga.jpg)</label>
                    <input type="text" id="image" name="image" value="/placeholder.jpg" disabled />
                </div>

                <div class="input-group">
                    <label for="beschreibung">Beschreibung</label>
                    <textarea id="beschreibung" name="beschreibung" rows="3" required></textarea>
                </div>

                <div class="modal-actions">
                    <button type="button" class="cancel-btn" onclick={closeModal}>Abbrechen</button>
                    <button type="submit" class="save-btn" onclick={closeModal}>Speichern</button>
                </div>
            </form>
        </div>
    </dialog>

    <main class="nutrition-grid">
        {#each data.sports as sport}
            <SportCard item={sport} />
        {/each}
    </main>
</div>