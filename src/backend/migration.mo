module {
  type OldActor = {
    // All other fields and variables except mainBannerImageUrls
  };

  type NewActor = {
    // All other fields and variables plus mainBannerImageUrls
    mainBannerImageUrls : [Text];
  };

  public func run(old : OldActor) : NewActor {
    { old with mainBannerImageUrls = [] };
  };
};
