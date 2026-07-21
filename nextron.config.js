export const config = {
  webpack: (config, { isServer }) => {
    // Verhindert, dass Webpack __dirname/__filename verschluckt oder kaputt parst
    config.node = {
      ...config.node,
      __dirname: false,
      __filename: false,
    };
    return config;
  },
};
