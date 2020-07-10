
const Discord = require('discord.js');
const client = new Discord.Client();
const db = require('quick.db');
var economy = new db.table('economy');
var games = new db.table('games');
var embed = new Discord.MessageEmbed();

embed.setColor('#EEA81C');
 embed.setFooter("Value Bot");
embed.setTimestamp();

var bal;
var wins;
var losses;
var id;
var username;
var avatarUrl;
var player1;
var player2;
var channel;
var channelId;
var player1card;
var player2card;
var player1short;
var player2short;
const {prefix, token} = require("./config.json");
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});





client.on('message', message => {



  (async () => {
    if (games.has(message.channel.id)) {
      if (message.author.bot) return;
            if (!(games.has(message.channel.id))) return;
            if (!(message.author.id == games.get(message.channel.id).activePlayer)) return;
              console.log(Number(message.content));
              console.log(Number(message.id));
              if (games.get(message.channel.id+".firstTurn") && Number(message.content) > 15) {
                  if (message.id != message.id) return;
                client.channels.cache.get(message.channel.id).send("You can not bet over 15 for the first turn!");
                return;
              }
              if (Number.isInteger(Number(message.content)) && Number(message.content) >= 1 && economy.get(games.get(message.channel.id).activePlayer).balance >= Number(message.content) && !isNaN(Number(message.content)) && typeof Number(message.content) == 'number' && isFinite(Number(message.content)) && Number(message.content) % 1 === 0 & Number.isSafeInteger(Number(message.content)) && Number(message.content) > games.get(message.channel.id).player1bet && Number(message.content) >  games.get(message.channel.id).player2bet) {
              games.set(message.channel.id+".firstTurn", false);
                if (games.get(message.channel.id).activePlayer == games.get(message.channel.id).player1) {
                  games.set(message.channel.id+".player1bet", Number(message.content));
                  games.set(message.channel.id+".activePlayer", games.get(message.channel.id).player2);
                  client.channels.cache.get(message.channel.id).send("<@"+ games.get(message.channel.id).activePlayer + "> It is now your turn.");
                  embed.setTitle("Bets");
                  embed.setDescription("Please input a number that is higher than " + games.get(message.channel.id+".player1bet") + "coins, or say stop to give priority.");
                  embed.addFields(
                  { name: games.get(message.channel.id+".player1name"), value: games.get(message.channel.id+".player1bet") + " coins"},
                  { name: games.get(message.channel.id+".player2name"), value: games.get(message.channel.id+".player2bet") + " coins"}
                  );
                  client.channels.cache.get(message.channel.id).send(embed);
                  embed.fields = [];
                  embed.setTitle("");
                  embed.setDescription("");
                  return;
                }
                else {
                  games.set(message.channel.id+".player2bet", Number(message.content));
                  games.set(message.channel.id+".activePlayer", games.get(message.channel.id).player1);
                  client.channels.cache.get(message.channel.id).send("<@"+ games.get(message.channel.id).activePlayer + "> It is now your turn.");
                  embed.setTitle("Bets");
                  embed.setDescription("Please input a number that is higher than " + games.get(message.channel.id+".player2bet") + "coins, or say stop to give priority.");
                  embed.addFields(
                  { name: games.get(message.channel.id+".player1name"), value: games.get(message.channel.id+".player1bet") + " coins"},
                  { name: games.get(message.channel.id+".player2name"), value: games.get(message.channel.id+".player2bet") + " coins"}
                  );
                  client.channels.cache.get(message.channel.id).send(embed);
                  embed.fields = [];
                  embed.setTitle("");
                  embed.setDescription("");
                  return;
                }
              }
              else if (message.content == "stop") {
if (games.get(message.channel.id+".player1bet") == 0 || games.get(message.channel.id+".player2bet") == 0) {
client.channels.cache.get(message.channel.id).send("Both players must bet at least once before a stop!");
return;
}


                if (games.get(message.channel.id).activePlayer == games.get(message.channel.id).player1) {
                  games.set(message.channel.id+".activePlayer", games.get(message.channel.id).player2);
                }
                else {
                  games.set(message.channel.id+".activePlayer", games.get(message.channel.id).player1);
                }



                embed.addFields(
                { name: games.get(message.channel.id+".player1name"), value: games.get(message.channel.id+".player1bet") + " coins"},
                { name: games.get(message.channel.id+".player2name"), value: games.get(message.channel.id+".player2bet") + " coins"},
                { name: "Stopped", value: "Do you think your card is higher or lower?"}
                );
                client.channels.cache.get(message.channel.id).send(embed).then(response => {
                  embed.fields = [];
                  games.set(message.channel.id+".message", response.id);
                  games.set(message.channel.id+".status", "end");
                  response.react('⬆️').then(() => response.react('⬇️'));
                  client.channels.cache.get(message.channel.id).overwritePermissions([
              {
                id: games.get(message.channel.id+".player1"),
                deny: 'SEND_MESSAGES',
              },
              {
                id: games.get(message.channel.id+".player2"),
                deny: 'SEND_MESSAGES',
              }

            ]);









                });
              }
              else {
                client.channels.cache.get(message.channel.id).send("That is not a valid number, it's not higher then the previous bet, or you don't have that much to bet. Please try again!");
                return;
              }
    }
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  var args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  args = args.join(" ");
  if (command === 'stats' || command === 'info' || command === 'bal' || command === 'balance') {
    if (args.length == 0 ) {
id = message.author.id;
username = message.member.user.tag;
avatarUrl = message.author.displayAvatarURL();
    }
    else {
      id = await getUserFromMention(args);
      console.log(id);
      try {
        await client.users.fetch(id).then(myUser => {
      avatarUrl = myUser.avatarURL();
      username = myUser.tag;
    });
      }
      catch {
        message.channel.send("That is not a user!");
        return;
      }


    }
          try {
            bal = economy.get(id).balance;
            wins = economy.get(id).wins;
            losses = economy.get(id).losses;
          }
          catch {
              economy.set(id, {balance: 150, wins: 0, losses: 0});
              bal = economy.get(id).balance;
              wins = economy.get(id).wins;
              losses = economy.get(id).losses;



          }
          embed.setThumbnail(avatarUrl);
          embed.addFields(
		{ name: '**Name** ', value: username},
    { name: '**Coins** ', value: bal },
    { name: '**Wins** ', value: wins },
    { name: '**Losses** ', value: losses }
        );
message.channel.send(embed);
embed.fields = [];
embed.setThumbnail();
      }
      else if (command == "rules" || command == "video") {
        message.channel.send("https://youtu.be/LfhFnv7sYU4");
      }
      else if (command == "add" && message.member.hasPermission('ADMINISTRATOR')) {
        args = args.split(" ");
        id = getUserFromMention(args[0]);
        if (id == undefined) {
          message.channel.send("Not a user!");
          return;

              }
              try {
                bal = economy.get(id).balance;
                wins = economy.get(id).wins;
                losses = economy.get(id).losses;
              }
              catch {
                  economy.set(id, {balance: 150, wins: 0, losses: 0});
              }
        try {
          economy.add(id+".balance", args[1]);
          message.channel.send("Added " + args[1] + " coins to " + args[0]);
        }
        catch {
          message.channel.send("Not a number try again!");
        }

      }
      else if (command == "remove" && message.member.hasPermission('ADMINISTRATOR')) {
        args = args.split(" ");
        id = getUserFromMention(args[0]);
        if (id == undefined) {
          message.channel.send("Not a user!");
          return;
        }
        try {
          bal = economy.get(id).balance;
          wins = economy.get(id).wins;
          losses = economy.get(id).losses;
        }
        catch {
            economy.set(id, {balance: 150, wins: 0, losses: 0});




        }
        try {
          economy.subtract(id+".balance", args[1]);
          message.channel.send("Removed " + args[1] + "coins from " + args[0]);
        }
        catch {
          message.channel.send("Not a number try again!");
        }
      }
      else if (command == "set" && message.member.hasPermission('ADMINISTRATOR')) {
        args = args.split(" ");
        id = getUserFromMention(args[0]);
        if (id == undefined) {
          message.channel.send("Not a user!");
          return;
        }
        try {
          bal = economy.get(id).balance;
          wins = economy.get(id).wins;
          losses = economy.get(id).losses;
        }
        catch {
            economy.set(id, {balance: 150, wins: 0, losses: 0});




        }
        try {
          economy.set(id+".balance", args[1]);
          message.channel.send("Set " + args[1] + " to " + args[0]);
        }
        catch {
          message.channel.send("Not a number try again!");
        }
      }
      else if (command == "all" && message.member.hasPermission('ADMINISTRATOR')) {
        for (var i = 0; i < economy.all().length; i++) {
          try {
            economy.set(economy.all()[i].ID+".balance", Number(args));
          }
          catch (e) {
            message.channel.send("Not a number try again!");
            console.log(e);
            return;
          }

        }
        message.channel.send("Set everyones balance to " + args + " coins");
      }

      else if (command == "challenge") {


if (getUserFromMention(args) == message.author.id) return;
player1 = message.author.id;
  player2 = getUserFromMention(args);
  if (player2 == undefined) {
    message.channel.send("Not a user!");
    return;
  }


for (var i = 0; i < games.all().length; i++) {
  if (games.all()[i].data.player1 == player1 || games.all()[i].data.player1 == player2 || games.all()[i].data.player2 == player2 || games.all()[i].data.player2 == player1) {
    message.channel.send("You or the opponet is already in a match!");
    return;
  }
}

await client.users.fetch(player1).then(result => {
player1short = result.tag.slice(0,4)
});


await client.users.fetch(player2).then(result => {
player2short = result.tag.slice(0,4)
});


          let guild = message.guild.id;
            message.guild.channels.create(player1short + "-" + player2short, {
              type: 'text',
              permissionOverwrites: [
                {
                  id: guild,
                  deny: 'VIEW_CHANNEL'
                },
                {
                  id: player1,
                  allow: 'VIEW_CHANNEL'
                },
                {
                  id: player2,
                  allow: 'VIEW_CHANNEL'
                }
              ]
            }).then(result => {

              channelId = result.id;
        channel = client.channels.cache.get(channelId);


























          try {
            economy.get(player1).balance;
            economy.get(player1).wins;
            economy.get(player1).losses;
          }
          catch {
              economy.set(player1, {balance: 150, wins: 0, losses: 0});



          }
          try {
            bal = economy.get(player2).balance;
            wins = economy.get(player2).wins;
            losses = economy.get(player2).losses;
          }
          catch {
              economy.set(player2, {balance: 150, wins: 0, losses: 0});
          }


          embed.addFields(
          { name: '**Name** ', value: message.member.user.tag},
          { name: '**Game Request** ', value: "React ✅ or ❌"},
          { name: '**Id** ', value: channel}
          );





        channel.send(embed).then(message => {
message.react('✅').then(() => message.react('❌'));
games.set(channelId, {player1: player1, player2: player2, message: message.id, status: "start"});
embed.fields = [];
        });

});
      }







      function getUserFromMention(mention) {
      	if (!mention) return;


      	if (mention.startsWith('<@') && mention.endsWith('>')) {
      		mention = mention.slice(2, -1);

      		if (mention.startsWith('!')) {
      			mention = mention.slice(1);
      		}
if (client.users.cache.get(mention).bot) return;
        return client.users.cache.get(mention).id;



      	}
      }

















})();



});







client.on('messageReactionAdd', async (reaction, user) => {


        function getName(card) {
          if (card == 14) {
            return "Ace"
          }
          else if (card == 11) {
            return "Jack"
          }
          else if (card == 12) {
            return "Queen"
          }
          else if (card == 13) {
            return "King"
          }
          else {
            return card;
          }
        }


if (user.bot) return;




if (games.has(reaction.message.channel.id) && games.get(reaction.message.channel.id).player2 == user.id && games.get(reaction.message.channel.id).message == reaction.message.id && games.get(reaction.message.channel.id).status == "start") {
  if (reaction.emoji.name === "✅") {
    player1card = Math.floor(Math.random() * 12) + 2;
    player2card = Math.floor(Math.random() * 12) + 2;
    games.set(reaction.message.channel.id+".player1card", player1card);
    games.set(reaction.message.channel.id+".player2card", player2card);
    await client.users.fetch(player1).then(myUser => {
  avatarUrl = myUser.avatarURL();


embed.setAuthor('Card', avatarUrl);
    embed.setTitle('Your card is '+ getName(player1card));
    embed.attachFiles([__dirname + "\\images\\" + player1card + ".png"])
    embed.setImage('attachment://' + player1card + '.png');
client.users.cache.get(player1).send(embed);
embed = new Discord.MessageEmbed();

embed.setColor('#EEA81C');
 embed.setFooter("Value Bot");
embed.setTimestamp();
});
await client.users.fetch(player2).then(myUser => {
avatarUrl = myUser.avatarURL();


embed.setAuthor('Card', avatarUrl);
    embed.setTitle('Your card is '+ getName(player2card));
    embed.attachFiles([__dirname + "\\images\\" + player2card + ".png"])
    embed.setImage('attachment://' + player2card + '.png');
client.users.cache.get(player2).send(embed);
embed = new Discord.MessageEmbed();
embed.setColor('#EEA81C');
 embed.setFooter("Value Bot");
embed.setTimestamp();
});
    games.set(reaction.message.channel.id+".message", "");
    if (Math.floor(Math.random() * 2) + 1 == 1) {
       channel.send("<@"+ games.get(reaction.message.channel.id).player1 + "> goes first");
       games.set(reaction.message.channel.id+".activePlayer", games.get(reaction.message.channel.id).player1);
    }
    else {
    channel.send("<@"+ games.get(reaction.message.channel.id).player2 + "> goes first");
      games.set(reaction.message.channel.id+".activePlayer", games.get(reaction.message.channel.id).player2);
    }

      client.users.fetch(games.get(reaction.message.channel.id).player1).then(result => {
      games.set(reaction.message.channel.id+".player1name", result.tag);
      });

      client.users.fetch(games.get(reaction.message.channel.id).player2).then(result => {
      games.set(reaction.message.channel.id+".player2name", result.tag);
      });

      games.set(reaction.message.channel.id+".player1bet", 0);
      games.set(reaction.message.channel.id+".player2bet", 0);
      games.set(reaction.message.channel.id+".firstTurn", true);
  }
  else if (reaction.emoji.name === "❌") {
client.channels.cache.get(reaction.message.channel.id).delete();
games.delete(reaction.message.channel.id);
  }
}
else if (games.has(reaction.message.channel.id) && games.get(reaction.message.channel.id).activePlayer == user.id && games.get(reaction.message.channel.id).message == reaction.message.id && games.get(reaction.message.channel.id).status == "end") {


  function player1Wins(reaction) {
    console.log("player 1 win");
    embed.addFields(
    { name: '**Winner** ', value: games.get(reaction.message.channel.id+".player1name")},
    { name: games.get(reaction.message.channel.id+".player1name"), value: "had a " + games.get(reaction.message.channel.id+".player1card") + " and won " + games.get(reaction.message.channel.id+".player2bet") + " coins"},
    { name: games.get(reaction.message.channel.id+".player2name"), value: "had a " + games.get(reaction.message.channel.id+".player2card") + " and lost " + games.get(reaction.message.channel.id+".player2bet") + " coins"}
    );
    client.channels.cache.get(reaction.message.channel.id).send(embed);
    embed.fields = [];
    economy.add(games.get(reaction.message.channel.id+".player1")+'.balance', games.get(reaction.message.channel.id+".player2bet"));
    economy.subtract(games.get(reaction.message.channel.id+".player2")+'.balance', games.get(reaction.message.channel.id+".player2bet"));
    economy.add(games.get(reaction.message.channel.id+".player2")+'.losses', 1);
    economy.add(games.get(reaction.message.channel.id+".player1")+'.wins', 1);
  setTimeout(function() {
  client.channels.cache.get(reaction.message.channel.id).delete();
  games.delete(reaction.message.channel.id);
  }, 10000);

  }

  function player2Wins(reaction) {
    embed.addFields(
    { name: '**Winner** ', value: games.get(reaction.message.channel.id+".player2name")},
    { name: games.get(reaction.message.channel.id+".player1name"), value: "had a " + games.get(reaction.message.channel.id+".player1card") + " and lost " + games.get(reaction.message.channel.id+".player1bet") + " coins"},
    { name: games.get(reaction.message.channel.id+".player2name"), value: "had a " + games.get(reaction.message.channel.id+".player2card") + " and won " + games.get(reaction.message.channel.id+".player1bet") + " coins"}
    );
    client.channels.cache.get(reaction.message.channel.id).send(embed);
    embed.fields = [];
    economy.add(games.get(reaction.message.channel.id+".player2")+'.balance', games.get(reaction.message.channel.id+".player1bet"));
    economy.subtract(games.get(reaction.message.channel.id+".player1")+'.balance', games.get(reaction.message.channel.id+".player1bet"));
    economy.add(games.get(reaction.message.channel.id+".player1")+'.losses', 1);
    economy.add(games.get(reaction.message.channel.id+".player2")+'.wins', 1);
  setTimeout(function() {
  client.channels.cache.get(reaction.message.channel.id).delete();
  games.delete(reaction.message.channel.id);
  }, 10000);
  }









  if (reaction.emoji.name === "⬆️") {
console.log("done!");
games.set(reaction.message.channel.id+".message", "");


          if (games.get(reaction.message.channel.id+".activePlayer") == games.get(reaction.message.channel.id+".player1")) {
            if (games.get(reaction.message.channel.id+".player1card") == games.get(reaction.message.channel.id+".player2card")) {
    player2Wins(reaction);

            }
            else if (games.get(reaction.message.channel.id+".player1card") > games.get(reaction.message.channel.id+".player2card")) {
    player1Wins(reaction);
            }
            else {
    player2Wins(reaction);
            }

          }




          if (games.get(reaction.message.channel.id+".activePlayer") == games.get(reaction.message.channel.id+".player2")) {
            if (games.get(reaction.message.channel.id+".player1card") == games.get(reaction.message.channel.id+".player2card")) {
    player1Wins(reaction);
            }
            else if (games.get(reaction.message.channel.id+".player1card") < games.get(reaction.message.channel.id+".player2card")) {
    player2Wins(reaction);
            }
            else {
    player1Wins(reaction);
            }

          }














        }

        else if (reaction.emoji.name === "⬇️") {
games.set(reaction.message.channel.id+".message", "");
          if (games.get(reaction.message.channel.id+".activePlayer") == games.get(reaction.message.channel.id+".player1")) {
            if (games.get(reaction.message.channel.id+".player1card") == games.get(reaction.message.channel.id+".player2card")) {
    player2Wins(reaction);
            }
            else if (games.get(reaction.message.channel.id+".player1card") < games.get(reaction.message.channel.id+".player2card")) {
    player1Wins(reaction);
            }
            else {
    player2Wins(reaction);
            }

          }




          if (games.get(reaction.message.channel.id+".activePlayer") == games.get(reaction.message.channel.id+".player2")) {
            if (games.get(reaction.message.channel.id+".player1card") == games.get(reaction.message.channel.id+".player2card")) {
    player1Wins(reaction);
            }
            else if (games.get(reaction.message.channel.id+".player1card") > games.get(reaction.message.channel.id+".player2card")) {
    player2Wins(reaction);
            }
            else {
    player1Wins(reaction);
            }

          }






  }
}
});

client.login(token);
