function showNumber(i, j, num) {
    let numberCell = $('#number-cell-' + i + '-' + j);
    numberCell.css('background-color', getBgColor(num));
    numberCell.css('color', getColor(num));
    numberCell.text(num);

    //生成动画
    numberCell.animate({
        width: "100px",
        height: "100px",
        top: getY(i),
        left: getX(j)
    }, 50);
}

function move(fromX, fromY, toX, toY) {
    let numberCell = $('#number-cell-' + fromX + '-' + fromY);
    numberCell.animate({
        top: getY(toX),
        left: getX(toY)
    }, 200);
}

function updateScore(score) {
    $('#score').text(score);
}

function updatePlayer(name) {
    $('#player').text(name);
}