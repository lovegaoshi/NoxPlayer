import shutil

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--build', action='store_true', default=False)
    args = parser.parse_args()
    if args.build:
        shutil.move('ffmpeg-core.js', 'build/js/ffmpeg-core.js')
        shutil.move('ffmpeg-core.wasm', 'build/js/ffmpeg-core.wasm')
        shutil.move('ffmpeg-core.worker.js', 'build/js/ffmpeg-core.worker.js')
    else:
        try:
            shutil.move('build/js/ffmpeg-core.js', 'ffmpeg-core.js')
            shutil.move('build/js/ffmpeg-core.wasm', 'ffmpeg-core.wasm')
            shutil.move('build/js/ffmpeg-core.worker.js', 'ffmpeg-core.worker.js')
        except:
            pass