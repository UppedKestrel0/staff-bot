const Discord = require("discord.js");
const config = require("./config.json");
const bot = new Discord.Client();
const fs = require("fs");
const colors = require("colors");
const Token = process.env.token;
let profanities = ["fuck", "nigger", "cunt", "bitch", "asshole", "nigga", "tits", "sex", " https://discord.gg/", "https://", "http://", "porn"];

//COMMAND HANDLER
bot.commands = new Discord.Collection();
fs.readdir("./commands", (err, files) => {
  if (err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }
  jsfile.forEach((f,i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} has been loaded!`);
    bot.commands.set(props.help.name, props)
  });
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  if (!message.content.startsWith(config.prefix)) return;

  let prefix = ("!");
  let messageArray = message.content.split(" ")
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if(cmd === `${prefix}serverinfo`){

    let sicon = message.guild.iconURL
    let serverembed = new Discord.RichEmbed()
    .setTitle("**Server Information**")
    .setColor("#00ff23")
    .setThumbnail(sicon)
    .addField("Server Name", message.guild.name)
    .addField("Server Info", "Limbo Realms is a new and upcoming MC server that will have 2 main gamemodes which will be: Skyblock and a surprise gamemode. :wink:")
    .addField("Total Members", message.guild.memberCount);

    message.delete().catch(O_o=> {});

    return message.author.sendMessage(serverembed);
  }

  if(cmd === `${prefix}botinfo`){

    let botembed = new Discord.RichEmbed()
    .setTitle("**Bot Information**")
    .setColor("#00ff23")
    .setThumbnail("https://cdn.discordapp.com/avatars/561093941139603466/65d7ae1b256909d2286fcf3ba9a647fd.png?size=256&quot")
    .addField("Bot Name", bot.user.username)
    .addField("Bot Job", "To assist in moderating this Discord.")
    .addField("Bot Creator", "@UppedKestrel0#9421");

    message.delete().catch(O_o=> {});

    return message.author.sendMessage(botembed);
  }
  
  if(cmd === `${prefix}help`){

    let helpembed = new Discord.RichEmbed()
    .setTitle("**List of Commands**")
    .setColor("#00ff23")
    .addField("Command 1", "!serverinfo | DM's you some information about the Server.")
    .addField("Command 2", "!botinfo | DMs you some information about the bot.")
    .addField("Command 3", "!roll | Picks a random number between 1 and 6.")
    .addField("Command 4", "!8ball <Question> | Answers the question with a random response of: Yes, No, Maybe, I don't know, Please ask again Later")
    .addField("Command 5", "!avatar | Sends your discord avatar in the channel")
    .addField("Command 6", "!cat | Sends an image of a cat")
    .addField("Command 7", "!dog | Sends an image of a dog")
    .addField("Command 8", "!report <user> {reason} | Reports a user for the specified reason")
    .addField("Command 9", "!suggest <suggestion> | Adds a suggestion to the Suggestion Channel");

    message.delete().catch(O_o=> {});

    return message.author.sendMessage(helpembed);
  }

  if(cmd === `${prefix}report`){

    let ruser = message.guild.member(message.mentions.users.first() || message.guild.member.get(args[0]));
    if(!ruser) return message.channel.send("Couldn't find specified user.");
    let reason = args.join(" ").slice(22);

    let reportembed = new Discord.RichEmbed()
    .setTitle("**NEW REPORT**")
    .setColor("#00ff23")
    .addField("Reported User", `${ruser}`)
    .addField("Reported By", `${message.author}`)
    .addField("Time of Report", message.createdAt)
    .addField("Reason", reason);

    let reportchannel = message.guild.channels.find(`name`, "logs");
    if(!reportchannel) return message.author.sendMessage("Couldn't find logs channel");
    message.delete().catch(O_o=> {});

    
    return reportchannel.send(reportembed);
  }

  if(cmd === `${prefix}say`){
    let reply = args.slice(0).join(" ");
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You are lacking the required permissions to run this command.");
    message.delete().catch(O_o=> {});
    
    return message.channel.send(reply);
  }
  if(cmd === `${prefix}suggest`){
    let suggestion = args.slice(0).join(" ");
    
    let suggestEmbed = new Discord.RichEmbed()
    .setTitle("**NEW SUGGESTION**")
    .setColor("#f2f215")
    .addField("__Suggestion__", args)
    .addField("__Author__", `${message.author}`);

    let suggestionChannel = message.guild.channels.find(`name`, "suggestions");
    message.delete().catch(O_o=> {});

    return suggestionChannel.send(suggestEmbed);
  };

  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);
  });

bot.on('guildMemberAdd', (guildMember) => {
  guildMember.addRole(guildMember.guild.roles.find(role => role.name === "Member"));

  guildMember.guild.channels.get("529775651692216331").send(`Welcome <@${guildMember.id}>`);
});

//EVENTS
bot.on('ready', async () => {
    console.log(`${bot.user.username} is online on ${bot.guilds.size} server/s!`)

    bot.user.setActivity("Limbo Realms | !help for a list of commands", {type: "PLAYING"});
});

bot.on('error', error => { console.log(error) });
bot.login(Token);