<script setup lang="ts">
import * as tf from '@tensorflow/tfjs'
import * as tmImage from '@teachablemachine/image'

const modelUrl = './meal-recognizer'

const labels = ref<string[]>([])
const model = shallowRef<tmImage.CustomMobileNet>()
const webcam = shallowRef<tmImage.Webcam>()
const maxPredictions = ref(0)

const webcamContainer = useTemplateRef('webcamContainer')
const webcamContainerSize = useElementSize(webcamContainer)

async function init() {
  model.value = await tmImage.load(`${modelUrl}/model.json`, `${modelUrl}/metadata.json`)
  maxPredictions.value = model.value.getTotalClasses()

  webcam.value = new tmImage.Webcam(webcamContainerSize.width.value, webcamContainerSize.height.value, false)
  await webcam.value.setup({ facingMode: 'environment' })
  await webcam.value.play()

  if (webcamContainer.value) {
    webcamContainer.value.appendChild(webcam.value.canvas)
  }

  labels.value = Array.from({ length: maxPredictions.value }, () => '')
}

async function loop() {
  webcam.value!.update()
  await predict()
  requestAnimationFrame(loop)
}

async function predict() {
  const prediction = await model.value!.predict(webcam.value!.canvas)
  labels.value = prediction
    .sort((p1, p2) => p2.probability - p1.probability)
    .map(p => `${p.className} (${Math.floor(p.probability * 100)}% de certitude)`)
}

onMounted(async () => {
  await tf.ready()
  await init()
  requestAnimationFrame(loop)

  watchEffect(() => {
    if (!webcam.value) return
    webcam.value.width = webcamContainerSize.width.value
    webcam.value.height = webcamContainerSize.height.value

    const canvas = webcam.value?.canvas
    canvas.width = webcamContainerSize.width.value
    canvas.height = webcamContainerSize.height.value
  })
})
</script>

<template>
  <ClientOnly>
    <div class="w-full h-dvh flex flex-col items-center justify-center gap-4 p-6 overflow-hidden bg-gradient-to-b from-cyan-900/20 to-blue-900/20">
      <h1 class="text-3xl font-bold font-poppins">Meal Recognizer</h1>
      <div ref="webcamContainer" class="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-2/5 aspect-square rounded-2xl bg-gray-700 overflow-hidden">
      </div>
      <div v-if="labels.length" class="text-lg bg-gray-700 px-3 py-2 rounded-lg flex flex-row items-center justify-center gap-2">
        <Icon name="heroicons:information-circle" />
        <p class="font-inter" v-if="labels[0].startsWith('not_food')">Aucun plat n'a été détecté</p>
        <p class="font-inter" v-else>Plat détecté : {{ labels[0] }}</p>
      </div>
    </div>
  </ClientOnly>
</template>
