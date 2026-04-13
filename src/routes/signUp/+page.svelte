<div class="auth-wrapper">
  <div class="auth-card">
    <div class="auth-header">
      <img src="/fittrack_logo_v2.png" alt="FitTrack Logo" class="auth-logo" />
      <h1 class="auth-title">Konto erstellen</h1>
      <p class="auth-subtitle">Werde Teil der FitTrack-Community.</p>
    </div>

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
  </div>
</div>