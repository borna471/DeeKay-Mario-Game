class Player {

    constructor( ) {
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
            // start at 0 so gravity effects it if its in the air (check update fn)
        }
        this.width = 30
        this.height = 30
        
    }
 
    draw() {
        c.fillStyle = 'red'
        // order matters for some reason 
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        
    } 

    update() {
        
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        this.draw()

        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity
        } else {
            // this.velocity.y = 0
            // remove to make player die when falling 
        }
        
    }
}