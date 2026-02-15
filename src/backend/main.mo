import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  include MixinStorage();

  // Time constants (nanoseconds)
  let ONE_SECOND_NANOS : Int = 1_000_000_000;
  let ONE_MINUTE_NANOS : Int = 60 * ONE_SECOND_NANOS;
  let ONE_HOUR_NANOS : Int = 60 * ONE_MINUTE_NANOS;
  let ONE_DAY_NANOS : Int = 24 * ONE_HOUR_NANOS;
  let ONLINE_WINDOW_NANOS : Int = 15 * ONE_MINUTE_NANOS;
  let WIB_OFFSET_NANOS : Int = 7 * ONE_HOUR_NANOS;

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  let adminUsers = Map.empty<Nat, AdminUser>();
  let adminUsersByEmail = Map.empty<Text, Nat>();
  let adminSessions = Map.empty<Text, AdminSession>();
  var nextAdminUserId : Nat = 1;
  var superAdminSeeded = false;

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

  let userProfiles = Map.empty<Principal, UserProfile>();
  let vehicles = Map.empty<Nat, Vehicle>();
  let promotions = Map.empty<Nat, Promotion>();
  let testimonials = Map.empty<Nat, Testimonial>();
  let blogPosts = Map.empty<Nat, BlogPost>();
  let contacts = Map.empty<Nat, Contact>();
  let creditSimulations = Map.empty<Nat, CreditSimulation>();
  let mediaAssets = Map.empty<Nat, MediaAsset>();
  let productInteractions = Map.empty<Nat, Interaction>();
  let blogInteractions = Map.empty<Nat, BlogInteraction>();
  let blogComments = Map.empty<Nat, BlogComment>();
  var nextBlogCommentId : Nat = 1;

  var visitorStats : VisitorStats = {
    totalVisitors = 0;
    activeUsers = 0;
    pageViews = 0;
    todayTraffic = 0;
    yesterdayTraffic = 0;
    weeklyTraffic = 0;
    monthlyTraffic = 0;
    yearlyTraffic = 0;
    onlineVisitors = 0;
    lastUpdated = 0;
  };

  let onlineSessions = Map.empty<Text, Time.Time>();

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

  func validateAdminSession(token : Text) : ?AdminSession {
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

  func requireAdminSession(token : Text) : AdminSession {
    switch (validateAdminSession(token)) {
      case (?session) { session };
      case null {
        Runtime.trap("Unauthorized: Invalid or expired admin session");
      };
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

  func getWIBOffset() : Int {
    WIB_OFFSET_NANOS;
  };

  func safeIntToNat(value : Int) : Nat {
    value.toNat();
  };

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
      } else {
        0;
      };
      yesterdayTraffic = if (now >= dayStartWIB and now < (dayStartWIB + ONE_DAY_NANOS)) {
        visitorStats.yesterdayTraffic;
      } else {
        visitorStats.todayTraffic;
      };
      weeklyTraffic = if (now >= weekStart and now < (weekStart + (safeIntToNat(ONE_DAY_NANOS) * 7))) {
        visitorStats.weeklyTraffic;
      } else {
        0;
      };
      monthlyTraffic = if (now >= monthStart and now < (monthStart + (safeIntToNat(ONE_DAY_NANOS) * 30))) {
        visitorStats.monthlyTraffic;
      } else {
        0;
      };
      yearlyTraffic = if (now >= yearStart and now < (yearStart + (safeIntToNat(ONE_DAY_NANOS) * 365))) {
        visitorStats.yearlyTraffic;
      } else {
        0;
      };
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

  // The rest of the original code remains unchanged

  public shared ({ caller }) func createVehicle(sessionToken : Text, vehicle : Vehicle) : async Bool {
    vehicles.add(vehicle.id, vehicle);
    true;
  };

  public shared ({ caller }) func updateVehicle(sessionToken : Text, vehicle : Vehicle) : async Bool {
    vehicles.add(vehicle.id, vehicle);
    true;
  };

  public shared ({ caller }) func deleteVehicle(sessionToken : Text, id : Nat) : async Bool {
    vehicles.remove(id);
    true;
  };

  public shared ({ caller }) func createPromotion(sessionToken : Text, promotion : Promotion) : async Bool {
    promotions.add(promotion.id, promotion);
    true;
  };

  public shared ({ caller }) func updatePromotion(sessionToken : Text, promotion : Promotion) : async Bool {
    promotions.add(promotion.id, promotion);
    true;
  };

  public shared ({ caller }) func deletePromotion(sessionToken : Text, id : Nat) : async Bool {
    promotions.remove(id);
    true;
  };

  public shared ({ caller }) func createTestimonial(sessionToken : Text, testimonial : Testimonial) : async Bool {
    testimonials.add(testimonial.id, testimonial);
    true;
  };

  public shared ({ caller }) func updateTestimonial(sessionToken : Text, testimonial : Testimonial) : async Bool {
    testimonials.add(testimonial.id, testimonial);
    true;
  };

  public shared ({ caller }) func deleteTestimonial(sessionToken : Text, id : Nat) : async Bool {
    testimonials.remove(id);
    true;
  };

  public shared ({ caller }) func createBlogPost(sessionToken : Text, post : BlogPost) : async Bool {
    blogPosts.add(post.id, post);
    true;
  };

  public shared ({ caller }) func updateBlogPost(sessionToken : Text, post : BlogPost) : async Bool {
    blogPosts.add(post.id, post);
    true;
  };

  public shared ({ caller }) func deleteBlogPost(sessionToken : Text, id : Nat) : async Bool {
    blogPosts.remove(id);
    true;
  };

  public shared ({ caller }) func addContact(contact : Contact) : async Bool {
    let uniqueId = contacts.size() + 1;
    contacts.add(uniqueId, contact);
    true;
  };

  public shared ({ caller }) func getContacts(sessionToken : Text) : async ?[Contact] {
    let contactsArray = contacts.values().toArray();
    ?contactsArray;
  };

  public shared ({ caller }) func deleteContact(sessionToken : Text, id : Nat) : async Bool {
    contacts.remove(id);
    true;
  };

  public shared ({ caller }) func addCreditSimulation(simulation : CreditSimulation) : async Bool {
    let uniqueId = creditSimulations.size() + 1;
    creditSimulations.add(uniqueId, simulation);
    true;
  };

  public shared ({ caller }) func getCreditSimulations(sessionToken : Text) : async ?[CreditSimulation] {
    let creditSimulationsArray = creditSimulations.values().toArray();
    ?creditSimulationsArray;
  };

  public shared ({ caller }) func deleteCreditSimulation(sessionToken : Text, id : Nat) : async Bool {
    creditSimulations.remove(id);
    true;
  };

  public shared ({ caller }) func createMediaAsset(sessionToken : Text, asset : MediaAsset) : async Bool {
    mediaAssets.add(asset.id, asset);
    true;
  };

  public shared ({ caller }) func deleteMediaAsset(sessionToken : Text, id : Nat) : async Bool {
    mediaAssets.remove(id);
    true;
  };

  public shared ({ caller }) func getMediaAssets(sessionToken : Text) : async ?[MediaAsset] {
    let mediaAssetsArray = mediaAssets.values().toArray();
    ?mediaAssetsArray;
  };

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
    let interaction = productInteractions.get(itemId);
    switch (interaction) {
      case (?existing) {
        let updated = {
          itemId = existing.itemId;
          likes = existing.likes;
          shares = existing.shares + 1;
          sharesWhatsApp = if (platform == "whatsapp") {
            existing.sharesWhatsApp + 1;
          } else { existing.sharesWhatsApp };
          sharesFacebook = if (platform == "facebook") {
            existing.sharesFacebook + 1;
          } else { existing.sharesFacebook };
          sharesTwitter = if (platform == "twitter") {
            existing.sharesTwitter + 1;
          } else { existing.sharesTwitter };
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

  // PUBLIC QUERIES

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

  // Blog Interaction Functionality

  public query ({ caller }) func getBlogInteractionSummary(blogPostId : Nat) : async BlogInteractionSummary {
    switch (blogInteractions.get(blogPostId)) {
      case (?interaction) {
        {
          likesCount = interaction.likesCount;
          sharesCount = interaction.sharesCount;
          commentsCount = interaction.commentsCount;
        };
      };
      case (null) { { likesCount = 0; sharesCount = 0; commentsCount = 0 } };
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

  public query ({ caller }) func getBlogComments(blogPostId : Nat) : async [BlogComment] {
    blogComments.values().toArray();
  };

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

    blogComments.add(nextBlogCommentId, comment);
    nextBlogCommentId += 1;

    updateBlogInteractionCounts(blogCommentInput.blogPostId, false, false);

    comment;
  };

  public shared ({ caller }) func getBlogComment(sessionToken : Text, blogPostId : Nat, commentId : Nat) : async ?BlogComment {
    switch (blogComments.get(commentId)) {
      case (?comment) {
        if (comment.blogPostId == blogPostId) {
          ?comment;
        } else {
          null;
        };
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func deleteBlogComment(sessionToken : Text, blogPostId : Nat, commentId : Nat) : async () {
    switch (blogComments.get(commentId)) {
      case (?comment) {
        if (comment.blogPostId == blogPostId) {
          blogComments.remove(commentId);
        };
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func updateBlogComment(sessionToken : Text, blogPostId : Nat, commentId : Nat, content : Text) : async () {
    switch (blogComments.get(commentId)) {
      case (?comment) {
        if (comment.blogPostId == blogPostId) {
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
          blogComments.add(commentId, updatedComment);
        };
      };
      case (null) {};
    };
  };

  func updateBlogInteractionCounts(blogPostId : Nat, incrementLikes : Bool, incrementShares : Bool) {
    let currentInteraction = blogInteractions.get(blogPostId);

    let likesCount = switch (currentInteraction) {
      case (?interaction) {
        if (incrementLikes) { interaction.likesCount + 1 } else { interaction.likesCount };
      };
      case (null) { if (incrementLikes) { 1 } else { 0 } };
    };

    let sharesCount = switch (currentInteraction) {
      case (?interaction) {
        if (incrementShares) { interaction.sharesCount + 1 } else { interaction.sharesCount };
      };
      case (null) { if (incrementShares) { 1 } else { 0 } };
    };

    let commentsCount = switch (currentInteraction) {
      case (?interaction) { interaction.commentsCount + 1 };
      case (null) { 1 };
    };

    let updatedInteraction = {
      blogPostId;
      likesCount;
      sharesCount;
      commentsCount;
    };

    blogInteractions.add(blogPostId, updatedInteraction);
  };
};
