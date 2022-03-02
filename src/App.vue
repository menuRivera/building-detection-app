<template>
  <div>
    <video autoplay muted playsInline v-bind="camera" id="cam" />
    <canvas id="c" />
  </div>
</template>

<script>
import * as tf from "@tensorflow/tfjs-core";
import { loadGraphModel } from "@tensorflow/tfjs-converter";
// import * as tflite from "@tensorflow/tfjs-tflite";
// import cocoSsd from "@tensorflow-models/coco-ssd";
import { reactive, onMounted } from "vue";

export default {
  name: "App",
  setup() {
    tf.setBackend("webgl");
    // semacam useRef
    const camera = reactive({ srcObject: null });

    const webcam = async () => {
      try {
        camera.srcObject = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: "user" }, //or environment
          // https://contest-server.cs.uchicago.edu/ref/JavaScript/developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints/facingMode.html
        });
        await camera.onloadedmetadata;
      } catch (e) {
        console.log(e);
      }
    };

    const load = async () => {
      try {
        console.log("Loading...");
        // load webcam
        await webcam();
        console.log("Webcam loaded!");

        // TODO: load pre-trained models
        // const loadModel = await tflite.loadTFLiteModel('../converted_tflite/model_unquant.tflite')
        // const loadModel = await cocoSsd.load();
        const loadModel = await loadGraphModel("../model_web/model.json");
        console.log("model loaded!");
        const cam = document.getElementById("cam");

        // panggil fungsi detectFromVideoFrame
        detectFromVideoFrame(loadModel, cam);
      } catch (e) {
        console.log(e);
      }
    };

    const detectFromVideoFrame = (model, video) => {
      console.log("detectFromVideoFram");
      // detect object dari video
      model.detect(video).then(
        (predictions) => {
          console.log("Predictions: ", predictions);
          showDetection(predictions); // show object detection

          requestAnimationFrame(() => {
            detectFromVideoFrame(model, video);
          });
        },
        (error) => {
          console.log(error);
        }
      );
    };

    // draw the detections bounding boxes, as well as the labels, and confidence score over the video
    const showDetection = (prediction) => {
      console.log("Show detection: ", prediction);
      const c = document.getElementById("c");
      const ctx = c.getContext("2d");
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      const font = "24px helvetica";
      ctx.font = font;
      ctx.textBaseline = "top";
      prediction.forEach((prediction) => {
        const x = prediction.bbox[0];
        const y = prediction.bbox[1];
        const width = prediction.bbox[2];
        const height = prediction.bbox[3];

        // Draw the bounding box.
        ctx.strokeStyle = "#2fff00";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // Draw the label background.
        ctx.fillStyle = "#2fff00";

        // ganti 'preson' jadi 'toilet'
        let predictionText = prediction.class;
        if (predictionText == "person") {
          predictionText = "toilet";
        }

        const textWidth = ctx.measureText(predictionText).width;
        const textHeight = parseInt(font, 10);

        // draw top left rectangle
        ctx.fillRect(x, y, textWidth + 10, textHeight + 10);

        // draw bottom left rectangle
        ctx.fillRect(
          x,
          y + height - textHeight,
          textWidth + 15,
          textHeight + 10
        );

        // Draw the text last to ensure it's on top.
        ctx.fillStyle = "#000000";
        ctx.fillText(predictionText, x, y);
        ctx.fillText(prediction.score.toFixed(2), x, y + height - textHeight);
      });
    };

    onMounted(() => {
      if (
        navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia
      ) {
        load();
      } else {
        alert("not supported");
      }
    });

    return {
      camera,
    };
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
video,
canvas {
  /* height: 100vh;
  width: 100vw; */
  /* flip the video */
  transform: scaleX(-1);
  position: fixed;
  height: 100%;
  width: 100%;
  object-fit: cover;
}
</style>
