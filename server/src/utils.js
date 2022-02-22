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
        let canvasSize = 500
        let speed = 25
        let entitySize = 25

        function randint(min, max) {
            return Math.random() * (max - min) + min;
        }

        let size = (canvasSize - entitySize) / speed
        const multiples = [];

        for (let i = speed; i <= speed * size; i += speed){
            multiples.push(i);
        };

        let pos = multiples[Math.floor(randint(0, size))]
        return pos
    }
}