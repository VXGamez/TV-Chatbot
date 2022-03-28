// t.me/SBC_TvChatBot

const TelegramBot = require('node-telegram-bot-api');
const fetchUrl = require("fetch").fetchUrl;

const token = '5267675406:AAEII-vvsD_DSMPX__KoDVAN6NHUFU-pGB0';
const bot = new TelegramBot(token, {
    polling: true
});

var regexes = require('./regexes.json');
var diccionari = require('./dictionary.json');
var genresNames = require('./genre.json');


//Sessions
class User {
    constructor(name) {
        this.name = name;
        this.lastQuery = null;
        this.contentType = null;
    }
};

function capitalizeTheFirstLetterOfEachWord(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
        separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
            separateWord[i].substring(1);
    }
    return separateWord.join(' ');
}

var userId;

process.on('unhandledRejection', error => {
    bot.sendMessage(userId, diccionari['error'][Math.floor(Math.random() * diccionari['error'].length)], {
        parse_mode: 'HTML'
    });
});

let sessions = new Map();

bot.on('message', (msg) => {
    userId = msg.chat.id;
    var user = sessions.get(userId);
    if (user == null) {
        user = new User(msg.chat.first_name.split(" ")[0]);
        sessions.set(userId, user);
    }

    var input = msg.text.toLowerCase();


    if (input.match("disney+") != null) {
        input = input.replace("disney+", "disney_plus");
    }
    if (input.match("disney plus") != null) {
        input = input.replace("disney plus", "disney_plus");
    }
    if (input.match("apple tv +") != null) {
        input = input.replace("apple tv +", "apple_tv_plus");
    }
    if (input.match("apple tv plus") != null) {
        input = input.replace("apple tv plus", "apple_tv_plus");
    }
    if (input.match("prime video") != null) {
        input = input.replace("prime video", "prime_video");
    }
    if (input.match("prime ") != null) {
        input = input.replace("prime ", "prime_video");
    }
    if (input.match("hbo max") != null) {
        input = input.replace("hbo max", "hbo_max");
    }


    var match = "none";

    var found = false;
    Object.entries(regexes).map(item => {
        item[1].forEach((intern) => {
            if (input.match(intern) != null) {
                match = item[0];
                found = true;
                return;
            }
        });

        if (found) {
            return;
        }
    });
    var ok = false;
    var item = diccionari[match][Math.floor(Math.random() * diccionari[match].length)];


    var content_type = "both";
    var sources = "netflix,hbo_max,disney_plus,apple_tv_plus,prime_video";


    if (match == "welcome") {
        var matches = input.match(regexes.welcome[0]);
        if (matches != null) {
            user.name = matches[0].split(" ")[3];
        } else {
            matches = input.match(regexes.welcome[1]);
            if (matches != null) {
                user.name = matches[0].split(" ")[1];
            } else{
                matches = input.match(regexes.welcome[2]);
                if (matches != null) {
                    user.name = matches[0].split(" ")[2];
                }
            }

        }
    } 
    else if (match == "recommender" || match == "content_type" || match == "genre" || match == "streaming_service") {
        if (input.split(" ").length > 1) {
            match = "not found";
            var index = 0;
            var indexFound = -1;
            regexes.content_type.forEach(item => {
                if (input.match(item) != null) {
                    if (match == "not found") {
                        indexFound = index;
                        if (indexFound < 2) {
                            content_type = "movie";
                        } else {
                            content_type = "show";
                        }
                    } else {
                        if (match != input.match(item)) {
                            if (index == 1 && indexFound == 0) {
                                content_type = "movie";
                            } else if (indexFound > 1 && index > 1) {
                                content_type = "show";
                            } else {
                                content_type = "both";
                            }
                            return;
                        }
                    }
                }
                index++;
            });
            var nombres = [];
            var genre = [];
            regexes.genre.forEach(item => {
                if (input.match("not " + item + "|isn't " + item + "|isn't a " + item + "|not a " + item) != null) {
                    if (!nombres.includes("not " + item)) {
                        nombres.push("not " + item);
                    }
                } else {
                    if (input.match(item) != null) {
                        if (!nombres.includes(item)) {
                            nombres.push(item);
                        }
                    }
                }
            });
            if (nombres.length > 0) {
                for (var g in nombres) {
                    if (nombres[g].split(" ").length > 1) {
                        var num = genresNames[nombres[g].split(" ")[1]];
                        var generated = Object.keys(genresNames)[Math.floor(Math.random() * Object.keys(genresNames).length)];
                        while (num == genresNames[generated]) {
                            generated = Object.keys(genresNames)[Math.floor(Math.random() * Object.keys(genresNames).length)];
                        }
                        genre.push(genresNames[generated]);
                    } else {
                        genre.push(genresNames[nombres[g]]);
                    }
                }
            }
            var selectedGenre = genre[0];

            if (genre.length > 1) {
                var allWords = input.split(" ");

                var genreOk = true;

                for (var i = 0; i < allWords.length - 2; i += 2) {
                    if (nombres.includes(allWords[i]) && allWords[i + 1] == "and" && nombres.includes(allWords[i + 2])) {
                        genreOk = false;
                        break;
                    }
                }
                if (!genreOk) {
                    bot.sendMessage(userId, diccionari['invalidGenre'][Math.floor(Math.random() * diccionari['moreInfo'].length)], {
                        parse_mode: 'HTML'
                    });
                    return;
                } else {
                    selectedGenre = genre[Math.floor(Math.random() * genre.length)];
                }
            }

            var streaming = [];
            var platforms = "";
            regexes.streaming_service.forEach(item => {
                if (input.match(item) != null) {
                    streaming.push(item);
                }
            });

            platforms = "";

            if (streaming.length > 1) {
                var allWords = input.split("or");

                for (var i = 0; i < allWords.length; i++) {
                    var cleaned = "";
                    var palabros = allWords[i].split(" ");
                    for (var j = 0; j < palabros.length; j++) {
                        if (palabros[j] == "and") {
                            cleaned += " " + palabros[j] + " ";
                        }
                        if (palabros[j].match("netflix|hbo_max|hbo|disney_plus|apple_tv_plus|prime_video") != null) {
                            cleaned += palabros[j];
                        }
                    }
                    if (cleaned != "") {
                        allWords[i] = cleaned;
                    } else {
                        delete allWords[i];
                    }
                }


                platforms = allWords[Math.floor(Math.random() * allWords.length)];

                platforms = platforms.replace(" and ", ",");
            } else if (streaming.length == 1) {
                platforms = streaming[0];
            }

            user.contentType = content_type;
            user.selectedGenre = genre == "" ? "" : "&genre=" + selectedGenre;
            user.selectedPlatforms = platforms == "" ? sources : platforms;
            user.lastQuery = "https://api.reelgood.com/v3.0/content/random?content_kind=" + user.contentType + "&nocache=true&region=es" + user.selectedGenre + "&sources=" + user.selectedPlatforms;
            ok = true;

        } else {
            item = diccionari['moreInfo'][Math.floor(Math.random() * diccionari['moreInfo'].length)];
        }
    }
    else if(match == "another"){
        ok = true;
    }


    if (item.match("/username") != null) {
        item = item.replace("/username", capitalizeTheFirstLetterOfEachWord(user.name));
    }


    if (ok && user.lastQuery != null) {
        try {
            fetchUrl(user.lastQuery, function (error, meta, body) {
                try {
                    const resposta = JSON.parse(body.toString());
                    var any = "Unknown";
                    if (resposta.released_on != null) {
                        any = resposta.released_on.split("-")[0];
                    }
                    var lines = "";
                    if (resposta.season_count == 0) {
                        lines = resposta.title + "</b></u><b> (" + any + ")</b>\n\n❝";
                    } else {
                        lines = resposta.title + "</b></u>\n\n<i>" + any + " - " + resposta.season_count + " Seasons</i>\n\n❝";
                    }
                    if (resposta.id != null) {

                        var contenido = user.contentType;
                        if (user.contentType == "both") {
                            if (resposta.season_count == 0) {
                                contenido = "movie";
                            } else {
                                contenido = "show";
                            }
                        }

                        bot.sendPhoto(userId, "https://img.reelgood.com/content/" + contenido + "/" + resposta.id + "/poster-780.jpg", {
                            parse_mode: 'HTML',
                            caption: "‎\n☉ <u><b>" + lines + resposta.overview + "❞\n\n✳️ " +
                                (resposta.classification == null ? "Unknown" : resposta.classification) + "  •  🕑 " +
                                resposta.runtime + "min" + "  •  ⭐ " + resposta.imdb_rating + "/10"
                        });
                    } else {
                        bot.sendMessage(userId, diccionari['error'][Math.floor(Math.random() * diccionari['error'].length)], {
                            parse_mode: 'HTML'
                        });
                    }


                } catch (err) {
                    bot.sendMessage(userId, diccionari['error'][Math.floor(Math.random() * diccionari['error'].length)], {
                        parse_mode: 'HTML'
                    });
                }
            });
        } catch (err) {
            bot.sendMessage(userId, diccionari['error'][Math.floor(Math.random() * diccionari['error'].length)], {
                parse_mode: 'HTML'
            });
        }

    } else {
        bot.sendMessage(userId, item, {
            parse_mode: 'HTML'
        });
    }
});


/*
EXEMPLE DE CONVERSA:

U: Hola!
C: Hola <nom>!

U: Recomana'm una peli
C: Qualsevol peli

U: Recomana'm una serie
C: Qualsevol serie

U: another one
C: otra peli (amb les mateixes dades que la anterior)

U: Recomana'm una peli de terror
C: Qualsevol peli de terror

U: Recomana'm una peli de terror o comedia
C: Qualsevol peli de terror o comedia

U: Recomana'm una peli de netflix
C: Qualsevol peli de peli de netflix

U: Recomana'm una peli de netflix o hbo
C: Qualsevol peli de terror o comedia

U: Recomana'm una peli que no sigui de terror
C: Qualsevol peli que no sigui terror

*/