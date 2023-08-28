<template>
<div class="relative z-10">
	<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition opacity"></div>
	<div class="fixed inset-0 z-10 overflow-y-auto mt-6">
		<div class="flex min-h-full items-end justify-center p-4 items-center py-2">
			<div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 mt-10 max-w-4xl">
				<div class="bg-white px-4 pt-5 pb-4 p-6">
					<div class="flex items-center flex-col">
						<h3 class="text-2xl font-medium leading-6 text-gray-900 mb-4">Crop Image</h3>
						<div class="mb-3 w-full">
							<label class="block uppercase tracking-wide text-gray-700 text-xs mb-2">Select Image</label>
							<input class="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-400 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" ref="fileInput" @change="getUploadedImage" accept="image/jpeg, image/png" type="file">
						</div>
						<div class="flex justify-center max-w-3xl w-full">
							<Cropper ref="cropper" :src="uploadedImage" :min-height="1200" :min-width="700" :max-height="1200" :max-width="700" />
						</div>
						<div class="pb-3 flex justify-end mt-4">
							<button v-if="uploadedImage" type="button" @click="crop" class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-white text-base font-medium shadow-sm hover:bg-blue-500 ml-3 text-sm focus:ring-2">Crop Image</button>
							<button @click="$emit('showModal', false)" type="button" class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-white text-base font-medium shadow-sm hover:bg-red-500 ml-3 text-sm focus:ring-2">Cancel</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	
</div>
<div class="flex display-items-center">
<img v-if="croppedImageData.imageUrl" :src="croppedImageData.imageUrl" />
</div>


</template>

<script setup lang="ts">
import {  ref } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const emit = defineEmits(['croppedImageData', 'showModal']);

const fileInput = ref<HTMLInputElement | null>(null);
const cropper = ref<typeof Cropper | null>(null);
const uploadedImage = ref<string | null>(null);
const showModal = ref(false);
const croppedImageData = ref<{
  file: File | null;
  imageUrl: string | null;
  height: number | null;
  width: number | null;
  left: number | null;
  top: number | null;
}>({
  file: null,
  imageUrl: null,
  height: null,
  width: null,
  left: null,
  top: null,
});

const getUploadedImage = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    uploadedImage.value = URL.createObjectURL(file);
   
  }
};

const crop = async () => {
  if (fileInput.value && cropper.value) {
    const { coordinates, canvas } = cropper.value.getResult();
    if(fileInput.value.files){
      croppedImageData.value.file = fileInput.value.files?.[0] 
    }
  
    croppedImageData.value.imageUrl = canvas.toDataURL();
    croppedImageData.value.height = coordinates.height;
    croppedImageData.value.width = coordinates.width;
    croppedImageData.value.left = coordinates.left;
    croppedImageData.value.top = coordinates.top;


    emit('croppedImageData', croppedImageData.value);
    emit('showModal', false);
  }
};
</script>
