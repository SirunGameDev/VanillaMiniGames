var standardtext = "Wähle von Links nach Rechts die richtige Zahlen!"

function initGame( rowscounter = 3, columnscounter = 10) {
    // Game Settings
    //let rowscounter = 3
    //let columnscounter = 10

    // Create Game Container
    var game = document.createElement('div');
    game.classList.add("gamecontainer");
    document.body.appendChild(game);
    // Create Mode Container
    const modecontainter = document.createElement('div')
    modecontainter.classList.add("modecontainter")
    game.appendChild(modecontainter)

    // Mode 1
    const mode_1 = document.createElement('div')
    mode_1.classList.add("field_mode_1")
    mode_1.classList.add("mode_active")
    modecontainter.appendChild(mode_1)
    mode_1.innerHTML = "2^X"
    
    // choose Mode

    mode_1.onclick = chooseMode
    
    // add Message Frame
    const messageframe = document.createElement("div")
    messageframe.classList.add("messageframe")
    messageframe.innerHTML = standardtext
    modecontainter.appendChild(messageframe)

    // add Time
    const timeframe = document.createElement("div")

    timeframe.classList.add("field_time")
    timeframe.classList.add("timeframe")
    timeframe.innerHTML = 0;
    modecontainter.appendChild(timeframe)
    // Create Playfield
    const matrix = [];
    const matrixcontainer = document.createElement('div');
    matrixcontainer.classList.add("matrix");


    //Create Jumpfields
    for (let i = 0; i < rowscounter; i++) {
        matrix[i] = [];
        const rowcontainer = document.createElement('div');
        rowcontainer.classList.add("row_"+i)
        matrixcontainer.appendChild(rowcontainer);
        matrix[i] = rowcontainer;
        // Create startposition and horse
        const startfields = document.createElement('div');
        startfields.classList.add("field_"+"start"+"_"+i)
        startfields.classList.add("field_"+"start")
        if(i == Math.floor(rowscounter/2)) {
            //startfields.classList.add("horse")
         }
        rowcontainer.appendChild(startfields)
        for(let j = 0; j < columnscounter; j++){
            matrix[i][j] = document.createElement('div');
            matrix[i][j].classList.add("field_"+i+"_"+j)
            matrix[i][j].classList.add("element_"+i+""+j)
            matrix[i][j].classList.add("elements")
            matrix[i][j].classList.add("column_"+j)
            /*if(j == 0){
                matrix[i][j].classList.add("legitgoal")
            }*/
            matrix[i][j].onclick = onPlayfieldClick;
            matrix[i].appendChild(matrix[i][j]);
        }
    }
    game.appendChild(matrixcontainer);

}
function chooseMode () {
    if (document.getElementsByClassName("popup")[0]){
        setMessage("Popup already opend")
        delay(1000)
        setMessage("Wähle einen Modus")
        return;
    }
    let popup = document.createElement("div")
    popup.classList.add("popup")
    popup.classList.add("modes")
    let GameModes = GameModeMatrix()
    for (let Mode in GameModes)   {
        let modefield = document.createElement("div")
        modefield.classList.add("field_mode")
        modefield.innerHTML = Mode
        popup.appendChild(modefield)
        modefield.onclick = triggerChoose;
    }
    let modecontainter = document.getElementsByClassName("modecontainter")[0]
    modecontainter.appendChild(popup)
    setMessage("Wähle ein neuen Modus")
    clearInterval(timer)
}
function triggerChoose(){
    let popup = document.getElementsByClassName("popup")[0]
    let active = document.getElementsByClassName("mode_active")[0]
    active.innerHTML = this.innerHTML
    let modecontainter = document.getElementsByClassName("modecontainter")[0]
    modecontainter.removeChild(popup)
    // reset startgaming
    setMessage(standardtext)
    timer = setInterval(incrementSeconds, 1000);

    startGameMode()
}
function startGameMode() {

    var testfn = getGameMode();
    fillField(testfn);
    fillRights(testfn);
    setHorseandLegit();
}
function setHorseandLegit() {
    let timer = document.getElementsByClassName("timeframe")[0]
    timer.innerHTML = 0;
    let horse = document.getElementsByClassName("horse")[0]
    if(horse && !horse.classList.contains("field.start")){
        horse.classList.remove("horse")
    }
    let columns = Array.from(document.getElementsByClassName("column_0"))
    for (let column in columns) {
        columns[column].classList.add("legitgoal")
    }
    let startfield = document.getElementsByClassName("field_start")
    startfield[Math.floor(startfield.length/2)].classList.add("horse")
}
var timer = setInterval(incrementSeconds, 1000);
function getGameMode(){
    let mode = document.getElementsByClassName("mode_active");
    var fn =  GameModeMatrix()[mode[0].innerHTML]
    return fn;
}
function GameModeMatrix() {
    return {
        "2^X"   : expbasis(2),
        "2X"    : multiby(2),
        "3X"    : multiby(3),
        "4X"    : multiby(4),
        "5X"    : multiby(5),
        "6X"    : multiby(6),
        "7X"    : multiby(7),
        "8X"    : multiby(8),
        "9X"    : multiby(9),
        "fib"   : fib,
    }

}
function fib(n) {
    if(n == 0) {
        return 0;
    }
    else if(n == 1) {
        return 1;
    }
    else {
        return fib(n-1)+fib(n-2);
    }

}
function expbasis  (base) {
    return function (n) {
        return base**n;
    }

}
function multiby (base = 1) {
    return function (step) {
        return base*step;
    }
}
function fillField(fn) {
    let fieldelements = document.getElementsByClassName("elements")
    elements = Array.from(fieldelements);
    elements.forEach(element => {
        element.innerHTML = Math.floor(Math.random() * fn(10))
    });
}
function fillRights(fn) {
    for (i = 0; i < 10; i++) {
        let right = Math.floor(Math.random() * 3)
        let elements = document.getElementsByClassName("column_"+i)
        elements[right].innerHTML = fn(i);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    initGame();
    startGameMode()
});

async function onPlayfieldClick(){
    if(document.getElementsByClassName("popup")[0]){
        return;
    }
    if(!checkiflegit(this)) {
        setMessage("Springe nicht zu weit!")
        await delay(1000);
        setMessage()

        return;
    }
    if(checkifright(this)){
        let horse = document.getElementsByClassName("horse")[0];
        horse.classList.replace("horse", "empty")
        
        let legitgoals = document.getElementsByClassName("legitgoal")
        let array = Array.from(legitgoals);
        array.forEach(lg => {
            lg.classList.remove("legitgoal")
        })
        let column = getColumn(array[0]);

        column++;
        let newgoals = Array.from(document.getElementsByClassName("column_"+column))
        if(newgoals.length == 0) {
            setMessage("Gewonnen!")
            clearInterval(timer)
        }
        newgoals.forEach(ng => {
            ng.classList.add("legitgoal")
        })
        this.classList.add("horse")

    }
}
function getColumn(element) {
    let lgclasslist = element.classList
    let column = 0;
    lgclasslist.forEach(lgclass => {
            
        if(lgclass.includes("column")){
            column = parseInt(lgclass.split("_").slice(-1)[0])

        }
    })
    return column;
}
function setMessage(text = standardtext) {
    let messanger = document.getElementsByClassName("messageframe")[0]
    messanger.innerHTML = text;
}
function checkifright(element) {
    let column = getColumn(element)
    let number = element.innerHTML;
    let fn = getGameMode();
    let result = fn(column)
    return number == result
}
function checkifrightcolumn(element) {
    let horse = document.getElementsByClassName("horse")[0];
    // no wildcard with contain, so to much hassle

    if (horse.classList.contains("field_start_1") && element.classList.contains("column_0")) {
        return false;
    }
    if (false) {

    }
    return true;
}
function checkiflegit (element) {
    return element.classList.contains("legitgoal");
}


function incrementSeconds () {
    let element = document.getElementsByClassName("timeframe")[0]
    element.innerHTML = parseInt(element.innerHTML) + 1
}


const delay = ms => new Promise(res => setTimeout(res, ms));