console.log("Sup");

const visualserContainer = document.getElementById("visualiser-container");
const mainCircle = document.getElementById('record-btn');
const cirleContainer = document.getElementById("circleContainer");

//size is in pixels and opacity is in percentage
const mainCircleSize = 50;
const mainCirleOpacity = 100;
const numberOfCircles = 10;

let i;
for (i = 1; i <= 255; i++) {
  const div = document.createElement('div');
  div.id = `visualiser-bar-${i}`;
  div.style.width = '10px';
  div.style.color = 'gray';
  div.style.height = "10px"
  visualserContainer.appendChild(div);
}

const visualiserMaker = async (data) =>{
  for (let i = 0; i < 255; i++) {
    const bar = document.getElementById(`visualiser-bar-${i+1}`);
    if (bar) {
      bar.style.backgroundColor = 'red';
      bar.style.height = `${data[i]}px`;
    }
  }
};
const rippleMaker = (array) =>{

}

const createRipple = () => {
  for (let i = 1; i <= 10; i++) {
    let circle = document.createElement('div');
    circle.classList.add('circle');
    const baseSize = 100 + (i* 100);
    
    circle.style.width = `${baseSize}px`;
    circle.style.height = `${baseSize}px`;
    
    const opacity = (0.7 - (i * 0.08));
    circle.style.backgroundColor = `rgba(143, 80, 80, ${opacity})`;
    cirleContainer.appendChild(circle);
  }
};
const recordBtn = document.getElementById("record-btn");
let ctx = null;

recordBtn.addEventListener("click", async () => {
  try {
    ctx = new AudioContext();
    const stream = await accessMicrophone();
    if (!ctx) {
      throw new Error("Context is not defined");
    }
    const source = ctx.createMediaStreamSource(stream);
    const analyser = createAnalyser(ctx);
    analyser.fftSize = 1024;

    source.connect(analyser);

    const buffLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(buffLength);

    function visualize() {
      analyser.getByteFrequencyData(dataArray);
      createRipple();
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      
      // Apply to circles
      const circles = document.querySelectorAll(".circle");
      circles.forEach((circle, index) => {
        if (index === 0) return; 
        
        const scale = 1 + (average / 255) * 2; 
        const baseSize = 100 + (index * 90);
        const newSize = baseSize * scale;
        
        circle.style.width = `${newSize}px`;
        circle.style.height = `${newSize}px`;
        
        const opacity = (1 - (index * 0.06)) * (average / 255);
        circle.style.backgroundColor = `rgba(143, 80, 80, ${opacity})`;
      });
      console.log(dataArray)
      requestAnimationFrame(visualize);
    }
    visualize(dataArray, analyser);
  } catch (err) {
    if (err instanceof DOMException) {
      console.error(err);
      alert("YOU ARE NGMI");
      return;
    }
    console.error(err);
  }
});

/**
 * Access users' microphone
 * @returns {Promise<MediaStream>} mediaStream
 */
async function accessMicrophone() {
  return await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
}

/**
 * Returns an AnalyserNode
 * @param {AudioContext} ctx
 * @returns {AnalyserNode} analyserNode
 */
function createAnalyser(ctx) {
  return ctx.createAnalyser();
}
