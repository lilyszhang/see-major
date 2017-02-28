import nussl

def separate(audio):
    song = nussl.AudioSignal(audio)
    songRepet = nussl.Repet(song)
    songRepet.run()
    bg, fg = songRepet.make_audio_signals()
    bg.write_audio_to_file('testbg.wav')
    fg.write_audio_to_file('testfg.wav')
