const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

const getCacheDirs = (constants) => path.normalize(`${constants.PUBLISH_DIR}/previews`);

module.exports = {
  async onPreBuild({constants, utils, inputs}) {
    const {PUBLISH_DIR} = constants;
    const cacheManifestFile = inputs.outputFile;
    const cacheManifestDir = path.resolve(PUBLISH_DIR, '../.cache/');
    const cacheManifestPath = path.join(cacheManifestDir, cacheManifestFile);
    const files = await utils.cache.list();

    const sliceBySlash = (item) => item.split('/');
    const fileSlug = files.map(sliceBySlash).map((items) => items[items.length - 2]);
    const jsonFile = JSON.stringify(fileSlug, null, 2);

    if (!fs.existsSync(cacheManifestDir)) {
      console.log(`${cacheManifestDir} isn't there so let's make one.`);
      await fsp.mkdir(cacheManifestDir);
    }

    if (files.length) {
      await fsp.writeFile(cacheManifestPath, jsonFile, 'utf-8');
      console.log(`Cache manifest saved to ${cacheManifestPath}`);
      console.log(`Cache file count: ${files.length}`);
    } else {
      console.log('There is no cache available for now.');
    }
  },
  async onPostBuild({constants, utils}) {
    const cacheDir = getCacheDirs(constants);
    if (await utils.cache.save(`${cacheDir}`)) {
      console.log(`Stored the ${cacheDir} to speed up future builds.`);
    } else {
      console.log('Nothing found.');
    }
  },
};
