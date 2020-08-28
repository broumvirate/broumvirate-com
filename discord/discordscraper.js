const   Discord = require('discord.js'),
        mongoose = require("mongoose"),
        moment = require("moment"),
        Nick = require("../models/nick"),
        Boy = require("../models/boy"),
        bmHelpers = require("../bmHelpers")
        dotEnv = require("dotenv");

const   client = new Discord.Client();

if (process.env.NODE_ENV !== 'production') {
    dotEnv.config({ path: '../.env' });
}

mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true, });

let discordMessages = []     // Contains: messages pulled directly from discord                                           
let nickEntries = []         // Contains: 

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
    let idList = [] // List of discord IDs we've had, if we have two ids in one day we need a new entry
    let entry = {date:Date.now(), nicknames:[], dateString:moment(Date.now()).format("MMMM Do, YYYY")} // Initial entry format

    mges.sort((a, b) => (a[0].timestamp, b[0].timestamp) ? -1 : 1)                              // Sort messages by timestamp
    for(i=0;i<mges.length;i++){
        if(moment(mges[i][0].timestamp).isAfter(moment(Date.now()).subtract(1, "day"))){        // For each message, if it's within the last day

            let discordTag = mges[i][0].author.name.split("#")[1]                               // Grab the 4-digit discord tag from the user
            if(Object.keys(bmHelpers.discordTags).includes(discordTag)){                        // If that user is in the discordTags:boys list, it is valid. Proceed.

                let boyId = bmHelpers.discordTags[discordTag]                                   // Grab the boyId and the nickname
                let thisNickname = mges[i][0].fields[1].value.slice(1, -1)

                if(idList.includes(boyId)){                                                     // If we've already had that boy, push the entry to the finished entry list and reset it
                    nickEntries.push(entry);                                                    // This code makes sure there are new entries if a boy comes up twice
                    entry = {date:moment(Date.now()).add(i, "s").format(), nicknames:[], dateString:moment(Date.now()).format("MMMM Do, YYYY")}
                    idList = []
                }

                idList.push(boyId)                                                              // Now, add this boy's ID to the list so we know when it comes up again
                entry.nicknames.push({                                                          // Add the boy/nick pair to the entry list
                   boy: boyId,
                   nickname: thisNickname 
                })

            }
        }
    }
    nickEntries.push(entry);                                                                    // We're out of the loop, push the last entry to the nick entries list 

    if(nickEntries[0].nicknames.length > 0){                                                    // Make sure there's at least one nickname change, and insert into database
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