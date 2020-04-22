const   Discord = require('discord.js'),
        mongoose = require("mongoose"),
        moment = require("moment"),
        Nick = require("../models/nick"),
        Boy = require("../models/boy"),
        bmHelpers = require("../bmHelpers")
        dotEnv = require("dotenv");

const client = new Discord.Client();

if (process.env.NODE_ENV !== 'production') {
    dotEnv.config({ path: '../.env' });
}

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, });

var discordMessages = []
var nickEntries = []

client.once('ready', () => {
    console.log("Broumvirate discord bot running!");
    client.channels.fetch("699995522718630020").then(channel => channel.messages.fetch({limit:50}).then(messages =>{
        messages.forEach( msg => {
            discordMessages.push(msg.embeds)
        })
    })).then(() => {
    processNicks(discordMessages)})
})

client.login(process.env.DISCORD)

function processNicks(mges){
    var changes = []
    mges.sort((a, b) => (a[0].timestamp, b[0].timestamp) ? -1 : 1)
    for(i=0;i<mges.length;i++){
        if(moment(mges[i][0].timestamp).isAfter(moment(Date.now()).subtract(1, "day"))){

            changes.push({  nickname:   mges[i][0].fields[1].value.slice(1, -1),
                            boy:        bmHelpers.discordTags[mges[i][0].author.name.split("#")[1]]})
        }

    }

    var entry = {date:Date.now(), nicknames:[]}
    var idList = []
    for(i=0;i<changes.length;i++){
        if(idList.includes(changes[i].boy)){
            nickEntries.push(entry);
            entry = {date:moment(Date.now()).add(i, "s").format(), nicknames:[]}
            idList = []
        }
        idList.push(changes[i].boy)
        entry.nicknames.push(changes[i])
    }
    nickEntries.push(entry);
    if(nickEntries[0].nicknames.length > 0){
        Nick.insertMany(nickEntries, function(err, newNick){
            if(err){
                console.log(err);
                process.exit(0);
            }
            else{
                console.log(newNick);
                process.exit(0);
            }
        })
    }
}