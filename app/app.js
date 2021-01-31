var express = require("express");
var v4 = require("uuid").v4;
var AWS = require("aws-sdk");
var bodyParser = require("body-parser");
var GameContext = require("./game/gameContext");
var Deck = require("./game/deck");

var port = process.env.PORT || 3000;
var app = express();

AWS.config.update({ region: "us-west-2" });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send({
    status: true,
    message: "Please start a game, or retreive results",
  });
});

app.get("/status", (req, res) => {
  res.send({ status: true, message: "App is working." });
});

app.get("/start-game", (req, res) => {
  const deck = Deck.getStandardDeck();
  const game = new GameContext(deck);
  var docClient = new AWS.DynamoDB.DocumentClient();

  game.play();

  var params = {
    TableName: "games-table",
    Item: {
      id: v4(),
      result: game.winner,
      rounds: game.rounds,
    },
  };

  docClient.put(params, function (err, data) {
    if (err) {
      console.error(JSON.stringify(err, null, 2));
    } else {
      console.log("PutItem succeeded");
    }
  });

  res.send({
    status: true,
    message: "Success!",
    data: { result: game.winner, rounds: game.rounds },
  });
});

app.get("/lifetime-results", (req, res) => {
  const query = req.query;

  // query games-table
  var docClient = new AWS.DynamoDB.DocumentClient();
  var params = {
    TableName: "games-table",
    FilterExpression: "#result = :result_val",
    ExpressionAttributeNames: {
      "#result": "result",
    },
    ExpressionAttributeValues: { ":result_val": query.result },
  };

  var count = 0;

  function onScan(err, data) {
    if (err) {
      console.error(
        "Unable to scan the table. Error JSON:",
        JSON.stringify(err, null, 2)
      );
      res.send({
        status: true,
        message: "No results found.",
        data: { result: query.result, count: count },
      });
    } else {
      console.log("Scan succeeded.");

      count += data.Count;
      // continue scanning if we have more items
      if (typeof data.LastEvaluatedKey != "undefined") {
        console.log("Scanning for more...");
        params.ExclusiveStartKey = data.LastEvaluatedKey;
        docClient.scan(params, onScan);
      }

      res.send({
        status: true,
        message: "success",
        data: { result: query.result, count: count },
      });
    }
  }

  docClient.scan(params, onScan);
});

// Listen on Port 3000
app.listen(port, function () {
  console.log("App listening on port 3000!");
});
