//获取纵坐标
function getY(i) {
    return 20 + i * 120;
}

//获取横坐标
function getX(j) {
    return 20 + j * 120;
}

//获取数字格子的颜色
function getBgColor(number) {
    switch (number) {
        case 2:
            return '#9400d3';
        case 4:
            return '#800080';
        case 8:
            return '#000080';
        case 16:
            return '#0000ff';
        case 32:
            return '#1e90ff';
        case 64:
            return '#6495ed';
        case 128:
            return '#00bfff';
        case 256:
            return '#00ffff';
        case 512:
            return '#00ff00';
        case 1024:
            return '#ffff00';
        case 2048:
            return '#ffd700';
    }

    return 'black';
}

function getColor(number) {
    if (number >= 128) {
        return 'black';
    }
    return 'yellow';
}

//判断是否可以向左、右、上、下移动
function canMoveLeft(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveRight(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveUp(board) {
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (board[i][j] != 0) {
                if (board[i - 1][j] == 0 || board[i - 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMoveDown(board) {
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            if (board[i][j] != 0) {
                if (board[i + 1][j] == 0 || board[i + 1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

//判断水平、垂直方向上有没有数字格子
function noBlockX(x, y1, y2, board) {
    for (let i = y1 + 1; i < y2; i++) {
        if (board[x][i] != 0) {
            return false;
        }
    }
    return true;
}

function noBlockY(y, x1, x2, board) {
    for (let i = x1 + 1; i < x2; i++) {
        if (board[i][y] != 0) {
            return false;
        }
    }
    return true;
}

//判断整个棋盘还有没有空格子
function noSpace(board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] == 0) {
                return false;
            }
        }
    }
    return true;
}

//判断整个棋盘还能不能移动
function noMove(board) {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp(board) || canMoveDown(board)) {
        return false;
    }
    return true;
}