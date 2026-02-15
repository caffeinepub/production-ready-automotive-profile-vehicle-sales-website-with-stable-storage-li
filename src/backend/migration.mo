import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";

module {
  // Types matching the old actor state
  type OldAdminUser = {
    id : Nat;
    email : Text;
    passwordHash : Text;
    role : Text;
    createdAt : Int;
    status : Text;
  };

  type OldAdminSession = {
    token : Text;
    userId : Nat;
    role : Text;
    expiresAt : Int;
  };

  type OldUserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type OldVisitorStats = {
    totalVisitors : Nat;
    activeUsers : Nat;
    pageViews : Nat;
    todayTraffic : Nat;
  };

  type OldBlogInteraction = {
    blogPostId : Nat;
    likesCount : Nat;
    sharesCount : Nat;
    commentsCount : Nat;
  };

  type OldBlogComment = {
    id : Nat;
    blogPostId : Nat;
    parentId : ?Nat;
    name : Text;
    email : Text;
    content : Text;
    createdAt : Time.Time;
    approved : Bool;
  };

  type OldActor = {
    adminUsers : Map.Map<Nat, OldAdminUser>;
    adminUsersByEmail : Map.Map<Text, Nat>;
    adminSessions : Map.Map<Text, OldAdminSession>;
    nextAdminUserId : Nat;
    superAdminSeeded : Bool;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    visitorStats : OldVisitorStats;
    blogInteractions : Map.Map<Nat, OldBlogInteraction>;
    blogComments : Map.Map<Nat, OldBlogComment>;
    nextBlogCommentId : Nat;
    accessControlState : AccessControl.AccessControlState;
  };

  // New types matching the updated actor state
  type NewAdminUser = OldAdminUser;
  type NewAdminSession = OldAdminSession;
  type NewUserProfile = OldUserProfile;

  type NewVisitorStats = {
    totalVisitors : Nat;
    activeUsers : Nat; // Deprecated, kept for consistency
    pageViews : Nat;
    todayTraffic : Nat;
    yesterdayTraffic : Nat;
    weeklyTraffic : Nat;
    monthlyTraffic : Nat;
    yearlyTraffic : Nat;
    onlineVisitors : Nat;
    lastUpdated : Time.Time;
  };

  type NewBlogInteraction = OldBlogInteraction;
  type NewBlogComment = OldBlogComment;

  type NewActor = {
    adminUsers : Map.Map<Nat, NewAdminUser>;
    adminUsersByEmail : Map.Map<Text, Nat>;
    adminSessions : Map.Map<Text, NewAdminSession>;
    nextAdminUserId : Nat;
    superAdminSeeded : Bool;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    visitorStats : NewVisitorStats;
    blogInteractions : Map.Map<Nat, NewBlogInteraction>;
    blogComments : Map.Map<Nat, NewBlogComment>;
    nextBlogCommentId : Nat;
    accessControlState : AccessControl.AccessControlState;
    onlineSessions : Map.Map<Text, Time.Time>;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newVisitorStats : NewVisitorStats = {
      totalVisitors = old.visitorStats.totalVisitors;
      activeUsers = 0; // Deprecated
      pageViews = old.visitorStats.pageViews;
      todayTraffic = old.visitorStats.todayTraffic;
      yesterdayTraffic = 0;
      weeklyTraffic = 0;
      monthlyTraffic = 0;
      yearlyTraffic = 0;
      onlineVisitors = 0;
      lastUpdated = 0;
    };

    {
      adminUsers = old.adminUsers;
      adminUsersByEmail = old.adminUsersByEmail;
      adminSessions = old.adminSessions;
      nextAdminUserId = old.nextAdminUserId;
      superAdminSeeded = old.superAdminSeeded;
      userProfiles = old.userProfiles;
      visitorStats = newVisitorStats;
      blogInteractions = old.blogInteractions;
      blogComments = old.blogComments;
      nextBlogCommentId = old.nextBlogCommentId;
      accessControlState = old.accessControlState;
      onlineSessions = Map.empty<Text, Time.Time>();
    };
  };
};
