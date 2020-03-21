# Japanizer

## Summary

Learn Japanese by playing. Find the correct transcription of the Japanese symbols (at this moment only Hiragana) that appear and beat yourself with this little application.

[Respository]()

## Possible improvements

* Add Katakana support
* Add Kanji support
* Share new records in social media
* Gamify: World ranking, Friends ranking, Achievements, ...

## Lessons learnt

* How to implement a Singleton object in JavaScript
* Trying to save all possible setup combination lead to a high computation overhead with poor customer experience 2 29 combinations
* New array join syntax [...iterator1, ... iterator2]

## Development

Install latest version of [NodeJS](https://nodejs.org) if you don't have it already.

Create package and dependencies:
```bash
$ npm init
$ npm i -D electron@latest
$ npm i -D electron-builder@latest
```

Install dev dependencies:
```bash
$ npm install
```

Run the application locally:

```bash
$ npm start
```

Build the application and create installer:
```bash
$ npm run dist
```
