import _ from 'lodash';

// create link between filter objects and category objects
export function connectGroupItems (args) {
  const { config, group } = args;

  // static groups have static filters, we don't need to link anything
  if (!group.dynamic || _.isEmpty(config.filters)) {
    return group;
  }

  const { filters, hiddenFilters } = config;

  let { items } = group;
  // don't filter items if there are no hidden filters
  if (!_.isEmpty(hiddenFilters) && !group.shouldShowHiddenFilters) {
    items = items.filter((id) => !hiddenFilters[id]);
  }

  return {
    ...group,
    items: items.filter((id) => filters[id])
      .map((id) => filters[id]),
  };
}
