class Sapper {
    newGameButton;
    menuButton;
    font = {
        small: '15px Verdana',
        header: '18px Verdana',
        medium: '25px Verdana',
        large: '80px Verdana',
    };
    color = {
        lightgreen: '#05d00f',
        green: '#08912d',
        orange: '#ee8149',
        blue: '#3c6b6d',
        white: '#ffffff',
        winShadow: '#0ae80d',
        loseShadow: '#F00',
    };

    constructor(rows, bombs) {
        this.rows = rows;
        this.bombs = bombs;
        this.sizeElem = 30;
        this.size = this.sizeElem * this.rows;
        this.canvas = document.getElementById('draw');
        this.context = this.canvas.getContext('2d');
        this.isGame = true;
        this.field = [];
        this.flags = [];
        this.openElems = [];
        this.seconds = 0;
        this.interval = false;

        this.newGameButton = this.setButton(this.newGameButton, 66);
        this.menuButton = this.setButton(this.menuButton, 20);

        this.image = new Image();
        this.image.src = './assets/s-point.png';

        this.bomb1 = new Image();
        this.bomb1.src = './assets/bomb1.png';

        this.bomb0 = new Image();
        this.bomb0.src = './assets/bomb0.png';

        this.bomb2 = new Image();
        this.bomb2.src = './assets/bomb2.png';

        this.flag = new Image();
        this.flag.src = './assets/flag.png';

        this.setListeners();
        this.image.onload = () => {
            this.startGame(this.context);
        };
    }

    setListeners() {
        document.addEventListener('click', e => this.getButtonAction(e), false);
        this.canvas.addEventListener('click', e => this.openCell(e.layerX, e.layerY));
        this.canvas.oncontextmenu = e => this.putOrRemoveFlag(e.layerX, e.layerY);
    }

    setButton(button, i) {
        button = new Path2D();
        button.rect(210, 30*16 + i, 90, 40);
        button.closePath();
        return button;
    }

    getButtonAction(e) {
        let pointer = this.getPointer(this.canvas, e);
        if (this.context.isPointInPath(this.menuButton, pointer.x, pointer.y)) {
            this.showHowToPlay(this.context);
        } else if (this.context.isPointInPath(this.newGameButton, pointer.x, pointer.y)) {
            this.startGame(this.context);
        }
    }

    getPointer(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        let y = event.clientY - rect.top;
        let x = event.clientX - rect.left;
        return {x:x, y:y};
    }

    clearRect() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    showHowToPlay() {
        this.clearRect();
        clearInterval(this.interval);
        this.interval = false;
        this.isGame = false;
        let size = 450;
        let width = this.canvas.width;
        let height = this.canvas.height;

        let mainText = [
            'To be successful in this game you need to try and',
            'create an opening in the map to which you will see',
            'numbers appear indicating to you if any bombs are',
            'around that square. Segregate suspicious square',
            'before placing your flags and finding all of the bombs.',
        ];

        let controlText = [
            'Press left mouse button to open a tile',
            'Press right mouse button to place a flag',
            'Press left mouse button twice to open a tiles',
            'around the number',
        ];
    
        this.context.save();

        this.context.lineWidth = 2;
        this.context.textAlign = 'center';
        this.context.font = this.font.medium;
        this.context.strokeStyle = this.color.lightgreen;
        this.context.strokeText('How to play', width / 3, height / 10);
        this.context.strokeStyle = this.color.orange;
        this.context.strokeText('Controls', width / 3,  height * 5 / 10);
    
        this.context.textAlign = 'left';
        this.context.font = this.font.header;

        this.fillHowToText(mainText, height, 1, this.color.green);
        this.fillHowToText(controlText, height, 5, this.color.orange);
    
        this.context.strokeStyle = 'lightgrey';
        this.context.fillStyle = this.color.blue;
        this.context.font = this.font.small;
    
        this.context.fill(this.newGameButton);
        this.context.stroke(this.newGameButton);
    
        this.context.fillStyle = this.color.white;
        this.context.fillText('New game', 220, size + 120);
    
        this.context.restore();
    }

    fillHowToText(text, height, heightIndex, color) {
        this.context.fillStyle = color;

        for (let i in text) {
            this.context.fillText(text[i], 0, height * (heightIndex += 0.5) / 10);
        }
    }

    startGame() {
        this.flags = [];
        this.openElems = [];
        this.seconds = 0;
        this.clearRect();
        clearInterval(this.interval);
        this.interval = false;
        this.context.strokeRect(0, 0, this.size, this.size);

        let field = this.putNumbers(this.putRandomBombs(this.createMatrix()));

        this.drawGameBoard();
        this.fillGameFooter();

        this.field = field;
        this.isGame = true;

        // === for testing
        // this.context.fillStyle = 'red';
        // for (let t1 = 0; t1 < this.rows; t1 ++) {
        //     for (let t2 = 0; t2 < this.rows; t2 ++) {
        //         this.context.fillText(this.field[t2][t1], t2 * 30 + 10, t1 * 30 + 20);
        //     }
        // }
        // === for testing

    }

    createMatrix() {
        let field = [];
        for (let i = 0; i < this.rows; i++) {
            field[i] = [];
            for (let j = 0; j < this.rows; j++) {
                field[i][j] = 0;
            }
        }
        return field;
    }

    putRandomBombs(field) {
        for (let b = 0; b < this.bombs; b++) {

            let i = Math.floor(Math.random() * this.rows);
            let j = Math.floor(Math.random() * this.rows);

            if (field[i][j] == 'x') {
                b--;
            } else {
                field[i][j] = 'x';
            }
        }
        return field;
    }

    putNumbers(field) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (field[i][j] != 'x') {
                    continue;
                }
                for (let i1 = Math.max(0, i - 1); i1 <= Math.min(i + 1, this.rows - 1); i1++) {
                    for (let j1 = Math.max(0, j - 1); j1 <= Math.min(j + 1, this.rows - 1); j1++) {
                        if (field[i1][j1] != 'x') {
                            field[i1][j1] = field[i1][j1] + 1;
                        }
                    }
                }
            }
        }

        return field;
    }

    drawGameBoard() {
        for (let t1 = 0; t1 < this.size; t1 += this.sizeElem) {
            for (let t2 = 0; t2 < this.size; t2 += this.sizeElem) {
                this.context.drawImage(this.image, t1, t2, this.sizeElem, this.sizeElem);
            }
        }
    }

    fillGameFooter() {
        this.context.save();

        this.context.font = this.font.medium;
        this.context.fillStyle = this.color.blue;
        this.context.textAlign = 'left';

        this.context.strokeRect(10, this.size + 20, 95, 40);
        this.context.strokeText('Bombs', 15, this.size + 50);
        this.context.strokeRect(10, this.size + 62, 95, 45);
        this.context.strokeText('x' + this.bombs, 30, this.size + 90);

        this.context.strokeRect(110, this.size + 20, 95, 40);
        this.context.strokeText('Time', 125, this.size + 50);
        this.context.strokeRect(110, this.size + 62, 95, 45);
        this.drawTime('000');

        this.context.font = this.font.small;
        this.context.strokeStyle = 'lightgrey';

        this.context.fill(this.menuButton);
        this.context.stroke(this.menuButton);
        this.context.fill(this.newGameButton);
        this.context.stroke(this.newGameButton);

        this.context.fillStyle = this.color.white;
        this.context.fillText('New game', 220, this.size + 90);
        this.context.fillText('How to play', 218, this.size + 45);

        this.context.restore();
    }

    putOrRemoveFlag(layerX, layerY) {
        let xElem = Math.floor(layerX / this.sizeElem);
        let yElem = Math.floor(layerY / this.sizeElem);

        if (
            this.isGame &&
            xElem < this.rows &&
            yElem < this.rows 
            && this.openElems.indexOf(xElem + ' ' + yElem) == -1
        ) {
            let elemId = this.flags.indexOf(xElem + ' ' + yElem);
            if (elemId == -1) {
                this.context.drawImage(this.flag, xElem * this.sizeElem, yElem * this.sizeElem, this.sizeElem, this.sizeElem);
                this.flags.push(xElem + ' ' + yElem);
            } else {
                this.context.drawImage(this.image, xElem * this.sizeElem, yElem * this.sizeElem, this.sizeElem, this.sizeElem);
                this.flags.splice(elemId, 1);
            }

            this.context.fillStyle = this.color.white;
            this.context.fillRect(12, this.size + 64, 92, 42);
            this.context.font = this.font.medium;
            this.context.fillStyle = this.color.blue;
            this.context.textAlign = 'left';
            this.context.strokeText('x' + (this.bombs - this.flags.length), 30, this.size + 90);
        }
        return false;
    }

    openCell(layerX, layerY) {
        let xElem = Math.floor(layerX / this.sizeElem);
        let yElem = Math.floor(layerY / this.sizeElem);

        if (
            this.isGame &&
            xElem < this.rows &&
            yElem < this.rows &&
            this.flags.indexOf(xElem + ' ' + yElem) == -1 &&
            this.openElems.indexOf(xElem + ' ' + yElem) == -1
        ) {
            if (this.seconds == 0 && !this.interval) {
                this.interval = setInterval(this.timer.bind(this), 1000);
            }

            let point = this.field[xElem][yElem];

            if (point == 'x') {
                this.isGame = false;
                this.putAllBombs();
                this.context.drawImage(this.bomb1, xElem * this.sizeElem, yElem * this.sizeElem, this.sizeElem, this.sizeElem);
                this.drawLose();
            } 
            else if (point == '0') {
                this.openEmpty(xElem, yElem);
            } 
            else {
                this.openNumber(xElem, yElem);
            }

            this.tryWin();
        }

    }

    putAllBombs() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.field[i][j] == 'x') {
                    let elemId = this.flags.indexOf(i + ' ' + j);
                    if (elemId == -1) {
                        this.context.drawImage(this.bomb0, i * this.sizeElem, j * this.sizeElem, this.sizeElem, this.sizeElem);
                    } else {
                        this.flags.splice(elemId, 1);
                    }
                }
            }
        }

        for (let i = 0; i < this.flags.length; i++) {
            let a = this.flags[i].split(' ');
            this.context.drawImage(this.bomb2, a[0] * this.sizeElem, a[1] * this.sizeElem, this.sizeElem, this.sizeElem);
        }
    }

    putLastFlags() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.field[i][j] == 'x') {
                    this.context.drawImage(this.flag, i * this.sizeElem, j * this.sizeElem, this.sizeElem, this.sizeElem);
                }
            }
        }
    }

    openNumber(i, j) {
        let point = this.field[i][j];

        this.context.fillStyle = 'lightgrey';
        this.context.fillRect(i * this.sizeElem, j * this.sizeElem, this.sizeElem, this.sizeElem);
        this.context.fillStyle = this.color.blue;
        this.context.font = this.font.small;
        this.context.fillText(point, i * this.sizeElem + 10, j * this.sizeElem + 20);

        this.openElems.push(i + ' ' + j);
    }

    openEmpty(i, j) {
        if (
            this.field[i] &&
            this.field[i][j] == '0' &&
            this.flags.indexOf(i + ' ' + j) == -1 &&
            this.openElems.indexOf(i + ' ' + j) == -1
        ) {
            this.openNumber(i, j);

            this.openEmpty(i-1, j);
            this.openEmpty(i+1, j);
            this.openEmpty(i, j-1);
            this.openEmpty(i, j+1);
        }
    }

    tryWin() {
        if (
            this.isGame &&
            this.openElems.length >= this.rows * this.rows - this.bombs
        ) {
            clearInterval(this.interval);
            this.isGame = false;
            this.putLastFlags();
            this.drawWin();
        }
    }

    drawWin() {
        this.context.save();
        this.context.textAlign = 'center';
        this.context.font = this.font.large;
        this.context.shadowColor = this.color.winShadow;
        this.context.shadowOffsetX = 5;
        this.context.shadowOffsetY = 5;
        this.context.shadowBlur = 5;
        this.context.strokeStyle = this.color.lightgreen;
        this.context.lineWidth = 2;
        this.context.strokeText('You win!', this.canvas.width / 2, this.canvas.height / 4);
        this.context.restore();

        this.context.fillStyle = this.color.white;
        this.context.fillRect(12, this.size + 64, 92, 42);
        this.context.font = this.font.medium;
        this.context.fillStyle = this.color.blue;
        this.context.textAlign = 'left';
        this.context.strokeText('x0', 30, this.size + 90);
    }

    drawLose() {
        this.context.save();
        this.context.textAlign = 'center';
        this.context.font = this.font.large;
        this.context.shadowColor = this.color.loseShadow;
        this.context.shadowOffsetX = 5;
        this.context.shadowOffsetY = 5;
        this.context.shadowBlur = 5;
        this.context.strokeStyle = this.color.loseShadow;
        this.context.lineWidth = 2;
        this.context.strokeText('You lose!', this.canvas.width / 2, this.canvas.height / 4);
        this.context.restore();
    }

    drawTime(sec) {
        this.context.save();
        this.context.font = this.font.medium;
        this.context.fillStyle = this.color.white;
        this.context.fillRect(112, this.size + 64, 92, 42);
        this.context.strokeText(sec, 130, this.size + 90);
        this.context.restore();
    }

    timer() {
        console.log(this.interval);

        let sec;
        if (this.isGame) {
            if (++this.seconds < 10) {
                sec = '00' + this.seconds;
            } else if (this.seconds < 100) {
                sec = '0' + this.seconds;
            } else {
                sec = this.seconds;
            }
            this.drawTime(sec);
        } else {
            clearInterval(this.interval);
        }
    }
}

const sapper = new Sapper(16, 40);
