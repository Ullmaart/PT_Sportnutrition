<script>
  // Importiert den globalen Speicher von SvelteKit
  import { page } from "$app/stores";
  import "./style.css";
  let { children } = $props();
</script>

<pre style="background: #333; color: #0f0; padding: 10px; font-size: 12px;">
  SESSION-STATUS: {JSON.stringify($page.data.session, null, 2)}
</pre>

<nav class="navbar">
  <div class="nav-container">
    <div class="logo">
      <img src="/fittrack_logo_v2.png" alt="FitTrack Logo" class="logo-image" />
      FitTrack
    </div>

    <div class="nav-links">
      <a href="/" class="nav-link">Home</a>
      <a href="/sport" class="nav-link">Sport</a>
      <a href="/nutrition" class="nav-link">Nutrition</a>
    </div>

    <div class="nav-action">
      {#if $page.data.session}
        <div class="user-menu">
          <span class="user-greeting">Hi, {$page.data.session.user.username}!</span>
          <form method="POST" action="/auth/signout" class="inline-form">
            <button type="submit" class="logout-button">Abmelden</button>
          </form>
        </div>
      {:else}
        <a href="/login" class="cta-button login-submit">Anmelden</a>
      {/if}
    </div>

  </div>
</nav>

<main>
  {@render children()}
</main>
