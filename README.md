<p align="center">
  <img src="/media/popcorn.png" height="70px">
</p>
<h1 align="center">TV-Chatbot</h1>

<p align="center">
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/node.js-17.8-orange">
  </a
  <a href="https://github.com/VXGamez/TV-Chatbot/tree/main/LICENSE">
    <img src="https://img.shields.io/badge/License-BSD%203-lightgrey.svg">
  </a>
  <a href="https://github.com/VXGamez/TV-Chatbot/tree/main">
    <img src="https://img.shields.io/badge/Development Stage-blue.svg">
  </a>
  <a href="https://opensource.org/licenses/BSD-3-Clause">
    <img src="https://img.shields.io/badge/Open%20Source-%E2%9D%A4-brightgreen.svg">
  </a>
</p>

<p align="center">
    TV-Chatbot is a Telegram Chatbot that can recommend you a variety of series and TV shows
</p>
<br>

## Introduction
TV-Chatbot is a Telegram Chatbot that can recommend you a variety of series and TV shows from different platforms (specifically,
Netflix, HBO Max, Amazon Prime, Apple TV+ and Disney+).
You can tell him what platforms you have and what you want to be recommended (e.g. a horror movie).

To use it, run it and visit: [TvChatbot](https://t.me/SBC_TvChatBot)

## API

The API used for this project has been extracted from the [ReelGood](https://reelgood.com/roulette) page. We reverse engineered the calls the website makes for it's API and created the "api_readme" file found in this same repository. To do this we captured the website's traffic and took a look at the paquets it was sending, and what headers they had.

We found a limitation to this method. We could only support up to 5 streaming services simultaneously since supporting more would require a registered user and using a bearer token that refreshes over time.

## Example

Here is a practical example to see how the TV-Chatbot works:

> **User:** Hello my name is Carlos!

> **TV Chatbot:** Hey!! What a joy to see you here! 😃

> **User:** Recommend me a TV show streamed in Netflix please!

> **TV Chatbot:** 
<br><br><img src="/media/movies/movie2.jpg" height=250px><br><br>
☉ <b><u>Sacred Games</u></b><br><br>
<i>2018 - 2 Seasons</i><br><br>
❝A link in their pasts leads an honest cop to a fugitive gang boss, whose cryptic warning spurs the officer on a quest to save Mumbai from cataclysm.❞<br><br>
✳️ 18+  •  🕑 50min  •  ⭐ 8.6/10<br><br>

> **User:** Can you recommend me a movie now streamed in HBO max?

> **TV Chatbot:**
<br><br><img src="/media/movies/movie1.jpg" height=250px><br><br>
☉ <b><u>The Warning</u></b> <b>(2018)</b><br><br>
❝Ten-year-old Nico receives a threatening letter and now his life is in danger. No one seems to believe him except one person that he doesn't know.❞<br><br>
✳️ 18+  •  🕑 93min  •  ⭐ 5.9/10

> **User:** Goodbye!

> **TV Chatbot:** Bye! I hope to see you soon 🤙

## How to Run it
To run it, you need to have Node & npm installed in your system
```bash
#Clone the repository
git clone https://github.com/VXGamez/TV-Chatbot.git

#Install the npm packages
npm install

#Start it
npm start

#Visit https://t.me/SBC_TvChatBot to talk to the bot
```



