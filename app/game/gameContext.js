module.exports = class GameContext {
  constructor(startingDeck) {
    this._gameOver = false;
    this._round = 0;
    this._playerHands = {
      firstPlayer: [],
      secondPlayer: [],
    };
    this.pile = [];

    this._deal(startingDeck.cards);
  }

  /**
   * Getter: is game complete.
   */
  get isGameOver() {
    return this._gameOver;
  }

  get winner() {
    return this._playerHands.firstPlayer.length === 0
      ? "secondPlayer"
      : this._playerHands.secondPlayer.length === 0
      ? "firstPlayer"
      : "tie";
  }

  get rounds() {
    return this._round;
  }

  /**
   * Deal a shuffled deck of cards to each player.
   * @param {Deck} deckOfCards object
   */
  _deal(deckOfCards) {
    deckOfCards.forEach((e, i) => {
      i % 2 !== 0
        ? this._playerHands.firstPlayer.push(e)
        : this._playerHands.secondPlayer.push(e);
    });
  }

  /**
   * Determine if the a player is out of cards
   */
  _isPlayerOutOfCards() {
    if (
      this._playerHands.firstPlayer.length === 0 ||
      this._playerHands.secondPlayer.length === 0
    ) {
      this._gameOver = true;
    }
  }

  /**
   * Play a hand of cards 'face up' and determine the outcome
   */
  _playHand() {
    // If the game is over, exit loop and return the winner
    if (this.isGameOver) {
      if (this._playerHands.firstPlayer.length > 0) {
        return "first";
      } else {
        return "second";
      }
    }

    let cardOne = this._playerHands.firstPlayer[0];
    let cardTwo = this._playerHands.secondPlayer[0];

    // Add a card from each player's hands to the pile, and
    // remove the cards from each hand.
    this.pile.push(cardOne, cardTwo);
    this._playerHands.firstPlayer.shift();
    this._playerHands.secondPlayer.shift();

    // Determine the winning hand, or in the case
    // of a tie a war.
    return cardOne.value > cardTwo.value
      ? "first"
      : cardOne.value < cardTwo.value
      ? "second"
      : "war";
  }

  // Add an extra set of cards to the pile when
  // we reach the war phase. Technically, the war phase also follows with the next card,
  // but since it is just a card flip we can just flip the next card as normal
  _warShift() {
    this.pile.push(
      this._playerHands.firstPlayer[0],
      this._playerHands.secondPlayer[0]
    );
    this._playerHands.firstPlayer.shift();
    this._playerHands.secondPlayer.shift();
    this._isPlayerOutOfCards();
  }

  /**
   * Resolve a play-hand of cards, including recursively cycling
   * through more hands if there is a war.
   */
  _resolveHand() {
    function recurse(that) {
      // Get the cards played for the hand
      handsPlayed += 1;

      let outcome = that._playHand();

      // Add the cards to the bottom of the winning players hand, or
      // in the case of a war each player adds a card to the pile
      // and we play another hand.
      switch (outcome) {
        case "first":
          that._playerHands.firstPlayer.push(...that.pile);
          that._isPlayerOutOfCards();
          break;
        case "second":
          that._playerHands.secondPlayer.push(...that.pile);
          that._isPlayerOutOfCards();
          break;
        case "war":
          that._warShift();
          outcome = recurse(that);

          break;
      }
      return outcome;
    }

    // Function scoped variabls available to all recusive call
    // and this/that binding to we can access object properties/methods.
    var handsPlayed = 0;
    var that = this;

    return {
      winner: recurse(that),
      noOfHands: handsPlayed,
    };
  }

  playRound() {
    const { winner } = this._resolveHand();
    this.pile = []; // reset the card pile after the hand is over

    this._round += 1;
    return { round: this._round, winner: winner };
  }

  *[Symbol.iterator]() {
    while (!this.isGameOver) {
      yield this.playRound();
    }
  }

  // Add a round limit, due to the fact that war can go inifintely.
  // Potentially could add a 'suffle pile' option before we add them back to the bottom
  // of the deck, but more needs to be understood.
  // If round limit is reached, the game ends in a tie.
  // https://mathoverflow.net/questions/11503/does-war-have-infinite-expected-length
  play(roundLimit = 10000) {
    do {
      var { round } = this.playRound();
      if (round === roundLimit) {
        this._gameOver = true;
      }
    } while (!this.isGameOver);
  }
};
