import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Debug "mo:core/Debug";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
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
    status : Text; // "Active" or "Inactive"
  };

  public type AdminSession = {
    token : Text;
    userId : Nat;
    role : Text;
    expiresAt : Int;
  };

  var debugEnabled = false;

  public type AdminLoginDebugReport = {
    userFound : Bool;
    passwordMatch : Bool;
    hashCompareMethod : DebugHashCompareMethod;
    sessionCreated : Bool;
    error : ?Text;
  };

  public type DebugHashCompareMethod = {
    #textCompare;
    #bytesEqual;
    #hybridCompare;
    #failed;
  };

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

  var superAdminSeeded = false;

  system func postupgrade() {
    Debug.print("Admin users after upgrade: " # adminUsers.size().toText());
  };

  func seedSuperAdmin() {
    if (superAdminSeeded) {
      return;
    };

    let superAdminEmail = "puadsolihan@gmail.com";
    let superAdminPassword = "66669999";

    switch (adminUsersByEmail.get(superAdminEmail)) {
      case (?existingId) {
        switch (adminUsers.get(existingId)) {
          case (?existingAdmin) {
            let updatedSuperAdmin : AdminUser = {
              id = existingAdmin.id;
              email = superAdminEmail;
              passwordHash = hashPassword(superAdminPassword, superAdminEmail);
              role = "Super Admin";
              createdAt = existingAdmin.createdAt;
              status = "Active";
            };
            adminUsers.add(existingAdmin.id, updatedSuperAdmin);
          };
          case null {};
        };
      };
      case null {
        let superAdminId = nextAdminUserId;
        nextAdminUserId += 1;

        let newSuperAdmin : AdminUser = {
          id = superAdminId;
          email = superAdminEmail;
          passwordHash = hashPassword(superAdminPassword, superAdminEmail);
          role = "Super Admin";
          createdAt = Time.now();
          status = "Active";
        };

        adminUsers.add(superAdminId, newSuperAdmin);
        adminUsersByEmail.add(superAdminEmail, superAdminId);
      };
    };

    superAdminSeeded := true;
    Debug.print("Super Admin seeded. Total admin users: " # adminUsers.size().toText());
  };

  private func hashPassword(password : Text, salt : Text) : Text {
    let combined = password # salt;
    let bytes = combined.encodeUtf8();
    let hash = bytes.hash().toText();
    hash;
  };

  private func generateSessionToken(userId : Nat) : Text {
    let timestamp = Time.now();
    let tokenData = userId.toText() # Int.toText(timestamp);
    let bytes = tokenData.encodeUtf8();
    let hash = bytes.hash().toText();
    hash;
  };

  private func validateAdminSession(token : Text) : ?AdminSession {
    switch (adminSessions.get(token)) {
      case (?session) {
        let now = Time.now();
        if (session.expiresAt > now) {
          ?session;
        } else {
          adminSessions.remove(token);
          null;
        };
      };
      case null { null };
    };
  };

  // Make debug function available to everyone via debug toggle.
  public shared ({ caller }) func debugAdminLogin(email : Text, password : Text, sessionToken : ?Text) : async AdminLoginDebugReport {
    // Check if debug mode is enabled
    if (not debugEnabled) {
      Runtime.trap("Access denied");
    };
    // Only allow debug login if debug is toggled explicitly
    switch (adminUsersByEmail.get(email)) {
      case (?userId) {
        switch (adminUsers.get(userId)) {
          case (?user) {
            if (user.status != "Active") {
              return {
                userFound = true;
                passwordMatch = false;
                hashCompareMethod = #failed;
                sessionCreated = false;
                error = ?"Your account is not active.";
              };
            };

            let expectedHash = hashPassword(password, email);
            if (expectedHash == user.passwordHash) {
              let token = generateSessionToken(userId);
              let sessionExpiry = Time.now() + (24 * 60 * 60 * 1_000_000_000);
              let session : AdminSession = {
                token = token;
                userId = userId;
                role = user.role;
                expiresAt = sessionExpiry;
              };
              adminSessions.add(token, session);
              {
                userFound = true;
                passwordMatch = true;
                hashCompareMethod = #textCompare;
                sessionCreated = true;
                error = null;
              };
            } else if (expectedHash.encodeUtf8() == user.passwordHash.encodeUtf8()) {
              let token = generateSessionToken(userId);
              let sessionExpiry = Time.now() + (24 * 60 * 60 * 1_000_000_000);
              let session : AdminSession = {
                token = token;
                userId = userId;
                role = user.role;
                expiresAt = sessionExpiry;
              };
              adminSessions.add(token, session);
              {
                userFound = true;
                passwordMatch = true;
                hashCompareMethod = #hybridCompare;
                sessionCreated = true;
                error = null;
              };
            } else {
              {
                userFound = true;
                passwordMatch = false;
                hashCompareMethod = #textCompare;
                sessionCreated = false;
                error = ?"Invalid password";
              };
            };
          };
          case null {
            {
              userFound = false;
              passwordMatch = false;
              hashCompareMethod = #failed;
              sessionCreated = false;
              error = ?"User record corrupt";
            };
          };
        };
      };
      case null {
        {
          userFound = false;
          passwordMatch = false;
          hashCompareMethod = #failed;
          sessionCreated = false;
          error = ?"User not found";
        };
      };
    };
  };

  public shared ({ caller }) func adminLogin(email : Text, password : Text) : async ?{ token : Text; role : Text } {
    switch (adminUsersByEmail.get(email)) {
      case (?userId) {
        switch (adminUsers.get(userId)) {
          case (?user) {
            if (user.status != "Active") {
              return null;
            };

            let expectedHash = hashPassword(password, email);
            if (expectedHash == user.passwordHash) {
              let token = generateSessionToken(userId);
              let sessionExpiry = Time.now() + (24 * 60 * 60 * 1_000_000_000);
              let session : AdminSession = {
                token = token;
                userId = userId;
                role = user.role;
                expiresAt = sessionExpiry;
              };
              adminSessions.add(token, session);
              ?{ token = token; role = user.role };
            } else {
              null;
            };
          };
          case null { null };
        };
      };
      case null { null };
    };
  };

  public shared ({ caller }) func adminLogout(token : Text) : async () {
    adminSessions.remove(token);
  };

  public shared ({ caller }) func createAdminUser(sessionToken : Text, email : Text, password : Text, role : Text) : async ?Nat {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create admin users");
    };

    let session = requireAdminSession(sessionToken);

    if (session.role != "Super Admin") {
      Runtime.trap("Unauthorized: Only Super Admins can create admin users");
    };

    switch (adminUsersByEmail.get(email)) {
      case (?_) { return null };
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
      status = "Active";
    };

    adminUsers.add(userId, adminUser);
    adminUsersByEmail.add(email, userId);
    ?userId;
  };

  private func requireAdminSession(token : Text) : AdminSession {
    switch (validateAdminSession(token)) {
      case (?session) { session };
      case null {
        Runtime.trap("Unauthorized: Invalid or expired admin session");
      };
    };
  };

  public shared ({ caller }) func toggleDebugMode(state : Bool) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can toggle debug mode");
    };
    debugEnabled := state;
  };

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

  public shared ({ caller }) func createVehicle(sessionToken : Text, vehicle : Vehicle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create vehicles");
    };
    let session = requireAdminSession(sessionToken);
    vehicles.add(vehicle.id, vehicle);
  };

  public shared ({ caller }) func updateVehicle(sessionToken : Text, vehicle : Vehicle) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update vehicles");
    };
    let session = requireAdminSession(sessionToken);
    vehicles.add(vehicle.id, vehicle);
  };

  public shared ({ caller }) func deleteVehicle(sessionToken : Text, id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete vehicles");
    };
    let session = requireAdminSession(sessionToken);
    vehicles.remove(id);
  };

  public shared ({ caller }) func createPromotion(sessionToken : Text, promotion : Promotion) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create promotions");
    };
    let session = requireAdminSession(sessionToken);
    promotions.add(promotion.id, promotion);
  };

  public shared ({ caller }) func updatePromotion(sessionToken : Text, promotion : Promotion) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update promotions");
    };
    let session = requireAdminSession(sessionToken);
    promotions.add(promotion.id, promotion);
  };

  public shared ({ caller }) func deletePromotion(sessionToken : Text, id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete promotions");
    };
    let session = requireAdminSession(sessionToken);
    promotions.remove(id);
  };

  public shared ({ caller }) func createTestimonial(sessionToken : Text, testimonial : Testimonial) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create testimonials");
    };
    let session = requireAdminSession(sessionToken);
    testimonials.add(testimonial.id, testimonial);
  };

  public shared ({ caller }) func updateTestimonial(sessionToken : Text, testimonial : Testimonial) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update testimonials");
    };
    let session = requireAdminSession(sessionToken);
    testimonials.add(testimonial.id, testimonial);
  };

  public shared ({ caller }) func deleteTestimonial(sessionToken : Text, id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };
    let session = requireAdminSession(sessionToken);
    testimonials.remove(id);
  };

  public shared ({ caller }) func createBlogPost(sessionToken : Text, post : BlogPost) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };
    let session = requireAdminSession(sessionToken);
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func updateBlogPost(sessionToken : Text, post : BlogPost) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };
    let session = requireAdminSession(sessionToken);
    blogPosts.add(post.id, post);
  };

  public shared ({ caller }) func deleteBlogPost(sessionToken : Text, id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };
    let session = requireAdminSession(sessionToken);
    blogPosts.remove(id);
  };

  public shared ({ caller }) func addContact(contact : Contact) : async () {
    let uniqueId = contacts.size() + 1;
    contacts.add(uniqueId, contact);
  };

  public query ({ caller }) func getContacts(sessionToken : Text) : async ?[Contact] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view contacts");
    };
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        ?contacts.values().toArray();
      };
      case null {
        null;
      };
    };
  };

  public shared ({ caller }) func deleteContact(sessionToken : Text, id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete contacts");
    };
    let session = requireAdminSession(sessionToken);
    contacts.remove(id);
  };

  public shared ({ caller }) func addCreditSimulation(simulation : CreditSimulation) : async () {
    let uniqueId = creditSimulations.size() + 1;
    creditSimulations.add(uniqueId, simulation);
  };

  public query ({ caller }) func getCreditSimulations(sessionToken : Text) : async ?[CreditSimulation] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view credit simulations");
    };
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        ?creditSimulations.values().toArray();
      };
      case null {
        null;
      };
    };
  };

  public shared ({ caller }) func deleteCreditSimulation(sessionToken : Text, id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete credit simulations");
    };
    let session = requireAdminSession(sessionToken);
    creditSimulations.remove(id);
  };

  public shared ({ caller }) func createMediaAsset(sessionToken : Text, asset : MediaAsset) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create media assets");
    };
    let session = requireAdminSession(sessionToken);
    mediaAssets.add(asset.id, asset);
  };

  public shared ({ caller }) func deleteMediaAsset(sessionToken : Text, id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete media assets");
    };
    let session = requireAdminSession(sessionToken);
    mediaAssets.remove(id);
  };

  public query ({ caller }) func getMediaAssets(sessionToken : Text) : async ?[MediaAsset] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view media assets");
    };
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        ?mediaAssets.values().toArray();
      };
      case null {
        null;
      };
    };
  };

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
    productInteractions.get(itemId);
  };

  public shared ({ caller }) func incrementPageView() : async () {
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews + 1;
      todayTraffic = visitorStats.todayTraffic;
    };
  };

  public shared ({ caller }) func incrementVisitor() : async () {
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors + 1;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews;
      todayTraffic = visitorStats.todayTraffic + 1;
    };
  };

  public query ({ caller }) func getVisitorStats(sessionToken : Text) : async ?VisitorStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view visitor stats");
    };
    switch (validateAdminSession(sessionToken)) {
      case (?session) {
        ?visitorStats;
      };
      case null {
        null;
      };
    };
  };

  public shared ({ caller }) func updateVisitorStats(sessionToken : Text, stats : VisitorStats) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update visitor stats");
    };
    let session = requireAdminSession(sessionToken);
    visitorStats := stats;
  };

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
