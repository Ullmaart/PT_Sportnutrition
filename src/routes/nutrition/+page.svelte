<script>
    import NutritionCard from "$lib/components/NutritionCard.svelte";
    import "../style.css"; // Stelle sicher, dass der Pfad stimmt

    let { data } = $props();
</script>

<div class="page-container">
    <header class="page-header">
        <h1>Nutrition</h1>
        <p>Deine tägliche Nährwertübersicht</p>
    </header>

    <main class="nutrition-grid">
        {#each data.nutritions as food}
            <NutritionCard item={food} />
        {/each}
    </main>
</div>