<script>
    import { page } from "$app/stores";
    import SportCard from "$lib/components/SportsCard.svelte";
    import { enhance } from "$app/forms";
    import "../style.css"; 

    let { data, form } = $props();
    let isAdmin = $derived($page.data.session?.user?.role === 'admin');

    // Referenzen für unsere VIER Modals
    let addDialog;
    let deleteDialog;
    let successDialog;
    let deleteSuccessDialog; // NEU

    // Reagieren auf Änderungen für das Löschen-PopUp
    let deleteId = $state("");
    let deleteName = $state("");

    // 1. Funktionen: Hinzufügen
    function openAddModal() { addDialog.showModal(); }
    function closeAddModal() { addDialog.close(); }

    // 2. Funktionen: Löschen bestätigen
    function openDeleteModal(id, name) {
        deleteId = id;
        deleteName = name;
        deleteDialog.showModal();
    }
    function closeDeleteModal() { deleteDialog.close(); }

    // 3. Funktionen: Erfolgsmeldung (Hinzugefügt)
    function openSuccessModal() { successDialog.showModal(); }
    function closeSuccessModal() { successDialog.close(); }

    // 4. Funktionen: Erfolgsmeldung (Gelöscht) - NEU
    function openDeleteSuccessModal() { deleteSuccessDialog.showModal(); }
    function closeDeleteSuccessModal() { deleteSuccessDialog.close(); }
</script>

<div class="page-container sport-theme">
    <header class="page-header">
        <h1 class="gradient-text">Entdecke Sportarten</h1>
        <p>Finde deine nächste Leidenschaft aus {data.sports.length} Disziplinen</p>
        
        {#if isAdmin}
            <button class="add-btn" onclick={openAddModal}>+ Neue Sportart hinzufügen</button>
        {/if}
    </header>

    {#if isAdmin}
        <dialog bind:this={addDialog} class="modal">
            <div class="modal-content">
                <h2 class="gradient-text" style="margin-top: 0; text-align: center;">Neue Sportart</h2>
                
                <form method="POST" action="?/create" enctype="multipart/form-data" class="add-form" 
                    use:enhance={() => {
                        return async ({ update, result }) => {
                            if (result.type === 'success') {
                                closeAddModal(); 
                                openSuccessModal(); 
                            }
                            await update();
                        };
                    }}>
                    
                    <div class="input-group">
                        <label for="name">Name der Sportart</label>
                        <input type="text" id="name" name="name" required />
                    </div>

                    <div class="input-group">
                        <label for="herkunft">Herkunft</label>
                        <input type="text" id="herkunft" name="herkunft" required />
                    </div>

                    <div class="input-group">
                        <label for="image">Titelbild hochladen</label>
                        <input type="file" id="image" name="image" accept="image/png, image/jpeg, image/webp" style="padding: 5px;" />
                        <span style="font-size: 0.75rem; color: #64748b;">(Optional. JPG, PNG oder WEBP)</span>
                    </div>

                    <div class="input-group">
                        <label for="beschreibung">Beschreibung</label>
                        <textarea id="beschreibung" name="beschreibung" rows="3" required></textarea>
                    </div>

                    <div class="modal-actions" style="display: flex; justify-content: center; margin-top: 20px;">
                        <button type="button" class="cancel-btn" onclick={closeAddModal}>Abbrechen</button>
                        <button type="submit" class="save-btn" style="background-color: #10b981;">Speichern</button>
                    </div>
                </form>
            </div>
        </dialog>

        <dialog bind:this={deleteDialog} class="modal">
            <div class="modal-content" style="text-align: center;">
                <h2 class="gradient-text" style="margin-top: 0; margin-bottom: 15px;">Bitte bestätigen</h2>
                <p style="margin-bottom: 25px; color: #64748b; font-size: 1.05rem; line-height: 1.5;">
                    Möchtest du <strong>{deleteName}</strong> wirklich unwiderruflich löschen?
                </p>

                <form method="POST" action="?/delete" use:enhance={() => {
                    closeDeleteModal(); // Schließt die Sicherheitsfrage sofort
                    return async ({ update, result }) => { 
                        if (result.type === 'success') {
                            openDeleteSuccessModal(); // Öffnet die Erfolgsmeldung
                        }
                        await update(); 
                    };
                }}>
                    <input type="hidden" name="id" value={deleteId} />
                    <div class="modal-actions" style="display: flex; justify-content: center; gap: 15px;">
                        <button type="button" class="cancel-btn" onclick={closeDeleteModal}>Abbrechen</button>
                        <button type="submit" class="save-btn" style="background-color: #ef4444;">Ja, löschen!</button>
                    </div>
                </form>
            </div>
        </dialog>

        <dialog bind:this={successDialog} class="modal">
            <div class="modal-content" style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">✅</div>
                <h2 style="margin-top: 0; color: #0f172a;">Erfolgreich!</h2>
                <p style="color: #64748b; margin-bottom: 25px;">Die Sportart wurde erfolgreich gespeichert.</p>
                <button type="button" class="save-btn" style="background-color: #10b981; width: 100%;" onclick={closeSuccessModal}>
                    Schliessen
                </button>
            </div>
        </dialog>

        <dialog bind:this={deleteSuccessDialog} class="modal">
            <div class="modal-content" style="text-align: center; padding: 40px 20px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">🗑️</div>
                <h2 style="margin-top: 0; color: #0f172a;">Gelöscht!</h2>
                <p style="color: #64748b; margin-bottom: 25px;">Die Sportart wurde erfolgreich und unwiderruflich entfernt.</p>
                <button type="button" class="save-btn" style="background-color: #ef4444; width: 100%;" onclick={closeDeleteSuccessModal}>
                    Schließen
                </button>
            </div>
        </dialog>
    {/if}

    <main class="nutrition-grid">
        {#each data.sports as sport}
            <SportCard item={sport} {isAdmin} onDelete={openDeleteModal} />
        {/each}
    </main>
</div>