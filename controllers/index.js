const initControllers = () => {
  const controllers = {};
  const allControllers = FileHandler.readModules("controllers", {});
  allControllers.forEach((Controller) => {
    const controllerName = Controller.name;
    controllers[controllerName] = new Controller(controllerName);
  });
  return allControllers;
};

export default initControllers;
