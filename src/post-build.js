const path = require('path');
const fs = require('fs');
const util = require('util');

const args = process.argv.slice(2);
console.log(args);
let build_path=path.join(__dirname, '/../dist/');

if(args[0]){
  build_path=(args[0].split('=')[1]);
}

console.log('build_path: ', build_path);

// get application version from package.json
const appVersion = 'kfcv2'; //require('../package.json').version;
// promisify core API's
const readDir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
console.log('\nRunning post-build tasks');
// our version.json will be in the dist folder
const versionFilePath =  path.join(build_path + '/version.json'); 
let mainHash = '';
let mainBundleFile = '';

// read the dist folder files and find the one we're looking for
readDir(build_path)
  .then(files => {

    mainBundleFile = files.find(f => {

      if (f.includes("main")) {
        return f;
      }
    });

    let matchHash = Math.floor(Date.now() / 1000);
    mainHash = matchHash;
    console.log(Math.floor(Date.now() / 1000));
    console.log('Manin bundle file matchHash', matchHash);
    console.log(`Writing version and hash to ${versionFilePath}`);
    // write current version and hash into the version.json file
    const src = `{"version": "${appVersion}", "hash": "${matchHash}"}`;
    console.log('version file : ', src)
    return writeFile(versionFilePath, src);
  }).then(() => {
    // main bundle file not found, dev build?
    if (!mainBundleFile) {
      return;
    }
    console.log(`Replacing hash in the ${mainBundleFile}`);
    // replace hash placeholder in our main.js file so the code knows it's current hash
    const mainFilepath = path.join(build_path, mainBundleFile);
    return readFile(mainFilepath, 'utf8')
      .then(mainFileData => {
        const replacedFile = mainFileData.replace('{{POST_BUILD_ENTERS_HASH_HERE}}', mainHash);
        return writeFile(mainFilepath, replacedFile);
      });
  }).catch(err => {
    console.log('Error with post build:', err);
  });

  // Default Path
  // ng build --configuration=production && npm run post-build

  // build out put path mentioned
  // ng build --configuration=production --output-path='d:\kfcbuild' && npm run post-build buildpath='d:\kfcbuild'
