import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";

actor {
  type Image = {
    id: Nat;
    title: Text;
    category: Text;
    url: Text;
    createdAt: Int;
    likes: Nat;
    comments: [Text];
  };

  stable var imageEntries : [(Nat, Image)] = [];
  var images = HashMap.HashMap<Nat, Image>(10, Nat.equal, Nat.hash);
  var nextId : Nat = 0;

  public query func getImages() : async [Image] {
    Iter.toArray(images.vals())
  };

  public func uploadImage(title : Text, category : Text, url : Text) : async Nat {
    let id = nextId;
    nextId += 1;
    let newImage : Image = {
      id;
      title;
      category;
      url;
      createdAt = Time.now();
      likes = 0;
      comments = [];
    };
    images.put(id, newImage);
    id
  };

  public func likeImage(id : Nat) : async Bool {
    switch (images.get(id)) {
      case (null) { false };
      case (?image) {
        let updatedImage : Image = {
          image with likes = image.likes + 1;
        };
        images.put(id, updatedImage);
        true
      };
    }
  };

  public func addComment(id : Nat, comment : Text) : async Bool {
    switch (images.get(id)) {
      case (null) { false };
      case (?image) {
        let updatedImage : Image = {
          image with comments = Array.append(image.comments, [comment]);
        };
        images.put(id, updatedImage);
        true
      };
    }
  };

  system func preupgrade() {
    imageEntries := Iter.toArray(images.entries());
  };

  system func postupgrade() {
    images := HashMap.fromIter<Nat, Image>(imageEntries.vals(), 10, Nat.equal, Nat.hash);
  };
}