import matplotlib.pyplot as plt
matplotlib.use('Agg')
import nussl, os, requests
from flask import Flask, render_template, request
from werkzeug.utils import secure_filename

allowedExtensions = set(['wav'])

app = Flask(__name__)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowedExtensions

@app.route('/', methods = ['GET', 'POST'])
def uploading_file():
   if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit a empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(filename)
            return separate(str(filename)) #redirect(url_for('uploaded_file', filename=filename))
        else:
            return 'Unable to Upload File'
   return render_template('upload.html')

if __name__ == '__main__':
   app.run(debug = True)

def separate(audio):
    '''Performs REPET on .wav file and creates three .wav files in path directory'''
    song = nussl.AudioSignal(audio)
    songRepet = nussl.Repet(song)
    songRepet.run()
    bg, fg = songRepet.make_audio_signals()
    bg.write_audio_to_file('bg.wav')
    fg.write_audio_to_file('fg.wav')
    song.write_audio_to_file('song.wav')
    return render_template('index.html')
