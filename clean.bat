cd 'E:\Dev\react\PollApp9-taimurs-branch'
Remove-Item -Path node_modules -Recurse -Force
Remove-Item -Path package-lock.json -Force

npm install
npm cache verify

npm cache clean --force


cd android
./gradlew clean
cd ..

react-native run-android --reset-cache
 
npx react-native start --reset-cache

depcheck
npm-check -u
npx react-native doctor

npx react-native run-android --reset-cache
choco install watchman  --force

#verify the linking
npx react-native config


npm uninstall @babel/plugin-proposal-optional-catch-binding @babel/plugin-proposal-numeric-separator @babel/plugin-proposal-class-properties @babel/plugin-proposal-nullish-coalescing-operator @babel/plugin-proposal-optional-chaining @babel/plugin-proposal-object-rest-spread @babel/plugin-proposal-async-generator-functions


npm install @babel/plugin-transform-optional-catch-binding @babel/plugin-transform-numeric-separator @babel/plugin-transform-class-properties @babel/plugin-transform-nullish-coalescing-operator @babel/plugin-transform-optional-chaining @babel/plugin-transform-object-rest-spread @babel/plugin-transform-async-generator-functions --save-dev

