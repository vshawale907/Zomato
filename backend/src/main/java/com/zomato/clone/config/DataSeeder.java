package com.zomato.clone.config;

import com.zomato.clone.entity.*;
import com.zomato.clone.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Already seeded
        }

        // 1. Create Users
        User customer = User.builder()
                .fullName("John Customer")
                .email("customer@gmail.com")
                .phone("9876543210")
                .password(passwordEncoder.encode("password"))
                .role(Role.CUSTOMER)
                .profileImage("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150")
                .build();

        User owner = User.builder()
                .fullName("Alice Merchant")
                .email("owner@gmail.com")
                .phone("9876543211")
                .password(passwordEncoder.encode("password"))
                .role(Role.RESTAURANT_OWNER)
                .profileImage("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150")
                .build();

        User admin = User.builder()
                .fullName("Super Administrator")
                .email("admin@gmail.com")
                .phone("9876543212")
                .password(passwordEncoder.encode("password"))
                .role(Role.ADMIN)
                .profileImage("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150")
                .build();

        userRepository.saveAll(List.of(customer, owner, admin));

        // 2. Create Saved Addresses for customer
        Address addr1 = Address.builder()
                .street("Flat 402, Sea Breeze Apartments, Bandra West")
                .city("Mumbai")
                .state("Maharashtra")
                .zipCode("400050")
                .isDefault(true)
                .user(customer)
                .build();

        Address addr2 = Address.builder()
                .street("12th Floor, Cyber Towers, Hitec City")
                .city("Hyderabad")
                .state("Telangana")
                .zipCode("500081")
                .isDefault(false)
                .user(customer)
                .build();

        addressRepository.saveAll(List.of(addr1, addr2));

        // 3. Create Restaurants (City: Mumbai)
        Restaurant r1 = Restaurant.builder()
                .name("Pizza Suprema")
                .description("Voted best artisanal sourdough wood-fired pizzas in the city.")
                .image("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500")
                .coverImage("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200")
                .address("Hill Road, Bandra West")
                .city("Mumbai")
                .latitude(19.0544)
                .longitude(72.8294)
                .cuisineType("Pizza, Italian, Fast Food")
                .deliveryTime(25)
                .minimumOrder(200.0)
                .openingTime("11:00 AM")
                .closingTime("11:00 PM")
                .owner(owner)
                .build();

        Restaurant r2 = Restaurant.builder()
                .name("The Royal Biryani")
                .description("Experience authentic Nizami and Lucknowi dum cooked biryanis.")
                .image("https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500")
                .coverImage("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200")
                .address("Linking Road, Santacruz West")
                .city("Mumbai")
                .latitude(19.0822)
                .longitude(72.8361)
                .cuisineType("North Indian, Biryani, Mughlai")
                .deliveryTime(35)
                .minimumOrder(300.0)
                .openingTime("12:00 PM")
                .closingTime("11:30 PM")
                .owner(owner)
                .build();

        Restaurant r3 = Restaurant.builder()
                .name("Bonsai Greens")
                .description("Fresh gourmet salads, high-protein wraps, and cold-pressed juices.")
                .image("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500")
                .coverImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200")
                .address("Colaba Causeway, South Mumbai")
                .city("Mumbai")
                .latitude(18.9218)
                .longitude(72.8322)
                .cuisineType("Healthy Food, Salad, Beverages")
                .deliveryTime(20)
                .minimumOrder(150.0)
                .openingTime("08:00 AM")
                .closingTime("10:00 PM")
                .owner(owner)
                .build();

        Restaurant r4 = Restaurant.builder()
                .name("Delhi Chaat Bhandar")
                .description("Crispy golgappas, tangy dahi bhallas, and spicy aloo tikki chat.")
                .image("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500")
                .coverImage("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200")
                .address("Connaught Place")
                .city("Delhi")
                .latitude(28.6304)
                .longitude(77.2177)
                .cuisineType("Street Food, Fast Food, Snacks")
                .deliveryTime(15)
                .minimumOrder(100.0)
                .openingTime("10:00 AM")
                .closingTime("09:30 PM")
                .owner(owner)
                .build();

        restaurantRepository.saveAll(List.of(r1, r2, r3, r4));

        // 4. Create Menu Items for Pizza Suprema
        MenuItem m1 = MenuItem.builder()
                .name("Margherita Sourdough")
                .description("San Marzano tomato sauce, fresh mozzarella, fresh basil, extra virgin olive oil.")
                .price(350.0)
                .category("Main Course")
                .image("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300")
                .veg(true)
                .restaurant(r1)
                .build();

        MenuItem m2 = MenuItem.builder()
                .name("Double Cheese Garlic Bread")
                .description("Toasted baguette slices topped with house garlic butter and melted mozzarella.")
                .price(180.0)
                .category("Starters")
                .image("https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300")
                .veg(true)
                .restaurant(r1)
                .build();

        MenuItem m3 = MenuItem.builder()
                .name("Tiramisu Cup")
                .description("Layers of espresso-soaked ladyfingers and creamy mascarpone filling.")
                .price(220.0)
                .category("Desserts")
                .image("https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300")
                .veg(true)
                .restaurant(r1)
                .build();

        MenuItem m4 = MenuItem.builder()
                .name("Iced Peach Tea")
                .description("Refreshing brewed black tea infused with natural sweet peach syrup.")
                .price(110.0)
                .category("Beverages")
                .image("https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300")
                .veg(true)
                .restaurant(r1)
                .build();

        // Menu items for Royal Biryani
        MenuItem m5 = MenuItem.builder()
                .name("Galouti Kebab (4 Pcs)")
                .description("Melt-in-mouth minced mutton kebabs served with mint chutney and onion rings.")
                .price(320.0)
                .category("Starters")
                .image("https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300")
                .veg(false)
                .restaurant(r2)
                .build();

        MenuItem m6 = MenuItem.builder()
                .name("Hyderabadi Chicken Dum Biryani")
                .description("Fragrant basmati rice layered with spiced marinated chicken and slow-cooked in dum style.")
                .price(290.0)
                .category("Main Course")
                .image("https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=300")
                .veg(false)
                .restaurant(r2)
                .build();

        MenuItem m7 = MenuItem.builder()
                .name("Shahi Tukda")
                .description("Crispy fried bread slices soaked in cardamon flavored milk syrup and dry fruits.")
                .price(140.0)
                .category("Desserts")
                .image("https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=300")
                .veg(true)
                .restaurant(r2)
                .build();

        // Menu items for Bonsai Greens
        MenuItem m8 = MenuItem.builder()
                .name("Avocado Quinoa Salad bowl")
                .description("Organic quinoa, fresh avocado, cherry tomatoes, cucumbers, mixed greens in honey-lemon glaze.")
                .price(240.0)
                .category("Main Course")
                .image("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300")
                .veg(true)
                .restaurant(r3)
                .build();

        MenuItem m9 = MenuItem.builder()
                .name("Detox Green Juice")
                .description("Cold pressed kale, green apple, cucumber, celery, celery, ginger, lemon.")
                .price(160.0)
                .category("Beverages")
                .image("https://images.unsplash.com/photo-1610970881699-44a5587caaec?w=300")
                .veg(true)
                .restaurant(r3)
                .build();

        // Menu items for Delhi Chaat Bhandar
        MenuItem m10 = MenuItem.builder()
                .name("Special Dahi Bhalla")
                .description("Soft lentil dumplings soaked in creamy sweetened yogurt topped with tamarind & mint chutneys.")
                .price(120.0)
                .category("Starters")
                .image("https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=300")
                .veg(true)
                .restaurant(r4)
                .build();

        menuItemRepository.saveAll(List.of(m1, m2, m3, m4, m5, m6, m7, m8, m9, m10));

        // 5. Create Sample Reviews to calculate default ratings
        Review rev1 = Review.builder()
                .user(customer)
                .restaurant(r1)
                .rating(4.5)
                .comment("Best margherita pizza I have eaten in a long time! Highly recommend!")
                .build();

        Review rev2 = Review.builder()
                .user(admin)
                .restaurant(r1)
                .rating(4.0)
                .comment("Very good delivery speed and packaging. Garlic bread was cheese-filled.")
                .build();

        Review rev3 = Review.builder()
                .user(customer)
                .restaurant(r2)
                .rating(5.0)
                .comment("The chicken biryani was so flavor-packed and chicken pieces were tender.")
                .build();

        Review rev4 = Review.builder()
                .user(customer)
                .restaurant(r3)
                .rating(4.2)
                .comment("Healthy, clean, and delicious food. Perfect if you are on a calorie deficit.")
                .build();

        reviewRepository.saveAll(List.of(rev1, rev2, rev3, rev4));

        // Update ratings
        r1.setRating(4.3);
        r1.setNumRatings(2);
        r2.setRating(5.0);
        r2.setNumRatings(1);
        r3.setRating(4.2);
        r3.setNumRatings(1);
        r4.setRating(0.0);
        r4.setNumRatings(0);

        restaurantRepository.saveAll(List.of(r1, r2, r3, r4));
    }
}
