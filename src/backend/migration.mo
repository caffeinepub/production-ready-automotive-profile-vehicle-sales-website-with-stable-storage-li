import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  type BlogCommentOld = {
    id : Nat;
    blogPostId : Nat;
    name : Text;
    email : Text;
    content : Text;
    createdAt : Int;
    approved : Bool;
  };

  type BlogCommentNew = {
    id : Nat;
    blogPostId : Nat;
    parentId : ?Nat;
    name : Text;
    email : Text;
    content : Text;
    createdAt : Int;
    approved : Bool;
  };

  type OldActor = {
    blogComments : Map.Map<Nat, BlogCommentOld>;
  };

  type NewActor = {
    blogComments : Map.Map<Nat, BlogCommentNew>;
  };

  public func run(old : OldActor) : NewActor {
    let blogComments = old.blogComments.map<Nat, BlogCommentOld, BlogCommentNew>(
      func(_id, oldComment) {
        {
          id = oldComment.id;
          blogPostId = oldComment.blogPostId;
          parentId = null;
          name = oldComment.name;
          email = oldComment.email;
          content = oldComment.content;
          createdAt = oldComment.createdAt;
          approved = oldComment.approved;
        };
      }
    );
    { blogComments };
  };
};
