void setup() { 
  size(window.innerWidth, window.innerHeight); 
} 

var width = window.innerWidth;
var height = window.innerHeight;

var keys = [];
void keyPressed() {keys[keyCode]=true;};
void keyReleased() {keys[keyCode]=false;};
var mouse = [];
var timePassed = 0;
var gameHasStarted = false;
void mousePressed() {mouse[mouseButton] = true;};
void mouseReleased() {mouse[mouseButton] = false;};

var checkWin = function(arr)
{
    //println(arr0[0].type + " " + arr0[1].type + " " + arr0[2].type);
    if(arr[0].type!==0)
    {
        for(var i = 1; i < arr.length; i++){
            if(arr[i].type!==arr[0].type)
            {
                return 0;
            }
        }
    }
    else{
        return 0;
    }
    return arr[0].type;
};

var okay = function(game)
{
    for(var i = 0; i < game.cells.length; i++)
    {
        if(game.cells[i].on() && game.cells[i].type !== 0)
        {
            return false;
        }
    }
    return true;
};

var Cell = function(x, y)
{
    this.x = x;
    this.y = y;
    this.h = height*7/40;
    this.w = width*7/40;
    this.type = 0;
    this.flipped = false;
    
    this.display = function()
    {
        textAlign(CENTER, CENTER);
        textSize(((width+height)/2)*3/40);
        fill(255, 255, 255);
        rect(this.x, this.y, this.w, this.h);
        switch(this.type)
        {
            case 0:
                fill(255, 255, 255);
                rect(this.x, this.y, this.w, this.h);
                break;
            case 1:
                fill(0, 0, 0);
                text("X", this.x+this.w/2, this.y+this.h/2);
                break;
            case 2:
                fill(0, 0, 0);
                text("O", this.x+this.w/2, this.y+this.h/2);
                break;
        }
    };
    this.on = function()
    {
        if(mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h){return true;}
    };
};

var Board = function()
{
    this.cells = [];
    this.win = false;
    this.timer = 0;
    this.delay = 60;
    this.clock = 0;
    this.pairs = [];
    this.pairsFound = 0;
    this.totalPairs = 8;
    this.turn = 1;
    
    this.setup = function()
    {
        for(var r = 0; r < 3; r++)
        {
            for(var c = 0; c < 3; c++)
            {
                this.cells.push(new Cell(width/20+width*(7/40)*r, height/20+height*(7/40)*c));
            }
        }
    };
    
    this.update = function()
    {
        for(var i = 0; i < this.cells.length; i++)
        {
            if(this.cells[i].on() && mouse[LEFT] && this.cells[i].type===0)
            {
                gameHasStarted = true;
                if(this.turn===1)
                {
                    this.cells[i].type = 1;
                    this.turn = 2;
                }
                else
                {
                    this.cells[i].type = 2;
                    this.turn = 1;
                }
            }
        }
    };
    
    this.display = function()
    {
        for(var i = 0; i < this.cells.length; i++)
        {
            this.cells[i].display();
        }
        var arr = [], win = 0;
        for(var i = 0; i < 8; i++){
            arr.push([]);
        }
        for(var i = 0; i < this.cells.length; i++)
        {
            if(i%3===0){arr[0].push(this.cells[i]);}
            else if(i%3===1){arr[1].push(this.cells[i]);}
            else{arr[2].push(this.cells[i]);}
            if(floor(i/3)===0){arr[3].push(this.cells[i]);}
            else if(floor(i/3)===1){arr[4].push(this.cells[i]);}
            else{arr[5].push(this.cells[i]);}
            if(i===2||i===4||i===6){arr[6].push(this.cells[i]);}
            if(i===0||i===4||i===8){arr[7].push(this.cells[i]);}
        }
        var i = 0;
        do
        {
            win = checkWin(arr[i]);
            i++;
        }while(win===0 && i < arr.length);
        if(win===0)
        {
            var full = true;
            for(var i = 0; i < this.cells.length; i++)
            {
                if(this.cells[i].type===0)
                {
                    full = false;
                    break;
                }
            }
            if(full){win=3;}
        }
        if(win>0)
        {
            fill(255, 0, 0);
            textAlign(LEFT, CENTER);
            textSize(((width+height)/2)*3/40);
            gameHasStarted = false;
            if(win===1){text("X wins!\nPress enter to start again", 20, height/4*3);}
            else if(win===2){text("O wins!\nPress enter to start again", 20, height/4*3);}
            else if(win===3){text("It's a tie!\nPress enter to start again", 20, height/4*3);}
            if(keys[10])
            {
                timePassed = 0;
                this.turn = 1;
                this.cells = [];
                win = 0;
                this.setup();
            }
        }
    };
};

var game = new Board();
game.setup();

void draw()
{
    size(window.innerWidth, window.innerHeight);
    width = window.innerWidth;
    height = window.innerHeight;
    background(11, 133, 0);
    var turn = [null, "X", "O"];
    fill(0, 0, 0);
    textSize(((width+height)/2)*3/40);
    textAlign(CENTER, CENTER);
    text("Time:  " + floor(timePassed/60), width/4*3, height*1/10);
    text("Turn: " + turn[game.turn], width/4*3, height*1/4);
    if(gameHasStarted){timePassed++;}
    game.update();
    game.display();
    if(okay(game))
    {
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        text(turn[game.turn], mouseX, mouseY);
    }
};
