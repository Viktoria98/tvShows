import { CharacterMetadata, ContentBlock, ContentState, genKey } from 'draft-js';
import { List, Map, OrderedSet } from 'immutable';

const contentStateForEntities = ContentState.createFromBlockArray([]);

const convertToBlocks = (commonUrl, thumbUrl) => {
  // https://f001.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=4_z1ff50eebe20dc3e15cc80c1d_f1037856663b96ff3_d20170829_m115416_c001_v0001091_t0042

  const block = new ContentBlock({
    key: genKey(), // Generate unic key for this block
    text: ' ', // Text that will be rednered
    type: 'image', // Block type
    // characterList: List(), // Charasters info
    characterList: List([
      CharacterMetadata.create({
        style: OrderedSet(),
        entity: null,
      }),
    ]), // Charasters info
    depth: 0, // Only for list items and headers
    data: Map({
      commonUrl,
      thumbUrl,
    }), // Additional custom information
  });

  const emptyBlock = new ContentBlock({
    key: genKey(), // Generate unic key for this block
    text: '', // Text that will be rednered
    type: 'space', // Block type
    // characterList: List(), // Charasters info
    characterList: List(), // Charasters info
    depth: 0, // Only for list items and headers
    data: Map(), // Additional custom information
  });

  return ContentState.createFromBlockArray(
    [block, emptyBlock],
    contentStateForEntities.getEntityMap()
  );
};

export default {
  convertToBlocks,
};
