<script>
  let { children } = $props();
</script>

<nav class="navbar">
  <div class="nav-container">
    <div class="logo">
      <span class="logo-emoji">⚡</span> FitTrack
    </div>
    
    <div class="nav-links">
      <a href="/" class="nav-link">Home</a>
      <a href="/sport" class="nav-link">Sport</a>
      <a href="/nutrition" class="nav-link">Nutrition</a>
    </div>
    
    <div class="nav-action">
      <button class="cta-button">Starten</button>
    </div>
  </div>
</nav>

<main>
  {@render children()}
</main>