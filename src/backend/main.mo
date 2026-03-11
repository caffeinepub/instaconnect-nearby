import Time "mo:core/Time";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

actor {
  type InstagramEntry = {
    id : Nat;
    name : Text;
    instagramUsername : Text;
    area : Text;
    pin : Nat;
    timestamp : Time.Time;
  };

  module InstagramEntry {
    public func compareByTimestamp(a : InstagramEntry, b : InstagramEntry) : Order.Order {
      Int.compare(b.timestamp, a.timestamp);
    };
  };

  var nextId = 0;

  let entries = Map.empty<Nat, InstagramEntry>();

  public shared ({ caller }) func addEntry(name : Text, instagramUsername : Text, area : Text, pin : Nat) : async Nat {
    let id = nextId;
    nextId += 1;

    let entry : InstagramEntry = {
      id;
      name;
      instagramUsername;
      area;
      pin;
      timestamp = Time.now();
    };

    entries.add(id, entry);
    id;
  };

  public query ({ caller }) func getAllEntries() : async [InstagramEntry] {
    entries.values().toArray().sort(InstagramEntry.compareByTimestamp);
  };

  public query ({ caller }) func getEntriesByArea(area : Text) : async [InstagramEntry] {
    let filtered = entries.values().toArray().filter(
      func(entry) {
        Text.equal(entry.area, area);
      }
    );
    filtered.sort(InstagramEntry.compareByTimestamp);
  };

  public shared ({ caller }) func deleteEntry(id : Nat, pin : Nat) : async () {
    switch (entries.get(id)) {
      case (null) { Runtime.trap("Entry not found") };
      case (?entry) {
        if (entry.pin == pin) {
          entries.remove(id);
        } else {
          Runtime.trap("Invalid PIN");
        };
      };
    };
  };
};
