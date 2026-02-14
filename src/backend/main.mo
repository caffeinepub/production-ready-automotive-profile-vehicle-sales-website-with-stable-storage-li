import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Admin User Management Types
  public type AdminUser = {
    id : Nat;
    email : Text;
    passwordHash : Text;
    role : Text; // "admin" or "superadmin"
    createdAt : Int;
  };

  public type AdminSession = {
    token : Text;
    userId : Nat;
    role : Text;
    expiresAt : Int;
  };

  // Stable storage for admin users and sessions
  let adminUsers = Map.empty<Nat, AdminUser>();
  let adminUsersByEmail = Map.empty<Text, Nat>();
  let adminSessions = Map.empty<Text, AdminSession>();
  var nextAdminUserId : Nat = 1;

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  public type Variant = {
    name : Text;
    priceAdjustment : Nat;
    features : [Text];
    isPremium : Bool;
  };

  public type CommercialVehicleFeatures = {
    economical : Bool;
    power : Bool;
    speed : Bool;
    capacity : Bool;
    bus : Bool;
    fourByTwo : Bool;
    sixByTwo : Bool;
    sixByFour : Bool;
  };

  public type TechnicalSpecs = {
    engine : Text;
    transmission : Text;
    dimensions : Text;
    weight : Text;
    fuelCapacity : Text;
    suspension : Text;
    additionalFeatures : [Text];
  };

  public type Vehicle = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    videoUrl : ?Text;
    variants : [Variant];
    isCommercial : Bool;
    brochure : Text;
    specs : TechnicalSpecs;
    commercialFeatures : ?CommercialVehicleFeatures;
    published : Bool;
  };

  public type Promotion = {
    id : Nat;
    title : Text;
    description : Text;
    terms : Text;
    validUntil : Text;
    imageUrl : Text;
    published : Bool;
  };

  public type Testimonial = {
    id : Nat;
    customerName : Text;
    city : Text;
    review : Text;
    rating : Float;
    imageUrl : Text;
    published : Bool;
  };

  public type BlogPost = {
    id : Nat;
    title : Text;
    content : Text;
    author : Text;
    publishDate : Text;
    imageUrl : Text;
    seoTitle : Text;
    seoDescription : Text;
    views : Nat;
    likes : Nat;
    published : Bool;
  };

  public type Contact = {
    name : Text;
    address : Text;
    phoneNumber : Text;
    email : Text;
    message : Text;
    unit : Text;
    downPayment : ?Float;
    tenor : ?Nat;
    notes : ?Text;
    date : Text;
  };

  public type CreditSimulation = Contact;

  public type MediaAsset = {
    id : Nat;
    url : Text;
    typ : Text;
    size : Nat;
    folder : Text;
  };

  public type Interaction = {
    itemId : Nat;
    likes : Nat;
    shares : Nat;
    sharesWhatsApp : Nat;
    sharesFacebook : Nat;
    sharesTwitter : Nat;
  };

  public type VisitorStats = {
    totalVisitors : Nat;
    activeUsers : Nat;
    pageViews : Nat;
    todayTraffic : Nat;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let vehicles = Map.empty<Nat, Vehicle>();
  let promotions = Map.empty<Nat, Promotion>();
  let testimonials = Map.empty<Nat, Testimonial>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let contacts = Map.empty<Nat, Contact>();
  let creditSimulations = Map.empty<Nat, CreditSimulation>();
  let mediaAssets = Map.empty<Nat, MediaAsset>();
  let productInteractions = Map.empty<Nat, Interaction>();

  var visitorStats : VisitorStats = {
    totalVisitors = 0;
    activeUsers = 0;
    pageViews = 0;
    todayTraffic = 0;
  };

  // Helper function: Simple password hashing (salted)
  // Note: In production, use a proper cryptographic library
  private func hashPassword(password : Text, salt : Text) : Text {
    let combined = password # salt;
    let bytes = combined.encodeUtf8();
    let hash = bytes.hash().toText();
    hash;
  };

  // Helper function: Generate session token
  private func generateSessionToken(userId : Nat) : Text {
    let timestamp = Time.now();
    let tokenData = userId.toText() # Int.toText(timestamp);
    let bytes = tokenData.encodeUtf8();
    let hash = bytes.hash().toText();
    hash;
  };

  // Helper function: Validate admin session token
  private func validateAdminSession(token : Text) : ?AdminSession {
    switch (adminSessions.get(token)) {
      case (?session) {
        let now = Time.now();
        if (session.expiresAt > now) {
          ?session;
        } else {
          // Session expired, remove it
          adminSessions.remove(token);
          null;
        };
      };
      case null { null };
    };
  };

  // Admin Authentication API
  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async ?{ token : Text; role : Text } {
    // Find user by email
    switch (adminUsersByEmail.get(email)) {
      case (?userId) {
        switch (adminUsers.get(userId)) {
          case (?user) {
            // Verify password (with salt = email for simplicity)
            let expectedHash = hashPassword(password, email);
            if (expectedHash == user.passwordHash) {
              // Create session token
              let token = generateSessionToken(userId);
              let sessionExpiry = Time.now() + (24 * 60 * 60 * 1_000_000_000); // 24 hours
              let session : AdminSession = {
                token = token;
                userId = userId;
                role = user.role;
                expiresAt = sessionExpiry;
              };
              adminSessions.add(token, session);
              ?{ token = token; role = user.role };
            } else {
              null; // Invalid password
            };
          };
          case null { null };
        };
      };
      case null { null }; // User not found
    };
  };

  // Admin logout
  public shared ({ caller }) func adminLogout(token : Text) : async () {
    adminSessions.remove(token);
  };

  // Create admin user (protected - only existing admins or initialization)
  public shared ({ caller }) func createAdminUser(email : Text, password : Text, role : Text) : async ?Nat {
    // Check if this is initialization (no admin users exist) or caller is admin
    let isInitialization = adminUsers.size() == 0;
    if (not isInitialization and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create admin users");
    };

    // Check if email already exists
    switch (adminUsersByEmail.get(email)) {
      case (?_) { return null }; // Email already exists
      case null {};
    };

    let userId = nextAdminUserId;
    nextAdminUserId += 1;

    let passwordHash = hashPassword(password, email);
    let adminUser : AdminUser = {
      id = userId;
      email = email;
      passwordHash = passwordHash;
      role = role;
      createdAt = Time.now();
    };

    adminUsers.add(userId, adminUser);
    adminUsersByEmail.add(email, userId);
    ?userId;
  };

  // Validate session and check admin permission
  private func requireAdminSession(token : Text) : AdminSession {
    switch (validateAdminSession(token)) {
      case (?session) { session };
      case null {
        Runtime.trap("Unauthorized: Invalid or expired admin session");
      };
    };
  };

  // User Profile Management - User-level access
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Vehicle Management - Admin-only CRUD (requires session token)
  public shared ({ caller }) func createVehicle(sessionToken : Text, vehicle : Vehicle) : async () {
    let session = requireAdminSession(sessionToken);
    vehicles.add(vehicle.id, vehicle);
  };

  public shared ({ caller }) func updateVehicle(sessionToken : Text, vehicle : Vehicle) : async () {
    let session = requireAdminSession(sessionToken);
    vehicles.add(vehicle.id, vehicle);
  };

  public shared ({ caller }) func deleteVehicle(sessionToken : Text, id : Nat) : async () {
    let session = requireAdminSession(sessionToken);
    vehicles.remove(id);
  };

  // Promotion Management - Admin-only CRUD (requires session token)
  public shared ({ caller }) func createPromotion(sessionToken : Text, promotion : Promotion) : async () {
    let session = requireAdminSession(sessionToken);
    promotions.add(promotion.id, promotion);
  };

  public shared ({ caller }) func updatePromotion(sessionToken : Text, promotion : Promotion) : async () {
    let session = requireAdminSession(sessionToken);
    promotions.add(promotion.id, promotion);
  };

  public shared ({ caller }) func deletePromotion(sessionToken : Text, id : Nat) : async () {
    let session = requireAdminSession(sessionToken);
    promotions.remove(id);
  };

  // Testimonial Management - Admin-only CRUD (requires session token)
  public shared ({ caller }) func createTestimonial(sessionToken : Text, testimonial : Testimonial) : async () {
    let session = requireAdminSession(sessionToken);
    testimonials.add(testimonial.id, testimonial);
  };

  public shared ({ caller }) func updateTestimonial(sessionToken : Text, testimonial : Testimonial) : async () {
    let session = requireAdminSession(sessionToken);
    testimonials.add(testimonial.id, testimonial);
  };

  public shared ({ caller }) func deleteTestimonial(sessionToken : Text, id : Nat) : async () {
    let session = requireAdminSession(sessionToken);
    testimonials.remove(id);
  };

  // Blog Post Management - Admin-only CRUD (requires session token)
  public shared ({ caller }) func createBlogPost(sessionToken : Text, post : BlogPost) : async () {
    let session = requireAdminSession(sessionToken);
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func updateBlogPost(sessionToken : Text, post : BlogPost) : async () {
    let session = requireAdminSession(sessionToken);
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func deleteBlogPost(sessionToken : Text, id : Nat) : async () {
    let session = requireAdminSession(sessionToken);
    blogPosts.remove(id);
  };

  // Contact Management - Public submission, Admin-only viewing/deletion (requires session token)
  public shared ({ caller }) func addContact(contact : Contact) : async () {
    // Public endpoint - anyone can submit a contact form (including guests)
    let uniqueId = contacts.size() + 1;
    contacts.add(uniqueId, contact);
  };

  public query ({ caller }) func getContacts(sessionToken : Text) : async [Contact] {
    // Validate session in query context
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        contacts.values().toArray();
      };
      case null {
        Runtime.trap("Unauthorized: Invalid or expired admin session");
      };
    };
  };

  public shared ({ caller }) func deleteContact(sessionToken : Text, id : Nat) : async () {
    let session = requireAdminSession(sessionToken);
    contacts.remove(id);
  };

  // Credit Simulation Management - Public submission, Admin-only viewing/deletion (requires session token)
  public shared ({ caller }) func addCreditSimulation(simulation : CreditSimulation) : async () {
    // Public endpoint - anyone can submit a credit simulation (including guests)
    let uniqueId = creditSimulations.size() + 1;
    creditSimulations.add(uniqueId, simulation);
  };

  public query ({ caller }) func getCreditSimulations(sessionToken : Text) : async [CreditSimulation] {
    // Validate session in query context
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        creditSimulations.values().toArray();
      };
      case null {
        Runtime.trap("Unauthorized: Invalid or expired admin session");
      };
    };
  };

  public shared ({ caller }) func deleteCreditSimulation(sessionToken : Text, id : Nat) : async () {
    let session = requireAdminSession(sessionToken);
    creditSimulations.remove(id);
  };

  // Media Asset Management - Admin-only (requires session token)
  public shared ({ caller }) func createMediaAsset(sessionToken : Text, asset : MediaAsset) : async () {
    let session = requireAdminSession(sessionToken);
    mediaAssets.add(asset.id, asset);
  };

  public shared ({ caller }) func deleteMediaAsset(sessionToken : Text, id : Nat) : async () {
    let session = requireAdminSession(sessionToken);
    mediaAssets.remove(id);
  };

  public query ({ caller }) func getMediaAssets(sessionToken : Text) : async [MediaAsset] {
    // Validate session in query context
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        mediaAssets.values().toArray();
      };
      case null {
        Runtime.trap("Unauthorized: Invalid or expired admin session");
      };
    };
  };

  // Product Interactions - User-level access for actions, public for viewing
  public shared ({ caller }) func likeProduct(itemId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can like products");
    };
    let interaction = productInteractions.get(itemId);
    switch (interaction) {
      case (?existing) {
        let updated = {
          itemId = existing.itemId;
          likes = existing.likes + 1;
          shares = existing.shares;
          sharesWhatsApp = existing.sharesWhatsApp;
          sharesFacebook = existing.sharesFacebook;
          sharesTwitter = existing.sharesTwitter;
        };
        productInteractions.add(itemId, updated);
      };
      case null {
        let newInteraction = {
          itemId = itemId;
          likes = 1;
          shares = 0;
          sharesWhatsApp = 0;
          sharesFacebook = 0;
          sharesTwitter = 0;
        };
        productInteractions.add(itemId, newInteraction);
      };
    };
  };

  public shared ({ caller }) func shareProduct(itemId : Nat, platform : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can share products");
    };
    let interaction = productInteractions.get(itemId);
    switch (interaction) {
      case (?existing) {
        let updated = {
          itemId = existing.itemId;
          likes = existing.likes;
          shares = existing.shares + 1;
          sharesWhatsApp = if (platform == "whatsapp") { existing.sharesWhatsApp + 1 } else { existing.sharesWhatsApp };
          sharesFacebook = if (platform == "facebook") { existing.sharesFacebook + 1 } else { existing.sharesFacebook };
          sharesTwitter = if (platform == "twitter") { existing.sharesTwitter + 1 } else { existing.sharesTwitter };
        };
        productInteractions.add(itemId, updated);
      };
      case null {
        let newInteraction = {
          itemId = itemId;
          likes = 0;
          shares = 1;
          sharesWhatsApp = if (platform == "whatsapp") { 1 } else { 0 };
          sharesFacebook = if (platform == "facebook") { 1 } else { 0 };
          sharesTwitter = if (platform == "twitter") { 1 } else { 0 };
        };
        productInteractions.add(itemId, newInteraction);
      };
    };
  };

  public query ({ caller }) func getProductInteraction(itemId : Nat) : async ?Interaction {
    // Public endpoint - anyone can view interaction stats
    productInteractions.get(itemId);
  };

  // Analytics - Public tracking, Admin-only for stats management (requires session token)
  public shared ({ caller }) func incrementPageView() : async () {
    // Public endpoint - allows tracking of all visitors including guests
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews + 1;
      todayTraffic = visitorStats.todayTraffic;
    };
  };

  public shared ({ caller }) func incrementVisitor() : async () {
    // Public endpoint - allows tracking of all visitors including guests
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors + 1;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews;
      todayTraffic = visitorStats.todayTraffic + 1;
    };
  };

  public query ({ caller }) func getVisitorStats(sessionToken : Text) : async VisitorStats {
    // Validate session in query context
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        visitorStats;
      };
      case null {
        Runtime.trap("Unauthorized: Invalid or expired admin session");
      };
    };
  };

  public shared ({ caller }) func updateVisitorStats(sessionToken : Text, stats : VisitorStats) : async () {
    let session = requireAdminSession(sessionToken);
    visitorStats := stats;
  };

  // Public Query Endpoints - No authorization required
  public query ({ caller }) func getVehicles() : async [Vehicle] {
    vehicles.values().toArray();
  };

  public query ({ caller }) func getVehicle(id : Nat) : async ?Vehicle {
    vehicles.get(id);
  };

  public query ({ caller }) func getPromotions() : async [Promotion] {
    promotions.values().toArray();
  };

  public query ({ caller }) func getPromotion(id : Nat) : async ?Promotion {
    promotions.get(id);
  };

  public query ({ caller }) func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  public query ({ caller }) func getBlogPosts() : async [BlogPost] {
    blogPosts.values().toArray();
  };

  public query ({ caller }) func getBlogPost(id : Nat) : async ?BlogPost {
    blogPosts.get(id);
  };
};
