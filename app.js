// t.me/SBC_TvChatBot

const TelegramBot = require('node-telegram-bot-api');
const fetchUrl = require("fetch").fetchUrl;

const token = '5267675406:AAEII-vvsD_DSMPX__KoDVAN6NHUFU-pGB0';
const bot = new TelegramBot(token, {polling: true});

var regexes = require('./regexes.json');
var diccionari = require('./dictionary.json');


//Sessions
class User {
    constructor(name){
        this.firstName = name[0];
        this.lastName = name[1];
    }  
    
    set name (value){
        if(value.split(" ").length>1){
            this.firstName = value;
            this.lastName = value;
        }else{
            this.firstName = value;
            this.lastName = "";
        }
    }


};
let sessions = new Map();

bot.on('message', (msg) => {
    var userId = msg.chat.id;
    var user = sessions.get(userId);
    if(user == null){
        user = new User(msg.chat.first_name.split(" "));
        sessions.set(userId, user);
    }    
    
    var input = msg.text.toLowerCase();
    
    var match = "none";
    
    var found = false;
    Object.entries(regexes).map(item => {
        item[1].forEach((intern) => {
            if(input.match(intern) != null){
                match = item[0];
                found = true;
                return;
            }
        });
        
        if(found){
            return;
        }
    });
    
    var item = diccionari[match][Math.floor(Math.random()*diccionari[match].length)];
    if( (match == "welcome" || match == "goodbye") ){
        var username = msg.from.first_name;
        var matches = input.match(regexes.welcome[0]);
        if(matches != null){
            username = matches[0].split(" ")[3];
        }
        user.name = username;
    }
    
    if(item.match("/username") != null){
        item = item.replace("/username", user.name);
    }
    

    fetchUrl("https://api.reelgood.com/v3.0/content/random?content_kind=both&nocache=true&region=es&sources=apple_tv_plus", function(error, meta, body){
        const resposta = JSON.parse(body.toString());
        //bot.sendPhoto(chatId, "https://img.reelgood.com/content/show/"+resposta.id+"/poster-780.jpg");
        bot.sendMessage(userId, item);
    });

});