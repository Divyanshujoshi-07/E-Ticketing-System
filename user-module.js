(function () {
  const UserModule = {
    init() {
      this.registerForm = document.querySelector("#register-form");
      this.loginForm = document.querySelector("#login-form");
      this.profileForm = document.querySelector("#profile-form");
      this.logoutButton = document.querySelector("#logout-button");

      this.registerForm.addEventListener("submit", (event) => this.handleRegister(event));
      this.loginForm.addEventListener("submit", (event) => this.handleLogin(event));
      this.profileForm.addEventListener("submit", (event) => this.handleProfileSave(event));
      this.logoutButton.addEventListener("click", () => this.logout());
    },

    handleRegister(event) {
      event.preventDefault();
      try {
        const user = EStorage.registerUser({
          name: document.querySelector("#register-name").value,
          email: document.querySelector("#register-email").value,
          password: document.querySelector("#register-password").value
        });
        this.registerForm.reset();
        App.showToast(`Welcome, ${user.name}. Account created.`);
        App.renderAll();
        App.switchTab("tickets");
      } catch (error) {
        App.showToast(error.message);
      }
    },

    handleLogin(event) {
      event.preventDefault();
      try {
        const user = EStorage.loginUser(
          document.querySelector("#login-email").value,
          document.querySelector("#login-password").value
        );
        this.loginForm.reset();
        App.showToast(`Logged in as ${user.name}.`);
        App.renderAll();
        App.switchTab("tickets");
      } catch (error) {
        App.showToast(error.message);
      }
    },

    handleProfileSave(event) {
      event.preventDefault();
      try {
        const user = EStorage.updateProfile({
          name: document.querySelector("#profile-name").value,
          phone: document.querySelector("#profile-phone").value,
          city: document.querySelector("#profile-city").value
        });
        App.showToast(`Profile updated for ${user.name}.`);
        App.renderAll();
      } catch (error) {
        App.showToast(error.message);
      }
    },

    logout() {
      EStorage.setCurrentUser(null);
      App.showToast("Logged out.");
      App.renderAll();
      App.switchTab("user");
    },

    render() {
      const user = EStorage.getCurrentUser();
      const currentUserPill = document.querySelector("#current-user-pill");
      const authState = document.querySelector("#auth-state");
      const profileBadge = document.querySelector("#profile-badge");
      const profileFields = [
        document.querySelector("#profile-name"),
        document.querySelector("#profile-phone"),
        document.querySelector("#profile-city")
      ];
      const profileEmail = document.querySelector("#profile-email");
      const saveButton = document.querySelector("#profile-save");

      if (user) {
        currentUserPill.textContent = user.name;
        currentUserPill.classList.add("signed-in");
        authState.textContent = "Signed in";
        authState.className = "module-state ready";
        profileBadge.textContent = "Active profile";
        this.logoutButton.classList.remove("hidden");
        document.querySelector("#profile-name").value = user.name || "";
        document.querySelector("#profile-phone").value = user.phone || "";
        document.querySelector("#profile-city").value = user.city || "";
        profileEmail.value = user.email || "";
        profileFields.forEach((field) => field.disabled = false);
        saveButton.disabled = false;
      } else {
        currentUserPill.textContent = "Guest";
        currentUserPill.classList.remove("signed-in");
        authState.textContent = "Not signed in";
        authState.className = "module-state";
        profileBadge.textContent = "Guest profile";
        this.logoutButton.classList.add("hidden");
        this.profileForm.reset();
        profileEmail.value = "";
        profileFields.forEach((field) => field.disabled = true);
        saveButton.disabled = true;
      }
    }
  };

  window.UserModule = UserModule;
})();
