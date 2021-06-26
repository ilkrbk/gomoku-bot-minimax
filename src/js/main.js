let list = document.querySelector('.game__list');
let items = document.querySelectorAll('.game__item');
let levelWrap = document.querySelector('.header__menu');
let textField = document.querySelector('.header__field-for-text-win');
let matrixField = PushMatrix(15, 15);
//let TerminalArray = [];
let counterItem = 1;
let level = 2;
let tableCodes = [
    {code: "_XXXXX", price: 9999},
    {code: "XXXXX_", price: 9999},
    {code: "_XXXXX_", price: 9999},
    {code: "XXXXX", price: 9999},
    {code: "_XXXX_", price: 7000},
    {code: "_XXXX", price: 4000},
    {code: "XXXX_", price: 4000},
    {code: "_X_XXX_", price: 2500},
    {code: "_XX_XX_", price: 2500},
    {code: "_XXX_X_", price: 2500},
    {code: "_XXX_X_", price: 2500},
    {code: "_XX_XX_", price: 2500},
    {code: "_X_XXX", price: 2000},
    {code: "_XX_XX", price: 2000},
    {code: "_XXX_X", price: 2000},
    {code: "XXX_X_", price: 2000},
    {code: "XX_XX_", price: 2000},
    {code: "_XXX_", price: 2000},
    {code: "_XXX", price: 1500},
    {code: "XXX_", price: 1500},
    {code: "_X_XX_", price: 1000},
    {code: "_XX_X_", price: 1000},
    {code: "_XX_X_", price: 1000},
    {code: "_X_XX_", price: 1000},
    {code: "_X_XX", price: 800},
    {code: "_XX_X", price: 800},
    {code: "XX_X_", price: 800},
    {code: "X_XX_", price: 800},
    {code: "_XX_", price: 500},
    {code: "_XX", price: 200},
    {code: "XX_", price: 200}
]

let HandlerList = (e) => Game(e);
list.addEventListener('click', HandlerList);
levelWrap.addEventListener('click', (e) => {
    matrixField = PushMatrix(15, 15);
    counterItem = 1;
    textField.innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        items[i].textContent = "";
        while (items[i].firstChild) {
            items[i].removeChild(items[i].firstChild);
        }
    }
    if (e.target.textContent == "легкий") {
        level = 1
    } else if (e.target.textContent == "средний") {
        level = 2
    }
    list.addEventListener('click', HandlerList);
});

function Game(e){
    if (e.target.textContent === '' && e.target.tagName == 'LI') {
        let indexItem = FindIndex(e, items);
        let y = Math.floor(indexItem/15);
        let x = indexItem%15;
        CreateMaxPlayer(e, y, x);
        let obj = { matrix: matrixField, array: [], bestPrice: 0, y: y, x: x, oldy: -1, oldx: -1, startY: -1, startX: -1, minimax: "min"};
        TerminalArray = [];
        obj.bestPrice = SearchFiveInLine(obj, obj.y, obj.x, 1);
        if (obj.bestPrice == 9999) {
            ShowWin(1);
            return;
        }
        BotGame(obj);
    }
}

function BotGame(obj){
    BotStep(obj, 0, 2);
    for (let i = 0; i < obj.array.length; i++) {
        DFS(obj.array[i]);
    }
    Step(obj)
    //console.log(obj);
}

function ShowWin(checkVar){
    let text;
    if (checkVar == 1) text = "Вы победили!!!";
    else text = "Бот победил!!!";
    textField.innerHTML = text;
    list.removeEventListener('click', HandlerList);
}

function ParseTerminalArr(array, bestPrice, y, x){
    let max = 0;
    let arr = [];
    for (let i = 0; i < array.length; i++) {
        if (array[i].bestPrice > max) {
            max = array[i].bestPrice;
            arr = [];
            arr.push(array[i])
        } else if ((array[i].bestPrice == max)) {
            arr.push(array[i])
        }
    }
    let arr2 = [];
    if (bestPrice > 800) {
        for (let i = 0; i < arr.length; i++) {
            let localPrice = SearchFiveInLine(arr[i], y, x, 1)
            if (bestPrice > localPrice) {
                bestPrice = localPrice;
                arr2 = [];
                arr2.push(arr[i])
            } else if ((bestPrice == localPrice)) {
                arr2.push(arr[i])
            }
        }
        return arr2;
    }
    return arr;
}

function Step(obj){
    let result = ParseTerminalArr(obj.array, obj.bestPrice, obj.y, obj.x);
    let z = getRandomInt(0, result.length);
    result[z]
    items[(result[z].startY * 15) + result[z].startX].textContent = counterItem;
    counterItem++;
    let span = document.createElement('span');
    span.classList.add('max__player')
    items[(result[z].startY * 15) + result[z].startX].appendChild(span);
    obj.matrix[result[z].startY][result[z].startX] = -1;
    if (result[z].bestPrice == 9999) {
        ShowWin(-1);
        return;
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function DFS(obj){
    if (obj.minimax == undefined) return;
    for (let i = 0; i < obj.array.length; i++) {
        if (obj.array[i].array.length == 0) {
            if (obj.array[i].minimax == "min") {
                obj.array[i].bestPrice = SearchFiveInLine(obj.array[i], obj.array[i].oldy, obj.array[i].oldx, -1);
            } else {
                obj.array[i].bestPrice = SearchFiveInLine(obj.array[i], obj.array[i].y, obj.array[i].x, -1);
            }
        }
        DFS(obj.array[i]);
        if (obj.minimax == "max" && obj.bestPrice < obj.array[i].bestPrice) {
            obj.bestPrice = obj.array[i].bestPrice;
        } else if (obj.minimax == "min" && obj.bestPrice > obj.array[i].bestPrice) {
            obj.bestPrice = obj.array[i].bestPrice;
        }
    }
}

function BotStep(obj, exit, player){
    for (let i = 0; i < 15; ++i)
        for (let j = 0; j < 15; ++j)
            if (obj.matrix[i][j] == 0)
                if ((i == 0 && j == 0 && (obj.matrix[i + 1][j] != 0 || obj.matrix[i][j + 1] != 0 || obj.matrix[i + 1][j + 1] != 0)) || 
                (i == 14 && j == 14 && (obj.matrix[i][j - 1] != 0 || obj.matrix[i - 1][j] != 0 || obj.matrix[i - 1][j - 1] != 0)) || 
                (i == 0 && j == 14 && (obj.matrix[i][j - 1] != 0 || obj.matrix[i + 1][j] != 0 || obj.matrix[i + 1][j - 1] != 0)) || 
                (i == 14 && j == 0 && (obj.matrix[i][j + 1] != 0 || obj.matrix[i - 1][j] != 0 || obj.matrix[i - 1][j + 1] != 0)) || 
                (i == 14 && j - 1 >= 0 && j + 1 < 15 && (obj.matrix[i][j + 1] != 0 || obj.matrix[i][j - 1] != 0 || obj.matrix[i - 1][j] != 0 || obj.matrix[i - 1][j - 1] != 0 || obj.matrix[i - 1][j + 1] != 0)) || 
                (j == 14 && i - 1 >= 0 && i + 1 < 15 && (obj.matrix[i + 1][j] != 0 || obj.matrix[i][j - 1] != 0 || obj.matrix[i - 1][j] != 0 || obj.matrix[i - 1][j - 1] != 0 || obj.matrix[i + 1][j - 1] != 0)) || 
                (i == 0 && j - 1 >= 0 && j + 1 < 15 && (obj.matrix[i + 1][j] != 0 || obj.matrix[i][j + 1] != 0 || obj.matrix[i][j - 1] != 0 || obj.matrix[i + 1][j + 1] != 0 || obj.matrix[i + 1][j - 1] != 0)) ||
                (j == 0 && i - 1 >= 0 && i + 1 < 15 && (obj.matrix[i + 1][j] != 0 || obj.matrix[i][j + 1] != 0 || obj.matrix[i - 1][j] != 0 || obj.matrix[i + 1][j + 1] != 0 || obj.matrix[i - 1][j + 1] != 0)) || 
                ((i - 1 >= 0 && i + 1 < 15 && j - 1 >= 0 && j + 1 < 15) && (obj.matrix[i + 1][j] != 0 || obj.matrix[i][j + 1] != 0 || obj.matrix[i][j - 1] != 0 || obj.matrix[i - 1][j] != 0 || obj.matrix[i + 1][j + 1] != 0 || obj.matrix[i - 1][j - 1] != 0 || obj.matrix[i - 1][j + 1] != 0 || obj.matrix[i + 1][j - 1] != 0))) {
                    let matrixClone = CloneMatrix(obj.matrix);
                    let objResult = {matrix: matrixClone, array: [], bestPrice: 0, y: i, x: j, oldy: obj.y, oldx: obj.x, startY: obj.startY, startX: obj.startX, minimax: "max",};

                    if (objResult.startX == -1 && objResult.startY == -1) {
                        objResult.startX = j;
                        objResult.startY = i;
                    }
                    if (player % 2 == 0) {
                        objResult.matrix[i][j] = -1;
                        objResult.minimax = "max";
                        objResult.bestPrice = -Infinity;
                    } else {
                        objResult.matrix[i][j] = 1;
                        objResult.minimax = "min"
                        objResult.bestPrice = Infinity;
                    }
                    obj.array.push(objResult);
                } 
    if (exit < level) {
        exit++;
        player++;
        for(let i = 0; i < obj.array.length; ++i){
            BotStep(obj.array[i], exit, player);
        }
    }
}

function CloneMatrix(matrix){
    let matrixResult = [];
    for (let i = 0; i < matrix.length; ++i)
        matrixResult.push(matrix[i].slice());
    return matrixResult;
}

function FindIndex(e, items){
    for(let i = 0; i < 225; ++i)
        if(items[i] === e.target) return i;
    return -1;
}

function CreateMaxPlayer(e, y, x){
    e.target.textContent = counterItem;
    counterItem++;
    let span = document.createElement('span');
    span.classList.add('min__player')
    e.target.appendChild(span);
    matrixField[y][x] = 1;
}

function SearchFiveInLine(obj, y, x, plus){
    let codes = { resultStrG: "", resultStrV: "", resultStrLR: "", resultStrRL: ""};
    for (let i = -4; i < 5; ++i)
        for (let j = -4; j < 5; ++j)
            if (y + j >= 0 && y + j < 15 && x + i >= 0 && x + i < 15){
                let xi = x + i;
                let yj = y + j;
                if (xi == x && yj == y) {
                    codes.resultStrG += "0";
                    codes.resultStrV += "0";
                    codes.resultStrLR += "0";
                    codes.resultStrRL += "0";
                } else {
                    if (i == j)
                        if (obj.matrix[yj][xi] == 0) codes.resultStrLR += "_";
                        else if (obj.matrix[yj][xi] == plus) codes.resultStrLR += "X";
                        else codes.resultStrLR += "|";
                    if (i == 0)
                        if (obj.matrix[yj][xi] == 0) codes.resultStrV += "_";
                        else if (obj.matrix[yj][xi] == plus) codes.resultStrV += "X";
                        else codes.resultStrV += "|";
                    if (j == 0)
                        if (obj.matrix[yj][xi] == 0) codes.resultStrG += "_";
                        else if (obj.matrix[yj][xi] == plus) codes.resultStrG += "X";
                        else codes.resultStr += "|";
                    if (xi + yj == x + y)
                        if (obj.matrix[yj][xi] == 0) codes.resultStrRL += "_";
                        else if (obj.matrix[yj][xi] == plus) codes.resultStrRL += "X";
                        else codes.resultStrRL += "|";
                }
            }
    //obj.bestPrice = ConvertToCode(codes.resultStrG, codes.resultStrV, codes.resultStrLR, codes.resultStrRL);
    return ConvertToCode(codes.resultStrG, codes.resultStrV, codes.resultStrLR, codes.resultStrRL);
}

function PushMatrix(n, m){
    let matrix = [];
    for (let i = 0; i < n; ++i) {
        matrix.push([]);
        for (let k = 0; k < m; ++k) {
            matrix[i].push(0);
        }
    }
    return matrix;
}

function ConvertToCode(a, b, c, d){
    let array = [a, b, c, d];
    for (let i = 0; i < array.length; i++) {
        let center = FindCenterPrice(array[i]);
        array[i] = array[i].replace('0', 'X');
        array[i] = DelAllSymvolsAfterSleshRelativelyCenter(array[i], center);
        array[i] = DelAllSymvolsBeforeSleshRelativelyCenter(array[i], center);
        array[i] = DelSuperfluousSpases(array[i]);
    }
    return ChoiseMaxPrice(array);
}

function FindCenterPrice(array){
    for (let k = 0; k < array.length; k++)
        if (array[k] == "0") return k;
}

function DelAllSymvolsAfterSleshRelativelyCenter(code, center){
    for (let j = center + 1; j < code.length; ++j)
        if (code[j] == "|") code = code.substr(0, j);
    return code;
}

function DelAllSymvolsBeforeSleshRelativelyCenter(code, center){
    for (let j = center - 1; j >= 0; --j)
        if (code[j] == "|") code = code.substr(j + 1);
    return code;
}

function DelSuperfluousSpases(code){
    while(code[0] == "_" && code[1] == "_")
        code = code.substr(1);
    while(code[code.length - 1] == "_" && code[code.length - 2] == "_")
        code = code.substr(0, code.length - 1);
    return code;
}

function ChoiseMaxPrice(array){
    let max = 0;
    for (let i = 0; i < array.length; i++){
        let priceCode = CheckCodes(array[i], max);
        if (max < priceCode) max = priceCode;
    }
    return max;
}

function CheckCodes(code, max){
    for (let j = 0; j < tableCodes.length; j++)
        if (code === tableCodes[j].code && max < tableCodes[j].price)
            return tableCodes[j].price;
    return 0;
}