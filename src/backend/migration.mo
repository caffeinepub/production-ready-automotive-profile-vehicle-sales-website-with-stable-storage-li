import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
  type OldMediaAsset = {
    id : Nat;
    url : Text;
    typ : Text;
    size : Nat;
    folder : Text;
  };

  type NewMediaAsset = {
    id : Nat;
    url : Text;
    typ : Text;
    size : Nat;
    folder : Text;
    legacyDataUrl : ?Text;
    externalBlob : ?Storage.ExternalBlob;
  };

  type OldActor = {
    mediaAssets : Map.Map<Nat, OldMediaAsset>;
  };

  type NewActor = {
    mediaAssets : Map.Map<Nat, NewMediaAsset>;
  };

  public func run(old : OldActor) : NewActor {
    let newMediaAssets = old.mediaAssets.map<Nat, OldMediaAsset, NewMediaAsset>(
      func(_id, oldMediaAsset) {
        {
          id = oldMediaAsset.id;
          url = oldMediaAsset.url;
          typ = oldMediaAsset.typ;
          size = oldMediaAsset.size;
          folder = oldMediaAsset.folder;
          legacyDataUrl = ?oldMediaAsset.url;
          externalBlob = null;
        };
      }
    );

    { mediaAssets = newMediaAssets };
  };
};
