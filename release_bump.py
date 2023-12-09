import logging
import re
from enum import Enum
import subprocess
from pathlib import Path


def fix_content(path: str, transform) -> None:
    content = []
    with open(Path(path), encoding='utf8') as f:
        for i in f:
            content.append(transform(i))

    with open(Path(path), 'w', encoding='utf8') as f:
        for line in content:
            f.write(line)


def get_version():
    with open(Path('./public/manifest.json'), encoding='utf8') as f:
        for line in f:
            find_version = re.search(r'(\d+\.\d+\.\d+.\d+)', line)
            if (find_version):
                return find_version.group(0)[:-2]


class VersionUpdate(Enum):
    MAJOR = 1
    MINOR = 2
    PATCH = 3


VersionUpdateDict = {
    1: VersionUpdate.MAJOR,
    2: VersionUpdate.MINOR,
    3: VersionUpdate.PATCH
}


def autoincrease_version(version=get_version(), inc=VersionUpdate.PATCH):
    rematch = re.compile(r'(\d+)\.(\d+)\.(\d+)').match(version)
    logging.debug(f'increase version release from {version}')
    major = int(rematch.group(1))
    minor = int(rematch.group(2))
    patch = int(rematch.group(3))
    if inc == VersionUpdate.MAJOR:
        major += 1
        minor = 0
        patch = 0
    elif inc == VersionUpdate.MINOR:
        minor += 1
        patch = 0
    elif inc == VersionUpdate.PATCH:
        patch += 1
    return f'{major}.{minor}.{patch}'


if __name__ == '__main__':
    import argparse
    logging.basicConfig(level=logging.DEBUG)
    parser = argparse.ArgumentParser(description="ina music segment")
    parser.add_argument("--version", type=str,
                        help="file path or weblink", default=get_version())
    parser.add_argument("--inc", type=int,
                        help="file path or weblink", default=3)
    args = parser.parse_args()
    version = get_version()
    new_version = autoincrease_version(
        version=version, inc=VersionUpdateDict[args.inc])
    fix_content(Path('./public/manifest.json'), lambda line: line.replace(
        version, new_version
    ))
    subprocess.call(['git', 'commit', '-am', f'release: {new_version}'])
    subprocess.call(['git', 'tag', f'v{new_version}'])
    subprocess.call(['git', 'push', 'origin', 'nox-player', '--tags'])
