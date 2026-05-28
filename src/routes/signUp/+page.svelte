<script>
  export let form;
</script>

<div class="auth-wrapper">
  <div class="auth-card">
    <div class="auth-header">
      <img src="/fittrack_logo_v2.png" alt="FitTrack Logo" class="auth-logo" />
      <h1 class="auth-title">Konto erstellen</h1>
      <p class="auth-subtitle">Werde Teil der FitTrack-Community.</p>
    </div>

    {#if form?.success}
      <div class="success-message" style="text-align: center; padding: 1rem 0;">
        <svg class="success-icon" style="width: 48px; height: 48px; color: #16a34a; margin-bottom: 1rem;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2 style="color: #166534; margin-bottom: 1rem;">Registrierung erfolgreich!</h2>
        <p style="margin-bottom: 1rem; line-height: 1.5;">
          Dein Account wurde im System angelegt. Um eine hohe Datenqualität zu gewährleisten, muss dein Profil erst von einem Account-Manager verifiziert und freigeschaltet werden.
        </p>
        <p style="margin-bottom: 2rem;">
          <strong>Wir kontaktieren dich per E-Mail</strong>, sobald du dich einloggen kannst.
        </p>
      </div>
      <a href="/" class="cta-button auth-submit" style="display: block; text-align: center; text-decoration: none;">Zurück zur Startseite</a>

    {:else}
      {#if form?.error}
        <p style="color: red; text-align: center; margin-bottom: 1rem;">{form.error}</p>
      {/if}

      <form class="auth-form" method="POST">
        <div class="input-row">
          <div class="input-group">
            <label for="firstname">Vorname</label>
            <input type="text" id="firstname" name="firstname" placeholder="Max" required />
          </div>

          <div class="input-group">
            <label for="lastname">Name</label>
            <input type="text" id="lastname" name="lastname" placeholder="Mustermann" required />
          </div>
        </div>

        <div class="input-group">
          <label for="email">E-Mail-Adresse</label>
          <input type="email" id="email" name="email" placeholder="max@beispiel.ch" required />
        </div>

        <div class="input-group">
          <label for="username">Benutzername</label>
          <input type="text" id="username" name="username" placeholder="z.B. fit_max" required />
        </div>

        <div class="input-group">
          <label for="password">Passwort</label>
          <input type="password" id="password" name="password" placeholder="Mindestens 8 Zeichen" required minlength="8" />
        </div>

        <div class="input-group">
          <label for="reason">Warum möchtest du einen Account?</label>
          <textarea id="reason" name="reason" placeholder="Erzähle uns kurz von deinen Zielen..." rows="4" required></textarea>
        </div>

        <button type="submit" class="cta-button auth-submit">Registrieren</button>
      </form>

      <div class="auth-footer">
        <p>Bereits ein Konto? <a href="/login" class="login-link">Jetzt anmelden</a></p>
      </div>
    {/if}
  </div>
</div>