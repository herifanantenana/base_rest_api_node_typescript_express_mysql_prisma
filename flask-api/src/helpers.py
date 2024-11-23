import os
import face_recognition

def encode_data_train(folder_path):
    encodings = []
    file_names = []

    images_path = [os.path.join(folder_path, filename) for filename in os.listdir(folder_path) if filename.endswith((".jpg",".png"))]

    for image_path in images_path:
        img = face_recognition.load_image_file(image_path)
        face_encodings = face_recognition.face_encodings(img)

        if len(face_encodings) > 0:
            img_encoding = face_encodings[0]
            encodings.append(img_encoding)
            file_names.append(os.path.basename(image_path))

    return encodings, file_names
