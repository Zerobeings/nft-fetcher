// File: getMixtapeNFTs.d.ts
export interface mixtapeNFT {
    id: number;
    index: number;
    name: string;
    description: string;
    image: string;
    blockHash: string;
    blockNumber: number;
    self: string;
    transactionHash: string;
    uri: string;
    apple: string;
    android: string;
    centerpoint: string;
    contentstring: string;
    twitter: string;
    instagram: string;
    animation_url: string;
    external_url: string;
    mimeType: string;
    youtube_url: string;
    background_color: string;
    attributes: Record<string, any>;
  }
  
  export function getMixtapeNFTs(
    contractAddress: string,
    limit: number,
    start: number,
    select: string[],
    where: string[],
    dbURL: string,
    network: string
  ): Promise<mixtapeNFT[]>;