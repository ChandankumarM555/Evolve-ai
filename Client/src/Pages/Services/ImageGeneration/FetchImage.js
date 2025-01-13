import axios from "axios";
export const fetchImages = async(
    promptCall,
    seedValue,
    dropDownValue,
    radioValue
) => {
    const options = {
        method: "POST",
        url: "https://api.segmind.com/v1/sdxl1.0-txt2img",
        headers: {
            "x-api-key": "SG_e223471534b9e8bd",
            "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
        data: {
            prompt: promptCall,
            seed: seedValue,
            scheduler: dropDownValue,
            num_inference_steps: radioValue,
            negative_prompt: "NONE",
            samples: "1",
            guidance_scale: "7.5",
            strength: "1",
            shape: 512,
        },
    };

    try {
        const response = await axios.request(options);

        const imageBlob = new Blob([response.data], { type: "image/jpeg" });
        console.log("The response ", response)
        console.log("The image blob is ", imageBlob)
        return imageBlob;
    } catch (error) {
        console.error("Error while fecthing Gen AI model API", error);
    }
};