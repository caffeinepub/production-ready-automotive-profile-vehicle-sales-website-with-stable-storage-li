import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type Variant = {
    name : Text;
    priceAdjustment : Nat;
    features : [Text];
    isPremium : Bool;
  };

  type CommercialVehicleFeatures = {
    economical : Bool;
    power : Bool;
    speed : Bool;
    capacity : Bool;
    bus : Bool;
    fourByTwo : Bool;
    sixByTwo : Bool;
    sixByFour : Bool;
  };

  type TechnicalSpecs = {
    engine : Text;
    transmission : Text;
    dimensions : Text;
    weight : Text;
    fuelCapacity : Text;
    suspension : Text;
    additionalFeatures : [Text];
  };

  type Vehicle = {
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
  };

  type Promotion = {
    id : Nat;
    title : Text;
    description : Text;
    terms : Text;
    validUntil : Text;
    imageUrl : Text;
  };

  type Testimonial = {
    id : Nat;
    customerName : Text;
    city : Text;
    review : Text;
    rating : Float;
    imageUrl : Text;
  };

  type BlogPost = {
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
  };

  type Contact = {
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

  type CreditSimulation = Contact;

  type MediaAsset = {
    id : Nat;
    url : Text;
    typ : Text;
    size : Nat;
    folder : Text;
  };

  type Interaction = {
    itemId : Nat;
    likes : Nat;
    shares : Nat;
    sharesWhatsApp : Nat;
    sharesFacebook : Nat;
    sharesTwitter : Nat;
  };

  type VisitorStats = {
    totalVisitors : Nat;
    activeUsers : Nat;
    pageViews : Nat;
    todayTraffic : Nat;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, UserProfile>;
    vehicles : Map.Map<Nat, Vehicle>;
    promotions : Map.Map<Nat, Promotion>;
    testimonials : Map.Map<Nat, Testimonial>;
    blogPosts : Map.Map<Nat, BlogPost>;
    contacts : Map.Map<Nat, Contact>;
    creditSimulations : Map.Map<Nat, CreditSimulation>;
    mediaAssets : Map.Map<Nat, MediaAsset>;
    productInteractions : Map.Map<Nat, Interaction>;
    visitorStats : VisitorStats;
  };

  public func run(old : OldActor) : OldActor {
    old;
  };
};
