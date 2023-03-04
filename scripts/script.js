const words = [   "APPLE",    "BREAD",    "CRAFT",    "DAIRY",    "EAGLE",    "FLAME",    "GHOST",    "HUMOR",    "IGLOO",    "JAZZY",    "KNOCK",    "LIMBO",    "MANGO",    "NINJA",    "OLIVE",    "PANDA",    "QUEEN",    "ROBOT",    "SALAD",    "THORN",    "VENUS",    "WATER",    "YACHT",    "ZEBRA",    "AGATE",    "BLAZE",    "CORAL",    "DREAM",    "FLAIR",    "GROVE",    "ICING",    "JUICE",    "NOMAD",    "OASIS",    "PATIO",    "QUILT",    "SABLE",    "TULIP",    "UNION",    "VALVE",    "WHALE",    "YEAST",    "AMBER",    "CARVE",    "DESKS",    "EXCEL",    "FLUTE",    "GREET",    "HOVER",    "IDOLS",    "JOKER",    "LATCH",    "MAGIC",    "NUTTY",    "ORBIT",    "PUNCH",    "REACH",    "SKILL",    "TIGER",    "UNZIP",    "VOGUE",    "WIPER",    "ZESTY",    "BRAVE",    "DODGE",    "EAGER",    "FAITH",    "GAMER",    "HUMID",    "IVORY",    "JELLY",    "KNEEL",    "LEMON",    "MUSIC",    "NEXUS",    "ORBIT",    "PEACH",    "QUAIL",    "SMILE",    "TWEAK",    "UPSET",    "VAPOR",    "WINGS",    "YOUTH"];
let word

const rows = 6
const length = 5

let currentRow = 1
let currentLetter = 1
let wrongLetters = []

let hasWon = false


window.addEventListener('load', (event) => {
    getWord()
    getSetup()
    getKeyboard()
    document.getElementById("row" + currentRow).classList.add('current-row');

});



document.getElementById("keyboard").onclick = (element) => {
    let id = element.target.id
    if (id.includes("delete")) {
        deleteLetter()
    }
    else if(id.includes("submit")){
        checkAnswer()
    }
    else if(isLetter(id)){
        setLetter(id)
    }

}

function isLetter(id) {
    return id.length === 1 && id.match(/[A-Z]/i);
}







function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function deleteLetter(){
    if(currentLetter !== 1){
        const currentPosition = getPosition(1)
        document.getElementById(currentPosition).innerText = ""
        currentLetter--
        document.getElementById("won-or-not").innerText = ""
    }

}

async function checkAnswer(){
    if(currentLetter === 6){

        let result = ""
        for (let i = 0; i < length; i++) {
            let currentID = "row" + currentRow + "-letter" + (i + 1)
            result += document.getElementById(currentID).innerText
        }
        const resultFromAPI = await getResult(result)
        console.log(resultFromAPI)
        try{
            if(resultFromAPI.title === "No Definitions Found"){
                notAWord()
            }else{
                checkResult(result)
                changeRow()
            }

        }
        catch (e){
        }

        console.log(result)



    }
}

function setLetter(id){
    const currentPosition = getPosition(0)
    if(currentLetter < 6){
        document.getElementById(currentPosition).innerText = id
        currentLetter++
    }
}

function getPosition(change){
    return "row" + currentRow  + "-letter" + (currentLetter - change)
}

function notAWord(){
    document.getElementById("won-or-not").innerText = "Enter a real word"
}

async function getResult(result){

    try{
        return await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + result)
            .then((res) => res.json())

    }catch (e){
        console.log(e.error)
    }
}

function checkResult(result){



    for (let i = 0; i < length; i++) {
        const temp = ("row" + currentRow + "-letter" + (i + 1))
        if(word.charAt(i) === result.charAt(i)){


            document.getElementById(temp).style.backgroundColor = "#6aaa64";
        }else if(word.includes(result.charAt(i))){
            document.getElementById(temp).style.backgroundColor = "#f1d148";
        }
        else {
            document.getElementById(result.charAt(i)).style.backgroundColor = "grey";
            wrongLetters.push(result.charAt(i).toUpperCase())
        }
    }



    if(result === word){
        hasWon = true
        checkHasWon()
    }
}

function changeRow(){
    document.getElementById("row" + currentRow).classList.remove('current-row')
    currentRow++
    currentLetter = 1

    if(currentRow === 7 && !hasWon){
        checkHasLost()
    }
    else {
        document.getElementById("row" + currentRow).classList.add('current-row');
    }


}

function onHover(object){

    object.style.background= '#3792cb'
}

function onRemoveHover(object){
    if (wrongLetters.includes(object.id) ){
        object.style.background= 'grey'
    }else{
        object.style.background= '#DDD0C8'
    }
}

function checkHasWon(){
    document.getElementById("won-or-not").innerText = "YOU WON"
    document.getElementById("button").style.visibility = "visible"
}
function checkHasLost(){
    document.getElementById("won-or-not").innerText = "YOU LOST! THE WORD WAS: " + word
    document.getElementById("button").style.visibility = "visible"
}

function refreshPage(){
    window.location.reload();
}



//==== Setup =====


async function getWord(){
    //word = await fetch("https://random-word-api.herokuapp.com/word?length=5").then((res) => res.json())
    //word = word.toString().toUpperCase()
    //Det her API giver nogle mærkelige ord som det andet word checker API siger ikke er rigtige ord.


    const randomNUmber = Math.floor(Math.random() * (words.length));
    word = words[randomNUmber]
    document.getElementById("header").innerText = "Welcome to wordle by Johannes Forsting! GOOD LUCK!"
}

function getSetup(){
    document.getElementById("word").innerHTML = ""
    let setup = ""

    for (let i = 0; i < rows; i++) {

        setup += `<section  id="row${i + 1}" class='word'>`

        for (let j = 0; j < length; j++) {
            let id = "row" + (i + 1) + "-letter" + (j + 1)
            setup += `<div id="${id}" class="letter"></div>`

        }
        setup += `</section>`
    }
    document.getElementById("word").innerHTML = setup
}



function getKeyboard(){

    const firstRow = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]
    const secondRow = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]
    const thirdRow = ["Z", "X", "C", "V", "B", "N", "M"]


    let setup = ""
    setup += `<div class="keyboard-row">`
    for (let i = 0; i < firstRow.length; i++) {
        const letter = firstRow[i]
        setup += `<div id=${letter} class="keyboard-letter" onmouseover=onHover(this) onmouseout=onRemoveHover(this)>${letter}</div>`
    }
    setup += `</div>`

    setup += `<div class="keyboard-row">`
    for (let i = 0; i < secondRow.length; i++) {
        const letter = secondRow[i]
        setup += `<div id=${letter} class="keyboard-letter" onmouseover=onHover(this) onmouseout=onRemoveHover(this)>${letter}</div>`
    }
    setup += `</div>`

    setup += `<div class="keyboard-row">`
    setup += `<div id="delete" class="keyboard-letter delete">⌫</div>`
    for (let i = 0; i < thirdRow.length; i++) {
        const letter = thirdRow[i]
        setup += `<div id=${letter} class="keyboard-letter" onmouseover=onHover(this) onmouseout=onRemoveHover(this)>${letter}</div>`
    }
    setup += `<div id="submit" class="keyboard-letter enter">Enter</div>`
    setup += `</div>`
    document.getElementById("keyboard").innerHTML = setup

}
