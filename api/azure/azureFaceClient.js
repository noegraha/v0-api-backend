import * as msRest from "@azure/ms-rest-js";
import Face from "@azure/cognitiveservices-face";

const credentials = new msRest.ApiKeyCredentials({
    inHeader: { "Ocp-Apim-Subscription-Key": process.env.AZURE_FACE_KEY }
});

export const faceClient = new Face(
    credentials,
    process.env.AZURE_FACE_ENDPOINT
);
