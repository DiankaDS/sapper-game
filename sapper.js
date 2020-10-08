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

    constructor() {
        this.canvas = document.getElementById('draw');
        this.context = this.canvas.getContext('2d');
        this.isGame = true;
        this.newGameButton = this.setButton(this.newGameButton, 66);
        this.menuButton = this.setButton(this.menuButton, 20);
        this.setListeners();
    }

    setListeners() {
        document.addEventListener('click', e => this.getButtonAction(e), false);
    }

    setButton(button, i) {
        button = new Path2D();
        button.rect(210, 30*16 + i, 90, 40);
        button.closePath();
        
        this.context.fill(button);
        this.context.stroke(button);

        return button;
    }

    getButtonAction(e) {
        let pointer = this.getPointer(this.canvas, e);
        if (this.context.isPointInPath(this.menuButton, pointer.x, pointer.y) && this.isGame) {
            this.showHowToPlay(this.context);
        } else if (this.context.isPointInPath(this.newGameButton, pointer.x, pointer.y)) {
            console.log('game');
        }
    }

    getPointer(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        let y = event.clientY - rect.top;
        let x = event.clientX - rect.left;
        return {x:x, y:y};
    }

    showHowToPlay(x) {
        x.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.isGame = false;
        let size = 450;
        let width = this.canvas.width;
        let height = this.canvas.height;
    
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
    
        x.fillStyle = this.color.green;
        x.fillText('To be successful in this game you need to try and', 0, height * 1.5 / 10);
        x.fillText('create an opening in the map to which you will see', 0, height * 2 / 10);
        x.fillText('numbers appear indicating to you if any bombs are', 0, height * 2.5 / 10);
        x.fillText('around that square. Segregate suspicious square', 0, height * 3 / 10);
        x.fillText('before placing your flags and finding all of the bombs.', 0, height * 3.5 / 10);
        x.fillStyle = this.color.orange;
        x.fillText('Press left mouse button to open a tile', 0, height * 5.5 / 10);
        x.fillText('Press right mouse button to place a flag', 0, height * 6 / 10);
        x.fillText('Press left mouse button twice to open a tiles around', 0, height * 6.5 / 10);
        x.fillText('the number', 0, height * 7 / 10);
    
        x.strokeStyle = 'lightgrey';
        x.fillStyle = this.color.blue;
        x.font = this.font.small;
    
        x.fill(this.newGameButton);
        x.stroke(this.newGameButton);
    
        x.fillStyle = this.color.white;
        x.fillText('New game', 220, size + 120);
    
        x.restore();
    }

    game() {
        console.log(this.isGame);
    }

}

const sapper = new Sapper();
sapper.game();