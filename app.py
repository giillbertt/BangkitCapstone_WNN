from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import onnxruntime as ort
import numpy as np
from PIL import Image
from io import BytesIO
from google.cloud import storage
import os

app = FastAPI()

from fastapi.middleware.cors import CORSMiddleware

# CORS setup to allow frontend to make requests to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust to your frontend URL if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set Google Cloud credentials
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/app/worknonetwork-project-e96dd49d9a07.json"

# Google Cloud Storage configuration
BUCKET_NAME = "wnn-bucket"
BLOB_NAME = "model-in-prod/WNN_Model.onnx"

def load_model_from_bucket(bucket_name: str, blob_name: str):
    """
    Loads an ONNX model directly from a Google Cloud Storage bucket.
    """
    try:
        # Initialize GCS client and download model as bytes
        client = storage.Client()
        bucket = client.get_bucket(bucket_name)
        blob = bucket.blob(blob_name)
        model_data = blob.download_as_bytes()
        print("Model successfully loaded from GCS")
        
        # Load model into ONNX Runtime from bytes
        session = ort.InferenceSession(model_data)
        return session
    except Exception as e:
        raise RuntimeError(f"Failed to load model from GCS: {e}")

# Load the model directly from GCS
try:
    session = load_model_from_bucket(BUCKET_NAME, BLOB_NAME)
except Exception as e:
    raise RuntimeError(f"Failed to initialize ONNX model session: {e}")

# Preprocessing function
def preprocess_image(image):
    """
    Preprocesses the image to match the model input requirements.
    """
    # Resize and normalize image for classification
    image = image.resize((224, 224))  # Resize according to model's expected input size
    image = np.array(image).astype(np.float32) / 255.0  # Normalize the image
    
    # Rearrange the image to match the input format [Batch, Height, Width, Channels]
    image = np.expand_dims(image, axis=0)
    
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    print(f"Received file content type: {file.content_type}")
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Read and preprocess the image
        image = Image.open(BytesIO(await file.read())).convert("RGB")
        input_data = preprocess_image(image)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")
    
    # Prepare the inputs for the ONNX model
    inputs = {session.get_inputs()[0].name: input_data}
    
    # Run the model inference
    prediction = session.run(None, inputs)
    
    # Assuming the model outputs class probabilities
    probabilities = prediction[0][0]  # Extract probabilities from output
    class_idx = np.argmax(probabilities)  # Get the index of the highest probability
    confidence = probabilities[class_idx]  # Confidence of the prediction

    # Convert the numpy float32 type to a native Python float
    confidence = float(confidence)

    # Map the class index to a label (You can adjust this based on your model's labels)
    labels = ['Compostable', 'Non-Recyclable', 'Recyclable']  # Example labels
    class_name = labels[class_idx]

    # Return prediction and confidence as JSON response
    return JSONResponse(content={"class": class_name, "confidence": confidence})
