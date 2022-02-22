
class Game {
    constructor(root) {
        this.id = ''

        this.players = { }

        this.socket;

        this.px = 0
        this.py = 0

        this.restart_fruit = false

        this.speed = 25

        this.canvasSize = root.width
        this.entitySize = 25

        this.fruit_px = this.generateFruitPos()
        this.fruit_py = this.generateFruitPos()

        this.frames = 100

        this.root = root
        this.ctx = root.getContext('2d')
    }
   
    init() {
        this.connectSocket()
        this.setRenderFps()
    }

    async connectSocket() {
        let options = {
            method: 'POST',
            body: JSON.stringify({})
        }

        let response = await fetch('http://localhost:3000/loginUser', options)
        let {id, players} = await response.json()
        this.id = id
        this.players = players


        this.socket = io('http://localhost:3000',  { transports : ['websocket'], query: {id: this.id} })

        this.handleSocketEvents()
    }

    handleSocketEvents() {
        this.socket.on('updatePlayers', (players) => {
            this.players = players
        })
    }

    setRenderFps() {
        this.render()
        setInterval(() => {
            this.render()
        }, 1000 / this.frames)
    }

    render() {
        this.ctx.clearRect(0, 0, 500, 500)

        if (this.restart_fruit) {
            this.fruit_px = this.generateFruitPos()
            this.fruit_py = this.generateFruitPos()
            
            this.restart_fruit = false
        }

        this.ctx.fillStyle = '#FF0096'
        this.ctx.fillRect(this.fruit_px, this.fruit_py, this.entitySize, this.entitySize)

        for (let i in this.players) {
            if (i == this.id) {
                this.ctx.fillStyle = '#3D85C6'
                this.ctx.fillRect(this.px, this.py, this.entitySize, this.entitySize)
            } else {
                this.ctx.fillStyle = '#515151'
                this.ctx.fillRect(this.players[i].pos.x, this.players[i].pos.y, this.entitySize, this.entitySize)
            }
        }
        
    }

    moveEntity(dir) {
        let update = false

        if (dir == 'ArrowRight') {
            if (this.px + this.speed > this.canvasSize - this.speed) {
                return
            }

            this.px += this.speed 
            update = true
        } else if (dir == 'ArrowLeft') {
            if (this.px - this.speed < 0) {
                return
            }

            this.px -= this.speed 
            update = true
        } else if (dir == 'ArrowDown') {
            if (this.py + this.speed > this.canvasSize - this.entitySize) {
                return
            }

            this.py += this.speed
            update = true
        } else if (dir == 'ArrowUp') {
            if (this.py - this.speed < 0) {
                return
            }

            this.py -= this.speed
            update = true
        }

        this.socket.emit('updatePlayerPos', {id: this.id, pos: {x: this.px, y: this.py}})

        if (this.py == this.fruit_py && this.px == this.fruit_px) {
            this.restart_fruit = true
        }
    }

    generateFruitPos() {
        function randint(min, max) {
            return Math.random() * (max - min) + min;
        }

        let size = (this.canvasSize - this.entitySize) / this.speed
        const multiples = [];

        for (let i = this.speed; i <= this.speed * size; i += this.speed){
            multiples.push(i);
        };

        let pos = multiples[Math.floor(randint(0, size))]
        return pos
    }
}


let GameInstance = new Game(document.querySelector('#screen'))
GameInstance.init()


document.addEventListener('keydown', ({key}) => {
    GameInstance.moveEntity(key)
})


const multiples = (num, size) => {
    const res = [];
    for(let i = num; i <= num * size; i += num){
        res.push(i);
    };
    return res;
};
