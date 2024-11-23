from flask import Flask, jsonify, request
import cv2 as cv
import numpy as np
from src.helpers import encode_data_train
from src.controller import facialrecognitionController

app = Flask(__name__)
FOLDER_PATH = '../public/profiles/'

@app.route("/")
def hello():
    return jsonify("Server running ✅"), 200

@app.route("/facial-recognition", methods=["POST"])
def recognize():
    if 'image' not in request.files: 
        return jsonify({'message' : 'Aucun fichier téléchargé'}), 200
    
    image = request.files['image']
    image_array = np.frombuffer(image.read(), dtype=np.uint8)
    new_image = cv.imdecode(image_array, cv.IMREAD_COLOR)
    encodings, file_names  = encode_data_train(FOLDER_PATH)
    facialrecognitionController(new_image, encodings, file_names)


    return jsonify()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
