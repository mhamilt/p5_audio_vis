let sample, fft;
//------------------------------------------------------------------------------
let theta = 0.26;
let branches = 60;
let branch_length = 0.16;
let branch_length_rate = 0.001;
//------------------------------------------------------------------------------
let bands = 16;
let smoothingFactor = 0.2;
let sum = new Array(bands);
sum.fill(0);
function preload() {
  soundFormats('mp3', 'ogg');
  sample = loadSound('assets/Cello.mp3');
}

//----------------------------------------------------------------------------
function setup() {
  screensize = (windowWidth < windowHeight) ? windowWidth : windowHeight;
  screensize *= 4.0/5.0;
  canvas = createCanvas(screensize, screensize);
  canvas.parent('sketch-holder');
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
  console.log(screensize);
  sample.setVolume(0.1);
  sample.play();
  fft = new p5.FFT(0.3, bands);
  fft.setInput(sample);
  background(0);
}
//----------------------------------------------------------------------------
function draw() {
  background(0);
  fill(255);
  if (getAudioContext().state !== 'running') {
    text(getAudioContext().state, width / 2, height / 2);
  } else {
    let spectrum = fft.analyze();

    let thresh = true;
    for (let i = 0; i < 8; i++) {
      sum[i] = spectrum[i] / 512;
      if (sum[i] < 0.13)
        thresh = false;
    }

    if (thresh)
    {
      if (theta < PI / 3)
        theta += 0.002;
    }

    if (branches < 200.0)
      branches += sum[1];

    if (branch_length < 0.66)
      branch_length += map(sum[1], 0.3,0.4, 0.00001,0.0017);

    if (theta > 0.0)
      theta -= 0.0004;
    if (branches > 0.0)
      branches -= 0.057;


    branch_length -= 0.0001;
    push();
    translate(width / 2, height);
    stroke(255);
    branch(100);
    pop();

  }
}
//----------------------------------------------------------------------------
function branch(len) {

  line(0, 0, 0, -len);
  translate(0, -len);

  //Each branch’s length shrinks by two-thirds.
  len *= branch_length;

  if (len > 2) {
    push();
    rotate(theta);
    //Subsequent calls to branch() include the length argument.
    branch(len);
    pop();

    push();
    rotate(-theta);
    branch(len);
    pop();
  }
}
//----------------------------------------------------------------------------
function touchStarted() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();

  }

}
