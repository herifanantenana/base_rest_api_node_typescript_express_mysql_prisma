from flask import jsonify
import face_recognition

def facialrecognitionController(image, encodings, file_names):
    face_locations = face_recognition.face_locations(image)
    face_encodings = face_recognition.face_encodings(image, face_locations)

    if len(face_encodings) > 0:
        matches = face_recognition.compare_faces(encodings, face_encodings[0])

        if True in matches:
            match_index = matches.index(True)
            recognizedFile = file_names[match_index]
            print("Individu reconnu avec succés")
            return jsonify({'message': 'Individu reconnu avec succés','file': recognizedFile}), 200
        
        return jsonify({'message': 'Aucun visage  dans l\'image'}), 404