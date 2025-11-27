const { withGradleProperties } = require('@expo/config-plugins');

const withJetifier = (config) => {
  return withGradleProperties(config, (config) => {
    // Remove existing property if present to avoid duplicates
    config.modResults = config.modResults.filter(
      (item) => item.key !== 'android.enableJetifier'
    );
    
    config.modResults.push({
      type: 'property',
      key: 'android.enableJetifier',
      value: 'true',
    });
    return config;
  });
};

module.exports = withJetifier;
