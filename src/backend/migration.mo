import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  type SiteBanner = {
    id : Text;
    imageUrl : Text;
    updatedAt : Time.Time;
    updatedBy : Nat;
  };

  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type OldActor = {
    adminUsers : Map.Map<Nat, { id : Nat; email : Text; passwordHash : Text; role : Text; createdAt : Int; status : Text }>;
    adminUsersByEmail : Map.Map<Text, Nat>;
    adminSessions : Map.Map<Text, {
      token : Text;
      userId : Nat;
      role : Text;
      expiresAt : Int;
    }>;
    nextAdminUserId : Nat;
    superAdminSeeded : Bool;
    userProfiles : Map.Map<Principal, UserProfile>;
    vehicles : Map.Map<Nat, {
      id : Nat;
      name : Text;
      description : Text;
      price : Nat;
      imageUrl : Text;
      videoUrl : ?Text;
      variants : [{
        name : Text;
        priceAdjustment : Nat;
        features : [Text];
        isPremium : Bool;
      }];
      isCommercial : Bool;
      brochure : Text;
      specs : {
        engine : Text;
        transmission : Text;
        dimensions : Text;
        weight : Text;
        fuelCapacity : Text;
        suspension : Text;
        additionalFeatures : [Text];
      };
      commercialFeatures : ?{
        economical : Bool;
        power : Bool;
        speed : Bool;
        capacity : Bool;
        bus : Bool;
        fourByTwo : Bool;
        sixByTwo : Bool;
        sixByFour : Bool;
      };
      published : Bool;
    }>;
    promotions : Map.Map<Nat, {
      id : Nat;
      title : Text;
      description : Text;
      terms : Text;
      validUntil : Text;
      imageUrl : Text;
      published : Bool;
    }>;
    testimonials : Map.Map<Nat, {
      id : Nat;
      customerName : Text;
      city : Text;
      review : Text;
      rating : Float;
      imageUrl : Text;
      published : Bool;
    }>;
    blogPosts : Map.Map<Nat, {
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
    }>;
    contacts : Map.Map<Nat, {
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
    }>;
    creditSimulations : Map.Map<Nat, {
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
    }>;
    mediaAssets : Map.Map<Nat, {
      id : Nat;
      url : Text;
      typ : Text;
      size : Nat;
      folder : Text;
    }>;
    productInteractions : Map.Map<Nat, {
      itemId : Nat;
      likes : Nat;
      shares : Nat;
      sharesWhatsApp : Nat;
      sharesFacebook : Nat;
      sharesTwitter : Nat;
    }>;
    blogInteractions : Map.Map<Nat, {
      blogPostId : Nat;
      likesCount : Nat;
      sharesCount : Nat;
      commentsCount : Nat;
    }>;
    nextBlogCommentId : Nat;
    visitorStats : {
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
    onlineSessions : Map.Map<Text, Time.Time>;
    blogComments : Map.Map<Nat, Map.Map<Nat, {
      id : Nat;
      blogPostId : Nat;
      parentId : ?Nat;
      name : Text;
      email : Text;
      content : Text;
      createdAt : Time.Time;
      approved : Bool;
    }>>;
  };

  type NewActor = {
    adminUsers : Map.Map<Nat, { id : Nat; email : Text; passwordHash : Text; role : Text; createdAt : Int; status : Text }>;
    adminUsersByEmail : Map.Map<Text, Nat>;
    adminSessions : Map.Map<Text, {
      token : Text;
      userId : Nat;
      role : Text;
      expiresAt : Int;
    }>;
    nextAdminUserId : Nat;
    superAdminSeeded : Bool;
    userProfiles : Map.Map<Principal, UserProfile>;
    vehicles : Map.Map<Nat, {
      id : Nat;
      name : Text;
      description : Text;
      price : Nat;
      imageUrl : Text;
      videoUrl : ?Text;
      variants : [{
        name : Text;
        priceAdjustment : Nat;
        features : [Text];
        isPremium : Bool;
      }];
      isCommercial : Bool;
      brochure : Text;
      specs : {
        engine : Text;
        transmission : Text;
        dimensions : Text;
        weight : Text;
        fuelCapacity : Text;
        suspension : Text;
        additionalFeatures : [Text];
      };
      commercialFeatures : ?{
        economical : Bool;
        power : Bool;
        speed : Bool;
        capacity : Bool;
        bus : Bool;
        fourByTwo : Bool;
        sixByTwo : Bool;
        sixByFour : Bool;
      };
      published : Bool;
    }>;
    promotions : Map.Map<Nat, {
      id : Nat;
      title : Text;
      description : Text;
      terms : Text;
      validUntil : Text;
      imageUrl : Text;
      published : Bool;
    }>;
    testimonials : Map.Map<Nat, {
      id : Nat;
      customerName : Text;
      city : Text;
      review : Text;
      rating : Float;
      imageUrl : Text;
      published : Bool;
    }>;
    blogPosts : Map.Map<Nat, {
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
    }>;
    contacts : Map.Map<Nat, {
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
    }>;
    creditSimulations : Map.Map<Nat, {
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
    }>;
    mediaAssets : Map.Map<Nat, {
      id : Nat;
      url : Text;
      typ : Text;
      size : Nat;
      folder : Text;
    }>;
    productInteractions : Map.Map<Nat, {
      itemId : Nat;
      likes : Nat;
      shares : Nat;
      sharesWhatsApp : Nat;
      sharesFacebook : Nat;
      sharesTwitter : Nat;
    }>;
    blogInteractions : Map.Map<Nat, {
      blogPostId : Nat;
      likesCount : Nat;
      sharesCount : Nat;
      commentsCount : Nat;
    }>;
    nextBlogCommentId : Nat;
    visitorStats : {
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
    onlineSessions : Map.Map<Text, Time.Time>;
    blogComments : Map.Map<Nat, Map.Map<Nat, {
      id : Nat;
      blogPostId : Nat;
      parentId : ?Nat;
      name : Text;
      email : Text;
      content : Text;
      createdAt : Time.Time;
      approved : Bool;
    }>>;
    siteBanners : Map.Map<Text, SiteBanner>;
    adminUserProfiles : Map.Map<Nat, UserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let siteBanners = Map.empty<Text, SiteBanner>();
    let adminUserProfiles = Map.empty<Nat, UserProfile>();
    { old with siteBanners; adminUserProfiles };
  };
};
