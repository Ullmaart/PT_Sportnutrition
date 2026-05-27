<script>
    import '../../benutzerverwaltung.css';
    import { enhance } from '$app/forms';
    
    export let data;

    let confirmDialog; 
    let modalMessage = "";
    let modalActionUrl = "";
    let modalUserId = "";
    let modalActionType = "default"; // Steuert die Farbe des PopUp-Buttons

    // Öffnet das PopUp und merkt sich, welche Aktion (Farbe) gefragt ist
    function openModal(message, actionUrl, userId, actionType = "default") {
        modalMessage = message;
        modalActionUrl = actionUrl;
        modalUserId = userId;
        modalActionType = actionType;
        confirmDialog.showModal();
    }

    function closeModal() {
        confirmDialog.close();
    }
</script>

<svelte:head>
    <title>Benutzerverwaltung | PT Sport Nutrition</title>
</svelte:head>

<div class="admin-container">
    <div class="header-section">
        <h1 class="gradient-text">Benutzerverwaltung</h1>
        <p class="subtitle">Verwalte hier alle registrierten Nutzer deiner App.</p>
    </div>

    {#if data.users.length === 0}
        <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <h2>Keine Nutzer vorhanden</h2>
            <p>Es haben sich noch keine weiteren Benutzer registriert.</p>
        </div>
    {:else}
        <div class="table-wrapper">
            <table class="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Benutzername</th>
                        <th>Status</th>
                        <th class="action-column">Aktion</th>
                    </tr>
                </thead>
                <tbody>
                    {#each data.users as user}
                        <tr>
                            <td data-label="Name">
                                <strong>{user.firstname || 'Kein Name'}</strong>
                                <br/>
                                <span style="font-size: 0.8rem; color: #666;">{user.email}</span>
                            </td>
                            <td data-label="Benutzername">@{user.username}</td>
                            
                            <td data-label="Status">
                                <span class="status-badge {user.isApproved ? 'approved' : 'pending'}">
                                    {user.isApproved ? 'Freigeschaltet' : 'Gesperrt'}
                                </span>
                            </td>
                            
                            <td data-label="Aktion" class="action-column">
                                <div class="action-buttons">
                                    {#if user.isApproved}
                                        <button type="button" class="btn-suspend" on:click={() => openModal(`Möchtest du den Benutzer @${user.username} wirklich sperren?`, '?/suspend', user._id, 'suspend')}>
                                            Sperren
                                        </button>
                                    {:else}
                                        <button type="button" class="btn-approve" on:click={() => openModal(`Möchtest du den Benutzer @${user.username} freischalten?`, '?/approve', user._id, 'approve')}>
                                            Freigeben
                                        </button>
                                    {/if}

                                    <button type="button" class="btn-delete" title="Benutzer löschen" on:click={() => openModal(`ACHTUNG: Möchtest du den Benutzer @${user.username} UNWIDERRUFLICH löschen?`, '?/delete', user._id, 'delete')}>
                                        🗑
                                    </button>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<dialog bind:this={confirmDialog} class="modal">
    <div class="modal-content">
        <h2 class="gradient-text" style="margin-top: 0; margin-bottom: 15px; text-align: center;">Bitte bestätigen</h2>
        
        <p style="text-align: center; margin-bottom: 25px; color: #64748b; font-size: 1.05rem; line-height: 1.5;">
            {modalMessage}
        </p>

        <form method="POST" action={modalActionUrl} use:enhance={() => {
            closeModal();
            return async ({ update }) => {
                await update(); 
            };
        }}>
            <input type="hidden" name="id" value={modalUserId} />
            
            <div class="modal-actions" style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                <button type="button" class="cancel-btn" on:click={closeModal}>Abbrechen</button>
                
                <button type="submit" class="save-btn 
                    {modalActionType === 'delete' ? 'btn-danger' : 
                     modalActionType === 'suspend' ? 'btn-warning' : 
                     modalActionType === 'approve' ? 'btn-success' : ''}">
                    Ja, ausführen!
                </button>
            </div>
        </form>
    </div>
</dialog>