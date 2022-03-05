<template>
  <div>
    <video autoplay muted playsInline v-bind="camera" id="cam" />
    <canvas id="c" />
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import detectFromVideoFrame from "./utils/detectFromVideoFrame";
import * as tflite from "@tensorflow/tfjs-tflite";
tflite.setWasmPath(
  "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-tflite@0.0.1-alpha.8/dist/"
);
// import * as tf from "@tensorflow/tfjs-core";
// tf.setBackend("cpu");
// import { loadGraphModel } from "@tensorflow/tfjs-converter";
// import cocoSsd from "@tensorflow-models/coco-ssd";
// import showDetection from "./utils/showDetection";

export default {
  name: "App",
  setup() {
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
        const cam = document.getElementById("cam");

        // TODO: load pre-trained models
        // const loadModel = await tflite.loadTFLiteModel('../converted_tflite/model_unquant.tflite')
        // const loadModel = await cocoSsd.load();
        // const loadModel = await loadGraphModel("../model_web/model.json");
        const loadModel = await tflite.ObjectDetector.create(
          "../converted_tflite/model_unquant.tflite"
        );
        // tflite.ObjectDetector.create("../converted_tflite/model_unquant.tflite")
        //   .then((loadModel) => {
        //     console.log("model loaded!");
        //     console.log(loadModel);
        //     detectFromVideoFrame(loadModel, cam);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });

        // panggil fungsi detectFromVideoFrame
        detectFromVideoFrame(loadModel, cam);
      } catch (e) {
        console.error(e);
      }
    };

    // detectFromVideoFrame

    // showDetection

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
</style>
