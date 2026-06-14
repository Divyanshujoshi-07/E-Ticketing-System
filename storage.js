(function () {
  const keys = {
    users: "eticket_users",
    currentUser: "eticket_current_user",
    routes: "eticket_routes",
    bookings: "eticket_bookings"
  };

  const sampleRoutes = [
    {
      id: "route_bus_210",
      type: "Bus",
      name: "Express 210",
      origin: "Delhi",
      destination: "Jaipur",
      date: "2026-06-15",
      time: "08:30",
      price: 499,
      totalSeats: 32,
      status: "Active"
    },
    {
      id: "route_bus_145",
      type: "Bus",
      name: "Coastal Rider 145",
      origin: "Chennai",
      destination: "Pondicherry",
      date: "2026-06-16",
      time: "07:15",
      price: 380,
      totalSeats: 36,
      status: "Active"
    },
    {
      id: "route_bus_332",
      type: "Bus",
      name: "Greenline 332",
      origin: "Bengaluru",
      destination: "Mysuru",
      date: "2026-06-17",
      time: "09:00",
      price: 260,
      totalSeats: 40,
      status: "Active"
    },
    {
      id: "route_bus_518",
      type: "Bus",
      name: "Night Star 518",
      origin: "Hyderabad",
      destination: "Vijayawada",
      date: "2026-06-17",
      time: "22:10",
      price: 640,
      totalSeats: 34,
      status: "Active"
    },
    {
      id: "route_bus_89",
      type: "Bus",
      name: "Capital Link 89",
      origin: "Lucknow",
      destination: "Kanpur",
      date: "2026-06-18",
      time: "10:30",
      price: 210,
      totalSeats: 38,
      status: "Active"
    },
    {
      id: "route_bus_701",
      type: "Bus",
      name: "Desert Express 701",
      origin: "Jodhpur",
      destination: "Udaipur",
      date: "2026-06-19",
      time: "06:20",
      price: 560,
      totalSeats: 32,
      status: "Active"
    },
    {
      id: "route_bus_44",
      type: "Bus",
      name: "Metro Shuttle 44",
      origin: "Noida",
      destination: "Gurugram",
      date: "2026-06-20",
      time: "08:05",
      price: 180,
      totalSeats: 30,
      status: "Active"
    },
    {
      id: "route_bus_612",
      type: "Bus",
      name: "Hill Route 612",
      origin: "Dehradun",
      destination: "Mussoorie",
      date: "2026-06-21",
      time: "11:45",
      price: 240,
      totalSeats: 28,
      status: "Active"
    },
    {
      id: "route_bus_930",
      type: "Bus",
      name: "Harbor Connect 930",
      origin: "Kochi",
      destination: "Thiruvananthapuram",
      date: "2026-06-22",
      time: "13:30",
      price: 520,
      totalSeats: 36,
      status: "Active"
    },
    {
      id: "route_bus_275",
      type: "Bus",
      name: "Saffron Travels 275",
      origin: "Ahmedabad",
      destination: "Vadodara",
      date: "2026-06-23",
      time: "17:40",
      price: 300,
      totalSeats: 42,
      status: "Active"
    },
    {
      id: "route_train_74",
      type: "Train",
      name: "Western Intercity",
      origin: "Mumbai",
      destination: "Pune",
      date: "2026-06-16",
      time: "06:45",
      price: 320,
      totalSeats: 40,
      status: "Active"
    },
    {
      id: "route_train_101",
      type: "Train",
      name: "Northern Mail 101",
      origin: "Delhi",
      destination: "Chandigarh",
      date: "2026-06-17",
      time: "05:50",
      price: 450,
      totalSeats: 56,
      status: "Active"
    },
    {
      id: "route_train_222",
      type: "Train",
      name: "Southern Pearl 222",
      origin: "Chennai",
      destination: "Madurai",
      date: "2026-06-18",
      time: "21:20",
      price: 610,
      totalSeats: 60,
      status: "Active"
    },
    {
      id: "route_train_303",
      type: "Train",
      name: "Eastern Corridor 303",
      origin: "Kolkata",
      destination: "Bhubaneswar",
      date: "2026-06-19",
      time: "07:35",
      price: 540,
      totalSeats: 58,
      status: "Active"
    },
    {
      id: "route_train_444",
      type: "Train",
      name: "Deccan Flyer 444",
      origin: "Pune",
      destination: "Hyderabad",
      date: "2026-06-20",
      time: "18:10",
      price: 720,
      totalSeats: 64,
      status: "Active"
    },
    {
      id: "route_train_505",
      type: "Train",
      name: "Central Vista 505",
      origin: "Bhopal",
      destination: "Nagpur",
      date: "2026-06-21",
      time: "12:15",
      price: 390,
      totalSeats: 52,
      status: "Active"
    },
    {
      id: "route_train_616",
      type: "Train",
      name: "Konkan Coast 616",
      origin: "Mangalore",
      destination: "Goa",
      date: "2026-06-22",
      time: "15:30",
      price: 480,
      totalSeats: 54,
      status: "Active"
    },
    {
      id: "route_train_727",
      type: "Train",
      name: "Royal Junction 727",
      origin: "Jaipur",
      destination: "Agra",
      date: "2026-06-23",
      time: "09:25",
      price: 430,
      totalSeats: 50,
      status: "Active"
    },
    {
      id: "route_train_838",
      type: "Train",
      name: "Ganga Express 838",
      origin: "Varanasi",
      destination: "Patna",
      date: "2026-06-24",
      time: "06:40",
      price: 360,
      totalSeats: 48,
      status: "Active"
    },
    {
      id: "route_train_949",
      type: "Train",
      name: "Himalayan Link 949",
      origin: "Chandigarh",
      destination: "Shimla",
      date: "2026-06-25",
      time: "08:55",
      price: 520,
      totalSeats: 44,
      status: "Active"
    },
    {
      id: "event_music_12",
      type: "Event",
      name: "City Music Night",
      origin: "City Arena",
      destination: "Concert",
      date: "2026-06-18",
      time: "19:00",
      price: 899,
      totalSeats: 48,
      status: "Active"
    },
    {
      id: "event_tech_01",
      type: "Event",
      name: "Tech Future Summit",
      origin: "Convention Centre",
      destination: "Conference",
      date: "2026-06-19",
      time: "10:00",
      price: 1499,
      totalSeats: 60,
      status: "Active"
    },
    {
      id: "event_food_02",
      type: "Event",
      name: "Street Food Carnival",
      origin: "Riverfront Grounds",
      destination: "Food Festival",
      date: "2026-06-20",
      time: "16:00",
      price: 299,
      totalSeats: 70,
      status: "Active"
    },
    {
      id: "event_comedy_03",
      type: "Event",
      name: "Laugh Lounge Live",
      origin: "Grand Theatre",
      destination: "Comedy",
      date: "2026-06-21",
      time: "20:30",
      price: 699,
      totalSeats: 42,
      status: "Active"
    },
    {
      id: "event_art_04",
      type: "Event",
      name: "Modern Art Expo",
      origin: "Kala Gallery",
      destination: "Exhibition",
      date: "2026-06-22",
      time: "11:00",
      price: 250,
      totalSeats: 55,
      status: "Active"
    },
    {
      id: "event_sports_05",
      type: "Event",
      name: "Premier Football Night",
      origin: "National Stadium",
      destination: "Sports",
      date: "2026-06-23",
      time: "19:30",
      price: 999,
      totalSeats: 80,
      status: "Active"
    },
    {
      id: "event_drama_06",
      type: "Event",
      name: "Stage Drama Festival",
      origin: "Town Hall",
      destination: "Theatre",
      date: "2026-06-24",
      time: "18:45",
      price: 550,
      totalSeats: 46,
      status: "Active"
    },
    {
      id: "event_workshop_07",
      type: "Event",
      name: "Startup Workshop",
      origin: "Innovation Hub",
      destination: "Workshop",
      date: "2026-06-25",
      time: "09:30",
      price: 799,
      totalSeats: 35,
      status: "Active"
    },
    {
      id: "event_dance_08",
      type: "Event",
      name: "Classical Dance Evening",
      origin: "Cultural Auditorium",
      destination: "Dance",
      date: "2026-06-26",
      time: "18:00",
      price: 450,
      totalSeats: 52,
      status: "Active"
    },
    {
      id: "event_film_09",
      type: "Event",
      name: "Indie Film Screening",
      origin: "Metro Cinema",
      destination: "Film",
      date: "2026-06-27",
      time: "17:15",
      price: 350,
      totalSeats: 44,
      status: "Active"
    }
  ];

  function read(key, fallback) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function createId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  function ensureSeedData() {
    if (!localStorage.getItem(keys.routes)) {
      write(keys.routes, sampleRoutes);
    } else {
      const routes = getRoutes();
      const existingIds = new Set(routes.map((route) => route.id));
      const missingSamples = sampleRoutes.filter((route) => !existingIds.has(route.id));
      if (missingSamples.length) {
        write(keys.routes, routes.concat(missingSamples));
      }
    }
    if (!localStorage.getItem(keys.users)) {
      write(keys.users, []);
    }
    if (!localStorage.getItem(keys.bookings)) {
      write(keys.bookings, []);
    }
  }

  function resetSampleData() {
    write(keys.routes, sampleRoutes);
    write(keys.bookings, []);
  }

  function getUsers() {
    return read(keys.users, []);
  }

  function saveUsers(users) {
    write(keys.users, users);
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function getCurrentUser() {
    const email = localStorage.getItem(keys.currentUser);
    if (!email) {
      return null;
    }
    return getUsers().find((user) => user.email === email) || null;
  }

  function setCurrentUser(email) {
    if (email) {
      localStorage.setItem(keys.currentUser, email);
    } else {
      localStorage.removeItem(keys.currentUser);
    }
  }

  function registerUser(data) {
    const users = getUsers();
    const email = normalizeEmail(data.email);
    if (users.some((user) => user.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const user = {
      id: createId("user"),
      name: data.name.trim(),
      email,
      password: data.password,
      phone: "",
      city: "",
      createdAt: new Date().toISOString()
    };
    users.push(user);
    saveUsers(users);
    setCurrentUser(email);
    return user;
  }

  function loginUser(emailInput, password) {
    const email = normalizeEmail(emailInput);
    const user = getUsers().find((item) => item.email === email && item.password === password);
    if (!user) {
      throw new Error("Invalid email or password.");
    }
    setCurrentUser(email);
    return user;
  }

  function updateProfile(data) {
    const current = getCurrentUser();
    if (!current) {
      throw new Error("Login required before editing profile.");
    }
    const users = getUsers().map((user) => {
      if (user.email !== current.email) {
        return user;
      }
      return {
        ...user,
        name: data.name.trim(),
        phone: data.phone.trim(),
        city: data.city.trim()
      };
    });
    saveUsers(users);
    return getCurrentUser();
  }

  function getRoutes() {
    return read(keys.routes, []);
  }

  function saveRoutes(routes) {
    write(keys.routes, routes);
  }

  function upsertRoute(routeData) {
    const routes = getRoutes();
    const route = {
      id: routeData.id || createId("route"),
      type: routeData.type,
      name: routeData.name.trim(),
      origin: routeData.origin.trim(),
      destination: routeData.destination.trim(),
      date: routeData.date,
      time: routeData.time,
      price: Number(routeData.price),
      totalSeats: Number(routeData.totalSeats),
      status: routeData.status
    };

    const index = routes.findIndex((item) => item.id === route.id);
    if (index >= 0) {
      routes[index] = route;
    } else {
      routes.push(route);
    }
    saveRoutes(routes);
    return route;
  }

  function deleteRoute(routeId) {
    const routes = getRoutes().filter((route) => route.id !== routeId);
    saveRoutes(routes);
  }

  function getBookings() {
    return read(keys.bookings, []);
  }

  function saveBookings(bookings) {
    write(keys.bookings, bookings);
  }

  function getBookedSeats(routeId) {
    return getBookings()
      .filter((booking) => booking.routeId === routeId && booking.status === "Booked")
      .flatMap((booking) => booking.seats);
  }

  function getAvailableSeatCount(routeId, totalSeats) {
    return Math.max(Number(totalSeats) - getBookedSeats(routeId).length, 0);
  }

  function createBooking(route, user, seats, passengerName) {
    const bookedSeats = getBookedSeats(route.id);
    const conflict = seats.find((seat) => bookedSeats.includes(seat));
    if (conflict) {
      throw new Error(`Seat ${conflict} was already booked. Please choose another seat.`);
    }

    const booking = {
      id: createId("booking"),
      routeId: route.id,
      userEmail: user.email,
      passengerName: passengerName.trim() || user.name,
      seats: seats.slice().sort((a, b) => a - b),
      amount: Number(route.price) * seats.length,
      status: "Booked",
      createdAt: new Date().toISOString(),
      routeSnapshot: {
        type: route.type,
        name: route.name,
        origin: route.origin,
        destination: route.destination,
        date: route.date,
        time: route.time,
        price: Number(route.price)
      }
    };

    const bookings = getBookings();
    bookings.unshift(booking);
    saveBookings(bookings);
    return booking;
  }

  function cancelBooking(bookingId, userEmail) {
    const bookings = getBookings();
    const booking = bookings.find((item) => item.id === bookingId);
    if (!booking) {
      throw new Error("Booking not found.");
    }
    if (userEmail && booking.userEmail !== userEmail) {
      throw new Error("You can cancel only your own booking.");
    }
    booking.status = "Cancelled";
    booking.cancelledAt = new Date().toISOString();
    saveBookings(bookings);
    return booking;
  }

  window.EStorage = {
    ensureSeedData,
    resetSampleData,
    registerUser,
    loginUser,
    updateProfile,
    setCurrentUser,
    getCurrentUser,
    getRoutes,
    upsertRoute,
    deleteRoute,
    getBookings,
    getBookedSeats,
    getAvailableSeatCount,
    createBooking,
    cancelBooking
  };
})();
