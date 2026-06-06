import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Initialize Mock Local Storage Database
const initMockDB = () => {
  if (localStorage.getItem('mock_initialized') !== 'v3') {
    const users = [
      { id: 1, email: 'customer@gmail.com', fullName: 'John Customer', password: 'password', role: 'CUSTOMER', phone: '9876543210', addresses: [
        { id: 1, street: 'Flat 402, Sea Breeze Apartments, Bandra West', city: 'Mumbai', state: 'Maharashtra', zipCode: '400050', isDefault: true },
        { id: 2, street: '12th Floor, Cyber Towers, Hitec City', city: 'Hyderabad', state: 'Telangana', zipCode: '500081', isDefault: false }
      ] },
      { id: 2, email: 'owner@gmail.com', fullName: 'Alice Merchant', password: 'password', role: 'RESTAURANT_OWNER', phone: '9876543211', addresses: [] },
      { id: 3, email: 'admin@gmail.com', fullName: 'Super Administrator', password: 'password', role: 'ADMIN', phone: '9876543212', addresses: [] }
    ];
    
    const restaurants = [
      {
        id: 1,
        name: "Pizza Suprema",
        description: "Voted best artisanal sourdough wood-fired pizzas in the city.",
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
        coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
        address: "Hill Road, Bandra West",
        city: "Mumbai",
        latitude: 19.0544,
        longitude: 72.8294,
        cuisineType: "Pizza, Italian, Fast Food",
        deliveryTime: 25,
        minimumOrder: 200,
        openingTime: "11:00 AM",
        closingTime: "11:00 PM",
        rating: 4.3,
        numRatings: 2,
        ownerId: 2,
        menuItems: [
          { id: 1, name: "Margherita Sourdough", description: "San Marzano tomato sauce, fresh mozzarella, fresh basil, extra virgin olive oil.", price: 350, category: "Main Course", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300", veg: true },
          { id: 2, name: "Double Cheese Garlic Bread", description: "Toasted baguette slices topped with house garlic butter and melted mozzarella.", price: 180, category: "Starters", image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300", veg: true },
          { id: 3, name: "Tiramisu Cup", description: "Layers of espresso-soaked ladyfingers and creamy mascarpone filling.", price: 220, category: "Desserts", image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300", veg: true },
          { id: 4, name: "Iced Peach Tea", description: "Refreshing brewed black tea infused with natural sweet peach syrup.", price: 110, category: "Beverages", image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300", veg: true }
        ]
      },
      {
        id: 2,
        name: "The Royal Biryani",
        description: "Experience authentic Nizami and Lucknowi dum cooked biryanis.",
        image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500",
        coverImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200",
        address: "Linking Road, Santacruz West",
        city: "Mumbai",
        latitude: 19.0822,
        longitude: 72.8361,
        cuisineType: "North Indian, Biryani, Mughlai",
        deliveryTime: 35,
        minimumOrder: 300,
        openingTime: "12:00 PM",
        closingTime: "11:30 PM",
        rating: 5.0,
        numRatings: 1,
        ownerId: 2,
        menuItems: [
          { id: 5, name: "Galouti Kebab (4 Pcs)", description: "Melt-in-mouth minced mutton kebabs served with mint chutney and onion rings.", price: 320, category: "Starters", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300", veg: false },
          { id: 6, name: "Hyderabadi Chicken Dum Biryani", description: "Fragrant basmati rice layered with spiced marinated chicken and slow-cooked in dum style.", price: 290, category: "Main Course", image: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=300", veg: false },
          { id: 7, name: "Shahi Tukda", description: "Crispy fried bread slices soaked in cardamon flavored milk syrup and dry fruits.", price: 140, category: "Desserts", image: "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300", veg: true }
        ]
      },
      {
        id: 3,
        name: "Bonsai Greens",
        description: "Fresh gourmet salads, high-protein wraps, and cold-pressed juices.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500",
        coverImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200",
        address: "Colaba Causeway, South Mumbai",
        city: "Mumbai",
        latitude: 18.9218,
        longitude: 72.8322,
        cuisineType: "Healthy Food, Salad, Beverages",
        deliveryTime: 20,
        minimumOrder: 150,
        openingTime: "08:00 AM",
        closingTime: "10:00 PM",
        rating: 4.2,
        numRatings: 1,
        ownerId: 2,
        menuItems: [
          { id: 8, name: "Avocado Quinoa Salad bowl", description: "Organic quinoa, fresh avocado, cherry tomatoes, cucumbers, mixed greens in honey-lemon glaze.", price: 240, category: "Main Course", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300", veg: true },
          { id: 9, name: "Detox Green Juice", description: "Cold pressed kale, green apple, cucumber, celery, ginger, lemon.", price: 160, category: "Beverages", image: "https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=300", veg: true }
        ]
      },
      {
        id: 4,
        name: "Delhi Chaat Bhandar",
        description: "Crispy golgappas, tangy dahi bhallas, and spicy aloo tikki chat.",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500",
        coverImage: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200",
        address: "Connaught Place",
        city: "Delhi",
        latitude: 28.6304,
        longitude: 77.2177,
        cuisineType: "Street Food, Fast Food, Snacks",
        deliveryTime: 15,
        minimumOrder: 100,
        openingTime: "10:00 AM",
        closingTime: "09:30 PM",
        rating: 0.0,
        numRatings: 0,
        ownerId: 2,
        menuItems: [
          { id: 10, name: "Special Dahi Bhalla", description: "Soft lentil dumplings soaked in creamy sweetened yogurt topped with tamarind & mint chutneys.", price: 120, category: "Starters", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300", veg: true }
        ]
      }
    ];

    const reviews = [
      { id: 1, restaurantId: 1, userId: 1, userFullName: 'John Customer', rating: 4.5, comment: "Best margherita pizza I have eaten in a long time! Highly recommend!", createdAt: new Date().toISOString() },
      { id: 2, restaurantId: 1, userId: 3, userFullName: 'Super Administrator', rating: 4.0, comment: "Very good delivery speed and packaging. Garlic bread was cheese-filled.", createdAt: new Date().toISOString() },
      { id: 3, restaurantId: 2, userId: 1, userFullName: 'John Customer', rating: 5.0, comment: "The chicken biryani was so flavor-packed and chicken pieces were tender.", createdAt: new Date().toISOString() },
      { id: 4, restaurantId: 3, userId: 1, userFullName: 'John Customer', rating: 4.2, comment: "Healthy, clean, and delicious food. Perfect if you are on a calorie deficit.", createdAt: new Date().toISOString() }
    ];

    const orders = [
      {
        id: 1001,
        orderNumber: "ORD-9988221",
        userId: 1,
        buyerName: "John Customer",
        userName: "John Customer",
        restaurantId: 1,
        restaurantName: "Pizza Suprema",
        totalAmount: 530.0,
        status: "DELIVERED",
        deliveryAddress: "Flat 402, Sea Breeze Apartments, Bandra West, Mumbai",
        paymentMethod: "CARD",
        paymentStatus: "PAID",
        orderItems: [
          { id: 1, menuItemName: "Margherita Sourdough", quantity: 1, price: 350.0, subtotal: 350.0 },
          { id: 2, menuItemName: "Double Cheese Garlic Bread", quantity: 1, price: 180.0, subtotal: 180.0 }
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 1002,
        orderNumber: "ORD-9988222",
        userId: 1,
        buyerName: "John Customer",
        userName: "John Customer",
        restaurantId: 2,
        restaurantName: "The Royal Biryani",
        totalAmount: 430.0,
        status: "PREPARING",
        deliveryAddress: "Flat 402, Sea Breeze Apartments, Bandra West, Mumbai",
        paymentMethod: "CASH_ON_DELIVERY",
        paymentStatus: "PENDING",
        orderItems: [
          { id: 3, menuItemName: "Hyderabadi Chicken Dum Biryani", quantity: 1, price: 290.0, subtotal: 290.0 },
          { id: 4, menuItemName: "Shahi Tukda", quantity: 1, price: 140.0, subtotal: 140.0 }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 1003,
        orderNumber: "ORD-9988223",
        userId: 1,
        buyerName: "John Customer",
        userName: "John Customer",
        restaurantId: 3,
        restaurantName: "Bonsai Greens",
        totalAmount: 400.0,
        status: "OUT_FOR_DELIVERY",
        deliveryAddress: "Flat 402, Sea Breeze Apartments, Bandra West, Mumbai",
        paymentMethod: "UPI",
        paymentStatus: "PAID",
        orderItems: [
          { id: 5, menuItemName: "Avocado Quinoa Salad bowl", quantity: 1, price: 240.0, subtotal: 240.0 },
          { id: 6, menuItemName: "Detox Green Juice", quantity: 1, price: 160.0, subtotal: 160.0 }
        ],
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ];

    const favorites = [
      { userId: 1, restaurantId: 1 },
      { userId: 1, restaurantId: 2 },
      { userId: 1, restaurantId: 3 }
    ];

    localStorage.setItem('mock_users', JSON.stringify(users));
    localStorage.setItem('mock_restaurants', JSON.stringify(restaurants));
    localStorage.setItem('mock_reviews', JSON.stringify(reviews));
    localStorage.setItem('mock_orders', JSON.stringify(orders));
    localStorage.setItem('mock_favorites', JSON.stringify(favorites));
    localStorage.setItem('mock_carts', JSON.stringify({}));
    localStorage.setItem('mock_initialized', 'v3');
  }
};

// Mock Response Router
const handleMockRequest = (config) => {
  initMockDB();
  const method = config.method ? config.method.toUpperCase() : 'GET';
  let path = config.url || '';
  if (path.startsWith('http://localhost:8080')) {
    path = path.replace('http://localhost:8080', '');
  }
  const [cleanPath, queryString] = path.split('?');
  
  const getUsers = () => JSON.parse(localStorage.getItem('mock_users') || '[]');
  const saveUsers = (users) => localStorage.setItem('mock_users', JSON.stringify(users));
  
  const getRestaurants = () => JSON.parse(localStorage.getItem('mock_restaurants') || '[]');
  const saveRestaurants = (rests) => localStorage.setItem('mock_restaurants', JSON.stringify(rests));
  
  const getReviews = () => JSON.parse(localStorage.getItem('mock_reviews') || '[]');
  const saveReviews = (revs) => localStorage.setItem('mock_reviews', JSON.stringify(revs));
  
  const getOrders = () => JSON.parse(localStorage.getItem('mock_orders') || '[]');
  const saveOrders = (ords) => localStorage.setItem('mock_orders', JSON.stringify(ords));
  
  const getFavorites = () => JSON.parse(localStorage.getItem('mock_favorites') || '[]');
  const saveFavorites = (favs) => localStorage.setItem('mock_favorites', JSON.stringify(favs));
  
  const getCarts = () => JSON.parse(localStorage.getItem('mock_carts') || '{}');
  const saveCarts = (carts) => localStorage.setItem('mock_carts', JSON.stringify(carts));

  const token = localStorage.getItem('accessToken');
  let currentUser = null;
  if (token) {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const parsed = JSON.parse(atob(tokenParts[1]));
        const users = getUsers();
        currentUser = users.find(u => u.email === parsed.sub || u.email === parsed.email);
      } else if (token.startsWith('mock-token-')) {
        const email = token.replace('mock-token-', '');
        const users = getUsers();
        currentUser = users.find(u => u.email === email);
      }
    } catch (e) {}
  }

  let body = {};
  if (config.data) {
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data;
    } catch (e) {}
  }

  const wrapResponse = (data, message = "Success", success = true) => {
    return {
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
      data: {
        success,
        message,
        data
      }
    };
  };

  const wrapError = (message, status = 400) => {
    return Promise.reject({
      response: {
        status,
        data: {
          success: false,
          message,
          data: null
        }
      }
    });
  };

  // Auth Routing
  if (cleanPath === '/api/auth/register' && method === 'POST') {
    const users = getUsers();
    if (users.find(u => u.email === body.email)) {
      return wrapError("Email is already registered!", 400);
    }
    const newUser = {
      id: users.length + 1,
      email: body.email,
      fullName: body.fullName,
      password: body.password || 'password',
      role: body.role || 'CUSTOMER',
      phone: body.phone || '',
      addresses: []
    };
    users.push(newUser);
    saveUsers(users);
    
    const mockToken = `mock-token-${newUser.email}`;
    return wrapResponse({
      accessToken: mockToken,
      refreshToken: `mock-refresh-${newUser.email}`,
      user: {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        phone: newUser.phone
      }
    }, "Registration successful");
  }

  if (cleanPath === '/api/auth/login' && method === 'POST') {
    const users = getUsers();
    const user = users.find(u => u.email === body.email && u.password === body.password);
    if (!user) {
      return wrapError("Invalid email or password!", 401);
    }
    const mockToken = `mock-token-${user.email}`;
    return wrapResponse({
      accessToken: mockToken,
      refreshToken: `mock-refresh-${user.email}`,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone
      }
    }, "Login successful");
  }

  if (cleanPath === '/api/auth/refresh' && method === 'POST') {
    const rToken = body.refreshToken || '';
    if (rToken.startsWith('mock-refresh-')) {
      const email = rToken.replace('mock-refresh-', '');
      return wrapResponse({
        accessToken: `mock-token-${email}`,
        refreshToken: rToken
      });
    }
    return wrapError("Invalid refresh token", 401);
  }

  if (cleanPath === '/api/auth/logout' && method === 'POST') {
    return wrapResponse(null, "Logged out successfully");
  }

  // Profile Routing
  if (cleanPath === '/api/users/profile' && method === 'GET') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    return wrapResponse({
      id: currentUser.id,
      email: currentUser.email,
      fullName: currentUser.fullName,
      role: currentUser.role,
      phone: currentUser.phone
    });
  }

  if (cleanPath === '/api/users/profile' && method === 'PUT') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const users = getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      users[idx].fullName = body.fullName || users[idx].fullName;
      users[idx].phone = body.phone || users[idx].phone;
      saveUsers(users);
      return wrapResponse({
        id: users[idx].id,
        email: users[idx].email,
        fullName: users[idx].fullName,
        role: users[idx].role,
        phone: users[idx].phone
      }, "Profile updated successfully");
    }
  }

  if (cleanPath === '/api/users/change-password' && method === 'POST') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const users = getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
      if (users[idx].password !== body.oldPassword) {
        return wrapError("Incorrect current password!", 400);
      }
      users[idx].password = body.newPassword;
      saveUsers(users);
      return wrapResponse(null, "Password changed successfully");
    }
  }

  if (cleanPath === '/api/users/addresses' && method === 'GET') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    return wrapResponse(currentUser.addresses || []);
  }

  if (cleanPath === '/api/users/addresses' && method === 'POST') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const users = getUsers();
    const uIdx = users.findIndex(u => u.id === currentUser.id);
    if (uIdx !== -1) {
      const user = users[uIdx];
      if (body.isDefault) {
        user.addresses.forEach(a => a.isDefault = false);
      }
      const newAddress = {
        id: (user.addresses.length ? Math.max(...user.addresses.map(a => a.id)) : 0) + 1,
        street: body.street,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        isDefault: body.isDefault || false
      };
      user.addresses.push(newAddress);
      saveUsers(users);
      return wrapResponse(newAddress, "Address saved successfully");
    }
  }

  if (cleanPath.startsWith('/api/users/addresses/') && method === 'DELETE') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const addressId = parseInt(cleanPath.split('/').pop());
    const users = getUsers();
    const uIdx = users.findIndex(u => u.id === currentUser.id);
    if (uIdx !== -1) {
      const user = users[uIdx];
      user.addresses = user.addresses.filter(a => a.id !== addressId);
      saveUsers(users);
      return wrapResponse(null, "Address deleted successfully");
    }
  }

  // Restaurant Routing
  if (cleanPath === '/api/restaurants' && method === 'GET') {
    let rests = getRestaurants();
    const params = new URLSearchParams(queryString || '');
    const search = params.get('search') || '';
    const city = params.get('city') || '';
    const cuisine = params.get('cuisine') || '';
    const vegOnly = params.get('vegOnly') === 'true';
    const sortBy = params.get('sortBy') || '';
    
    if (city) {
      rests = rests.filter(r => r.city.toLowerCase() === city.toLowerCase());
    }
    if (search) {
      rests = rests.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.cuisineType.toLowerCase().includes(search.toLowerCase()));
    }
    if (cuisine) {
      rests = rests.filter(r => r.cuisineType.toLowerCase().includes(cuisine.toLowerCase()));
    }
    if (vegOnly) {
      rests = rests.filter(r => r.menuItems && r.menuItems.some(item => item.veg));
    }
    
    if (sortBy === 'rating') {
      rests.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'deliveryTime') {
      rests.sort((a, b) => a.deliveryTime - b.deliveryTime);
    } else if (sortBy === 'minimumOrder') {
      rests.sort((a, b) => a.minimumOrder - b.minimumOrder);
    }

    const page = parseInt(params.get('page') || '0');
    const size = parseInt(params.get('size') || '9');
    const totalElements = rests.length;
    const totalPages = Math.ceil(totalElements / size);
    const content = rests.slice(page * size, (page + 1) * size);
    
    return wrapResponse({
      content,
      totalElements,
      totalPages,
      number: page,
      size
    });
  }

  if (cleanPath.startsWith('/api/menu/restaurant/') && method === 'GET') {
    const restId = parseInt(cleanPath.split('/').pop());
    const rests = getRestaurants();
    const rest = rests.find(r => r.id === restId);
    if (!rest) return wrapError("Restaurant not found!", 404);
    return wrapResponse(rest.menuItems || []);
  }

  if (cleanPath.startsWith('/api/favorites/check/') && method === 'GET') {
    if (!currentUser) return wrapResponse(false);
    const restId = parseInt(cleanPath.split('/').pop());
    const favs = getFavorites();
    const exists = favs.some(f => f.userId === currentUser.id && f.restaurantId === restId);
    return wrapResponse(exists);
  }

  if (cleanPath.startsWith('/api/restaurants/') && method === 'GET') {
    const id = parseInt(cleanPath.split('/').pop());
    const rests = getRestaurants();
    const rest = rests.find(r => r.id === id);
    if (!rest) return wrapError("Restaurant not found!", 404);
    return wrapResponse(rest);
  }

  // Favorites Routing
  if (cleanPath === '/api/favorites' && method === 'GET') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const favs = getFavorites().filter(f => f.userId === currentUser.id);
    const rests = getRestaurants();
    const favRests = rests.filter(r => favs.some(f => f.restaurantId === r.id));
    return wrapResponse(favRests);
  }

  if (cleanPath.startsWith('/api/favorites/toggle/') && method === 'POST') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const restId = parseInt(cleanPath.split('/').pop());
    let favs = getFavorites();
    const exists = favs.find(f => f.userId === currentUser.id && f.restaurantId === restId);
    if (exists) {
      favs = favs.filter(f => !(f.userId === currentUser.id && f.restaurantId === restId));
      saveFavorites(favs);
      return wrapResponse(false, "Removed from favorites");
    } else {
      favs.push({ userId: currentUser.id, restaurantId: restId });
      saveFavorites(favs);
      return wrapResponse(true, "Added to favorites");
    }
  }

  // Reviews Routing
  if (cleanPath.startsWith('/api/reviews/restaurant/') && method === 'GET') {
    const restId = parseInt(cleanPath.split('/').pop());
    const revs = getReviews().filter(r => r.restaurantId === restId).map(r => ({
      ...r,
      userName: r.userName || r.userFullName,
      userFullName: r.userFullName || r.userName
    }));
    return wrapResponse(revs);
  }

  if (cleanPath.startsWith('/api/reviews/restaurant/') && method === 'POST') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const restId = parseInt(cleanPath.split('/').pop());
    const revs = getReviews();
    const newReview = {
      id: revs.length + 1,
      restaurantId: restId,
      userId: currentUser.id,
      userFullName: currentUser.fullName,
      userName: currentUser.fullName,
      rating: body.rating,
      comment: body.comment,
      createdAt: new Date().toISOString()
    };
    revs.push(newReview);
    saveReviews(revs);

    const rests = getRestaurants();
    const rIdx = rests.findIndex(r => r.id === restId);
    if (rIdx !== -1) {
      const restRevs = revs.filter(r => r.restaurantId === restId);
      const avg = restRevs.reduce((acc, r) => acc + r.rating, 0) / restRevs.length;
      rests[rIdx].rating = parseFloat(avg.toFixed(1));
      rests[rIdx].numRatings = restRevs.length;
      saveRestaurants(rests);
    }
    return wrapResponse(newReview, "Review added successfully");
  }

  // Cart Routing
  if (cleanPath === '/api/cart' && method === 'GET') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const carts = getCarts();
    const cart = carts[currentUser.id] || { items: [], totalAmount: 0.0 };
    return wrapResponse(cart);
  }

  if (cleanPath === '/api/cart/items' && method === 'POST') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const carts = getCarts();
    const userCart = carts[currentUser.id] || { items: [], totalAmount: 0.0 };
    
    const rests = getRestaurants();
    let menuItem = null;
    let restaurant = null;
    for (const r of rests) {
      const item = r.menuItems?.find(m => m.id === body.menuItemId);
      if (item) {
        menuItem = item;
        restaurant = r;
        break;
      }
    }
    
    if (!menuItem) return wrapError("Menu item not found", 404);

    if (userCart.items.length > 0 && userCart.items[0].restaurantId !== restaurant.id) {
      return wrapError("Cart contains items from another restaurant. Clear cart first!", 400);
    }

    const existingIdx = userCart.items.findIndex(item => item.menuItem.id === menuItem.id);
    if (existingIdx !== -1) {
      userCart.items[existingIdx].quantity += body.quantity;
      userCart.items[existingIdx].subtotal = userCart.items[existingIdx].quantity * menuItem.price;
    } else {
      userCart.items.push({
        id: userCart.items.length + 1,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        menuItem,
        quantity: body.quantity,
        subtotal: body.quantity * menuItem.price
      });
    }

    userCart.totalAmount = userCart.items.reduce((acc, item) => acc + item.subtotal, 0);
    carts[currentUser.id] = userCart;
    saveCarts(carts);
    return wrapResponse(userCart, "Item added to cart");
  }

  if (cleanPath.startsWith('/api/cart/items/') && method === 'PUT') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const itemId = parseInt(cleanPath.split('/').pop());
    const carts = getCarts();
    const userCart = carts[currentUser.id];
    if (userCart) {
      const idx = userCart.items.findIndex(item => item.id === itemId);
      if (idx !== -1) {
        userCart.items[idx].quantity = body.quantity;
        userCart.items[idx].subtotal = body.quantity * userCart.items[idx].menuItem.price;
        userCart.totalAmount = userCart.items.reduce((acc, item) => acc + item.subtotal, 0);
        carts[currentUser.id] = userCart;
        saveCarts(carts);
        return wrapResponse(userCart, "Quantity updated");
      }
    }
    return wrapError("Item not found in cart", 404);
  }

  if (cleanPath.startsWith('/api/cart/items/') && method === 'DELETE') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const itemId = parseInt(cleanPath.split('/').pop());
    const carts = getCarts();
    const userCart = carts[currentUser.id];
    if (userCart) {
      userCart.items = userCart.items.filter(item => item.id !== itemId);
      userCart.totalAmount = userCart.items.reduce((acc, item) => acc + item.subtotal, 0);
      carts[currentUser.id] = userCart;
      saveCarts(carts);
      return wrapResponse(userCart, "Item removed from cart");
    }
    return wrapError("Item not found in cart", 404);
  }

  if (cleanPath === '/api/cart' && method === 'DELETE') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const carts = getCarts();
    carts[currentUser.id] = { items: [], totalAmount: 0.0 };
    saveCarts(carts);
    return wrapResponse(carts[currentUser.id], "Cart cleared");
  }

  // Order Routing
  if (cleanPath === '/api/orders' && method === 'POST') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const carts = getCarts();
    const userCart = carts[currentUser.id];
    if (!userCart || userCart.items.length === 0) {
      return wrapError("Cart is empty", 400);
    }
    const orders = getOrders();
    const newOrder = {
      id: orders.length + 1001,
      orderNumber: `ORD-${Date.now()}`,
      userId: currentUser.id,
      buyerName: currentUser.fullName,
      restaurantId: userCart.items[0].restaurantId,
      restaurantName: userCart.items[0].restaurantName,
      totalAmount: userCart.totalAmount,
      status: "PLACED",
      deliveryAddress: body.deliveryAddress,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentMethod === 'CASH_ON_DELIVERY' ? 'PENDING' : 'PAID',
      orderItems: userCart.items.map((item, idx) => ({
        id: idx + 1,
        menuItemId: item.menuItem.id,
        menuItemName: item.menuItem.name,
        quantity: item.quantity,
        price: item.menuItem.price,
        subtotal: item.subtotal
      })),
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    saveOrders(orders);

    carts[currentUser.id] = { items: [], totalAmount: 0.0 };
    saveCarts(carts);
    return wrapResponse(newOrder, "Order placed successfully");
  }

  if (cleanPath === '/api/orders' && method === 'GET') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const orders = getOrders().filter(o => o.userId === currentUser.id);
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return wrapResponse(orders);
  }

  if (cleanPath.startsWith('/api/orders/') && method === 'GET') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const orderId = parseInt(cleanPath.split('/').pop());
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return wrapError("Order not found", 404);
    return wrapResponse(order);
  }

  if (cleanPath.endsWith('/cancel') && method === 'POST') {
    if (!currentUser) return wrapError("Unauthorized", 401);
    const parts = cleanPath.split('/');
    const orderId = parseInt(parts[parts.length - 2]);
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = "CANCELLED";
      saveOrders(orders);
      return wrapResponse(orders[idx], "Order cancelled successfully");
    }
    return wrapError("Order not found", 404);
  }

  // Owner Routing
  if (cleanPath === '/api/owner/dashboard/stats' && method === 'GET') {
    if (!currentUser || (currentUser.role !== 'RESTAURANT_OWNER' && currentUser.role !== 'ADMIN')) {
      return wrapError("Access Denied", 403);
    }
    const rests = getRestaurants().filter(r => r.ownerId === currentUser.id);
    const orders = getOrders().filter(o => rests.some(r => r.id === o.restaurantId));
    const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((acc, o) => acc + o.totalAmount, 0);
    const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
    
    const salesDistribution = rests.map(r => {
      const restOrders = orders.filter(o => o.restaurantId === r.id && o.status !== 'CANCELLED');
      const revenue = restOrders.reduce((acc, o) => acc + o.totalAmount, 0);
      return {
        restaurantName: r.name,
        revenue,
        orderCount: restOrders.length
      };
    });

    return wrapResponse({
      totalRestaurants: rests.length,
      totalRevenue,
      totalOrders: orders.length,
      activeOrders,
      salesDistribution
    });
  }

  if (cleanPath === '/api/owner/orders' && method === 'GET') {
    if (!currentUser || (currentUser.role !== 'RESTAURANT_OWNER' && currentUser.role !== 'ADMIN')) {
      return wrapError("Access Denied", 403);
    }
    const rests = getRestaurants().filter(r => r.ownerId === currentUser.id);
    const allOrders = getOrders().filter(o => rests.some(r => r.id === o.restaurantId));
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const params = new URLSearchParams(queryString || '');
    const page = parseInt(params.get('page') || '0');
    const size = parseInt(params.get('size') || '10');
    const content = allOrders.slice(page * size, (page + 1) * size);
    return wrapResponse({
      content,
      totalElements: allOrders.length,
      totalPages: Math.ceil(allOrders.length / size),
      number: page,
      size
    });
  }

  if (cleanPath.startsWith('/api/owner/orders/') && cleanPath.endsWith('/status') && method === 'PUT') {
    if (!currentUser || (currentUser.role !== 'RESTAURANT_OWNER' && currentUser.role !== 'ADMIN')) {
      return wrapError("Access Denied", 403);
    }
    const parts = cleanPath.split('/');
    const orderId = parseInt(parts[parts.length - 2]);
    const params = new URLSearchParams(queryString || '');
    const status = params.get('status') || body.status;
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
      orders[idx].status = status;
      if (status === 'DELIVERED') {
        orders[idx].paymentStatus = 'PAID';
      }
      saveOrders(orders);
      return wrapResponse(orders[idx], `Order status updated to ${status}`);
    }
    return wrapError("Order not found", 404);
  }

  if (cleanPath === '/api/owner/restaurants' && method === 'GET') {
    if (!currentUser || (currentUser.role !== 'RESTAURANT_OWNER' && currentUser.role !== 'ADMIN')) {
      return wrapError("Access Denied", 403);
    }
    const rests = getRestaurants().filter(r => r.ownerId === currentUser.id);
    return wrapResponse({
      content: rests,
      totalElements: rests.length,
      totalPages: 1,
      number: 0,
      size: 20
    });
  }

  if (cleanPath === '/api/owner/restaurants' && method === 'POST') {
    if (!currentUser || (currentUser.role !== 'RESTAURANT_OWNER' && currentUser.role !== 'ADMIN')) {
      return wrapError("Access Denied", 403);
    }
    const rests = getRestaurants();
    const newRest = {
      id: rests.length + 1,
      name: body.name,
      description: body.description,
      image: body.image || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
      coverImage: body.coverImage || "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200",
      address: body.address,
      city: body.city || "Mumbai",
      latitude: body.latitude || 19.0,
      longitude: body.longitude || 72.0,
      cuisineType: body.cuisineType,
      deliveryTime: body.deliveryTime || 30,
      minimumOrder: body.minimumOrder || 150,
      openingTime: body.openingTime || "11:00 AM",
      closingTime: body.closingTime || "11:00 PM",
      rating: 0.0,
      numRatings: 0,
      ownerId: currentUser.id,
      menuItems: []
    };
    rests.push(newRest);
    saveRestaurants(rests);
    return wrapResponse(newRest, "Restaurant created successfully");
  }

  if (cleanPath.startsWith('/api/owner/restaurants/') && cleanPath.endsWith('/menu') && method === 'POST') {
    if (!currentUser || (currentUser.role !== 'RESTAURANT_OWNER' && currentUser.role !== 'ADMIN')) {
      return wrapError("Access Denied", 403);
    }
    const restId = parseInt(cleanPath.split('/')[4]);
    const rests = getRestaurants();
    const idx = rests.findIndex(r => r.id === restId);
    if (idx !== -1) {
      const menuItems = rests[idx].menuItems || [];
      const newMenu = {
        id: Math.floor(Math.random() * 10000) + 100,
        name: body.name,
        description: body.description,
        price: body.price,
        category: body.category,
        image: body.image || "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300",
        veg: body.veg
      };
      menuItems.push(newMenu);
      rests[idx].menuItems = menuItems;
      saveRestaurants(rests);
      return wrapResponse(newMenu, "Menu item added successfully");
    }
    return wrapError("Restaurant not found", 404);
  }

  // Admin Routing
  if (cleanPath === '/api/admin/dashboard/stats' && method === 'GET') {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return wrapError("Access Denied", 403);
    }
    const users = getUsers();
    const rests = getRestaurants();
    const orders = getOrders();
    const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((acc, o) => acc + o.totalAmount, 0);
    const activeOrders = orders.filter(o => o.status !== 'DELIVERED' && o.status !== 'CANCELLED').length;
    
    const topRestaurants = rests.map(r => {
      const count = orders.filter(o => o.restaurantId === r.id).length;
      return {
        id: r.id,
        name: r.name,
        cuisineType: r.cuisineType,
        rating: r.rating,
        orderCount: count
      };
    });
    topRestaurants.sort((a, b) => b.orderCount - a.orderCount);

    return wrapResponse({
      totalUsers: users.length,
      totalRestaurants: rests.length,
      totalOrders: orders.length,
      totalRevenue,
      activeOrders,
      topRestaurants: topRestaurants.slice(0, 5)
    });
  }

  if (cleanPath === '/api/admin/users' && method === 'GET') {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return wrapError("Access Denied", 403);
    }
    const allUsers = getUsers().map(u => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      phone: u.phone
    }));
    const params = new URLSearchParams(queryString || '');
    const page = parseInt(params.get('page') || '0');
    const size = parseInt(params.get('size') || '10');
    const content = allUsers.slice(page * size, (page + 1) * size);
    return wrapResponse({
      content,
      totalElements: allUsers.length,
      totalPages: Math.ceil(allUsers.length / size),
      number: page,
      size
    });
  }

  if (cleanPath.startsWith('/api/admin/users/') && cleanPath.endsWith('/role') && method === 'PUT') {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return wrapError("Access Denied", 403);
    }
    const parts = cleanPath.split('/');
    const userId = parseInt(parts[parts.length - 2]);
    const params = new URLSearchParams(queryString || '');
    const role = params.get('role') || body.role;
    const users = getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].role = role;
      saveUsers(users);
      return wrapResponse(null, "User role updated successfully");
    }
    return wrapError("User not found", 404);
  }

  if (cleanPath.startsWith('/api/admin/users/') && method === 'DELETE') {
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return wrapError("Access Denied", 403);
    }
    const userId = parseInt(cleanPath.split('/').pop());
    const users = getUsers();
    const updated = users.filter(u => u.id !== userId);
    saveUsers(updated);
    return wrapResponse(null, "User deleted successfully");
  }

  return wrapError("Mock endpoint not implemented", 404);
};

// Request Interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle fallback mock database on network errors and token refresh on 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Fallback: If network error (backend server is not running), use mock local database
    if (!error.response || error.code === 'ERR_NETWORK') {
      console.warn("[API Interceptor] Backend unreachable. Falling back to local mock database...");
      try {
        const mockResponse = await handleMockRequest(originalRequest);
        return mockResponse;
      } catch (mockError) {
        return Promise.reject(mockError);
      }
    }

    // Check if it's a 401 error and not a login request
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/api/auth/login')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        window.dispatchEvent(new Event('auth-expired'));
        return Promise.reject(error);
      }

      // Check if using mock refresh token
      if (refreshToken.startsWith('mock-refresh-')) {
        const email = refreshToken.replace('mock-refresh-', '');
        const accessToken = `mock-token-${email}`;
        const newRefreshToken = `mock-refresh-${email}`;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        isRefreshing = false;
        return api(originalRequest);
      }

      try {
        const response = await axios.post('http://localhost:8080/api/auth/refresh', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.dispatchEvent(new Event('auth-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
