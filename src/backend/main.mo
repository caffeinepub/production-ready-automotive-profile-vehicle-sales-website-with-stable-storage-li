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
import List "mo:core/List";
import Migration "migration";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

// Add migration with-clause for persistent actor state changes
(with migration = Migration.run)
actor {
  include MixinStorage();

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
    let tokenData = userId.toText() # Int.toText(timestamp);
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

  public shared ({ caller }) func createVehicle(sessionToken : Text, vehicle : Vehicle) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed createVehicle")) {
      return false;
    };
    vehicles.add(vehicle.id, vehicle);
    true;
  };

  public shared ({ caller }) func updateVehicle(sessionToken : Text, vehicle : Vehicle) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed updateVehicle")) {
      return false;
    };
    vehicles.add(vehicle.id, vehicle);
    true;
  };

  public shared ({ caller }) func deleteVehicle(sessionToken : Text, id : Nat) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed deleteVehicle")) {
      return false;
    };
    vehicles.remove(id);
    true;
  };

  public shared ({ caller }) func createPromotion(sessionToken : Text, promotion : Promotion) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed createPromotion")) {
      return false;
    };
    promotions.add(promotion.id, promotion);
    true;
  };

  public shared ({ caller }) func updatePromotion(sessionToken : Text, promotion : Promotion) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed updatePromotion")) {
      return false;
    };
    promotions.add(promotion.id, promotion);
    true;
  };

  public shared ({ caller }) func deletePromotion(sessionToken : Text, id : Nat) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed deletePromotion")) {
      return false;
    };
    promotions.remove(id);
    true;
  };

  public shared ({ caller }) func createTestimonial(sessionToken : Text, testimonial : Testimonial) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed createTestimonial")) {
      return false;
    };
    testimonials.add(testimonial.id, testimonial);
    true;
  };

  public shared ({ caller }) func updateTestimonial(sessionToken : Text, testimonial : Testimonial) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed updateTestimonial")) {
      return false;
    };
    testimonials.add(testimonial.id, testimonial);
    true;
  };

  public shared ({ caller }) func deleteTestimonial(sessionToken : Text, id : Nat) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed deleteTestimonial")) {
      return false;
    };
    testimonials.remove(id);
    true;
  };

  public shared ({ caller }) func createBlogPost(sessionToken : Text, post : BlogPost) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed createBlogPost")) {
      return false;
    };
    blogPosts.add(post.id, post);
    true;
  };

  public shared ({ caller }) func updateBlogPost(sessionToken : Text, post : BlogPost) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed updateBlogPost")) {
      return false;
    };
    blogPosts.add(post.id, post);
    true;
  };

  public shared ({ caller }) func deleteBlogPost(sessionToken : Text, id : Nat) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed deleteBlogPost")) {
      return false;
    };
    blogPosts.remove(id);
    true;
  };

  public shared ({ caller }) func addContact(contact : Contact) : async Bool {
    // Public endpoint - no authorization required (guests can submit)
    let uniqueId = contacts.size() + 1;
    contacts.add(uniqueId, contact);
    true;
  };

  public shared ({ caller }) func getContacts(sessionToken : Text) : async ?[Contact] {
    if (not isAdminAuthorized(sessionToken, "Failed getContacts")) {
      return null;
    };
    let contactsArray = contacts.values().toArray();
    ?contactsArray;
  };

  public shared ({ caller }) func deleteContact(sessionToken : Text, id : Nat) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed deleteContact")) {
      return false;
    };
    contacts.remove(id);
    true;
  };

  public shared ({ caller }) func addCreditSimulation(simulation : CreditSimulation) : async Bool {
    // Public endpoint - no authorization required (guests can submit)
    let uniqueId = creditSimulations.size() + 1;
    creditSimulations.add(uniqueId, simulation);
    true;
  };

  public shared ({ caller }) func getCreditSimulations(sessionToken : Text) : async ?[CreditSimulation] {
    if (not isAdminAuthorized(sessionToken, "Failed getCreditSimulations")) {
      return null;
    };
    let creditSimulationsArray = creditSimulations.values().toArray();
    ?creditSimulationsArray;
  };

  public shared ({ caller }) func deleteCreditSimulation(sessionToken : Text, id : Nat) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed deleteCreditSimulation")) {
      return false;
    };
    creditSimulations.remove(id);
    true;
  };

  public shared ({ caller }) func createMediaAsset(sessionToken : Text, asset : MediaAsset) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed createMediaAsset")) {
      return false;
    };
    mediaAssets.add(asset.id, asset);
    true;
  };

  public shared ({ caller }) func deleteMediaAsset(sessionToken : Text, id : Nat) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed deleteMediaAsset")) {
      return false;
    };
    mediaAssets.remove(id);
    true;
  };

  public shared ({ caller }) func getMediaAssets(sessionToken : Text) : async ?[MediaAsset] {
    if (not isAdminAuthorized(sessionToken, "Failed getMediaAssets")) {
      return null;
    };
    let mediaAssetsArray = mediaAssets.values().toArray();
    ?mediaAssetsArray;
  };

  public shared ({ caller }) func likeProduct(itemId : Nat) : async () {
    // Public endpoint - no authorization required (guests can like)
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
    // Public endpoint - no authorization required (guests can share)
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

  public shared ({ caller }) func incrementPageView() : async () {
    // Public endpoint - no authorization required
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews + 1;
      todayTraffic = visitorStats.todayTraffic;
    };
  };

  public shared ({ caller }) func incrementVisitor() : async () {
    // Public endpoint - no authorization required
    visitorStats := {
      totalVisitors = visitorStats.totalVisitors + 1;
      activeUsers = visitorStats.activeUsers;
      pageViews = visitorStats.pageViews;
      todayTraffic = visitorStats.todayTraffic + 1;
    };
  };

  public shared ({ caller }) func getVisitorStats(sessionToken : Text) : async ?VisitorStats {
    if (not isAdminAuthorized(sessionToken, "Failed getVisitorStats")) {
      return null;
    };
    ?visitorStats;
  };

  public shared ({ caller }) func updateVisitorStats(sessionToken : Text, stats : VisitorStats) : async Bool {
    if (not isAdminAuthorized(sessionToken, "Failed updateVisitorStats")) {
      return false;
    };
    visitorStats := stats;
    true;
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
    // Public endpoint - increments view count and returns BlogPost
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

  func isAdminAuthorized(sessionToken : Text, functionName : Text) : Bool {
    if (doValidateAdminSession(sessionToken)) {
      true;
    } else {
      Debug.print("Unauthorized admin attempt: " # functionName # " token=" # sessionToken);
      false;
    };
  };

  func doValidateAdminSession(token : Text) : Bool {
    switch (validateAdminSession(token)) {
      case (?_) { true };
      case (null) { false };
    };
  };

  // Blog Interaction Functionality

  public query ({ caller }) func getBlogInteractionSummary(blogPostId : Nat) : async BlogInteractionSummary {
    // Public endpoint - no authorization required
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
    // Public endpoint - no authorization required (guests can like)
    updateBlogInteractionCounts(blogPostId, true, false);
    switch (blogInteractions.get(blogPostId)) {
      case (?interaction) { interaction.likesCount };
      case (null) { 0 };
    };
  };

  public shared ({ caller }) func incrementBlogShare(blogPostId : Nat, _platform : Text) : async Nat {
    // Public endpoint - no authorization required (guests can share)
    updateBlogInteractionCounts(blogPostId, false, true);
    switch (blogInteractions.get(blogPostId)) {
      case (?interaction) { interaction.sharesCount };
      case (null) { 0 };
    };
  };

  public query ({ caller }) func getBlogComments(blogPostId : Nat) : async [BlogComment] {
    // Public endpoint - returns only approved comments for non-admins
    let allComments = blogComments.values().toArray();

    // Check if caller is admin
    let isCallerAdmin = AccessControl.isAdmin(accessControlState, caller);

    if (isCallerAdmin) {
      // Admins see all comments for the blog post
      allComments.filter<BlogComment>(func(comment) { comment.blogPostId == blogPostId });
    } else {
      // Public users see only approved comments for the blog post
      allComments.filter<BlogComment>(
        func(comment) {
          comment.blogPostId == blogPostId and comment.approved;
        },
      );
    };
  };

  public shared ({ caller }) func addBlogComment(blogCommentInput : BlogCommentInput) : async BlogComment {
    // Public endpoint - no authorization required (guests can comment)
    let comment : BlogComment = {
      id = nextBlogCommentId;
      blogPostId = blogCommentInput.blogPostId;
      parentId = blogCommentInput.parentId;
      name = blogCommentInput.name;
      email = blogCommentInput.email;
      content = blogCommentInput.content;
      createdAt = Time.now();
      approved = false;
    };

    blogComments.add(nextBlogCommentId, comment);
    nextBlogCommentId += 1;

    updateBlogInteractionCounts(blogCommentInput.blogPostId, false, false);

    comment;
  };

  public shared ({ caller }) func approveBlogComment(sessionToken : Text, commentId : Nat) : async () {
    // Admin-only endpoint
    if (not isAdminAuthorized(sessionToken, "Failed approveBlogComment")) {
      Runtime.trap("Unauthorized: Only admins can approve blog comments");
    };

    switch (blogComments.get(commentId)) {
      case (?comment) {
        let approvedComment = {
          id = comment.id;
          blogPostId = comment.blogPostId;
          parentId = comment.parentId;
          name = comment.name;
          email = comment.email;
          content = comment.content;
          createdAt = comment.createdAt;
          approved = true;
        };
        blogComments.add(commentId, approvedComment);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func deleteBlogComment(sessionToken : Text, commentId : Nat) : async () {
    // Admin-only endpoint
    if (not isAdminAuthorized(sessionToken, "Failed deleteBlogComment")) {
      Runtime.trap("Unauthorized: Only admins can delete blog comments");
    };

    blogComments.remove(commentId);
  };

  public shared ({ caller }) func updateBlogComment(sessionToken : Text, commentId : Nat, content : Text) : async () {
    // Admin-only endpoint
    if (not isAdminAuthorized(sessionToken, "Failed updateBlogComment")) {
      Runtime.trap("Unauthorized: Only admins can update blog comments");
    };

    switch (blogComments.get(commentId)) {
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
        blogComments.add(commentId, updatedComment);
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
