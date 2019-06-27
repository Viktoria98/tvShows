// eslint-disable-next-line import/no-unresolved
import { Meteor } from 'meteor/meteor';
import expect from 'expect';
import { Films } from '../api/db/filmsdb';
import { url } from '../startup/config';
import '../api/methods';

describe('url', () => {
  it('must be string', () => {
    expect(typeof url).toBe('string');
  });
});

function callAPI() {
  return new Promise((resolve) => {
    const res = Meteor.call('getData');
    return resolve(res);
  });
}

describe('get data from API', () => {
  describe('getData', function () {
    this.timeout(10000);
    it('data from API successfully fetched', (done) => {
      callAPI().then((result) => {
        expect(result.length).toBe(10);
      }).finally(done);
    });
  });
});

const films = {
  films: {
    title: 'Deadpool',
    year: 2016,
    ids: { tmdb: 111 },
  },
};

describe('films collection', () => {
  beforeEach(() => {
    Films.remove({});
  });

  it('films successfully added', () => {
    Films.insert(films.films);
    expect(Films.find().count()).toBe(1);
  });

  it('should add ', () => {
    Films.insert(films.films);
    Films.remove({});
    expect(Films.find().count()).toBe(0);
  });
});
