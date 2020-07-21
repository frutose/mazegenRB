//Adapted from Daniel Shiffman's code: https://www.youtube.com/watch?v=HyK_Q5rrcr4&
//More information: https://en.wikipedia.org/wiki/Maze_generation_algorithm

let grid;
let w;
let rows, cols;
let cell;
let current;
let stack;
let slider;
let para1, para2, button;
let winCell = false;
let exit;
let difficulty;

function setup() {
  createCanvas(480, 480);
  button = createButton('reset');
  button.position(435, 480);
  button.mousePressed(reset);
  para2 =createP('Difficulty: ' + difficulty);
  para2.position(140, 470);
  slider = createSlider(10, 40, 40, 10);
  para1 = createP('Cell length: ' + w + ' pixels');
  para1.position(140, 490);
  reset();
  setInterval(looping, 50);
}

function draw() {
  loop();
  background(0);
  image(extraCanvas, 0, 0);
  current.highlight();
  for(let i = 0; i < grid.length; i++) {
    grid[i].show();
  }
  current.visited = true;
  let next = current.checkNeighbors();
  if(next) {
    next.visited = true;
    stack.push(current);
    removeWalls(current, next);
    current = next;
  } else if(stack.length > 0){
      current = stack.pop();
  }
  //creating an exit
  if(stack.length == 0 && winCell == false) {
    exit = random(grid);
    exit.exit = true;
    if(current !== exit) {
      winCell = true;
    }
  }
  //winning condition
  if(current == exit) {
    console.log('won');
    winCell = false;
    push();
    stroke(255, 205);
    strokeWeight(2);
    fill(255, 225, 50);
    textSize(91);
    text('YOU WON!', 8, 250);
    pop();
    noLoop();
  }
}

//moves the current cell
function looping() {
  let moveup = index(current.i, current.j-1);
  let movedown = index(current.i, current.j+1);
  let moveright = index(current.i+1, current.j);
  let moveleft = index(current.i-1, current.j);
  if(stack.length == 0) {
    if(keyIsDown(UP_ARROW)) {
      if(!current.walls[0] && moveup >= 0) {
        current = grid[moveup];
      }
    } else if(keyIsDown(DOWN_ARROW)) {
      if(!current.walls[2] && movedown >= 0) {
        current = grid[movedown];
      }
    } else if(keyIsDown(RIGHT_ARROW)) {
      if(!current.walls[1] && moveright >= 0) {
        current = grid[moveright];
      }
    } else if(keyIsDown(LEFT_ARROW)) {
      if(!current.walls[3] && moveleft >= 0) {
        current = grid[moveleft];
      }
    }
  }
}






class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    this.walls = [true, true, true, true];
                //top, right, bottom, left
    this.exit = false;
  }

  show() {
    let x = w*this.i;
    let y = w*this.j;
    stroke(255, 255);
    strokeWeight(2);

    if(this.walls[0]) {
    line(x, y, x + w, y); //top wall
    }
    if(this.walls[1]) {
    line(x + w, y, x + w, y + w); //right wall
    }
    if(this.walls[2]) {
    line(x, y + w, x + w, y + w); //bottom wall
    }
    if(this.walls[3]) {
    line(x, y, x, y + w); //left wall
    }
    if(this.exit) {
      noStroke();
      fill(255, 20, 20, 255);
      rect(x, y, w, w);
    }
    if(this.visited) {
      noStroke();
      fill(50, 120, 80, 60);
      rect(x, y, w, w);
    }
  }
  
  highlight() {
    let x = w*this.i;
    let y = w*this.j;
    /*extraCanvas.*/noStroke();
    /*extraCanvas.*/fill(10, 10, 255, 230);
    /*extraCanvas.*/rect(x+1, y+1, w-1, w-1);
  }
  
  checkNeighbors() {
    let neighbors = [];
    
    let top = grid[index(this.i-1, this.j)];
    let right = grid[index(this.i, this.j+1)];
    let bottom = grid[index(this.i+1, this.j)];
    let left = grid[index(this.i, this.j-1)];
    
    if(top && !top.visited) {
      neighbors.push(top);
    }
    if(right && !right.visited) {
      neighbors.push(right);
    }
    if(bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if(left && !left.visited) {
      neighbors.push(left);
    }
    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }
}





function index(i, j) {
  if(i < 0 || j < 0 || i > rows - 1 || j > cols - 1) {
    return -1;  
  }
  return j + i*cols;
}

function removeWalls(a, b) {
  let x = a.i - b.i;
  if(x === 1) { //left neighbor
    a.walls[3] = false;
    b.walls[1] = false;
  } else if(x === -1) { //right neighbor
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if(y === 1) { //top neighbor
    a.walls[0] = false;
    b.walls[2] = false;
  } else if(y === -1) { //bottom neighbor
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

function reset() {
  winCell = false;
  extraCanvas = createGraphics(width, height);
  background(0);
  w = slider.value();
  //w = 5; /*insane O.O*/
  para1.html('Cell length: ' + w + ' pixels');
  grid = [];
  stack = [];
  //frameRate(10);
  rows = floor(width/w);
  cols = floor(height/w);
  for(let i = 0; i < rows; i++) {
    for(let j = 0; j < cols; j++) {
      cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  current = random(grid);
  if(winCell == false) {
  draw();
  }
  if(w == 40) {
    difficulty = 'easy';
    } else if(w == 30) {
        difficulty = 'medium';
      } else if(w == 20) {
          difficulty = 'hard';
        } else if(w == 10) {
            difficulty = 'very hard';        
          }
  para2.html('Difficulty: ' + difficulty);
  nblue = cols*rows;
  nred = cols*rows;
}