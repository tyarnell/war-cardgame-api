var should = require("should");
const Card = require("../game/card");
var Deck = require("../game/deck");

describe("Deck", () => {
  describe("Creating deck...", () => {
    it("Creates a standard, unshuffled Deck", () => {
      // Get a standard deck, unshuffled.
      const deck = Deck.getStandardDeck(false);

      deck.cards.length.should.equal(52);
      deck.cards[0].suit.should.equal("club");
      deck.cards[0].face.should.equal("2");
      deck.cards[0].value.should.equal(2);
    });

    it("Create a standard, shuffled Deck", () => {
      // Get a standard deck, unshuffled.
      const standardDeck = Deck.getStandardDeck(false);
      const shuffledDeck = Deck.getStandardDeck(true);

      shuffledDeck.cards.length.should.equal(52);
      shuffledDeck.cards.should.be.Array;
    });
  });
});
