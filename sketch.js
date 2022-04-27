let bg; 
function setup() {
  createCanvas(800,800);
  v = new Vehicle(90,400);
  bg = loadImage('langit2.jpg');
}

function draw() {
  background(bg)

  
  v.display()
  v.edges()
  v.update();
  v.wander();
  
}

class Vehicle{
  constructor(x,y){
    this.location = createVector(x,y);
    this.velocity = createVector(1,0);
    this.acceleration = createVector(0,0);
    this.l = 30.0;
    this.maxspeed = 2;
    this.maxforce = 0.05;
    this.wanderTheta = PI/2;
  }
  
  wander(){

    let projVector = this.velocity.copy();
    projVector.setMag(150);
    let projPoint = projVector.add(this.location);
    
    let wanderRadius = 40;
    let theta = this.wanderTheta + this.velocity.heading();
    let xBar = wanderRadius * cos(theta);
    let yBar = wanderRadius * sin(theta);
    
    let wanderPoint = p5.Vector.add(projPoint, createVector(xBar,yBar));
    
    let debug = true;
    if (debug){
      push()
      line(this.location.x, this.location.y, projPoint.x, projPoint.y);
      noStroke()
      fill(255,0,0);
      circle(projPoint.x, projPoint.y, 8);
      noFill();
      stroke('#000000');
      circle(projPoint.x, projPoint.y, wanderRadius*2);
      line(this.location.x, this.location.y, wanderPoint.x, wanderPoint.y);
      fill('blue')
      circle(wanderPoint.x, wanderPoint.y, 16)
      pop()
    }
    
    let steeringForce = wanderPoint.sub(this.location);
    steeringForce.setMag(this.maxforce);
    this.applyForce(steeringForce);
    
    this.wanderTheta += random(-0.5, 0.5);

    
  }
  
  seek(vektorTarget){
    var desired = p5.Vector.sub(vektorTarget, this.location);
    desired.normalize();
    desired.mult(this.maxspeed);
    
    //kemudi
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
  
  arrive(vektorTarget){
    var desired = p5.Vector.sub(vektorTarget, this.location);
    var jarak = desired.mag()

    if (jarak < 5){
      var m = map(jarak, 0, 100, 0, this.maxspeed);
      desired.normalize();
      desired.mult(m);
      
    }
    else{
      desired.normalize();
      desired.mult(this.maxspeed);    
    }

    
    //kemudi
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }
  
  
  update(){
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }
  applyForce(force){
    this.acceleration.add(force);
  }
  display(){
    var theta = this.velocity.heading()// + PI/2;
    push();
    fill(0);
    stroke(10);
    translate(this.location.x, this.location.y)
    rotate(theta)
    fill('rgb(26,26,26)')
    triangle(0, this.l/2, 0, -this.l/2, this.l,0)
    fill('#03A9F4')
    rect (0,35.30,-70)
    fill('#E91E63')
    triangle(-50,75,-50,-75,90,0)
    //triangle(-50,75,-50,-75,-90,0)
    pop();
  }

  edges() {
    if (this.location.x > width + 10) {
      this.location.x = -10;
    } else if (this.location.x < -10) {
      this.location.x = width + 10;
    }
    if (this.location.y > height + 10) {
      this.location.y = -10;
    } else if (this.location.y < -10) {
      this.location.y = height + 10;
    }
  }

}


