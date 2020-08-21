module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // Generate umd modules as jest understands it
        modules: 'umd',
      },
    ],
  ],
};
