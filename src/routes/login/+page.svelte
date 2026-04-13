<div class="login-wrapper">
  <div class="login-card">
    <div class="login-header">
      <img src="/fittrack_logo_v2.png" alt="FitTrack Logo" class="login-logo" />
      <h1 class="login-title">Willkommen zurück</h1>
      <p class="login-subtitle">Melde dich an, um dein Training zu tracken.</p>
    </div>

    <form class="login-form" method="POST" action="/auth/callback/credentials" data-sveltekit-reload>
      <div class="input-group">
        <label for="username">Benutzername</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          placeholder="Dein Benutzername" 
          required 
        />
      </div>

      <div class="input-group">
        <label for="password">Passwort</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          placeholder="••••••••" 
          required 
        />
      </div>

      <button type="submit" class="cta-button login-submit">Anmelden</button>
    </form>

    <div class="login-footer">
      <a href="/reset-password" class="forgot-password">Passwort vergessen?</a>
      <p>Noch kein Konto? <a href="/signUp" class="register-link">Jetzt registrieren</a></p>
    </div>
  </div>
</div>