module.exports = {
  hooks: {
    readPackage(pkg) {
      // Allow build scripts for essential packages
      if (pkg.name === 'esbuild' || pkg.name === 'sharp') {
        pkg.scripts = pkg.scripts || {};
      }
      return pkg;
    }
  }
};

