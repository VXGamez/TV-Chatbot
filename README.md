<p align="center">
  <img src="https://raw.githubusercontent.com/VXGamez/TV-Chatbot/tree/main/media/logo.png">
</p>
<h1 align="center">TV-Chatbot</h1>

<p align="center">
  <a href="https://nodejs.org">
    <img src="https://img.shields.io/badge/node.js-16.9-orange">
  </a>
  <a href="https://github.com/VXGamez/TV-Chatbot/tree/main/LICENSE">
    <img src="https://img.shields.io/badge/License-BSD%203-lightgrey.svg">
  </a>
  <a href="https://github.com/bielcarpi/todoplusplus/tree/main">
    <img src="https://img.shields.io/badge/Development Stage-blue.svg">
  </a>
  <a href="https://opensource.org/licenses/BSD-3-Clause">
    <img src="https://img.shields.io/badge/Open%20Source-%E2%9D%A4-brightgreen.svg">
  </a>
</p>

<p align="center">
    TV-Chatbot is a Telegram Chatbot that can recommend you a variety of series and TV shows
</p>

## Introduction
TV-Chatbot is a Telegram Chatbot that can recommend you a variety of series and TV shows from different platforms (specifically,
Netflix, HBO Max, Amazon Prime, Apple TV+ and Disney+).
You can tell him what platforms you have and what you want to be recommended (e.g. a horror movie).

To use it, run it and visit: t.me/SBC_TvChatBot

## API

The API used for this project has been extracted from the [ReelGood](https://reelgood.com/roulette) page. We reverse engineered the calls the website makes for it's API and created the "api_readme" file found in this same repository. To do this we captured the website's traffic and took a look at the paquets it was sending, and what headers they had.

We found a limitation to this method. We could only support up to 5 streaming services simultaneously since supporting more would require a registered user and using a bearer token that refreshes over time.

## Examples

Here are some practical examples to see how does the TV-Chatbot work:

    - Example 1:

    User: > Hello my name is Carlos!
    TV-Chatbot: > Hey!! What a joy to see you here! 😃
    User: > Recommend me a TV show streamed in Netflix please!
    TV-Chatbot: > 


## How to Run it
```bash

```



