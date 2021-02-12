let board = [];
let combined = [];
let name;
let score = 0;
let isOver = true;

/*开始新游戏*/
function newGame() {
    if (!isOver) {
        lose();
    }	//考虑玩家中途放弃的情况
    isOver = false;
    init();
    createNumber();
    createNumber();	//在随机两个格子生成数字
}

/*初始化*/
function init() {
    //输入玩家姓名
    name = prompt("Welcome to 2048!\nBefore starting a new game, please input your name:");
    updatePlayer(name);

    //画出并初始化棋盘
    for (let i = 0; i < 4; i++) {
        board[i] = [];
        combined[i] = [];
        for (let j = 0; j < 4; j++) {
            board[i][j] = 0;
            combined[i][j] = false;
            let gridCell = $('#grid-cell-' + i + '-' + j);
            gridCell.css('top', getY(i));
            gridCell.css('left', getX(j));
        }
    }

    //初始化分数
    score = 0;
    updateScore(score);
    updateBoard();
}

/*生成数字*/
function createNumber() {
    //判断是否有空格子
    if (noSpace(board)) {
        return false;
    }

    //随机一个位置
    let ranX = parseInt(Math.floor(Math.random() * 4));
    let ranY = parseInt(Math.floor(Math.random() * 4));
    let times = 0;
    while (times < 30) {
        if (board[ranX][ranY] == 0) {
            break;
        }
        ranX = parseInt(Math.floor(Math.random() * 4));
        ranY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }

    //性能优化
    if (times == 30) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    ranX = i;
                    ranY = j;
                }
            }
        }
    }

    //随机一个数字
    let num = Math.random() < 0.5 ? 2 : 4;

    //在随机位置显示随机数字
    board[ranX][ranY] = num;
    showNumber(ranX, ranY, num);

    return true;
}

/*测试专用:生成1024*/
function create1024() {
    //判断是否有空格子
    if (noSpace(board)) {
        return false;
    }

    //随机一个位置
    let ranX = parseInt(Math.floor(Math.random() * 4));
    let ranY = parseInt(Math.floor(Math.random() * 4));
    let times = 0;
    while (times < 30) {
        if (board[ranX][ranY] == 0) {
            break;
        }
        ranX = parseInt(Math.floor(Math.random() * 4));
        ranY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }

    //性能优化
    if (times == 30) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    ranX = i;
                    ranY = j;
                }
            }
        }
    }

    //在随机位置显示1024
    board[ranX][ranY] = 1024;
    showNumber(ranX, ranY, 1024);

    return true;
}

/*按键操作*/
$(document).keydown(function (e) {
    switch (e.keyCode) {
        case 37: //左
            if (moveLeft()) {
                setTimeout('createNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            return false;
        case 38: //上
            if (moveUp()) {
                setTimeout('createNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            return false;
        case 39: //右
            if (moveRight()) {
                setTimeout('createNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            return false;
        case 40: //下
            if (moveDown()) {
                setTimeout('createNumber()', 210);
                setTimeout('isGameOver()', 300);
            }
            return false;
        default:
            break;
    }
});

/*判断游戏是否结束*/
function isGameOver() {
    if (noSpace(board) && noMove(board)) {
        lose();
    }
}

/*失败*/
function lose() {
    alert("Game Over!\nYour score is " + score + "!");
    updateHistory(false);
    window.location.reload();
}

/*获胜*/
function win() {
    alert("Congratulations!\nYour score is " + score + "!");
    updateHistory(true);
    window.location.reload();
}

/*向左移动*/
function moveLeft() {
    //判断是否可以向左移动
    if (!canMoveLeft(board)) {
        return false;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            //如果不为0，那么他是可能向左移动的
            if (board[i][j] != 0) {
                for (let k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockX(i, k, j, board)) {
                        //移动
                        move(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    } else if (board[i][k] == board[i][j] && noBlockX(i, k, j, board) && !combined[i][k]) {
                        //移动
                        move(i, j, i, k);
                        //合并
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //加分
                        score += board[i][k];
                        updateScore(score);
                        //防止二次合并
                        combined[i][k] = true;
                    }
                }
            }
        }
    }

    //根据数组更新位置
    setTimeout("updateBoard()", 200);
    return true;
}

/*向右移动*/
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }

    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                for (let k = 3; k > j; k--) {
                    if (board[i][k] == 0 && noBlockX(i, j, k, board)) {
                        move(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                    } else if (board[i][k] == board[i][j] && noBlockX(i, j, k, board) && !combined[i][k]) {
                        move(i, j, i, k);
                        board[i][k] *= 2;
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        combined[i][k] = true;
                    }
                }
            }
        }
    }

    setTimeout("updateBoard()", 200);
    return true;
}

/*向上移动*/
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }

    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                for (let k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockY(j, k, i, board)) {
                        move(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    } else if (board[k][j] == board[i][j] && noBlockY(j, k, i, board) && !combined[k][j]) {
                        move(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        combined[k][j] = true;
                    }
                }
            }
        }
    }

    setTimeout("updateBoard()", 200);
    return true;
}

/*向下移动*/
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }

    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                for (let k = 3; k > i; k--) {
                    if (board[k][j] == 0 && noBlockY(j, i, k, board)) {
                        move(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                    } else if (board[k][j] == board[i][j] && noBlockY(j, i, k, board) && !combined[k][j]) {
                        move(i, j, k, j);
                        board[k][j] *= 2;
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        combined[k][j] = true;
                    }
                }
            }
        }
    }

    setTimeout("updateBoard()", 200);
    return true;
}

/*更新棋盘*/
function updateBoard() {
    $('.number-cell').remove();
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            $('#grid-container').append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>')
            let theNumberCell = $('#number-cell-' + i + '-' + j);
            if (board[i][j] == 0) {
                //无数值则不显示
                theNumberCell.css({
                    'width': '0px',
                    'height': '0px',
                    'top': getY(i) + 50,
                    'left': getX(j) + 50
                });
            } else {
                //有数值则显示
                theNumberCell.css({
                    'width': '100px',
                    'height': '100px',
                    'top': getY(i),
                    'left': getX(j),
                    'background-color': getBgColor(board[i][j]),
                    'color': getColor(board[i][j])
                });
                theNumberCell.text(board[i][j]);
                if (theNumberCell.text() == 1024 || theNumberCell.text() == 2048) {
                    theNumberCell.css('font-size', '45px');
                }
            }
            combined[i][j] = false;
            if (board[i][j] == 2048) {
                win();
            }
        }
    }
}


/*更新历史数据*/
function updateHistory(win) {
    isOver = true;
    let historyInfo = JSON.parse(localStorage.getItem("infoStorage"));//用户历史信息
    let playerInfo = {
        name: name,
        time: currentDate(),
        score: score,
        win: win
    };
    if (historyInfo == null) {
        historyInfo = [];
    }
    historyInfo.push(playerInfo);//将用户的信息对象放入数组中
    localStorage.setItem("infoStorage", JSON.stringify(historyInfo));//存入本地
}

/*显示排行榜*/
function displayRanking() {
    let historyInfo = JSON.parse(localStorage.getItem("infoStorage"));//用户历史信息
    let ranking = historyInfo;
    //对数组按照分数排序
    let k, m, tmp;
    for (k = 1; k < ranking.length; k++) {
        tmp = ranking[k];
        m = k - 1;
        while (m >= 0 && tmp.score < ranking[m].score) {
            ranking[m + 1] = ranking[m];
            m--;
        }
        ranking[m + 1] = tmp;
    }
    //在表格中显示
    for (let f = ranking.length - 1; f >= 0; f--) {
        let res = (ranking[f].win) ? "Win" : "Lose";
        document.getElementById('list').rows[ranking.length - f].cells[1].innerText = ranking[f].name;
        document.getElementById('list').rows[ranking.length - f].cells[2].innerText = ranking[f].score;
        document.getElementById('list').rows[ranking.length - f].cells[3].innerText = res;
        document.getElementById('list').rows[ranking.length - f].cells[4].innerText = ranking[f].time;
    }
}

/*显示历史记录*/
function displayHistory() {
    let historyInfo = JSON.parse(localStorage.getItem("infoStorage"));//用户历史信息
    let ranking = historyInfo;
    //在表格中显示
    for (let f = ranking.length - 1; f >= 0; f--) {
        let res = (ranking[f].win) ? "Win" : "Lose";
        document.getElementById('list').rows[ranking.length - f].cells[0].innerText = ranking[f].name;
        document.getElementById('list').rows[ranking.length - f].cells[1].innerText = ranking[f].score;
        document.getElementById('list').rows[ranking.length - f].cells[2].innerText = res;
        document.getElementById('list').rows[ranking.length - f].cells[3].innerText = ranking[f].time;
    }
}

/*清除历史数据*/
function clearHistory() {
    localStorage.clear();
    alert("List cleared.");
    location.reload();
}

/*获取当前日期时间*/
function currentDate() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth();
    let date = now.getDate();
    let hour = now.getHours();
    let min = now.getMinutes();
    let sec = now.getSeconds();
    month = month + 1;
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;
    let time = "";
    time = year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
    return time;
}