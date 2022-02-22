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

        this.fruit_px = 0
        this.fruit_py = 0

        this.frames = 100

        this.root = root
        this.ctx = root.getContext('2d')
    }
   
    init() {
        this.connectSocket()
        this.setRenderFps()
    }

    renderScoreboard() {
        let container = document.querySelector('.players-container')

        let element = '<h1 class = "title">Placar</h1>'

        console.log(this.players)

        for (let i in this.players) {
            if (i == this.id) {
                element += `
                <div class = 'player active-player'>
                    <p>Player: ${this.id.slice(0, 10)}</p>
                    <p>Pontos: ${this.players[i].points}</p>
                </div>
                `
            } else {
                element += `
                <div class = 'player default-player'>
                    <p>Player: ${this.id.slice(0, 10)}</p>
                    <p>Pontos: ${this.players[i].points}</p>
                </div>
                `
            }
        }
        
        container.innerHTML = element
    }

    async connectSocket() {
        let options = {
            method: 'POST',
            body: JSON.stringify({})
        }

        let response = await fetch('http://localhost:3000/loginUser', options)
        let {id, players, fruit} = await response.json()
        this.id = id
        this.players = players
        this.fruit_px = fruit.pos.x
        this.fruit_py = fruit.pos.y
        
        this.renderScoreboard()

        this.socket = io('http://localhost:3000',  { transports : ['websocket'], query: {id: this.id} })
        this.handleSocketEvents()
    }

    handleSocketEvents() {
        this.socket.on('updatePlayers', (players) => {
            this.players = players
        
            this.renderScoreboard()
        })

        this.socket.on('updateFruit', (fruit) => {
            this.fruit_px = fruit.pos.x
            this.fruit_py = fruit.pos.y
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

        if (update) {
            this.socket.emit('updatePlayerPos', {id: this.id, pos: {x: this.px, y: this.py}})
        }
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
