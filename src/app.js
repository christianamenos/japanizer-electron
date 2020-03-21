class DataBase {

    instance;

    DB_NAME = 'hiraganer-index';
    HIRAGANA_INDEX = 'hiragana';
    LEVEL_INDEX = 'level';
    SCORE_INDEX = 'score';
    TIME_INDEX = 'time';
    /*
    KATAKANA_INDEX = 'katakana';
    KANJI_INDEX = 'kanji';
    */

    database = {};

    constructor() {
        if (typeof DataBase.instance === 'object') {
            return DataBase.instance;
        } else {
            this.database = this._load();
            if (!this.database) {
                this.database = {};
                this.database[this.HIRAGANA_INDEX] = {
                    level: 0,
                    score: 0,
                    time: Infinity
                };
            }
        }
        this._save();

        this.instance = this;
        return this;
    }

    clean() {
        localStorage.clear();
    }

    _load() {
        return JSON.parse(window.localStorage.getItem(this.DB_NAME));
    }

    _save() {
        localStorage.setItem(this.DB_NAME, JSON.stringify(this.database));
    }

    updateAlphabetScore(alphabet, level, score, time) {
        if (alphabet === this.HIRAGANA_INDEX) { // TODO: add conditions for KATANA and KANJI
            this.database[alphabet][this.LEVEL_INDEX] = level;
            this.database[alphabet][this.SCORE_INDEX] = score;
            this.database[alphabet][this.TIME_INDEX] = time;
            this._save();
        }

    }

    getAlphabetScore(alphabet) {
        return this.database[alphabet];
    }
}

const db = new DataBase();
const MAX_SELECTABLE_OPTIONS = 4;
const hiraganaSymbols = [
    ['&#12354;', '&#12356;', '&#12358;', '&#12360;', '&#12362;'],
    ['&#12363;', '&#12365;', '&#12367;', '&#12369;', '&#12371;'],
    ['&#12373;', '&#12375;', '&#12377;', '&#12379;', '&#12381;'],
    ['&#12383;', '&#12385;', '&#12387;', '&#12390;', '&#12392;'],
    ['&#12394;', '&#12395;', '&#12396;', '&#12397;', '&#12398;'],
    ['&#12399;', '&#12402;', '&#12405;', '&#12408;', '&#12411;'],
    ['&#12414;', '&#12415;', '&#12416;', '&#12417;', '&#12418;'],
    ['&#12420;', '&#12422;', '&#12424;'],
    ['&#12425;', '&#12426;', '&#12427;', '&#12428;', '&#12429;'],
    ['&#12431;', '&#12432;', '&#12433;', '&#12434;'],
    ['&#12435;'],
    ['&#12364;', '&#12366;', '&#12368;', '&#12370;', '&#12372;'],
    ['&#12374;', '&#12376;', '&#12378;', '&#12380;', '&#12382;'],
    ['&#12384;', '&#12386;', '&#12389;', '&#12391;', '&#12393;'],
    ['&#12400;', '&#12403;', '&#12406;', '&#12409;', '&#12412;'],
    ['&#12401;', '&#12404;', '&#12407;', '&#12410;', '&#12413;'],
    ['&#12365;&#12419;', '&#12365;&#12421;', '&#12365;&#12423;'],
    ['&#12375;&#12419;', '&#12375;&#12421;', '&#12375;&#12423;'],
    ['&#12385;&#12419;', '&#12385;&#12421;', '&#12385;&#12423;'],
    ['&#12395;&#12419;', '&#12395;&#12421;', '&#12395;&#12423;'],
    ['&#12402;&#12419;', '&#12402;&#12421;', '&#12402;&#12423;'],
    ['&#12415;&#12419;', '&#12415;&#12421;', '&#12415;&#12423;'],
    ['&#12426;&#12419;', '&#12426;&#12421;', '&#12426;&#12423;'],
    ['&#12366;&#12419;', '&#12366;&#12421;', '&#12366;&#12423;'],
    ['&#12376;&#12419;', '&#12376;&#12421;', '&#12376;&#12423;'],
    ['&#12386;&#12419;', '&#12386;&#12421;', '&#12386;&#12423;'],
    ['&#12403;&#12419;', '&#12403;&#12421;', '&#12403;&#12423;'],
    ['&#12404;&#12419;', '&#12404;&#12421;', '&#12404;&#12423;'],
    ['&#12387;']
];
const hiraganaTranscriptions = [
    ['a', 'i', 'u', 'e', 'o'],
    ['ka', 'ki', 'ku', 'ke', 'ko'],
    ['sa', 'shi', 'su', 'se', 'so'],
    ['ta', 'chi', 'tsu', 'te', 'to'],
    ['na', 'ni', 'nu', 'ne', 'no'],
    ['ha', 'hi', 'fu', 'he', 'ho'],
    ['ma', 'mi', 'mu', 'me', 'mo'],
    ['ya', 'yu', 'yo'],
    ['ra', 'ri', 'ru', 're', 'ro'],
    ['wa', 'wi', 'we', 'wo'],
    ['n'],
    ['ga', 'gi', 'gu', 'ge', 'go'],
    ['za', 'ji', 'zu', 'ze', 'zo'],
    ['da', 'ji', 'zu', 'de', 'do'],
    ['ba', 'bi', 'bu', 'be', 'bo'],
    ['pa', 'pi', 'pu', 'pe', 'po'],
    ['kya', 'kyu', 'kyo'],
    ['sha', 'shu', 'sho'],
    ['cha', 'chu', 'cho'],
    ['nya', 'nyu', 'nyo'],
    ['hya', 'hyu', 'hyo'],
    ['mya', 'myu', 'myo'],
    ['rya', 'ryu', 'ryo'],
    ['gya', 'gyu', 'gyo'],
    ['ja', 'ju', 'jo'],
    ['ja', 'ju', 'jo'],
    ['bya', 'byu', 'byo'],
    ['pya', 'pyu', 'pyo'],
    ['pause']
];

let lowestTime = 0;
let currentLevel = 0;
let currentHighestHiraganaScore = 0;
let highestHiraganaScore = 0;
let highestLevel = 0;
let startTime;
let timmerInterval;
let selectedLevels = [];
let answer = 0;
let listOfOptions = [];
let validating = false;

initializeScore();

document.getElementById('start').addEventListener('click', startGame);
document.getElementById('restart').addEventListener('click', startGame);
document.getElementById('stop').addEventListener('click', stopGame);
document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('answer-btn')) {
        validateAnswer(e.target);
    }
});

function startGame() {
    currentHighestHiraganaScore = 0;
    document.getElementById('current-score').classList.remove('hidden');
    document.getElementById('current-score-number').innerText = 0;
    document.getElementById('start').classList.add('hidden');
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('restart').classList.remove('hidden');
    document.getElementById('stop').classList.remove('hidden');
    clearInterval(timmerInterval);
    startTime = new Date();
    updateTimer();
    timmerInterval = setInterval(updateTimer, 1000);
    document.getElementById('game-wrapper').classList.remove('hidden');
    selectedLevels = [...document.querySelectorAll('[name="hiragana-level"]:checked')].map((checkbox) => {
        return parseInt(checkbox.getAttribute('value'));
    });
    setNextQuestion();
    document.getElementById('new-record-message').classList.add('hidden');
    document.getElementById('new-record-message').classList.remove('text-blink');
}

function stopGame() {
    clearInterval(timmerInterval);
    document.getElementById('start').classList.remove('hidden');
    document.getElementById('setup').classList.remove('hidden');
    document.getElementById('restart').classList.add('hidden');
    document.getElementById('stop').classList.add('hidden');
}

function updateTimer() {
    const now = new Date();
    let elapsedTimeInSeconds = Math.floor((now - startTime) / 1000);
    document.getElementById('timmer').innerText = secondsToHumanReadable(elapsedTimeInSeconds);
}

function selectOptions() {
    let hiraganaSymbolOptions = [];
    let hiraganaTranscriptionOptions = [];
    selectedLevels.map((level) => {
        if (level > currentLevel) {
            currentLevel = level;
            console.log('ENTRO');
        }
        hiraganaSymbolOptions = [...hiraganaSymbolOptions, ...hiraganaSymbols[level]];
        hiraganaTranscriptionOptions = [...hiraganaTranscriptionOptions, ...hiraganaTranscriptions[level]];
    });
    /*
     * Since there are some transcriptions that are the same for different symbols, we create a Set to prevent the duplication
     * of answers (and avoid confusing the user) and make it easier to get the options (although less efficient)
     */
    let transcriptionOptions = new Set();
    let selectedOptions = [];
    while (selectedOptions.length < MAX_SELECTABLE_OPTIONS) {
        const randomChoice = getRandom(0, hiraganaSymbolOptions.length);
        const numOptions = transcriptionOptions.size;
        transcriptionOptions.add(hiraganaTranscriptionOptions[randomChoice]);
        if (numOptions < transcriptionOptions.size) {
            selectedOptions.push([hiraganaSymbolOptions[randomChoice], hiraganaTranscriptionOptions[randomChoice]]);
        }
    }
    return selectedOptions;
}

function setNextQuestion() {
    validating = false;
    listOfOptions = selectOptions();
    answer = getRandom(0, listOfOptions.length);
    document.getElementById('show-syllable').innerHTML = listOfOptions[answer][0];
    const optionsListNode = document.getElementById('solution-chooser');
    optionsListNode.innerHTML = '';
    listOfOptions.map((option, index) => {
        const liChild = document.createElement('li');
        liChild.setAttribute('data-index', index);
        liChild.classList.add('yellow-btn', 'answer-btn');
        liChild.innerHTML = option[1];
        optionsListNode.appendChild(liChild);
    });
}

function getRandom(min, max) { // min inclusive, max exclusive
    return Math.floor(Math.random() * (max - min) + min);
}

function validateAnswer(element) {
    if (!validating) {
        validating = true;
        if (element.getAttribute('data-index') == answer) {
            element.classList.add('green-btn');
            currentHighestHiraganaScore++;
            setTimeout(setNextQuestion, 200);
        } else {
            stopGame();
            const correctNode = element.parentNode.childNodes[answer];
            correctNode.classList.remove('yellow-btn');
            correctNode.classList.add('green-btn');
            element.classList.remove('yellow-btn');
            element.classList.add('red-btn');
            updateScore();
        }
    }
}

function updateScore() {
    const now = new Date();
    let elapsedTimeInSeconds = Math.floor((now - startTime) / 1000);
    document.getElementById('current-score-number').innerText = currentHighestHiraganaScore;
    if (currentHighestHiraganaScore > 0 && (currentHighestHiraganaScore > highestHiraganaScore || currentLevel > highestLevel || elapsedTimeInSeconds < lowestTime)) {
        lowestTime = elapsedTimeInSeconds;
        highestHiraganaScore = currentHighestHiraganaScore;
        highestLevel = currentLevel;
        db.updateAlphabetScore('hiragana', highestLevel, highestHiraganaScore, lowestTime);
        updateHighestScore(true);
    }
}

function updateHighestScore(showNewRecordMessage) {
    if (lowestTime !== Infinity) {
        document.getElementById('highest-level').innerText = highestLevel + 1;
        document.getElementById('highest-score').innerText = highestHiraganaScore;
        document.getElementById('lowest-time').innerText = secondsToHumanReadable(lowestTime);
        if (showNewRecordMessage) {
            document.getElementById('new-record-message').classList.remove('hidden');
            document.getElementById('new-record-message').classList.add('text-blink');
        }
    }
}

function initializeScore() {
    const hiraganaScore = db.getAlphabetScore('hiragana');
    highestLevel = hiraganaScore[db.LEVEL_INDEX];
    highestHiraganaScore = hiraganaScore[db.SCORE_INDEX];
    lowestTime = hiraganaScore[db.TIME_INDEX];
    updateHighestScore();
}

function secondsToHumanReadable(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds - hours * 3600) / 60);
    const remainingSeconds = Math.floor(seconds - hours * 3600 - minutes * 60);
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        remainingSeconds.toString().padStart(2, '0')
    ].join(':');
}