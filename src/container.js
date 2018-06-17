function makeContainer() {
  const services = new Map();
  const singletons = new Map();

  return {
    register,
    singleton,
    get
  };

  function register(name, definition, dependencies) {
    services.set(name, { definition, dependencies });
  }

  function singleton(name, definition, dependencies) {
    services.set(name, { definition, dependencies, singleton: true });
  }

  function isClass(func) {
    return typeof func === 'function';
  }

  function getResolvedDependecies(service) {
    let serviceDependencies = [];
    if (service.dependencies) {
      serviceDependencies = service.dependencies.map(dependencie => {
        return get(dependencie);
      });
    }
    return serviceDependencies;
  }

  function createService(service) {
    return service.definition(...getResolvedDependecies(service));
  }

  function get(name) {
    const foundService = services.get(name);
    if (isClass(foundService.definition)) {
      if (foundService.singleton) {
        const singletonInstance = singletons.get(name);
        if (singletonInstance) {
          return singletonInstance;
        }
        const newSingletonInstance = createService(foundService);
        singletons.set(name, newSingletonInstance);
        return newSingletonInstance;
      }

      return createService(foundService);
    }
    return foundService.definition;
  }
}

module.exports = makeContainer;
