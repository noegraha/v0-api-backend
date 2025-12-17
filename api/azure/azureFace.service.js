import { FaceClient } from "@azure/cognitiveservices-face";
import { ApiKeyCredentials } from "@azure/ms-rest-js";

const credentials = new ApiKeyCredentials({
    inHeader: {
        "Ocp-Apim-Subscription-Key": process.env.AZURE_FACE_KEY
    }
});

const faceClient = new FaceClient(
    credentials,
    process.env.AZURE_FACE_ENDPOINT
);

export const detectFace = async (imageStreamFn) => {
    const result = await faceClient.face.detectWithStream(
        imageStreamFn,
        {
            returnFaceId: false,
            returnFaceLandmarks: false
        }
    );

    console.log("AZURE RAW RESPONSE:", result);
    return result;
};


