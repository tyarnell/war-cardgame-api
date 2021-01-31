class Card {
  /**
   * Test if a suit is valid
   * @param {string} suit
   */
  static isValidSuit(suit) {
    const suitLower = suit.toLowerCase();

    return (
      [...Card.SUITS.values()].findIndex((s) => s.toLowerCase() === suitLower) >
      -1
    );
  }

  /**
   * Test if a face is valid
   * @param {string} face
   */
  static isValidFace(face) {
    const faceLower = face.toLowerCase();

    return (
      [...Card.CARDS.values()].findIndex(
        (c) => c.face.toLowerCase() === faceLower
      ) > -1
    );
  }

  /**
   * Test if a face value is valid
   * @param {int} value
   */
  static isValidValue(value) {
    return [...Card.CARDS.values()].findIndex((c) => c.value === value) > -1;
  }
  constructor(suit, face, value) {
    if (
      !Card.isValidSuit(suit) ||
      !Card.isValidFace(face) ||
      !Card.isValidValue(value)
    )
      throw Error("Invalid card values.");

    (this.suit = suit), (this.face = face), (this.value = value);
  }
}

// Static Card Properites
Card.SUITS = new Set(["club", "diamond", "heart", "spade"]);
Card.CARDS = new Set([
  { face: "2", value: 2 },
  { face: "3", value: 3 },
  { face: "4", value: 4 },
  { face: "5", value: 5 },
  { face: "6", value: 6 },
  { face: "7", value: 7 },
  { face: "8", value: 8 },
  { face: "9", value: 9 },
  { face: "10", value: 10 },
  { face: "J", value: 11 },
  { face: "Q", value: 12 },
  { face: "K", value: 13 },
  { face: "A", value: 14 },
]);

module.exports = Card;
