from fastapi import FastAPI, File , UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

T_MODEL = tf.keras.models.load_model("../models/2.keras")
P_MODEL = tf.keras.models.load_model("../models/1.keras")
Pe_MODEL = tf.keras.models.load_model("../models/3.keras")


P_CLASS_NAMES = ["EarlyBlight" , "Late Blight" , "Healthy" ]
Pe_CLASS_NAMES = ["Bacterial Spot","Healthy"]
T_CLASS_NAMES = ['Bacterial Spot',
 'Early Blight',
 'Late Blight',
 'Leaf Mold',
 'Septoria Leaf Spot',
 'Spider Mites Two Spotted Spider Mite',
 'Target Spot',
 'YellowLeaf Curl_Virus',
 'Mosaic Virus',
 'Healthy']


@app.get("/ping")

async def ping():
    return "hello you"


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict/2")

async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image,0)
    prediction = T_MODEL.predict(image_batch)
    predicted_class = T_CLASS_NAMES[np.argmax(prediction[0])]
    confidence = np.max(prediction[0])

    return{
        'class' : predicted_class,
        'confidence': float(confidence)
    }

@app.post("/predict/1")

async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image,0)
    prediction = P_MODEL.predict(image_batch)
    predicted_class = P_CLASS_NAMES[np.argmax(prediction[0])]
    confidence = np.max(prediction[0])

    return{
        'class' : predicted_class,
        'confidence': float(confidence)
    }

@app.post("/predict/3")

async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image,0)
    prediction = Pe_MODEL.predict(image_batch)
    predicted_class = Pe_CLASS_NAMES[np.argmax(prediction[0])]
    confidence = np.max(prediction[0])

    return{
        'class' : predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":

    uvicorn.run(app,host="localhost", port=8000)