import assert from "assert";
import { Films } from '../imports/api/db/filmsdb';
import expect from 'expect';
import '../imports/tests/main.test';

describe("tvShows", function () {
  it("package.json has correct name", async function s() {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "tvshows");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});