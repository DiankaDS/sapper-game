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
    };

    constructor(rows, bombs) {
        this.rows = rows;
        this.bombs = bombs;
        this.sizeElem = 30;
        this.size = this.sizeElem * this.rows;
        this.canvas = document.getElementById('draw');
        this.context = this.canvas.getContext('2d');
        this.isGame = true;
        this.newGameButton = this.setButton(this.newGameButton, 66);
        this.menuButton = this.setButton(this.menuButton, 20);
        this.setListeners();
        this.startGame(this.context);
    }

    setListeners() {
        document.addEventListener('click', e => this.getButtonAction(e), false);
    }

    setButton(button, i) {
        button = new Path2D();
        button.rect(210, 30*16 + i, 90, 40);
        button.closePath();
        return button;
    }

    getButtonAction(e) {
        let pointer = this.getPointer(this.canvas, e);
        if (this.context.isPointInPath(this.menuButton, pointer.x, pointer.y) && this.isGame) {
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

    clearRect(x) {
        x.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    showHowToPlay(x) {
        this.clearRect(x);
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
    
        x.save();

        x.lineWidth = 2;
        x.textAlign = 'center';
        x.font = this.font.medium;
        x.strokeStyle = this.color.lightgreen;
        x.strokeText('How to play', width / 3, height / 10);
        x.strokeStyle = this.color.orange;
        x.strokeText('Controls', width / 3,  height * 5 / 10);
    
        x.textAlign = 'left';
        x.font = this.font.header;

        this.fillHowToText(x, mainText, height, 1, this.color.green);
        this.fillHowToText(x, controlText, height, 5, this.color.orange);
    
        x.strokeStyle = 'lightgrey';
        x.fillStyle = this.color.blue;
        x.font = this.font.small;
    
        x.fill(this.newGameButton);
        x.stroke(this.newGameButton);
    
        x.fillStyle = this.color.white;
        x.fillText('New game', 220, size + 120);
    
        x.restore();
    }

    fillHowToText(x, text, height, heightIndex, color) {
        x.fillStyle = color;

        for (let i in text) {
            x.fillText(text[i], 0, height * (heightIndex += 0.5) / 10);
        }
    }

    fillGameFooter(x) {
        x.save();

        x.font = this.font.medium;
        x.fillStyle = this.color.blue;
        x.textAlign = 'left';

        x.strokeRect(10, this.size + 20, 95, 40);
        x.strokeText('Bombs', 15, this.size + 50);
        x.strokeRect(10, this.size + 62, 95, 45);
        x.strokeText('x' + this.bombs, 30, this.size + 90);

        x.strokeRect(110, this.size + 20, 95, 40);
        x.strokeText('Time', 125, this.size + 50);
        x.strokeRect(110, this.size + 62, 95, 45);
        x.strokeText('000', 130, this.size + 90);

        x.font = this.font.small;
        x.strokeStyle = 'lightgrey';

        x.fill(this.menuButton);
        x.stroke(this.menuButton);
        x.fill(this.newGameButton);
        x.stroke(this.newGameButton);

        x.fillStyle = this.color.white;
        x.fillText('New game', 220, this.size + 90);
        x.fillText('How to play', 218, this.size + 45);

        x.restore();
    }

    startGame(x) {
        this.clearRect(x);
        this.isGame = true;

        x.strokeRect(0, 0, this.size, this.size);

        this.fillGameFooter(x);

    }

}

const sapper = new Sapper(16, 40);
