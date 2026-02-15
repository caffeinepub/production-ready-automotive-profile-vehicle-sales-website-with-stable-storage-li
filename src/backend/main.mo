import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Array "mo:core/Array";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import Migration "migration";

(with migration = Migration.run)
actor {
  type AdminUserId = Nat;
  type BlogPostId = Nat;
  type BlogCommentId = Nat;

  let ONE_SECOND_NANOS : Int = 1_000_000_000;
  let ONE_MINUTE_NANOS : Int = 60 * ONE_SECOND_NANOS;
  let ONE_HOUR_NANOS : Int = 60 * ONE_MINUTE_NANOS;
  let ONE_DAY_NANOS : Int = 24 * ONE_HOUR_NANOS;
  let ONLINE_WINDOW_NANOS : Int = 15 * ONE_MINUTE_NANOS;
  let WIB_OFFSET_NANOS : Int = 7 * ONE_HOUR_NANOS;

  let accessControlState = AccessControl.initState();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type AdminUser = {
    id : Nat;
    email : Text;
    passwordHash : Text;
    role : Text;
    createdAt : Int;
    status : Text;
  };

  public type AdminSession = {
    token : Text;
    userId : Nat;
    role : Text;
    expiresAt : Int;
  };

  public type AdminSessionRef = AdminSession;

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
    yesterdayTraffic : Nat;
    weeklyTraffic : Nat;
    monthlyTraffic : Nat;
    yearlyTraffic : Nat;
    onlineVisitors : Nat;
    lastUpdated : Time.Time;
  };

  public type BlogInteraction = {
    blogPostId : Nat;
    likesCount : Nat;
    sharesCount : Nat;
    commentsCount : Nat;
  };

  public type BlogComment = {
    id : Nat;
    blogPostId : Nat;
    parentId : ?Nat;
    name : Text;
    email : Text;
    content : Text;
    createdAt : Time.Time;
    approved : Bool;
  };

  public type BlogInteractionSummary = {
    likesCount : Nat;
    sharesCount : Nat;
    commentsCount : Nat;
  };

  public type BlogCommentInput = {
    blogPostId : Nat;
    parentId : ?Nat;
    name : Text;
    email : Text;
    content : Text;
  };

  type SiteBanner = {
    id : Text;
    imageUrl : Text;
    updatedAt : Time.Time;
    updatedBy : Nat;
  };

  let adminUsers = Map.empty<Nat, AdminUser>();
  let adminUsersByEmail = Map.empty<Text, Nat>();
  let adminSessions = Map.empty<Text, AdminSessionRef>();
  var nextAdminUserId : Nat = 1;
  var superAdminSeeded = false;
  let userProfiles = Map.empty<Principal, UserProfile>();
  let adminUserProfiles = Map.empty<Nat, UserProfile>();
  let vehicles = Map.empty<Nat, Vehicle>();
  let promotions = Map.empty<Nat, Promotion>();
  let testimonials = Map.empty<Nat, Testimonial>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let contacts = Map.empty<Nat, Contact>();
  let creditSimulations = Map.empty<Nat, CreditSimulation>();
  let mediaAssets = Map.empty<Nat, MediaAsset>();
  let productInteractions = Map.empty<Nat, Interaction>();
  let blogInteractions = Map.empty<Nat, BlogInteraction>();
  let siteBanners = Map.empty<Text, SiteBanner>();
  var nextBlogCommentId : Nat = 1;

  // Backend API extension for main banner
  var mainBannerImageUrls : [Text] = [];

  let nowMagicallyNeverZero = 1700000000_000_000_001;
  var visitorStats : VisitorStats = {
    totalVisitors = 1;
    activeUsers = 1;
    pageViews = 1;
    todayTraffic = 1;
    yesterdayTraffic = 0;
    weeklyTraffic = 1;
    monthlyTraffic = 1;
    yearlyTraffic = 1;
    onlineVisitors = 1;
    lastUpdated = nowMagicallyNeverZero;
  };

  let onlineSessions = Map.empty<Text, Time.Time>();
  type OnlineSession = Time.Time;
  public type ExtendedVisitorStats = {
    totalVisitors : Nat;
    pageViews : Nat;
    todayTraffic : Nat;
    yesterdayTraffic : Nat;
    weeklyTraffic : Nat;
    monthlyTraffic : Nat;
    yearlyTraffic : Nat;
    onlineVisitors : Nat;
  };

  // Backend API extension for main banner
  public shared ({ caller }) func getMainBannerImageUrls() : async [Text] {
    mainBannerImageUrls;
  };

  public shared ({ caller }) func updateMainBannerImageUrls(sessionToken : Text, newUrls : [Text]) : async () {
    let _session = requireAdminSession(sessionToken);
    mainBannerImageUrls := newUrls;
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
              let session : AdminSessionRef = {
                token;
                userId;
                role = user.role;
                expiresAt = Time.now() + (24 * 60 * 60 * 1_000_000_000);
              };
              adminSessions.add(token, session);
              ?{ token; role = user.role };
            } else { null };
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

  func hashPassword(password : Text, salt : Text) : Text {
    let combined = password # salt;
    let bytes = combined.encodeUtf8();
    let hash = bytes.hash().toText();
    hash;
  };

  func generateSessionToken(userId : Nat) : Text {
    let timestamp = Time.now();
    let tokenData = userId.toText() # timestamp.toText();
    let bytes = tokenData.encodeUtf8();
    let hash = bytes.hash().toText();
    hash;
  };

  func validateAdminSession(token : Text) : ?AdminSessionRef {
    switch (adminSessions.get(token)) {
      case (?session) {
        if (session.expiresAt > Time.now()) {
          ?session;
        } else {
          adminSessions.remove(token);
          null;
        };
      };
      case null { null };
    };
  };

  func requireAdminSession(token : Text) : AdminSessionRef {
    switch (validateAdminSession(token)) {
      case (?session) { session };
      case null { Runtime.trap("Unauthorized: Invalid or expired admin session") };
    };
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

  public shared ({ caller }) func saveAdminUserProfile(
    sessionToken : Text,
    adminUserId : Nat,
    profile : UserProfile,
  ) : async () {
    let session = requireAdminSession(sessionToken);
    
    // Only allow admins to edit their own profile or Super Admins to edit any profile
    if (session.userId != adminUserId and session.role != "Super Admin") {
      Runtime.trap("Unauthorized: Can only edit your own profile");
    };
    
    adminUserProfiles.add(adminUserId, profile);
  };

  public shared ({ caller }) func getAdminUserProfile(
    sessionToken : Text,
    adminUserId : Nat,
  ) : async ?UserProfile {
    let session = requireAdminSession(sessionToken);
    
    // Only allow admins to view their own profile or Super Admins to view any profile
    if (session.userId != adminUserId and session.role != "Super Admin") {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    
    adminUserProfiles.get(adminUserId);
  };

  public shared ({ caller }) func getAdminUserProfileByIdToken(sessionToken : Text, adminUserId : Nat) : async ?UserProfile {
    let session = requireAdminSession(sessionToken);
    
    // Only allow admins to view their own profile or Super Admins to view any profile
    if (session.userId != adminUserId and session.role != "Super Admin") {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    
    adminUserProfiles.get(adminUserId);
  };

  // --- Visitor stats

  func getWIBOffset() : Int { WIB_OFFSET_NANOS };

  func safeIntToNat(value : Int) : Nat { value.toNat() };

  func updateVisitorStats() {
    let now = Time.now();

    let wibOffset = getWIBOffset();
    let nowWIB = now + wibOffset;
    let dayStartWIB = (nowWIB / ONE_DAY_NANOS) * ONE_DAY_NANOS - wibOffset;

    let weekStart = dayStartWIB - (safeIntToNat(ONE_DAY_NANOS) * 6);
    let monthStart = dayStartWIB - (safeIntToNat(ONE_DAY_NANOS) * 29);
    let yearStart = dayStartWIB - (safeIntToNat(ONE_DAY_NANOS) * 364);

    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews;
      todayTraffic = if (now >= dayStartWIB and now < (dayStartWIB + ONE_DAY_NANOS)) {
        visitorStats.todayTraffic;
      } else { 0 };
      yesterdayTraffic = if (now >= dayStartWIB and now < (dayStartWIB + ONE_DAY_NANOS)) {
        visitorStats.yesterdayTraffic;
      } else { visitorStats.todayTraffic };
      weeklyTraffic = if (now >= weekStart and now < (weekStart + (safeIntToNat(ONE_DAY_NANOS) * 7))) {
        visitorStats.weeklyTraffic;
      } else { 0 };
      monthlyTraffic = if (now >= monthStart and now < (monthStart + (safeIntToNat(ONE_DAY_NANOS) * 30))) {
        visitorStats.monthlyTraffic;
      } else { 0 };
      yearlyTraffic = if (now >= yearStart and now < (yearStart + (safeIntToNat(ONE_DAY_NANOS) * 365))) {
        visitorStats.yearlyTraffic;
      } else { 0 };
      onlineVisitors = visitorStats.onlineVisitors;
      lastUpdated = now;
    };
  };

  public shared ({ caller }) func getExtendedVisitorStats(sessionToken : Text) : async ExtendedVisitorStats {
    let _session = requireAdminSession(sessionToken);
    updateVisitorStats();

    {
      totalVisitors = visitorStats.totalVisitors;
      pageViews = visitorStats.pageViews;
      todayTraffic = visitorStats.todayTraffic;
      yesterdayTraffic = visitorStats.yesterdayTraffic;
      weeklyTraffic = visitorStats.weeklyTraffic;
      monthlyTraffic = visitorStats.monthlyTraffic;
      yearlyTraffic = visitorStats.yearlyTraffic;
      onlineVisitors = visitorStats.onlineVisitors;
    };
  };

  public shared ({ caller }) func getFooterVisitorStats() : async ExtendedVisitorStats {
    updateVisitorStats();

    {
      totalVisitors = visitorStats.totalVisitors;
      pageViews = visitorStats.pageViews;
      todayTraffic = visitorStats.todayTraffic;
      yesterdayTraffic = visitorStats.yesterdayTraffic;
      weeklyTraffic = visitorStats.weeklyTraffic;
      monthlyTraffic = visitorStats.monthlyTraffic;
      yearlyTraffic = visitorStats.yearlyTraffic;
      onlineVisitors = visitorStats.onlineVisitors;
    };
  };

  public shared ({ caller }) func incrementPageView() : async () {
    updateVisitorStats();
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews + 1;
      todayTraffic = visitorStats.todayTraffic;
      yesterdayTraffic = visitorStats.yesterdayTraffic;
      weeklyTraffic = visitorStats.weeklyTraffic;
      monthlyTraffic = visitorStats.monthlyTraffic;
      yearlyTraffic = visitorStats.yearlyTraffic;
      onlineVisitors = visitorStats.onlineVisitors;
      lastUpdated = Time.now();
    };
  };

  public shared ({ caller }) func incrementVisitor() : async () {
    updateVisitorStats();
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors + 1;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews;
      todayTraffic = visitorStats.todayTraffic + 1;
      yesterdayTraffic = visitorStats.yesterdayTraffic;
      weeklyTraffic = visitorStats.weeklyTraffic;
      monthlyTraffic = visitorStats.monthlyTraffic;
      yearlyTraffic = visitorStats.yearlyTraffic;
      onlineVisitors = visitorStats.onlineVisitors;
      lastUpdated = Time.now();
    };
  };

  public shared ({ caller }) func userActivity(sessionId : Text) : async () {
    let now = Time.now();

    for ((id, lastActivity) in onlineSessions.entries()) {
      if (now - lastActivity > ONLINE_WINDOW_NANOS) {
        onlineSessions.remove(id);
      };
    };

    onlineSessions.add(sessionId, now);
    let activeSessionCount = onlineSessions.size();

    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      activeUsers = activeSessionCount;
      pageViews = visitorStats.pageViews;
      todayTraffic = visitorStats.todayTraffic;
      yesterdayTraffic = visitorStats.yesterdayTraffic;
      weeklyTraffic = visitorStats.weeklyTraffic;
      monthlyTraffic = visitorStats.monthlyTraffic;
      yearlyTraffic = visitorStats.yearlyTraffic;
      onlineVisitors = activeSessionCount;
      lastUpdated = now;
    };
  };

  // Vehicles management

  public shared ({ caller }) func createVehicle(sessionToken : Text, vehicle : Vehicle) : async Bool {
    let _session = requireAdminSession(sessionToken);
    vehicles.add(vehicle.id, vehicle);
    true;
  };

  public shared ({ caller }) func updateVehicle(sessionToken : Text, vehicle : Vehicle) : async Bool {
    let _session = requireAdminSession(sessionToken);
    vehicles.add(vehicle.id, vehicle);
    true;
  };

  public shared ({ caller }) func deleteVehicle(sessionToken : Text, id : Nat) : async Bool {
    let _session = requireAdminSession(sessionToken);
    vehicles.remove(id);
    true;
  };

  // Promotions management

  public shared ({ caller }) func createPromotion(sessionToken : Text, promotion : Promotion) : async Bool {
    let _session = requireAdminSession(sessionToken);
    promotions.add(promotion.id, promotion);
    true;
  };

  public shared ({ caller }) func updatePromotion(sessionToken : Text, promotion : Promotion) : async Bool {
    let _session = requireAdminSession(sessionToken);
    promotions.add(promotion.id, promotion);
    true;
  };

  public shared ({ caller }) func deletePromotion(sessionToken : Text, id : Nat) : async Bool {
    let _session = requireAdminSession(sessionToken);
    promotions.remove(id);
    true;
  };

  // Testimonial management

  public shared ({ caller }) func createTestimonial(sessionToken : Text, testimonial : Testimonial) : async Bool {
    let _session = requireAdminSession(sessionToken);
    testimonials.add(testimonial.id, testimonial);
    true;
  };

  public shared ({ caller }) func updateTestimonial(sessionToken : Text, testimonial : Testimonial) : async Bool {
    let _session = requireAdminSession(sessionToken);
    testimonials.add(testimonial.id, testimonial);
    true;
  };

  public shared ({ caller }) func deleteTestimonial(sessionToken : Text, id : Nat) : async Bool {
    let _session = requireAdminSession(sessionToken);
    testimonials.remove(id);
    true;
  };

  // Blog post management

  public shared ({ caller }) func createBlogPost(sessionToken : Text, post : BlogPost) : async Bool {
    let _session = requireAdminSession(sessionToken);
    blogPosts.add(post.id, post);
    true;
  };

  public shared ({ caller }) func updateBlogPost(sessionToken : Text, post : BlogPost) : async Bool {
    let _session = requireAdminSession(sessionToken);
    blogPosts.add(post.id, post);
    true;
  };

  public shared ({ caller }) func deleteBlogPost(sessionToken : Text, id : Nat) : async Bool {
    let _session = requireAdminSession(sessionToken);
    blogPosts.remove(id);
    true;
  };

  // Contacts

  public shared ({ caller }) func addContact(contact : Contact) : async () {
    let uniqueId = contacts.size() + 1;
    contacts.add(uniqueId, contact);
  };

  public shared ({ caller }) func getContacts(sessionToken : Text) : async ?[Contact] {
    let _session = requireAdminSession(sessionToken);
    let contactsArray = contacts.values().toArray();
    ?contactsArray;
  };

  public shared ({ caller }) func deleteContact(sessionToken : Text, id : Nat) : async () {
    let _session = requireAdminSession(sessionToken);
    contacts.remove(id);
  };

  // Credit Simulations

  public shared ({ caller }) func addCreditSimulation(simulation : CreditSimulation) : async () {
    let uniqueId = creditSimulations.size() + 1;
    creditSimulations.add(uniqueId, simulation);
  };

  public shared ({ caller }) func getCreditSimulations(sessionToken : Text) : async ?[CreditSimulation] {
    let _session = requireAdminSession(sessionToken);
    let creditSimulationsArray = creditSimulations.values().toArray();
    ?creditSimulationsArray;
  };

  public shared ({ caller }) func deleteCreditSimulation(sessionToken : Text, id : Nat) : async () {
    let _session = requireAdminSession(sessionToken);
    creditSimulations.remove(id);
  };

  // Media assets

  public shared ({ caller }) func createMediaAsset(sessionToken : Text, asset : MediaAsset) : async Bool {
    let _session = requireAdminSession(sessionToken);
    mediaAssets.add(asset.id, asset);
    true;
  };

  public shared ({ caller }) func deleteMediaAsset(sessionToken : Text, id : Nat) : async Bool {
    let _session = requireAdminSession(sessionToken);
    mediaAssets.remove(id);
    true;
  };

  public query ({ caller }) func getAllMediaAssets() : async [MediaAsset] {
    let mediaAssetsArray = mediaAssets.values().toArray();
    mediaAssetsArray;
  };

  public shared ({ caller }) func getMediaAssets(sessionToken : Text) : async ?[MediaAsset] {
    let _session = requireAdminSession(sessionToken);
    let mediaAssetsArray = mediaAssets.values().toArray();
    ?mediaAssetsArray;
  };

  // Product interactions

  public shared ({ caller }) func likeProduct(itemId : Nat) : async () {
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
          itemId;
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
    let interaction = productInteractions.get(itemId);
    switch (interaction) {
      case (?existing) {
        let updated = {
          itemId = existing.itemId;
          likes = existing.likes;
          shares = existing.shares + 1;
          sharesWhatsApp = if (platform == "whatsapp") {
            existing.sharesWhatsApp + 1;
          } else {
            existing.sharesWhatsApp;
          };
          sharesFacebook = if (platform == "facebook") {
            existing.sharesFacebook + 1;
          } else {
            existing.sharesFacebook;
          };
          sharesTwitter = if (platform == "twitter") {
            existing.sharesTwitter + 1;
          } else {
            existing.sharesTwitter;
          };
        };
        productInteractions.add(itemId, updated);
      };
      case null {
        let newInteraction = {
          itemId;
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

  // Public queries

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

  public shared ({ caller }) func getAndIncrementBlogPostViews(blogPostId : Nat) : async ?BlogPost {
    switch (blogPosts.get(blogPostId)) {
      case (?blogPost) {
        let updatedBlogPost = {
          id = blogPost.id;
          title = blogPost.title;
          content = blogPost.content;
          author = blogPost.author;
          publishDate = blogPost.publishDate;
          imageUrl = blogPost.imageUrl;
          seoTitle = blogPost.seoTitle;
          seoDescription = blogPost.seoDescription;
          views = blogPost.views + 1;
          likes = blogPost.likes;
          published = blogPost.published;
        };
        blogPosts.add(blogPostId, updatedBlogPost);
        ?updatedBlogPost;
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getBlogPost(id : Nat) : async ?BlogPost {
    blogPosts.get(id);
  };

  // --- Blog interaction functionality, strictly scoped to blog post ID

  public query ({ caller }) func getBlogInteractionSummary(blogPostId : Nat) : async BlogInteractionSummary {
    switch (blogInteractions.get(blogPostId)) {
      case (?interaction) {
        {
          likesCount = interaction.likesCount;
          sharesCount = interaction.sharesCount;
          commentsCount = interaction.commentsCount;
        };
      };
      case (null) {
        {
          likesCount = 0;
          sharesCount = 0;
          commentsCount = 0;
        };
      };
    };
  };

  public shared ({ caller }) func incrementBlogLike(blogPostId : Nat) : async Nat {
    updateBlogInteractionCounts(blogPostId, true, false);
    switch (blogInteractions.get(blogPostId)) {
      case (?interaction) { interaction.likesCount };
      case (null) { 0 };
    };
  };

  public shared ({ caller }) func incrementBlogShare(blogPostId : Nat, _platform : Text) : async Nat {
    updateBlogInteractionCounts(blogPostId, false, true);
    switch (blogInteractions.get(blogPostId)) {
      case (?interaction) { interaction.sharesCount };
      case (null) { 0 };
    };
  };

  // --- Blog comments, strictly scoped to blog post ID

  let blogComments = Map.empty<BlogPostId, Map.Map<BlogCommentId, BlogComment>>();

  // Get comments for a specific blog post
  public query ({ caller }) func getBlogComments(blogPostId : BlogPostId) : async [BlogComment] {
    switch (blogComments.get(blogPostId)) {
      case (?comments) {
        comments.values().toArray();
      };
      case (null) { [] };
    };
  };

  // Add comment to a specific blog post
  public shared ({ caller }) func addBlogComment(blogCommentInput : BlogCommentInput) : async BlogComment {
    let comment : BlogComment = {
      id = nextBlogCommentId;
      blogPostId = blogCommentInput.blogPostId;
      parentId = blogCommentInput.parentId;
      name = blogCommentInput.name;
      email = blogCommentInput.email;
      content = blogCommentInput.content;
      createdAt = Time.now();
      approved = true;
    };

    var comments : Map.Map<Nat, BlogComment> = switch (blogComments.get(blogCommentInput.blogPostId)) {
      case (?existing) { existing };
      case (null) { Map.empty<Nat, BlogComment>() };
    };

    comments.add(nextBlogCommentId, comment);
    blogComments.add(blogCommentInput.blogPostId, comments);
    nextBlogCommentId += 1;

    updateBlogInteractionCounts(blogCommentInput.blogPostId, false, false);

    comment;
  };

  // Admin-only blog comment management (strictly scoped to blog post ID)

  public shared ({ caller }) func getBlogComment(sessionToken : Text, blogPostId : Nat, commentId : Nat) : async ?BlogComment {
    let _session = requireAdminSession(sessionToken);
    switch (blogComments.get(blogPostId)) {
      case (?comments) { comments.get(commentId) };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteBlogComment(sessionToken : Text, blogPostId : Nat, commentId : Nat) : async () {
    let _session = requireAdminSession(sessionToken);
    switch (blogComments.get(blogPostId)) {
      case (?comments) {
        comments.remove(commentId);
        if (comments.size() == 0) {
          blogComments.remove(blogPostId);
        };
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func updateBlogComment(sessionToken : Text, blogPostId : Nat, commentId : Nat, content : Text) : async () {
    let _session = requireAdminSession(sessionToken);
    switch (blogComments.get(blogPostId)) {
      case (?comments) {
        switch (comments.get(commentId)) {
          case (?comment) {
            let updatedComment = {
              id = comment.id;
              blogPostId = comment.blogPostId;
              parentId = comment.parentId;
              name = comment.name;
              email = comment.email;
              content = content;
              createdAt = comment.createdAt;
              approved = comment.approved;
            };
            comments.add(commentId, updatedComment);
          };
          case (null) {};
        };
      };
      case (null) {};
    };
  };

  // Blog interactions scoped to blog post ID

  func updateBlogInteractionCounts(blogPostId : Nat, incrementLikes : Bool, incrementShares : Bool) {
    let currentCounts = switch (blogInteractions.get(blogPostId)) {
      case (?counts) { counts };
      case (null) {
        {
          blogPostId;
          likesCount = 0;
          sharesCount = 0;
          commentsCount = 0;
        };
      };
    };

    blogInteractions.add(
      blogPostId,
      {
        blogPostId;
        likesCount = currentCounts.likesCount + (if (incrementLikes) { 1 } else { 0 });
        sharesCount = currentCounts.sharesCount + (if (incrementShares) { 1 } else { 0 });
        commentsCount = currentCounts.commentsCount + 1;
      },
    );
  };

  public shared ({ caller }) func getAllSiteBanners(sessionToken : Text) : async [SiteBanner] {
    let _session = requireAdminSession(sessionToken);
    siteBanners.values().toArray();
  };

  public shared ({ caller }) func getSiteBanner(sessionToken : Text, id : Text) : async ?SiteBanner {
    let _session = requireAdminSession(sessionToken);
    siteBanners.get(id);
  };

  public shared ({ caller }) func updateSiteBanner(sessionToken : Text, id : Text, imageUrl : Text) : async Bool {
    let session = requireAdminSession(sessionToken);
    switch (adminUsers.get(session.userId)) {
      case (?_adminUser) {
        let now = Time.now();
        siteBanners.add(
          id,
          {
            id;
            imageUrl;
            updatedAt = now;
            updatedBy = session.userId;
          },
        );
        true;
      };
      case (null) { Runtime.trap("Admin user not found for session") };
    };
  };
};
