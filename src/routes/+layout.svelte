<script>
  // Importiert den globalen Speicher von SvelteKit
  import { page } from "$app/stores";
  import "./style.css";
  let { children } = $props();
</script>

<nav class="navbar">
  <div class="nav-container">
    <a href="/">
      <div class="logo">
        <img
          src="/fittrack_logo_v2.png"
          alt="FitTrack Logo"
          class="logo-image"
        />
        FitTrack
      </div>
    </a>

    <div class="nav-links">
      <a href="/" class="nav-link">Home</a>
      <a href="/sport" class="nav-link">Sport</a>
      <a href="/nutrition" class="nav-link">Nutrition</a>

      {#if $page.data.session?.user?.role === "admin"}
        <a href="/admin/users" class="nav-link">Benutzerverwaltung</a>
      {/if}

      <a href="/weighttracking" class="nav-link">Tracker</a>
    </div>

    <div class="nav-action">
      {#if $page.data.session}
        <div class="user-menu">
          <span class="user-greeting"
            >Hi, {$page.data.session.user.username}!</span
          >
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

<footer class="modern-footer">
  <div class="footer-container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          <img
            src="/fittrack_logo_v2.png"
            alt="FitTrack Logo"
            class="logo-image"
            style="filter: brightness(0) invert(1);"
          />
          FitTrack
        </div>
        <p>
          Dein Körper, deine Performance. Verwalte deine Ernährung, entdecke
          neue Sportarten und verfolge dein Gewicht intelligent an einem Ort.
        </p>
      </div>

      <div class="footer-links">
        <h4>Navigation</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/sport">Sport</a></li>
          <li><a href="/nutrition">Nutrition</a></li>
          <li><a href="/weighttracking">Tracker</a></li>
        </ul>
      </div>

      <div class="footer-links">
        <h4>Rechtliches</h4>
        <ul>
          <li><a href="/rechtliches#impressum">Impressum</a></li>
          <li><a href="/rechtliches#datenschutz">Datenschutz</a></li>
          <li><a href="/rechtliches#nutzung">Nutzungsbedingungen</a></li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>
        &copy; {new Date().getFullYear()} FitTrack. Alle Rechte vorbehalten.
      </p>
    </div>
  </div>
</footer>
