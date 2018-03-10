# SiteMon

SiteMon is a Google Chrome extension that monitors user behavior in web surfing.

In the age of information, web surfing has become an indispensable part of human life. It is a fun activity, but sometimes it can distract us from work and thus lower our productivity. Time flies by without notice when we are watching YouTube videos or reading random articles. By the end of the day, we might feel we have not achieved anything. SiteMon helps us track where exactly we spend our time during internet surfing. With the analysis and graph report, we can then adjust our web surfing behavior and increase daily productivity.

If you like it, you can download it at Chrome Web Store: https://chrome.google.com/webstore/search/sitemon

## Features

*   Tracks what websites the user has visited.
*   Tracks how much time the user has spent on any particular website.

## Screenshots

### Popup

![Popup](https://raw.githubusercontent.com/zicodeng/sitemon/master/screenshots/popup.png)

### Dashboard (Options Page)

![Dashboard](https://raw.githubusercontent.com/zicodeng/sitemon/master/screenshots/dashboard.png)

## References

Icon: http://www.clker.com/clipart-292648.html

# Development

## Installation and Run

Install all dependencies.

    npm run install

Run webpack in development mode.

    npm run watch-build

Run webpack in production mode.

    npm run build

## Debug and Test

Go to **chrome://extensions/**

Click **Load unpacked extension...** button.

Find **sitemon** directory in your computer.

Select and load **dist** directory (make sure you have run webpack).
