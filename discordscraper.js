const   Discord = require('discord.js'),
        mongoose = require("mongoose"),
        Nick = require("./models/nick"),
        Boy = require("./models/boy"),
        bmHelpers = require("./bmHelpers")

const client = new Discord.Client();

mongoose.connect("mongodb+srv://dbUser:2tZjrPcSr2VrwWx6@broumvirate-com-wvuvq.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true, });

var discordMessages = []
var nickEntries = []

client.once('ready', () => {
    console.log("Broumvirate discord bot running!");
    client.channels.fetch("699995522718630020").then(channel => channel.messages.fetch({limit:7}).then(messages =>{
        messages.forEach( msg => {
            discordMessages.push(msg.embeds)
        })
    })).then(() => {processNicks(discordMessages)})
})

client.login('NzAwNDg1NDc2NDEwNDU4MTQy.XppVVQ.7Uh7yFPlV-FU0sdAw-yvW2AVbO8')

function processNicks(mges){
    var changes = []
    for(i=0;i<mges.length;i++){
        mges.sort((a, b) => (a[0].timestamp, b[0].timestamp) ? -1 : 1)
        changes.push({  nickname:   mges[i][0].fields[1].value.slice(1, -1),
                        boy:        bmHelpers.discordTags[mges[i][0].author.name.split("#")[1]]})
    }

    var entry = {date:Date.now(), nicknames:[]}
    var idList = []
    for(i=0;i<changes.length;i++){
        if(idList.includes(changes[i].boy)){
            //nickEntries.push(entry);
            entry = {date:Date.now(), nicknames:[]}
            idList = []
        }
        idList.push(changes[i].boy)
        entry.nicknames.push(changes[i])
    }
    //nickEntries.push(entry);
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