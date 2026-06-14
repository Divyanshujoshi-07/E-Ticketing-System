(function () {
  const App = {
    init() {
      EStorage.ensureSeedData();
      this.toast = document.querySelector("#toast");
      this.bindTabs();
      UserModule.init();
      TicketModule.init();
      AdminModule.init();
      AdminModule.resetRouteForm();
      this.renderAll();
    },

    bindTabs() {
      document.querySelectorAll("[data-tab]").forEach((button) => {
        button.addEventListener("click", () => this.switchTab(button.dataset.tab));
      });
    },

    switchTab(tabName) {
      document.querySelectorAll("[data-tab]").forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tabName);
      });
      document.querySelectorAll("[data-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === tabName);
      });
    },

    renderAll() {
      UserModule.render();
      TicketModule.render();
      AdminModule.render();
    },

    showToast(message) {
      this.toast.textContent = message;
      this.toast.classList.add("show");
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => {
        this.toast.classList.remove("show");
      }, 2800);
    },

    formatCurrency(value) {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }).format(Number(value || 0));
    },

    formatDate(dateString) {
      if (!dateString) {
        return "";
      }
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(`${dateString}T00:00:00`));
    },

    formatDateTime(dateString) {
      if (!dateString) {
        return "";
      }
      return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }).format(new Date(dateString));
    }
  };

  window.App = App;
  document.addEventListener("DOMContentLoaded", () => App.init());
})();
