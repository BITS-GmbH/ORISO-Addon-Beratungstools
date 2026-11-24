"""Builds server/fonts/BeratungstoolsSans-*.ttf: Noto Sans (Latin, Greek, Cyrillic) merged with
Noto Sans Ethiopic, both OFL, so pdfkit can render every ORISO language with one font.

    python3 tooling/fonts/merge.py NotoSans-Regular.ttf NotoSansEthiopic-Regular.ttf out.ttf Regular

Use the unhinted TTFs from https://notofonts.github.io (latin-greek-cyrillic and ethiopic).
"""

import sys

from fontTools.merge import Merger, Options
from fontTools.ttLib import TTFont

FAMILY = 'Beratungstools Sans'


def main(latin_path: str, ethiopic_path: str, out: str, style: str) -> None:
    latin, ethiopic = TTFont(latin_path), TTFont(ethiopic_path)
    # The merger needs the same tables in both fonts; vertical metrics and STAT are not used by PDFs.
    for font in (latin, ethiopic):
        for tag in ('vhea', 'vmtx', 'STAT'):
            if tag in font:
                del font[tag]
    latin.save(out + '.latin.tmp')
    ethiopic.save(out + '.ethiopic.tmp')
    merged = Merger(Options()).merge([out + '.latin.tmp', out + '.ethiopic.tmp'])
    postscript = f'{FAMILY.replace(" ", "")}-{style}'
    names = {1: FAMILY, 16: FAMILY, 4: f'{FAMILY} {style}', 6: postscript, 3: f'{postscript};Noto Sans + Noto Sans Ethiopic'}
    for record in merged['name'].names:
        if record.nameID in names:
            record.string = names[record.nameID]
    merged.save(out)


if __name__ == '__main__':
    main(*sys.argv[1:5])
