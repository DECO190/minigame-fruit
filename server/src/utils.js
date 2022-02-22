module.exports = {
    hash(length) {
        var result           = [];
        var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
        }
        return result.join('');
    },

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