import _ from 'lodash';
import { Dispatch as dispatch } from 'meteor/meteorflux:meteorflux';

// ListingExportCSV mixin
export default {
  downloadCSV (data, header = {}) {
    const store = this.props.store;
    const googleCSV = store.popup.exportToGoogle;

    const uid = Math.random();
    const dateRange = store.getDateRange();
    const args = {
      startDate: store.timeframeToUTC(dateRange.startDate),
      endDate: store.timeframeToUTC(dateRange.endDate),
      excludedIds: store.excludedRows,
      header,
      uid,
    };

    if (store.checkedAll) {
      args.protoFilters = store.getFiltersQuery();
    } else {
      const orderedIds = _.chain(Object.keys(this.props.dataKeys))
        .sort()
        .reverse()
        .map((id) => id.slice(1))
        .value();
      const ids = store.getSelectedIds();
      const sortedIds = _.sortBy(ids, (item) => orderedIds.indexOf(item.toString()));
      args.ids = sortedIds;
      if (_.isEmpty(args.ids)) {
        return false;
      }
    }

    const interval = store
      .progressNotification(store.action, { description: 'Gathered' }, uid);

    dispatch('CLOSE_POPUP');

    if (googleCSV) {
      return store
        .call('exportGoogleReport', args)
        .then(({ url }) => {
          clearInterval(interval);

          dispatch('NOTIFICATION', {
            message: 'Exported successfully. Check your email for Google Spreadsheet link if page didn\'t open in new tab',
            kind: 'success',
          });

          window.open(url);
        })
        .catch(store.errorHandler)
        .then(() => clearInterval(interval));
    }

    return store
      .call('exportReport', args)
      .then((url) => {
        clearInterval(interval);

        const link = document.createElement('a');
        link.href = url;

        // following line is for testing purposes
        Meteor.urlWithCsvReportName = url;

        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(store.errorHandler)
      .then(() => clearInterval(interval));
  },
};
