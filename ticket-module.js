(function () {
  const TicketModule = {
    selectedRouteId: null,
    selectedSeats: new Set(),
    filters: {
      type: "Bus",
      origin: "",
      destination: "",
      date: "",
      sort: "date"
    },

    init() {
      this.searchForm = document.querySelector("#search-form");
      this.clearSearchButton = document.querySelector("#clear-search");
      this.routeResults = document.querySelector("#route-results");
      this.seatMap = document.querySelector("#seat-map");
      this.bookingForm = document.querySelector("#booking-form");
      this.bookingStatusFilter = document.querySelector("#booking-status-filter");
      this.routeTypeButtons = document.querySelectorAll("[data-route-type]");

      this.searchForm.addEventListener("submit", (event) => this.handleSearch(event));
      this.clearSearchButton.addEventListener("click", () => this.clearSearch());
      this.bookingForm.addEventListener("submit", (event) => this.bookTicket(event));
      this.bookingStatusFilter.addEventListener("change", () => this.renderBookings());
      this.routeTypeButtons.forEach((button) => {
        button.addEventListener("click", () => this.selectRouteType(button.dataset.routeType));
      });
    },

    handleSearch(event) {
      event.preventDefault();
      this.filters = {
        type: document.querySelector("#search-type").value || "Bus",
        origin: document.querySelector("#search-origin").value.trim().toLowerCase(),
        destination: document.querySelector("#search-destination").value.trim().toLowerCase(),
        date: document.querySelector("#search-date").value,
        sort: document.querySelector("#search-sort").value
      };
      this.render();
    },

    clearSearch() {
      this.searchForm.reset();
      document.querySelector("#search-type").value = "Bus";
      this.filters = {
        type: "Bus",
        origin: "",
        destination: "",
        date: "",
        sort: "date"
      };
      this.render();
    },

    selectRouteType(type) {
      this.filters.type = type;
      document.querySelector("#search-type").value = type;
      this.selectedRouteId = null;
      this.selectedSeats.clear();
      this.render();
    },

    getFilteredRoutes() {
      return EStorage.getRoutes()
        .filter((route) => route.status === "Active")
        .filter((route) => {
          const matchesType = !this.filters.type || route.type === this.filters.type;
          const matchesOrigin = !this.filters.origin || route.origin.toLowerCase().includes(this.filters.origin);
          const matchesDestination = !this.filters.destination || route.destination.toLowerCase().includes(this.filters.destination);
          const matchesDate = !this.filters.date || route.date === this.filters.date;
          return matchesType && matchesOrigin && matchesDestination && matchesDate;
        })
        .sort((a, b) => {
          if (this.filters.sort === "price") {
            return Number(a.price) - Number(b.price);
          }
          if (this.filters.sort === "seats") {
            return EStorage.getAvailableSeatCount(b.id, b.totalSeats) - EStorage.getAvailableSeatCount(a.id, a.totalSeats);
          }
          if (this.filters.sort === "name") {
            return a.name.localeCompare(b.name);
          }
          return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
        });
    },

    selectRoute(routeId) {
      this.selectedRouteId = routeId;
      this.selectedSeats.clear();
      const user = EStorage.getCurrentUser();
      if (user) {
        document.querySelector("#passenger-name").value = user.name || "";
      }
      this.render();
    },

    toggleSeat(seatNumber) {
      if (this.selectedSeats.has(seatNumber)) {
        this.selectedSeats.delete(seatNumber);
      } else {
        this.selectedSeats.add(seatNumber);
      }
      this.renderSeatMap();
      this.updateBookingControls();
    },

    bookTicket(event) {
      event.preventDefault();
      const user = EStorage.getCurrentUser();
      if (!user) {
        App.showToast("Please login before booking a ticket.");
        App.switchTab("user");
        return;
      }
      if (!this.selectedRouteId || this.selectedSeats.size === 0) {
        App.showToast("Select a route and at least one seat.");
        return;
      }

      const route = EStorage.getRoutes().find((item) => item.id === this.selectedRouteId);
      if (!route) {
        App.showToast("Selected route is no longer available.");
        return;
      }

      try {
        const booking = EStorage.createBooking(
          route,
          user,
          Array.from(this.selectedSeats),
          document.querySelector("#passenger-name").value
        );
        this.selectedSeats.clear();
        App.showToast(`Ticket booked. Booking ID: ${booking.id}`);
        App.renderAll();
      } catch (error) {
        App.showToast(error.message);
        App.renderAll();
      }
    },

    cancelTicket(bookingId) {
      const user = EStorage.getCurrentUser();
      if (!user) {
        App.showToast("Please login before cancelling a ticket.");
        return;
      }
      EStorage.cancelBooking(bookingId, user.email);
      App.showToast("Ticket cancelled.");
      App.renderAll();
    },

    downloadTicket(bookingId) {
      const booking = EStorage.getBookings().find((item) => item.id === bookingId);
      if (!booking) {
        App.showToast("Booking not found.");
        return;
      }

      const ticketHtml = this.buildTicketHtml(booking);
      const blob = new Blob([ticketHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ticket-${booking.id}.html`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      App.showToast("Ticket downloaded.");
    },

    buildTicketHtml(booking) {
      const route = booking.routeSnapshot;
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Ticket ${booking.id}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; margin: 32px; color: #18202f; }
    .ticket { max-width: 720px; border: 1px solid #d8deea; border-radius: 8px; padding: 24px; }
    .head { display: flex; justify-content: space-between; gap: 16px; border-bottom: 1px solid #d8deea; padding-bottom: 16px; margin-bottom: 16px; }
    h1 { margin: 0; font-size: 28px; }
    p { margin: 6px 0; }
    .status { color: #087443; font-weight: 700; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
    strong { display: block; color: #667085; font-size: 12px; text-transform: uppercase; }
  </style>
</head>
<body>
  <main class="ticket">
    <div class="head">
      <div>
        <h1>E-Ticket</h1>
        <p>${route.name} (${route.type})</p>
      </div>
      <p class="status">${booking.status}</p>
    </div>
    <div class="grid">
      <p><strong>Booking ID</strong>${booking.id}</p>
      <p><strong>Passenger</strong>${booking.passengerName}</p>
      <p><strong>From / Venue</strong>${route.origin}</p>
      <p><strong>To / Category</strong>${route.destination}</p>
      <p><strong>Date</strong>${App.formatDate(route.date)}</p>
      <p><strong>Time</strong>${route.time}</p>
      <p><strong>Seats</strong>${booking.seats.join(", ")}</p>
      <p><strong>Amount</strong>${App.formatCurrency(booking.amount)}</p>
    </div>
  </main>
</body>
</html>`;
    },

    render() {
      this.renderStats();
      this.renderRoutes();
      this.renderSeatMap();
      this.renderBookings();
    },

    renderStats() {
      const activeRoutes = EStorage.getRoutes().filter((route) => route.status === "Active");
      const availableSeats = activeRoutes.reduce((total, route) => {
        return total + EStorage.getAvailableSeatCount(route.id, route.totalSeats);
      }, 0);
      const user = EStorage.getCurrentUser();
      const userBookings = user
        ? EStorage.getBookings().filter((booking) => booking.userEmail === user.email && booking.status === "Booked")
        : [];
      const userSpend = userBookings.reduce((total, booking) => total + Number(booking.amount || 0), 0);

      document.querySelector("#ticket-stat-routes").textContent = activeRoutes.length;
      document.querySelector("#ticket-stat-seats").textContent = availableSeats;
      document.querySelector("#ticket-stat-user-bookings").textContent = userBookings.length;
      document.querySelector("#ticket-stat-user-spend").textContent = App.formatCurrency(userSpend);
    },

    renderRoutes() {
      const routes = this.getFilteredRoutes();
      this.renderRouteTypeSlider();
      const typeLabel = this.filters.type || "All";
      document.querySelector("#results-count").textContent = `${routes.length} ${typeLabel} result${routes.length === 1 ? "" : "s"}`;
      document.querySelector("#ticket-state").textContent = this.selectedRouteId ? "Seat map ready" : "Choose a route or event";
      document.querySelector("#ticket-state").className = this.selectedRouteId ? "module-state ready" : "module-state";

      if (!routes.length) {
        this.routeResults.innerHTML = '<div class="empty-state">No active routes or events match the search.</div>';
        return;
      }

      this.routeResults.innerHTML = routes.map((route) => {
        const available = EStorage.getAvailableSeatCount(route.id, route.totalSeats);
        const booked = Number(route.totalSeats) - available;
        const occupiedPercent = route.totalSeats ? Math.round((booked / Number(route.totalSeats)) * 100) : 0;
        const selectedClass = route.id === this.selectedRouteId ? " selected" : "";
        return `
          <article class="route-card${selectedClass}">
            <div class="route-card-header">
              <h4>${route.name}</h4>
              <span class="type-chip">${route.type}</span>
            </div>
            <div class="meta-grid">
              <span><strong>Date</strong> ${App.formatDate(route.date)} at ${route.time}</span>
              <span><strong>From / Venue</strong> ${route.origin}</span>
              <span><strong>To / Category</strong> ${route.destination}</span>
              <span><strong>Available</strong> ${available} of ${route.totalSeats}</span>
              <span><strong>Booked</strong> ${booked} seats</span>
              <span><strong>Price</strong> ${App.formatCurrency(route.price)}</span>
            </div>
            <div class="seat-progress" aria-label="${occupiedPercent}% seats booked">
              <span style="width: ${occupiedPercent}%"></span>
            </div>
            <button class="secondary-button small-button" type="button" data-route-select="${route.id}">
              <span aria-hidden="true">&gt;</span>
              Select
            </button>
          </article>
        `;
      }).join("");

      this.routeResults.querySelectorAll("[data-route-select]").forEach((button) => {
        button.addEventListener("click", () => this.selectRoute(button.dataset.routeSelect));
      });
    },

    renderRouteTypeSlider() {
      this.routeTypeButtons.forEach((button) => {
        const isActive = button.dataset.routeType === this.filters.type;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-selected", String(isActive));
      });
    },

    renderSeatMap() {
      const route = EStorage.getRoutes().find((item) => item.id === this.selectedRouteId);
      const summary = document.querySelector("#selected-route-summary");
      const selectedCount = document.querySelector("#selected-seat-count");

      if (!route) {
        summary.textContent = "Select a route or event to view seats.";
        this.seatMap.innerHTML = "";
        this.selectedSeats.clear();
        selectedCount.textContent = "0 selected";
        this.updateFareSummary(null);
        this.updateBookingControls();
        return;
      }

      const bookedSeats = EStorage.getBookedSeats(route.id);
      const available = EStorage.getAvailableSeatCount(route.id, route.totalSeats);
      summary.innerHTML = `<strong>${route.name}</strong><br>${route.origin} to ${route.destination} | ${App.formatDate(route.date)} ${route.time} | ${App.formatCurrency(route.price)} per seat | ${available} available`;
      const selectedTotal = Number(route.price) * this.selectedSeats.size;
      selectedCount.textContent = this.selectedSeats.size
        ? `${this.selectedSeats.size} selected | ${App.formatCurrency(selectedTotal)}`
        : "0 selected";

      const buttons = [];
      for (let number = 1; number <= route.totalSeats; number += 1) {
        const booked = bookedSeats.includes(number);
        const selected = this.selectedSeats.has(number);
        const className = `seat-button${booked ? " booked" : ""}${selected ? " selected" : ""}`;
        buttons.push(`<button class="${className}" type="button" ${booked ? "disabled" : ""} data-seat="${number}" aria-label="Seat ${number}">${number}</button>`);
      }
      this.seatMap.innerHTML = buttons.join("");
      this.seatMap.querySelectorAll("[data-seat]").forEach((button) => {
        button.addEventListener("click", () => this.toggleSeat(Number(button.dataset.seat)));
      });
      this.updateFareSummary(route);
      this.updateBookingControls();
    },

    updateFareSummary(route) {
      const fareSummary = document.querySelector("#fare-summary");
      if (!route) {
        fareSummary.textContent = "Select seats to calculate fare.";
        return;
      }
      if (!this.selectedSeats.size) {
        fareSummary.textContent = `${App.formatCurrency(route.price)} per seat. Choose one or more seats.`;
        return;
      }
      const seats = Array.from(this.selectedSeats).sort((a, b) => a - b);
      const total = Number(route.price) * seats.length;
      fareSummary.textContent = `Seats ${seats.join(", ")} | ${seats.length} x ${App.formatCurrency(route.price)} = ${App.formatCurrency(total)}`;
    },

    updateBookingControls() {
      const user = EStorage.getCurrentUser();
      const hasRoute = Boolean(this.selectedRouteId);
      const hasSeats = this.selectedSeats.size > 0;
      const passengerInput = document.querySelector("#passenger-name");
      const bookButton = document.querySelector("#book-ticket");
      passengerInput.disabled = !hasRoute || !user;
      bookButton.disabled = !hasRoute || !hasSeats || !user;
      if (user && hasRoute && !passengerInput.value) {
        passengerInput.value = user.name || "";
      }
    },

    renderBookings() {
      const user = EStorage.getCurrentUser();
      const list = document.querySelector("#my-bookings");
      const count = document.querySelector("#my-bookings-count");

      if (!user) {
        list.innerHTML = '<div class="empty-state">Login to view your bookings.</div>';
        count.textContent = "0 bookings";
        this.bookingStatusFilter.value = "All";
        return;
      }

      const allBookings = EStorage.getBookings().filter((booking) => booking.userEmail === user.email);
      const statusFilter = this.bookingStatusFilter.value;
      const bookings = statusFilter === "All"
        ? allBookings
        : allBookings.filter((booking) => booking.status === statusFilter);
      count.textContent = statusFilter === "All"
        ? `${bookings.length} booking${bookings.length === 1 ? "" : "s"}`
        : `${bookings.length} of ${allBookings.length}`;
      if (!bookings.length) {
        list.innerHTML = '<div class="empty-state">No bookings found for this filter.</div>';
        return;
      }

      list.innerHTML = bookings.map((booking) => this.bookingCard(booking, true)).join("");
      list.querySelectorAll("[data-cancel-booking]").forEach((button) => {
        button.addEventListener("click", () => this.cancelTicket(button.dataset.cancelBooking));
      });
      list.querySelectorAll("[data-download-booking]").forEach((button) => {
        button.addEventListener("click", () => this.downloadTicket(button.dataset.downloadBooking));
      });
    },

    bookingCard(booking, includeActions, options = {}) {
      const route = booking.routeSnapshot;
      const statusClass = booking.status.toLowerCase();
      const customerInfo = options.showCustomer
        ? `<span><strong>Customer Email</strong> ${booking.userEmail}</span>`
        : "";
      const actions = includeActions && booking.status === "Booked"
        ? `<div class="booking-actions">
            <button class="ghost-button small-button" type="button" data-download-booking="${booking.id}">
              <span aria-hidden="true">DL</span>
              Download Ticket
            </button>
            <button class="danger-button small-button" type="button" data-cancel-booking="${booking.id}">
              <span aria-hidden="true">x</span>
              Cancel Ticket
            </button>
          </div>`
        : includeActions
          ? `<div class="booking-actions">
              <button class="ghost-button small-button" type="button" data-download-booking="${booking.id}">
                <span aria-hidden="true">DL</span>
                Download Ticket
              </button>
            </div>`
          : "";

      return `
        <article class="booking-card">
          <h4>${route.name} <span class="small-badge booking-status ${statusClass}">${booking.status}</span></h4>
          <div class="meta-grid">
            <span><strong>Booking ID</strong> ${booking.id}</span>
            <span><strong>Passenger</strong> ${booking.passengerName}</span>
            ${customerInfo}
            <span><strong>Trip/Event</strong> ${route.origin} to ${route.destination}</span>
            <span><strong>Date</strong> ${App.formatDate(route.date)} at ${route.time}</span>
            <span><strong>Booked On</strong> ${App.formatDateTime(booking.createdAt)}</span>
            <span><strong>Seats</strong> ${booking.seats.join(", ")}</span>
            <span><strong>Amount</strong> ${App.formatCurrency(booking.amount)}</span>
          </div>
          ${actions}
        </article>
      `;
    }
  };

  window.TicketModule = TicketModule;
})();
