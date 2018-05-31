// Store settings data
const settings = {};

const load = async ({ db }) => {
  const listSettings = db.select([
    'name',
    'type',
    'value',
  ])
    .from('settings');

  if (listSettings) {
    listSettings.forEach(({ type, value, name }) => {
      switch (type) {
        case 'NUMBER': settings[name] = parseInt(value, 10);
          break;
        case 'FLOAT': settings[name] = parseFloat(value);
          break;
        case 'STRING': settings[name] = String(value);
          break;
        case 'BOOLEAN': settings[name] = value === 'true' || value === '1';
          break;
        case 'OBJECT': settings[name] = JSON.parse(value);
          break;
        default: settings[name] = undefined;
          break;
      }
    });
  }
};

const get = key => settings[key] || null;

module.exports = {
  load,
  get,
};
