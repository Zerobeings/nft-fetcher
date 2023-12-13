///////////////////////////////////////////////////////////////////////////////////////////
// File: App.js                                                                        //
// adapted from skogards mixtape-network https://github.com/mixtape-network/moonbirdbase //
//                                                                                       //
///////////////////////////////////////////////////////////////////////////////////////////
const initSqlJs = require('sql.js');
const console = require('console-browserify');
const axios = require('axios');
//import sqlWasm from "!!file-loader?name=sql-wasm-[contenthash].wasm!sql.js/dist/sql-wasm.wasm"; // only required for initial build to get wasm file
const path = require('path');

async function fetchDatabase(repoUrl, databaseFileName) {
  try {
    const response = await axios.get(`${repoUrl}${databaseFileName}`, {
      responseType: 'arraybuffer',
      timeout: 300000, // 5 minutes
      headers: {
        'x-Requested-With': 'XMLHttpRequest',
      },
    });

    const buffer = response.data;
    const SQL = await initSqlJs({
      locateFile: () => "db/sql-wasm-595817d88d82727f463bc4b73e0a64cf.wasm"
    });
    const db = new SQL.Database(new Uint8Array(buffer));
    return db;
  } catch (error) {
    throw new Error(`Error fetching database: ${error.message}`);
  }
}

async function queryDatabase(db, sqlQuery, queryParams) {
  const results = db.exec(sqlQuery);

  if (results.length > 0) {
    const rows = results[0].values;
    const columns = results[0].columns;

    return rows.map((row) => {
      const nft = { attributes: {} };
      columns.forEach((col, index) => {
        if (
          [
            'id',
            'index',
            'name',
            'description',
            'image',
            'blockHash',
            'blockNumber',
            'self',
            'transactionHash',
            'uri',
            'apple',
            'android',
            'centerpoint',
            'contentstring',
            'twitter',
            'instagram',
            'animation_url',
            'external_url',
            'mimeType',
            'youtube_url',
            'background_color',
          ].includes(col)
        ) {
          nft[col] = row[index];
        } else {
          nft.attributes[col] = row[index];
        }
      });
      return nft;
    });
  }
  return [];
}

async function getMixtapeNFTs(contractAddress, limit, start, select, where, dbURL, network) {
  if (Array.isArray(select) && select.length > 0) {
    select = select.join(', ');
  }
  let sqlQuery = `SELECT ${select} FROM metadata`;
  if (Array.isArray(where) && where.length > 0) {
    sqlQuery += ` WHERE ${where.join(' AND ')}`;
  }
  if (limit > 0 && limit !== undefined) {
    sqlQuery += ` LIMIT ${limit}`;
  } else {
    sqlQuery += ` LIMIT 100`;
  }
  if (start > 0 && start !== undefined) {
    sqlQuery += ` OFFSET ${start}`;
  } else {
    sqlQuery += ` OFFSET 0`;
  }
  const repoUrl = dbURL || `https://cors.locatia.app/https://github.com/Zerobeings/nft-indexer/raw/main/${network}/${contractAddress}/`;
  try {
    const db = await fetchDatabase(repoUrl, 'mixtape.db');
    return queryDatabase(db, sqlQuery);
  } catch (error) {
    console.error('Error:', error.message);
    return [];
  }
}

module.exports = getMixtapeNFTs;
