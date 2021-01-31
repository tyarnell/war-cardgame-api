var should = require("should");
var GameContext = require("../game/gameContext");
var Deck = require("../game/deck");

describe("Game", () => {
  describe("Setting up Game...", () => {
    it("Initializes a game...", () => {
      const deck = Deck.getStandardDeck();
      const game = new GameContext(deck);

      game.isGameOver.should.equal(false);
      game.rounds.should.equal(0);
      game.winner.should.equal("tie");
    });

    it("Plays a game...", () => {
      const deck = Deck.getStandardDeck();
      const game = new GameContext(deck);

      game.play();

      game.isGameOver.should.equal(true);
      game.rounds.should.greaterThan(0);
      game.winner.should.equalOneOf("firstPlayer", "secondPlayer", "tie");
    });
  });
});
