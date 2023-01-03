// document.querySelector('.myImg').src = ".//gimages/platform.png"
import platform from "../gimages/platform.png"
import hills from "../gimages/hills.png"
import background from "../gimages/background.png"
import platformSmallTall from "../gimages/platformSmallTall.png"
import spriteRunLeft from "../gimages/spriteRunLeft.png"
import spriteRunRight from "../gimages/spriteRunRight.png"
import spriteStandLeft from "../gimages/spriteStandLeft.png"
import spriteStandRight from "../gimages/spriteStandRight.png"
// import { create } from "browser-sync"



console.log(platform)

// console.log(platform)
 
const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
const gravity = 0.5

// console.log(c)

// canvas.width = window.innerWidth // dont need window. since innerWidth is a field of window
canvas.width = 1024
canvas.height = 576

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
        this.width = 66
        this.height = 150

        this.image = createImage(spriteStandRight)
        this.frames = 0

        this.sprites = {
            stand: {
                right: createImage(spriteStandRight),
                left: createImage(spriteStandLeft),
                cropWidth: 177,
                width: 66
            },
            run: {
                right: createImage(spriteRunRight),
                left: createImage(spriteRunLeft),
                cropWidth: 341,
                width:127.875
            }
        }

        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
        
    }
 
    draw() {
        // c.fillStyle = 'red'
        // // order matters for some reason 
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        c.drawImage(
            this.currentSprite, 
            this.currentCropWidth * this.frames,
            0, 
            this.currentCropWidth,
            400,
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
        
    } 

    update() {
        
        this.frames++
        if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right ||
                                 this.currentSprite === this.sprites.stand.left)) {
            this.frames = 0
        } else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right ||
                                        this.currentSprite === this.sprites.run.left)) {
            this.frames = 0
        }
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

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x: x,
            y
            
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }

    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
  constructor({x, y, image}) {
      this.position = {
          x,
          y
          
      }
      this.image = image
      this.width = image.width
      this.height = image.height
  }

  draw() {
      // c.fillStyle = 'blue'
      // c.fillRect(this.position.x, this.position.y, this.width, this.height)

      c.drawImage(this.image, this.position.x, this.position.y)
  }
}

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}


let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)
// const image = new Image()
// image.src = platform

let player = new Player()
// const platform = new Platform()
let platforms = []

let genericObjects = []

let lastKey
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

player.draw()

let scrollOffset = 0

function init() {

platformImage = createImage(platform)
platformSmallTallImage = createImage(platformSmallTall)

// const image = new Image()
// image.src = platform

player = new Player()
// const platform = new Platform()
platforms = [ 
    new Platform({ 
        x: platformImage.width*4 + 400 - 2 + platformImage.width/2, 
        y: 270, 
        image: platformSmallTallImage}),

  new Platform({ 
    x: -1, 
    y: 460, 
    image: platformImage}),

  new Platform({ 
    x: platformImage.width-3, 
    y: 460, 
    image: platformImage}),

  new Platform({ 
    x: platformImage.width*2 + 100, 
    y: 460, 
    image: platformImage}),

    new Platform({ 
        x: platformImage.width*3 + 400, 
        y: 460, 
        image: platformImage}),

    new Platform({ 
        x: platformImage.width*4 + 400 - 2, 
        y: 460, 
        image: platformImage}),

    new Platform({ 
        x: platformImage.width*5 + 800, 
        y: 460, 
        image: platformImage})
    
    
    
]

genericObjects = [
  new GenericObject({
    x: 0,
    y: 0,
    image: createImage(background)
  }),

  new GenericObject({
    x: 0,
    y: 0,
    image: createImage(hills)
  })
]

player.draw()

scrollOffset = 0
}

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "white"
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
      genericObject.draw()
    })
    
    platforms.forEach(platform => {
        platform.draw()
    }) // draws each platform in the array of platforms

    player.update() // make it last thing to draw so it is in front of everything else
    


    if (keys.right.pressed && player.position.x < 400) { // second cond needed for side-scrolling
        player.velocity.x = 5
    } else if (
        (keys.left.pressed && player.position.x > 100) ||  // second cond needed for side-scrolling
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) {
        player.velocity.x = -5
    } else { 
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach((genericObject) => {
              genericObject.position.x -= player.speed * 0.2
            })
            // platform.position.x -= 5 // moves platform to left at same rate as player moves
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                
                platform.position.x += player.speed
            })
            // platform.position.x += 5 // moves platform to right at same rate as player moves

            genericObjects.forEach((genericObject) => {
              genericObject.position.x += player.speed * 0.2
            })
        } 

        
        
    }
    // platform collision protection
    platforms.forEach(platform => {
        
        if (player.position.y + player.height <= platform.position.y && 
            player.position.y + player.height + player.velocity.y >= platform.position.y &&
            player.position.x + player.width >= platform.position.x &&
            player.position.x + player.width <= platform.position.x + platform.width) {
                // second one makes sure you only stop when going down 
                // (when the next frame of movement would be covering the platform on way down)

                // third one makes it fall down when off the platform on left
                // fourth does same for right side 
            player.velocity.y = 0
        } 

    }) 

    // sprite switching
    if (keys.right.pressed && 
        lastKey == 'right' && 
        player.currentSprite !== player.sprites.run.right) {
        player.frames = 0
        player.currentSprite = player.sprites.run.right
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
    } else if (
        keys.left.pressed && 
        lastKey == 'left' && 
        player.currentSprite !== player.sprites.run.left) {

        player.currentSprite = player.sprites.run.left
            player.currentCropWidth = player.sprites.run.cropWidth
            player.width = player.sprites.run.width
    } else if (
        !keys.left.pressed && 
        lastKey == 'left' && 
        player.currentSprite !== player.sprites.stand.left) {

        player.currentSprite = player.sprites.stand.left
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
    } else if (
        !keys.right.pressed && 
        lastKey == 'right' && 
        player.currentSprite !== player.sprites.stand.right) {

        player.currentSprite = player.sprites.stand.right
            player.currentCropWidth = player.sprites.stand.cropWidth
            player.width = player.sprites.stand.width
    }

    // win condition
    if (scrollOffset > platformImage.width*6 + 300) {
        console.log("YOU WIN!")
    }

    // lose condition
    if (player.position.y > canvas.height) {
      console.log("YOU LOSE!")
      init()
    }
}

init()
animate()


// event listeners

window.addEventListener('keydown', ({ keyCode}) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65: 
            console.log('left')
            // player.velocity.x -= 2
            keys.left.pressed = true
            lastKey = 'left'
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            // player.velocity.x += 2
            keys.right.pressed = true
            lastKey = 'right'
            break

        case 87:
            console.log('up')
            player.velocity.y -= 15
            break
    }

   
}) // dont need to call window cuz this IS the window

window.addEventListener('keyup', ({ keyCode}) => {
    // console.log(keyCode)
    switch (keyCode) {
        case 65: 
            console.log('left')
            player.velocity.x = 0
            keys.left.pressed = false
            // player.currentSprite = player.sprites.stand.left
            // player.currentCropWidth = player.sprites.stand.cropWidth
            // player.width = player.sprites.stand.width
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            player.velocity.x = 0
            keys.right.pressed = false
            // player.currentSprite = player.sprites.stand.right
            // player.currentCropWidth = player.sprites.stand.cropWidth
            // player.width = player.sprites.stand.width
            break

        case 87:
            console.log('up')
            // player.velocity.y -= 20
            break
    }

    
})
