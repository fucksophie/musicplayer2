# start via webos-emulator -vd ose-527 -s

# i really couldn't care to make old chromium versions work
# vitelegacy is really shitty with extrmeely old chrome (especially some that are on)
# like chrome 53 (2016), which don't support es6 and partially support es5

WEBOS=true npm run build
rm assets -r
mv ../dist/assets assets/
cp ../dist/index.html index.html

echo "the generated index.html has a couple issues"
echo "1. make sure that all <scripts> are relative imports (replace '/assets/' to 'assets/')"
echo "2. if you wish to add vorlon debugging, make sure to add it's <script>"

read

cp index.html songs.html
cp index.html settings.html

ares-package .
ares-install lv.onefourone.musicplayer2_1.0.0_all.ipk
ares-launch lv.onefourone.musicplayer2

rm songs.html
rm settings.html