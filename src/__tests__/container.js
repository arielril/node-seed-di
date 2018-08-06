const makeContainer = require('../container.js');

describe('Container tests', () => {
  it('Should create a container and resolve a service', () => {
    const container = makeContainer();
    const testService = () => {
      const valor = 1;

      return {
        getValor
      };

      function getValor() {
        return valor;
      }
    };

    container.register('testeService', testService);
    const service = container.get('testeService');
    expect(service.getValor()).toBe(1);
  });

  it('Should create a container and resolve a new service with same name', () => {
    const container = makeContainer();
    const testService = () => {
      let valor = 1;

      return {
        getValor,
        setValor
      };

      function getValor() {
        return valor;
      }

      function setValor(param) {
        valor = param;
      }
    };
    container.register('testeService', testService);
    const service = container.get('testeService');
    service.setValor(5);
    expect(service.getValor()).toBe(5);

    const newService = container.get('testeService');
    expect(newService.getValor()).toBe(1);
  });

  it('Should a service dependency', () => {
    const container = makeContainer();
    const config = {
      chave: 'valor'
    };
    const testService = config => {
      return {
        getConfig
      };

      function getConfig() {
        return config;
      }
    };

    container.register('config', config);
    container.register('testService', testService, ['config']);
    const service = container.get('testService');
    expect(service.getConfig().chave).toBe('valor');
  });

  it('Should resolve a singleton service', () => {
    const container = makeContainer();
    const testService = () => {
      return {
        valor: 1
      };
    };

    container.singleton('testService', testService);

    const service = container.get('testService');
    expect(service.valor).toBe(1);
    service.valor = 2;
    const newService = container.get('testService');
    expect(newService.valor).toBe(2);
  });

  it('Should resolve a service with singleton dependency', () => {
    const container = makeContainer();
    const config = () => {
      return {
        porta: 3000
      };
    };
    const testService = config => {
      return {
        config
      };
    };

    container.singleton('config', config);
    container.register('testService', testService, ['config']);

    const service = container.get('testService');
    service.config.porta = 3001;

    const newService = container.get('testService');
    expect(newService.config.porta).toBe(3001);
  });
});
