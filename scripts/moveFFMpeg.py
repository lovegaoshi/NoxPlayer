import shutil
import sys

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--build', action='store_true', default=False)
    parser.add_argument('--prod', action='store_true', default=False)
    args = parser.parse_args()
    if args.prod:
        shutil.copy('node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.js',
                    'build/js/ffmpeg-core.js')
        shutil.copy('node_modules/@ffmpeg/core/dist/umd/ffmpeg-core.wasm',
                    'build/js/ffmpeg-core.wasm')
        sys.exit()
    if args.build:
        shutil.move('ffmpeg-core.js', 'build/js/ffmpeg-core.js')
        shutil.move('ffmpeg-core.wasm', 'build/js/ffmpeg-core.wasm')
    else:
        try:
            shutil.move('build/js/ffmpeg-core.js', 'ffmpeg-core.js')
            shutil.move('build/js/ffmpeg-core.wasm', 'ffmpeg-core.wasm')
        except:
            pass
