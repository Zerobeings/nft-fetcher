// File: index.d.ts
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
    imageHash: string;
    edition: number;
    custom_fields: Record<string, any>;
    file_url: string;
    file: string;
    license: string;
    license_url: string;
    attributes: Record<string, any>;
  }

  export interface GetMixtapeNFTsOptions {
    limit?: number; // Optional with default value
    start?: number; // Optional with default value
    select?: string[]; // Optional with default value
    where?: string[]; // Optional with default value
    dbURL?: string; // Optional with default value
  }
  
  export function getMixtapeNFTs(
    contractAddress: string,
    network: string,
    options?: GetMixtapeNFTsOptions
  ): Promise<mixtapeNFT[]>;