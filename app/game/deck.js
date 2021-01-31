var Card = require("./card");

/**
 * Shuffle and array in place.
 * @param {array} array to shuffle
 */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

class Deck {
  /**
   * Returns a standard deck object with a shuffled deck.
   * @param {Boolean} shuffle
   */
  static getStandardDeck(shuffle = true) {
    let cards = [];
    for (const suit of Card.SUITS.keys()) {
      for (const card of Card.CARDS) {
        cards.push(new Card(suit, card.face, card.value));
      }
    }
    if (shuffle) {
      shuffleArray(cards);
    }
    return new Deck(cards);
  }

  constructor(cards) {
    this.cards = cards;
  }
}

module.exports = Deck;
