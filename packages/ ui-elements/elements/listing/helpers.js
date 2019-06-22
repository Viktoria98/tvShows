// make sure that listing won't drop render if props for cell component are not specified,
// but warn developer that he probably fucked up smth when configuring prepareRow/Header
export function findComponentProps(package, component, id) {
  const getWarningMessage = (message = 'prepared props') => {
    return `
      Couldn't find ${message} for cell component -- ${component}, in column -- ${id}. Be aware that without passed props component most likely won't work properly.
    `;
  };

  const componentProps = package[component];

  // make sure that dev passed props/config for component
  if (!componentProps) {
    console.warn(getWarningMessage());
    return {};
  }

  // if specified that component should have column specific props
  if (componentProps.multipleEntities) {
    if (!componentProps[id] && !componentProps.default) {
      console.warn(getWarningMessage('column specific props or default props'));
    }
    // find column specific props, or fallback to default props
    // all must be explicitly specified in prepareRow/Header
    return componentProps[id] || componentProps.default || {};
  }

  return componentProps;
}
