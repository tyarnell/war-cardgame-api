# War Card Game

A solution to build and deploy an api that initiates a game of war, and retrieves results.

## Environment set up

1. Install [Terraform](https://learn.hashicorp.com/tutorials/terraform/install-cli)
2. Set up [AWS-sdk w/Environment Variables](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-up-node.html)
3. Install project

```bash
cd ./app
npm install

#optional
npm test

cd ../terraform terraform init
```

## Usage

```bash
chmod +x ./deploy.sh
./deploy.sh
```

## Results

- Terraform scripts create an Elastic Beanstalk environment, hosting a NodeJS express API
- Data & results are stored in a DynamoDB table
- the api BaseURL is most easily found in the AWS Console, and should look something like: `http://[YOUR APP NAME].[ELASTIC BEANSTALK ID].[REGION].elasticbeanstalk.com`
- A demo url can be found [here](http://tf-war-api.eba-nbvjccm8.us-west-2.elasticbeanstalk.com)

## API Usage

```
Method: /GET Route: /status
  EG: base_url/status
  Response: {"status":true,"message":"App is working."}

Method: /GET Route: /start-game
  EG: base_url/start-game
  response: {"status":true,"message":"Success!","data":{"result":"secondPlayer","rounds":4791}}

Method: /GET Route: /lifetime-results
  QueryParams: result Options: firstPlayer, secondPlayer, tie
  EG: base_url/lifetime-results?result=firstPlayer
  Response: {"status":true,"message":"success","data":{"result":"firstPlayer","count":4}}
```

## Considerations

The card game war is simple, yet has a few odd considerations when played out programmatically. Namely, if the cards are always layed down in the same order, where the first player lays down a card first, there are cases where games go infinitely. In the game logic, I noticed that games can last far longer than in the real world, so I have a stop limit of 10,000 rounds for a single game, in which case the game ends in a tie.

The game module is a standalone implementation of the game, and there are two ways to implement a game:

**Number 1**

As I have implemented it through the `game.play()` method.

```javascript
const deck = Deck.getStandardDeck();
const game = new GameContext(deck);
game.play();
```

**Number 2**

If there is a need to access the specific round details, then as a generator

```javascript
const deck = Deck.getStandardDeck();
const game = new GameContext(deck);

for (const round of game) {
  // Do something
}
```

## Future Work

There is quite a lot of work/additions I would like to make to the project, including but not limited to:

1. A more robust API, where users can submit their own player names & game configurations
2. Add more game mechanics: multiple players (2-4), card pile shuffling defaults, and optional war play styles
3. A GUI that allows for visual round playback of a simulated game, or interative rounds.
