var should = require("should");
var Card = require("../game/card");

describe("Card", () => {
  describe("Creating cards...", () => {
    it("Knows the suits", () => {
      Card.isValidSuit("club").should.be.true();
      Card.isValidSuit("diamond").should.be.true();
      Card.isValidSuit("heart").should.be.true();
      Card.isValidSuit("spade").should.be.true();
      Card.isValidSuit("foo").should.be.false();
    });

    it("Knows the available faces", () => {
      Card.isValidFace("2").should.be.true();
      Card.isValidFace("Q").should.be.true();
      Card.isValidFace("q").should.be.true();
      Card.isValidFace("E").should.be.false();
    });

    it("Knows the available values", () => {
      Card.isValidValue(2).should.be.true();
      Card.isValidValue(1).should.be.false();
      Card.isValidValue("1").should.be.false();
    });

    it("Constructs a good card", () => {
      const card = new Card("club", "K", 13);

      card.suit.should.equal("club");
      card.face.should.equal("K");
      card.value.should.equal(13);
    });

    it("Throws when given an invalid suit", () => {
      () => new Card("foo", "K", 13).should.throw();
    });

    it("Throws when given an invalid face", () => {
      () => new Card("club", "E", 13).should.throw();
    });

    it("Throws when given an invalid value", () => {
      () => new Card("club", "K", 15).should.throw();
    });
  });
});
