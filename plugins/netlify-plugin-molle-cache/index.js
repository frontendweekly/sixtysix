const fs = require('fs');
const fsp = require('fs').promises;
const path = require('path');

module.exports = {
  async onPreBuild({constants, utils, inputs}) {
    const {PUBLISH_DIR} = constants;
    const cacheManifestFile = inputs.outputFile;
    const cacheManifestDir = path.resolve(PUBLISH_DIR, '../.cache/');
    const cacheManifestPath = path.join(cacheManifestDir, cacheManifestFile);
    const files = await utils.cache.list();

    const previews = (item) => item.includes('previews');
    const sliceBySlash = (item) => item.split('/');
    const fileSlug = files
      .filter(previews)
      .map(sliceBySlash)
      .map((items) => items[items.length - 2]);
    const jsonFile = JSON.stringify(fileSlug, null, 2);

    if (!fs.existsSync(cacheManifestDir)) {
      console.log(`${cacheManifestDir} isn't there so let's make one.`);
      await fsp.mkdir(cacheManifestDir);
    }
    console.log(`Cache file count: ${files.length}`);
    await fsp.writeFile(cacheManifestPath, jsonFile, 'utf-8');
    console.log(`Cache manifest saved to ${cacheManifestPath}`);
  },
  async onPostBuild({constants, utils}) {
    if (await utils.cache.save(`${constants.PUBLISH_DIR}`)) {
      console.log(`Stored the ${constants.PUBLISH_DIR} to speed up future builds.`);
    } else {
      console.log('Nothing found.');
    }
  },
};
