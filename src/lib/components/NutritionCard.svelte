<script>
    let { item } = $props();
</script>

<div class="frame">
    <div class="nutrition-card">
        <div class="card-image-container">
            <img src={item.image} alt={item.name} class="card-image" />
        </div>

        <div class="card-title">
            <h3>{item.name}</h3>
        </div>

        <div class="energy-badge">
            <span class="emoji">🔥</span>
            <span class="kcal-value">{item.kalorien}</span>
            <span class="kcal-unit">kcal</span>
        </div>

        <div class="stats-row">
            <div class="stat-item">
                <span class="stat-label">Protein</span>
                <span class="stat-number">{item.protein}g</span>
                <div class="progress-bg">
                    <div class="progress-bar protein" style="width: {Math.min(item.protein * 3, 100)}%"></div>
                </div>
            </div>
            <div class="stat-item">
                <span class="stat-label">Carbs</span>
                <span class="stat-number">{item.kohlenhydrate}g</span>
                <div class="progress-bg">
                    <div class="progress-bar carbs" style="width: {Math.min(item.kohlenhydrate, 100)}%"></div>
                </div>
            </div>
            <div class="stat-item">
                <span class="stat-label">Fett</span>
                <span class="stat-number">{item.fett}g</span>
                <div class="progress-bg">
                    <div class="progress-bar fat" style="width: {Math.min(item.fett * 4, 100)}%"></div>
                </div>
            </div>
        </div>
    </div>
</div>