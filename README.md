# NFT Fetcher

This project is a JavaScript library for fetching NFT data from a SQLite database. It's adapted from the [Mixtape Network](https://github.com/mixtape-network). This library is intended to be used with the [nft-indexer](https://github.com/Zerobeings/nft-indexer) project.

## Quick Start Method

The quickest way to get started is to use the nextjs nft-fetcher-template repository.

```bash
git clone https://github.com/Zerobeings/nft-fetcher-template.git
cd nft-fetcher-template
yarn install
```

## Installation

```bash
npm install nft-fetcher
```
or
```bash
yarn add nft-fetcher
```

## Usage

### Next js example with React typescript and thirdweb react library
```javascript
import {
    useAddress,
    useContract,
    useChain,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/Contract.module.css";
import NFTCard from "../components/NFTCard/NFTCard";
import Container from "../components/Container/Container";
import getMixtapeNFTs from 'nft-fetcher';


export default function Contract() {
    const address = useAddress();
    const router = useRouter();
    const contractAddress = router.query.contract as string;
    const chain = useChain();
    const [NFTs, setNfts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [network, setNetwork] = useState<string>('ethereum');
    const [isProcessing, setIsProcessing] = useState<boolean>(true);

    
    useEffect(() => {
        (async () => {
            if (!isProcessing) {
                if (chain) {
                    setNetwork(chain['slug']);
                }
                const limit = 100; // Optional - the maximum number of NFTs to fetch.
                const start = 0; // Optional - the offset to start fetching from.
                const where = [] as any[]; // Optional - an array of column names to include in the result. If empty, all columns are included.
                const select = "*"; // Optional - an array of column names to include in the result. If empty, all columns are included.
                const dbURL = "" as string; // Optional - the URL of the SQLite database. If not provided, a default URL is used.
                if(contractAddress && network && chain) {
                    try {
                        console.log('Fetching NFTs...');
                        const nfts = await getMixtapeNFTs(contractAddress, network, 
                            {
                                limit: limit, 
                                start: start, 
                                where: where,
                                select: select,
                                dbURL: dbURL
                            }
                        );
                        console.log(nfts);
                        setNfts(nfts);
                        setLoading(false);
                    } catch (error) {
                        console.error('Error fetching NFT data:', error);
                        setLoading(false);
                    }
                }
            }
        })();
    }, [contractAddress, network, chain, isProcessing]);

    useEffect(() => {
        setInterval(() => {
            setIsProcessing(false);
        }, 5000); 
        }
    , []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="lg">
            <h1 className={styles.heading}>Connected to {chain ? chain.name : "an unsupported network"}</h1> 
            <div className={styles.grid}>
            {NFTs && chain &&
                NFTs.map((nft, i) => {
                    return <NFTCard nft={nft} key={i} network={network} contractAddress={contractAddress}></NFTCard>;
                })
            }
            </div>
        </Container>
    );
};

```
### React example with React typescript and thirdweb react library

NFTCard component
```javascript
import styles from './NFTCard.module.css';
import Image from 'next/image';
import { MediaRenderer } from "@thirdweb-dev/react";

interface Props {
  nft: any;
  network: string;
  contractAddress: string;
}

export default function NFTCard({ nft, network, contractAddress }: Props) {

  return (
    <div className={styles.container}>
      <div className={styles.item}>
      <h4 className={styles.heading}>{nft.name}</h4>
        {network === "ethereum" ?
        <a target="_blank" href={`https://opensea.io/assets/ethereum/${contractAddress}/${nft.index}`}>
          <MediaRenderer src={nft.image} alt="image" height="200px" width="200px" />
        </a>
        : network === "polygon" &&
        <a target="_blank" href={`https://opensea.io/assets/matic/${contractAddress}/${nft.index}`}>
          <MediaRenderer src={nft.image} alt="image" height="200px" width="200px"  />
        </a>
        }
       <table className={styles.table}>
    <tbody>
        {Object.entries(nft.attributes).map(([key, value], i) => {
            return (
                <tr key={i}>
                    <td>{key}</td>
                    <td>{String(value)}</td>
                </tr>
            );
        })}
    </tbody>
</table>

      </div>
    </div>
  );
}
```


## API

### `getMixtapeNFTs(contractAddress, limit, start, select, where, dbURL, network)`

Fetches NFT data from a SQLite database.

- `contractAddress`: The contract address of the NFTs.
- `limit`: The maximum number of NFTs to fetch.
- `start`: The offset to start fetching from.
- `select`: An array of column names to include in the result. If empty, all columns are included.
- `where`: An array of column names to include in the result. If empty, all columns are included.
- `dbURL`: The URL of the SQLite database. If not provided, a default URL is used.
- `network`: The network the NFTs are on.

Returns a promise that resolves to an array of NFTs.


## Next js configuration

Step 1: Update next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: "",
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
    };
    return config;
  }
};

module.exports = nextConfig;
```

Step 2: Create a `public` folder named `db` in the root of your project and add the `sql-wasm-595817d88d82727f463bc4b73e0a64cf.wasm` file to it. You can download the file from [here](https://github.com/Zerobeings/nft-indexer/tree/main/nextjs-db-file)

Step 3: Create an nft-fetcher.d.ts file in the root of your project and add the following code to it.
```javascript
declare module 'nft-fetcher';
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
