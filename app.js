// t.me/SBC_TvChatBot

const TelegramBot = require('node-telegram-bot-api');
const fetchUrl = require("fetch").fetchUrl;

const token = '5267675406:AAEII-vvsD_DSMPX__KoDVAN6NHUFU-pGB0';
const bot = new TelegramBot(token, {polling: true});

var regexes = require('./regexes.json');
var diccionari = require('./dictionary.json');
var genresNames = require('./genre.json');


//Sessions
class User {
    constructor(name){
        this.name = name;
        this.lastQuery = null;
        this.contentType = null;
    }  
};
let sessions = new Map();

bot.on('message', (msg) => {
    var userId = msg.chat.id;
    var user = sessions.get(userId);
    if(user == null){
        user = new User(msg.chat.first_name.split(" ")[0]);
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
    var ok = true;
    var item = diccionari[match][Math.floor(Math.random()*diccionari[match].length)];

    
    var content_type = "both";
    var sources = "netflix,hbo_max,disney_plus,apple_tv_plus,prime_video";

    
    console.log(match);
    if(match == "welcome"){
        var matches = input.match(regexes.welcome[0]);
        if(matches != null){
            user.name = matches[0].split(" ")[3];
        }else{
            matches = input.match(regexes.welcome[1]);
            if(matches != null){
                user.name = matches[0].split(" ")[1];
            }
        }
        ok=false;
    }else if(match == "goodbye"){
        ok=false;
    }
    else if(match == "recommender" || match == "content_type" || match == "genre"){
        if(input.split(" ").length > 1){
            match = "not found";
            var index = 0;
            var indexFound = -1;
            regexes.content_type.forEach(item => {
                if(input.match(item) != null){
                    if(match == "not found"){
                        indexFound = index;
                        if(indexFound<2){
                            content_type = "movie";
                        }else{
                            content_type = "show";
                        }
                    }else{
                        if(match != input.match(item)){
                            if(index == 1 && indexFound == 0){
                                content_type = "movie";
                            }else if(indexFound>1 && index>1){
                                content_type = "show";
                            }else{  
                                content_type = "both";
                            }
                            return;
                        }
                    }
                }
                index++;
            });
            var nombres=[];
            var genre=[];
            regexes.genre.forEach(item => {
                if(input.match(item) != null){
                    nombres.push(item);
                }
            });
            if(nombres.length>0){
                for(var g in nombres){
                    genre.push(genresNames[nombres[g]]);
                }
            }
            if(genre.length>1){
                bot.sendMessage(userId, diccionari['debug'], {parse_mode:'HTML'});
            }else{
                user.contentType = content_type;
                user.lastQuery = "https://api.reelgood.com/v3.0/content/random?content_kind="+user.contentType+"&nocache=true&region=es" + (genre=="" ? "" : "&genre="+genre.toString()) + "&sources=" + sources;
            }
        }else{
            item = diccionari['moreInfo'][Math.floor(Math.random()*diccionari['moreInfo'].length)];
            ok = false;
        }
    }


    if(item.match("/username") != null){
        item = item.replace("/username", user.name);
    }


    if(ok && user.lastQuery != null){
        try {
            fetchUrl(user.lastQuery, function(error, meta, body){
                try {
                    const resposta = JSON.parse(body.toString());
                    var any = "Unknown";
                    if(resposta.released_on!=null){
                        any = resposta.released_on.split("-")[0];
                    }
                    var lines="";
                    if(resposta.season_count == 0){
                        lines = resposta.title+"</b></u><b> ("+ any +")</b>\n\n❝";
                    }else{
                        lines = resposta.title+"</b></u>\n\n<i>" + any + " - " + resposta.season_count + " Seasons</i>\n\n❝";
                    }
                    if(resposta.id != null){
                        
                        bot.sendPhoto(userId, "https://img.reelgood.com/content/"+user.contentType+"/"+resposta.id+"/poster-780.jpg", 
                            {parse_mode:'HTML', caption: "‎\n☉ <u><b>"+lines+resposta.overview+"❞\n\n✳️ "+ 
                            (resposta.classification == null ? "Unknown": resposta.classification) + "  •  🕑 " + 
                            resposta.runtime+"min" + "  •  ⭐ " + resposta.imdb_rating + "/10"});   
                    }else{
                        //bot.sendMessage(userId, diccionari['error'][Math.floor(Math.random()*diccionari['error'].length)], {parse_mode:'HTML'});
                        bot.sendMessage(userId, diccionari['debug'], {parse_mode:'HTML'});
                    }
                    
                        
                }catch(err) {
                  //bot.sendMessage(userId, diccionari['error'][Math.floor(Math.random()*diccionari['error'].length)], {parse_mode:'HTML'});
                  bot.sendMessage(userId, diccionari['debug1'], {parse_mode:'HTML'});
                }
            });
          } catch(err) {
            //bot.sendMessage(userId, diccionari['error'][Math.floor(Math.random()*diccionari['error'].length)], {parse_mode:'HTML'});
            bot.sendMessage(userId, diccionari['debug2'], {parse_mode:'HTML'});
          }
        
    } else{
        bot.sendMessage(userId, item, {parse_mode:'HTML'});
    }

    /*
    "released_on": "2021-06-25T00:00:00",
    "genres": [
    12,
    11
  ],
  "season_count": 0,

    
    
    */
    

});




/*

Peli o serie o els dos

Genere/Generes?

Streaming service


EXEMPLE DE CONVERSA:

U: Hola!
C: Hola <nom>!

U: Recomana'm una peli
C: Qualsevol peli

U: Recomana'm una serie
C: Qualsevol serie

U: another one
C: otra peli (amb les mateixes dades que la anterior)

-------------- TAMO AQUI --------------

U: Recomana'm una peli de terror
C: Qualsevol peli de terror

U: Recomana'm una peli de terror i comedia
C: Qualsevol peli de terror i comedia

U: Recomana'm una peli de terror o comedia
C: Qualsevol peli de terror o comedia

U: Recomana'm una peli de netflix
C: Qualsevol peli de peli de netflix

U: Recomana'm una peli de netflix o hbo
C: Qualsevol peli de terror o comedia

U: Recomana'm una peli de netflix i hbo !!
C: Qualsevol peli de terror o comedia




U: Y una de comedia?
C: Una peli de comedia

U: Recomana'm una peli que no sigui de terror
C: Qualsevol peli que no sigui terror
*/