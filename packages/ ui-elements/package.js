Package.describe({
  name: 'ff:ui-elements',
  version: '0.0.1',
  summary: '',
  git: '',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.use(['ecmascript', 'stylus']);

  // api.mainModule('./dist/main.js', ['client']);
  api.mainModule('./elements/bundle.js', ['client']);

  Npm.depends({
    clipboard: '1.5.12',
    moment: '2.13.0',
    'moment-timezone': '0.5.4',
    'react-daterange-picker': '1.0.0',
    underscore: '1.8.3',
    'react-autosuggest': '9.0.0',
  });

  // fonts
  // api.addFiles('./styles/fonts.styl', ['client']);
  api.addAssets(
    [
      'assets/fonts/gotham-medium/gotham-medium-webfont.eot',
      'assets/fonts/gotham-medium/gotham-medium-webfont.svg',
      'assets/fonts/gotham-medium/gotham-medium-webfont.ttf',
      'assets/fonts/gotham-medium/gotham-medium-webfont.woff',
      'assets/fonts/gotham-medium/gotham-medium-webfont.woff2',
      'assets/fonts/whitney-medium/whitney-medium-webfont.eot',
      'assets/fonts/whitney-medium/whitney-medium-webfont.svg',
      'assets/fonts/whitney-medium/whitney-medium-webfont.ttf',
      'assets/fonts/whitney-medium/whitney-medium-webfont.woff',
      'assets/fonts/whitney-medium/whitney-medium-webfont.woff2',
      'assets/fonts/whitney-semibold/whitney-semibold-webfont.eot',
      'assets/fonts/whitney-semibold/whitney-semibold-webfont.svg',
      'assets/fonts/whitney-semibold/whitney-semibold-webfont.ttf',
      'assets/fonts/whitney-semibold/whitney-semibold-webfont.woff',
      'assets/fonts/whitney-semibold/whitney-semibold-webfont.woff2',
      'assets/fonts/sanfranciscodisplay-regular/sanfranciscodisplay-regular.eot',
      'assets/fonts/sanfranciscodisplay-regular/sanfranciscodisplay-regular.woff',
      'assets/fonts/sanfranciscodisplay-regular/sanfranciscodisplay-regular.ttf',
      'assets/fonts/sanfranciscodisplay-regular/sanfranciscodisplay-regular.svg',
      'assets/fonts/sanfranciscodisplay-medium/sanfranciscodisplay-medium.eot',
      'assets/fonts/sanfranciscodisplay-medium/sanfranciscodisplay-medium.woff',
      'assets/fonts/sanfranciscodisplay-medium/sanfranciscodisplay-medium.ttf',
      'assets/fonts/sanfranciscodisplay-medium/sanfranciscodisplay-medium.svg',
      'assets/fonts/sanfranciscodisplay-semibold/sanfranciscodisplay-semibold.eot',
      'assets/fonts/sanfranciscodisplay-semibold/sanfranciscodisplay-semibold.woff',
      'assets/fonts/sanfranciscodisplay-semibold/sanfranciscodisplay-semibold.ttf',
      'assets/fonts/sanfranciscodisplay-semibold/sanfranciscodisplay-semibold.svg',
    ],
    ['client'],
    { isAsset: true }
  );
});
