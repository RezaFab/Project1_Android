instal package 
 npm install
cara generate icon & splash
1.generate icon & splash
 cordova-res android --skip-config --copy
 cordova-res android --skip-config --type=adaptive-icon --icon-foreground-source=resources/icon-foreground.png --copy
2.generate page
 ionic generate page nama

cara jalanin di browser untuk developmen
1.ng serve

cara build 
1.ng build
2.npx cap copy


error:
1.import androidx.core.content.FileProvider;
jalanin aja ini :
npm install jetifier
npx jetify
npx cap sync android
