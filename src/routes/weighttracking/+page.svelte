<script>
    import "../styleTracker.css";
    import { enhance } from "$app/forms";

    export let data;

    let today = new Date().toISOString().split("T")[0];

    const phaseColors = [
        "#fecaca",
        "#fed7aa",
        "#fef08a",
        "#d9f99d",
        "#bbf7d0",
        "#99f6e4",
        "#bfdbfe",
        "#c7d2fe",
        "#e9d5ff",
    ];

    let dateInput = today;
    let weightInput = 88.0;
    let isInputVisible = true;

    let goalTitle = "";
    let goalStartDate = today;
    let goalEndDate = "";
    let goalTargetWeight = 80.0;
    let goalColor = phaseColors[6];

    let editingGoalId = null;
    let editGoalTitle = "";
    let editGoalStartDate = "";
    let editGoalEndDate = "";
    let editGoalTargetWeight = 0;
    let editGoalColor = "";

    $: weightHistory = data.weightHistory || [];
    $: goals = data.goals || [];

    let filterStartDate = "";
    let filterEndDate = "";
    let filterPhaseId = "all";

    let currentPage = 1;
    const itemsPerPage = 7;

    $: filteredHistory = weightHistory.filter((entry) => {
        if (filterStartDate && entry.date < filterStartDate) return false;
        if (filterEndDate && entry.date > filterEndDate) return false;

        if (filterPhaseId !== "all") {
            const entryPhase = goals.find(
                (g) => entry.date >= g.startDate && entry.date <= g.endDate,
            );
            if (filterPhaseId === "none" && entryPhase) return false;
            if (
                filterPhaseId !== "none" &&
                (!entryPhase || entryPhase.id !== filterPhaseId)
            )
                return false;
        }
        return true;
    });

    $: {
        filteredHistory;
        currentPage = 1;
    }

    $: totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
    $: displayedHistory = filteredHistory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    let editingId = null;
    let editDate = "";
    let editWeight = 0;

    $: difference =
        weightHistory.length > 0
            ? (weightInput - weightHistory[0].weight).toFixed(2)
            : 0;

    function adjustWeight(amount) {
        weightInput = parseFloat((weightInput + amount).toFixed(2));
    }

    function toggleInput() {
        isInputVisible = !isInputVisible;
    }

    function startEdit(entry) {
        editingId = entry.id;
        editDate = entry.date;
        editWeight = entry.weight;
    }

    function cancelEdit() {
        editingId = null;
    }

    function startEditGoal(goal) {
        editingGoalId = goal.id;
        editGoalTitle = goal.title;
        editGoalStartDate = goal.startDate;
        editGoalEndDate = goal.endDate;
        editGoalTargetWeight = goal.targetWeight;
        editGoalColor = goal.color || phaseColors[6];
    }

    function cancelEditGoal() {
        editingGoalId = null;
    }
</script>

<div class="unified-tracker" class:input-hidden={!isInputVisible}>
    {#if isInputVisible}
        <form
            method="POST"
            action="?/create"
            class="input-panel"
            use:enhance={() => {
                return async ({ result, update }) => {
                    if (result.type === "success") {
                        dateInput = today;
                        update();
                    }
                };
            }}
        >
            <div class="panel-header">
                <h2 class="section-title">Gewicht erfassen</h2>
                <button
                    type="button"
                    class="btn-toggle-close"
                    onclick={toggleInput}
                    title="Eingabe ausblenden">✕</button
                >
            </div>

            <div class="input-group">
                <label class="panel-label" for="track-date">Datum der Messung</label>
                <input
                    type="date"
                    id="track-date"
                    name="date"
                    bind:value={dateInput}
                    class="date-picker"
                    required
                />
            </div>

            <div class="weight-controls">
                <button
                    type="button"
                    class="btn-grad btn-adjust"
                    onclick={() => adjustWeight(-0.1)}>MINUS</button
                >

                <div class="weight-display-group">
                    <div class="weight-input-line">
                        <input
                            type="number"
                            step="0.1"
                            class="manual-weight-input main-weight"
                            bind:value={weightInput}
                        />
                        <span class="kg-label">kg</span>
                    </div>
                </div>

                <button
                    type="button"
                    class="btn-grad btn-adjust"
                    onclick={() => adjustWeight(0.1)}>PLUS</button
                >
            </div>

            <div class="final-weight-box">
                <span class="final-weight">{weightInput.toFixed(2)} kg</span>
            </div>

            <input type="hidden" name="weight" value={weightInput} />
            <button type="submit" class="btn-grad btn-confirm">GEWICHT BESTÄTIGEN</button>
        </form>
    {:else}
        <button
            class="input-collapsed-box"
            onclick={toggleInput}
            title="Eingabe einblenden"
        >
            <span class="collapsed-icon">⚖️</span>
            <span class="collapsed-text">ERFASSEN</span>
        </button>
    {/if}

    <main class="history-panel">
        <h1 class="page-title">Mein Gewicht - Historie</h1>

        <div class="filter-bar">
            <div class="filter-group">
                <label for="filter-start">Von</label>
                <input
                    type="date"
                    id="filter-start"
                    bind:value={filterStartDate}
                    class="filter-input"
                />
            </div>

            <div class="filter-group">
                <label for="filter-end">Bis</label>
                <input
                    type="date"
                    id="filter-end"
                    bind:value={filterEndDate}
                    class="filter-input"
                />
            </div>

            <div class="filter-group">
                <label for="filter-phase">Phase</label>
                <select
                    id="filter-phase"
                    bind:value={filterPhaseId}
                    class="filter-input select-input"
                >
                    <option value="all">Alle Phasen</option>
                    <option value="none">Keine Phase</option>
                    {#each goals as goal}
                        <option value={goal.id}>{goal.title}</option>
                    {/each}
                </select>
            </div>
        </div>

        <ul class="history-list">
            {#each displayedHistory as entry, i (entry.id)}
                {@const activeGoal = goals.find(
                    (g) => entry.date >= g.startDate && entry.date <= g.endDate,
                )}

                {@const globalIndex = weightHistory.findIndex(
                    (e) => e.id === entry.id,
                )}
                {@const prevEntry = weightHistory[globalIndex + 1]}

                <li class="history-item mobile-card"
                    class:goal-active={!!activeGoal}
                    style={activeGoal
                        ? `--goal-color: ${activeGoal.color};`
                        : ""}
                >
                    {#if editingId === entry.id}
                        <form
                            method="POST"
                            action="?/update"
                            class="edit-row"
                            use:enhance={() => {
                                return async ({ result, update }) => {
                                    if (result.type === "success") {
                                        editingId = null;
                                        update();
                                    }
                                };
                            }}
                        >
                            <input type="hidden" name="id" value={entry.id} />
                            <input
                                type="date"
                                name="date"
                                bind:value={editDate}
                                class="date-picker inline-edit"
                                required
                            />
                            <div class="inline-weight-input">
                                <input
                                    type="number"
                                    step="0.01"
                                    name="weight"
                                    bind:value={editWeight}
                                    class="date-picker inline-edit text-right"
                                    required
                                />
                                <span class="unit-label">kg</span>
                            </div>
                            <div class="item-actions">
                                <button type="submit" class="btn-action btn-save" title="Speichern">✓</button>
                                <button type="button" class="btn-action btn-cancel" onclick={cancelEdit} title="Abbrechen">✕</button>
                            </div>
                        </form>
                    {:else}
                        <div class="history-row-grid">
                            <div class="history-date-block">
                                <span class="date">{new Date(entry.date).toLocaleDateString("de-CH")}</span>
                                {#if activeGoal}
                                    <span class="phase-pill">{activeGoal.title}</span>
                                {/if}
                            </div>

                            <div class="history-weight-block">
                                <span class="weight">{entry.weight.toFixed(2)} kg</span>
                            </div>

                            <div class="goal-col">
                                {#if activeGoal}
                                    {@const totalDiff = Math.abs(
                                        entry.weight - activeGoal.targetWeight,
                                    ).toFixed(2)}
                                    <span>Ziel: {activeGoal.targetWeight} kg</span>
                                    <span class="sub-info">Noch {totalDiff} kg</span>
                                {/if}
                            </div>

                            <div class="trend-col">
                                {#if activeGoal && prevEntry}
                                    {@const diffToLast = entry.weight - prevEntry.weight}
                                    {@const isBulk =
                                        activeGoal.targetWeight > prevEntry.weight}
                                    {@const isGood = isBulk
                                        ? diffToLast >= 0
                                        : diffToLast <= 0}
                                    {@const trendColor =
                                        diffToLast === 0
                                            ? "#6b7280"
                                            : isGood
                                              ? "#22c55e"
                                              : "#ef4444"}
                                    <span style="color: {trendColor};">
                                        {diffToLast > 0 ? "+" : ""}{diffToLast.toFixed(2)} kg
                                    </span>
                                {/if}
                            </div>

                            <div class="item-actions">
                                <button
                                    class="btn-action btn-edit"
                                    onclick={() => startEdit(entry)}
                                    title="Bearbeiten">✎</button
                                >
                                <form method="POST" action="?/delete" use:enhance>
                                    <input type="hidden" name="id" value={entry.id} />
                                    <button
                                        type="submit"
                                        class="btn-action btn-delete"
                                        title="Löschen">🗑</button
                                    >
                                </form>
                            </div>
                        </div>
                    {/if}
                </li>
            {/each}

            {#if filteredHistory.length === 0}
                <li class="history-item empty-state">
                    <span class="date">Keine Einträge für die gewählten Filter gefunden.</span>
                </li>
            {/if}
        </ul>

        {#if totalPages > 1}
            <div class="pagination-controls">
                <button
                    type="button"
                    class="btn-action"
                    style="width: auto; padding: 0.5rem 1rem;"
                    disabled={currentPage === 1}
                    onclick={() => currentPage--}
                >
                    ← Zurück
                </button>
                <span class="pagination-info">Seite {currentPage} von {totalPages}</span>
                <button
                    type="button"
                    class="btn-action"
                    style="width: auto; padding: 0.5rem 1rem;"
                    disabled={currentPage === totalPages}
                    onclick={() => currentPage++}
                >
                    Weiter →
                </button>
            </div>
        {/if}
    </main>
</div>

<div class="unified-tracker goals-section">
    <div class="input-panel">
        <div class="panel-header">
            <h2 class="section-title">Neue Phase definieren</h2>
        </div>

        <form
            method="POST"
            action="?/saveGoal"
            use:enhance={() => {
                return async ({ result, update }) => {
                    if (result.type === "success" && result.data) {
                        if (result.data.error) {
                            alert(result.data.error);
                        } else {
                            goalTitle = "";
                            goalEndDate = "";
                            update();
                        }
                    }
                };
            }}
        >
            <div class="input-group">
                <label class="panel-label" for="phase-title">Titel der Phase</label>
                <input
                    type="text"
                    id="phase-title"
                    name="title"
                    bind:value={goalTitle}
                    class="date-picker"
                    placeholder="Bulk, Cut, Wettkampf..."
                    required
                />
            </div>

            <div class="input-group">
                <label class="panel-label" for="phase-start">Startdatum</label>
                <input
                    type="date"
                    id="phase-start"
                    name="startDate"
                    bind:value={goalStartDate}
                    class="date-picker"
                    required
                />
            </div>

            <div class="input-group">
                <label class="panel-label" for="phase-end">Enddatum</label>
                <input
                    type="date"
                    id="phase-end"
                    name="endDate"
                    bind:value={goalEndDate}
                    class="date-picker"
                    required
                />
            </div>

            <div class="input-group">
                <label class="panel-label" for="phase-weight">Zielgewicht (kg)</label>
                <input
                    type="number"
                    id="phase-weight"
                    step="0.1"
                    name="targetWeight"
                    bind:value={goalTargetWeight}
                    class="date-picker"
                    required
                />
            </div>

            <div class="input-group">
                <div class="panel-label" style="display:block; margin-bottom:0.3rem;">
                    Farbe wählen
                </div>
                <div class="color-picker-container">
                    {#each phaseColors as color}
                        <button
                            type="button"
                            class="color-dot"
                            aria-label="Farbe auswählen"
                            class:selected={goalColor === color}
                            style="background-color: {color};"
                            onclick={() => (goalColor = color)}
                        ></button>
                    {/each}
                </div>
                <input type="hidden" name="color" value={goalColor} />
            </div>

            <button type="submit" class="btn-grad btn-confirm" style="margin-top: 1rem;">
                PHASE SPEICHERN
            </button>
        </form>
    </div>

    <main class="history-panel">
        <h1 class="page-title">Meine Ziel-Phasen</h1>

        <ul class="history-list">
            {#each goals as goal (goal.id)}
                <li
                    class="history-item mobile-card goal-card"
                    style={goal.color ? `--goal-color: ${goal.color};` : ""}
                >
                    {#if editingGoalId === goal.id}
                        <form
                            method="POST"
                            action="?/updateGoal"
                            class="edit-goal-form"
                            use:enhance={() => {
                                return async ({ result, update }) => {
                                    if (result.type === "success" && result.data) {
                                        if (result.data.error) {
                                            alert(result.data.error);
                                        } else {
                                            editingGoalId = null;
                                            update();
                                        }
                                    }
                                };
                            }}
                        >
                            <input type="hidden" name="id" value={goal.id} />
                            <input
                                type="text"
                                name="title"
                                bind:value={editGoalTitle}
                                class="date-picker inline-edit"
                                required
                            />
                            <input
                                type="date"
                                name="startDate"
                                bind:value={editGoalStartDate}
                                class="date-picker inline-edit"
                                required
                            />
                            <input
                                type="date"
                                name="endDate"
                                bind:value={editGoalEndDate}
                                class="date-picker inline-edit"
                                required
                            />
                            <div class="inline-weight-input">
                                <input
                                    type="number"
                                    step="0.1"
                                    name="targetWeight"
                                    bind:value={editGoalTargetWeight}
                                    class="date-picker inline-edit text-right"
                                    required
                                />
                                <span class="unit-label">kg</span>
                            </div>

                            <div class="color-picker-container">
                                {#each phaseColors as color}
                                    <button
                                        type="button"
                                        class="color-dot"
                                        aria-label="Farbe auswählen"
                                        class:selected={editGoalColor === color}
                                        style="background-color: {color};"
                                        onclick={() => (editGoalColor = color)}
                                    ></button>
                                {/each}
                            </div>

                            <input type="hidden" name="color" value={editGoalColor} />

                            <div class="item-actions">
                                <button type="submit" class="btn-action btn-save" title="Speichern">✓</button>
                                <button
                                    type="button"
                                    class="btn-action btn-cancel"
                                    onclick={cancelEditGoal}
                                    title="Abbrechen">✕</button
                                >
                            </div>
                        </form>
                    {:else}
                        <div class="goal-card-inner">
                            <div class="goal-head">
                                <div class="goal-title-block">
                                    <span class="weight goal-title">{goal.title}</span>
                                    <span class="date goal-range">
                                        {new Date(goal.startDate).toLocaleDateString("de-CH")} bis {new Date(goal.endDate).toLocaleDateString("de-CH")}
                                    </span>
                                </div>

                                <div class="goal-meta">
                                    <span class="weight goal-target">{goal.targetWeight.toFixed(1)} kg</span>
                                    <div class="item-actions">
                                        <button
                                            class="btn-action btn-edit"
                                            onclick={() => startEditGoal(goal)}
                                            title="Bearbeiten">✎</button
                                        >
                                        <form method="POST" action="?/deleteGoal" use:enhance>
                                            <input type="hidden" name="id" value={goal.id} />
                                            <button
                                                type="submit"
                                                class="btn-action btn-delete"
                                                title="Löschen">🗑</button
                                            >
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </li>
            {/each}

            {#if goals.length === 0}
                <li class="history-item empty-state">
                    <span class="date">Du hast noch keine Phasen definiert.</span>
                </li>
            {/if}
        </ul>
    </main>
</div>