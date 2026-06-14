(function () {
  const AdminModule = {
    unlocked: false,

    init() {
      this.loginForm = document.querySelector("#admin-login-form");
      this.workspace = document.querySelector("#admin-workspace");
      this.routeForm = document.querySelector("#route-form");
      this.routeTable = document.querySelector("#admin-route-table");
      this.bookingsList = document.querySelector("#admin-bookings");

      this.loginForm.addEventListener("submit", (event) => this.unlock(event));
      this.routeForm.addEventListener("submit", (event) => this.saveRoute(event));
      document.querySelector("#route-form-reset").addEventListener("click", () => this.resetRouteForm());
      document.querySelector("#reset-demo-data").addEventListener("click", () => this.resetDemoData());
    },

    unlock(event) {
      event.preventDefault();
      const code = document.querySelector("#admin-code").value;
      if (code !== "admin123") {
        App.showToast("Invalid admin code.");
        return;
      }
      this.unlocked = true;
      this.loginForm.reset();
      App.showToast("Admin module unlocked.");
      this.render();
    },

    saveRoute(event) {
      event.preventDefault();
      const route = {
        id: document.querySelector("#route-id").value,
        type: document.querySelector("#route-type").value,
        name: document.querySelector("#route-name").value,
        origin: document.querySelector("#route-origin").value,
        destination: document.querySelector("#route-destination").value,
        date: document.querySelector("#route-date").value,
        time: document.querySelector("#route-time").value,
        price: document.querySelector("#route-price").value,
        totalSeats: document.querySelector("#route-seats").value,
        status: document.querySelector("#route-status").value
      };

      if (Number(route.price) <= 0 || Number(route.totalSeats) <= 0) {
        App.showToast("Price and seats must be greater than zero.");
        return;
      }

      const existingBookedSeats = route.id ? EStorage.getBookedSeats(route.id).length : 0;
      if (route.id && Number(route.totalSeats) < existingBookedSeats) {
        App.showToast(`Total seats cannot be lower than ${existingBookedSeats} booked seats.`);
        return;
      }

      EStorage.upsertRoute(route);
      App.showToast(route.id ? "Route/event updated." : "Route/event added.");
      this.resetRouteForm();
      App.renderAll();
    },

    editRoute(routeId) {
      const route = EStorage.getRoutes().find((item) => item.id === routeId);
      if (!route) {
        return;
      }
      document.querySelector("#route-form-title").textContent = "Update Routes";
      document.querySelector("#route-id").value = route.id;
      document.querySelector("#route-type").value = route.type;
      document.querySelector("#route-name").value = route.name;
      document.querySelector("#route-origin").value = route.origin;
      document.querySelector("#route-destination").value = route.destination;
      document.querySelector("#route-date").value = route.date;
      document.querySelector("#route-time").value = route.time;
      document.querySelector("#route-price").value = route.price;
      document.querySelector("#route-seats").value = route.totalSeats;
      document.querySelector("#route-status").value = route.status;
      document.querySelector("#route-name").focus();
    },

    deleteRoute(routeId) {
      const activeSeats = EStorage.getBookedSeats(routeId).length;
      if (activeSeats > 0) {
        App.showToast("Cannot delete a route/event with active bookings.");
        return;
      }
      const confirmed = window.confirm("Delete this route/event?");
      if (!confirmed) {
        return;
      }
      EStorage.deleteRoute(routeId);
      App.showToast("Route/event deleted.");
      if (TicketModule.selectedRouteId === routeId) {
        TicketModule.selectedRouteId = null;
        TicketModule.selectedSeats.clear();
      }
      App.renderAll();
    },

    resetRouteForm() {
      this.routeForm.reset();
      document.querySelector("#route-form-title").textContent = "Add Routes/Events";
      document.querySelector("#route-id").value = "";
      const today = new Date().toISOString().slice(0, 10);
      document.querySelector("#route-date").value = today;
      document.querySelector("#route-time").value = "09:00";
      document.querySelector("#route-status").value = "Active";
    },

    resetDemoData() {
      const confirmed = window.confirm("Restore sample routes and clear bookings?");
      if (!confirmed) {
        return;
      }
      EStorage.resetSampleData();
      TicketModule.selectedRouteId = null;
      TicketModule.selectedSeats.clear();
      this.resetRouteForm();
      App.showToast("Sample data restored.");
      App.renderAll();
    },

    render() {
      const adminState = document.querySelector("#admin-state");
      if (!this.unlocked) {
        this.workspace.classList.add("hidden");
        this.loginForm.classList.remove("hidden");
        adminState.textContent = "Locked";
        adminState.className = "module-state warning";
        return;
      }

      this.workspace.classList.remove("hidden");
      this.loginForm.classList.add("hidden");
      adminState.textContent = "Unlocked";
      adminState.className = "module-state ready";
      this.renderStats();
      this.renderRoutes();
      this.renderBookings();
    },

    renderStats() {
      const routes = EStorage.getRoutes();
      const bookings = EStorage.getBookings();
      const activeBookings = bookings.filter((booking) => booking.status === "Booked");
      const bookedSeats = activeBookings.reduce((total, booking) => total + booking.seats.length, 0);
      const revenue = activeBookings.reduce((total, booking) => total + Number(booking.amount || 0), 0);

      document.querySelector("#admin-stat-routes").textContent = routes.length;
      document.querySelector("#admin-stat-seats").textContent = bookedSeats;
      document.querySelector("#admin-stat-bookings").textContent = bookings.length;
      document.querySelector("#admin-stat-revenue").textContent = App.formatCurrency(revenue);
    },

    renderRoutes() {
      const routes = EStorage.getRoutes().sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
      if (!routes.length) {
        this.routeTable.innerHTML = '<tr><td colspan="9">No routes or events added.</td></tr>';
        return;
      }

      this.routeTable.innerHTML = routes.map((route) => {
        const available = EStorage.getAvailableSeatCount(route.id, route.totalSeats);
        return `
          <tr>
            <td>${route.name}</td>
            <td>${route.type}</td>
            <td>${route.origin}</td>
            <td>${route.destination}</td>
            <td>${App.formatDate(route.date)} ${route.time}</td>
            <td>${available}/${route.totalSeats}</td>
            <td>${App.formatCurrency(route.price)}</td>
            <td>${route.status}</td>
            <td>
              <div class="route-actions">
                <button class="ghost-button small-button" type="button" data-edit-route="${route.id}">
                  <span aria-hidden="true">E</span>
                  Edit
                </button>
                <button class="danger-button small-button" type="button" data-delete-route="${route.id}">
                  <span aria-hidden="true">x</span>
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join("");

      this.routeTable.querySelectorAll("[data-edit-route]").forEach((button) => {
        button.addEventListener("click", () => this.editRoute(button.dataset.editRoute));
      });
      this.routeTable.querySelectorAll("[data-delete-route]").forEach((button) => {
        button.addEventListener("click", () => this.deleteRoute(button.dataset.deleteRoute));
      });
    },

    renderBookings() {
      const bookings = EStorage.getBookings();
      document.querySelector("#admin-bookings-count").textContent = `${bookings.length} booking${bookings.length === 1 ? "" : "s"}`;
      if (!bookings.length) {
        this.bookingsList.innerHTML = '<div class="empty-state">No bookings yet.</div>';
        return;
      }
      this.bookingsList.innerHTML = bookings.map((booking) => TicketModule.bookingCard(booking, false, {
        showCustomer: true
      })).join("");
    }
  };

  window.AdminModule = AdminModule;
})();
