import React, { useEffect, useState } from 'react';
import { AnchorWallet, useWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, RpcResponseAndContext, AccountInfo, ParsedAccountData } from '@solana/web3.js';
import * as NFTs from '@primenums/solana-nft-tools';
import * as splToken from "@solana/spl-token";
import { sleep } from "../business/utils";

const Gallery = () => {

    let [images, setImages] = useState<Array<{ name: string, image: string }>>([]);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {

        (async () => {

            if (!publicKey) return;

            let parsedTokenAccounts: RpcResponseAndContext<
                Array<{
                    pubkey: PublicKey;
                    account: AccountInfo<ParsedAccountData>;
                }>
            >;


            parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: splToken.TOKEN_PROGRAM_ID });

            if (!parsedTokenAccounts) return;

            let tokens: Array<{ mint: string, amount: number, info: any }>

            tokens = parsedTokenAccounts.value.map((item) => ({
                mint: item.account.data.parsed?.info?.mint,
                amount: item.account.data.parsed?.info?.tokenAmount?.uiAmount,
                info: item.account.data
            }));

            tokens = tokens.filter(item => item.amount === 1);

            let index = 0;
            while (index < tokens.length) {

                try {

                    let myNFT = await NFTs.getNFTByMintAddress(connection, tokens[index].mint);
                    setImages(oldArray => [
                        ...oldArray,
                        {
                            name: myNFT.name,
                            image: myNFT.image
                        }
                    ]);
                    console.log('myNFT', myNFT);

                }
                catch (error) {
                    console.log({ error });
                    await sleep(1000);
                }

                index++;

            }

        })();

    }, [publicKey, connection]);

    return (
        <div className="gallery">
            {images.map((item, index) => (
                <div key={index}>
                    <img src={item.image} alt="nft" />
                    <h2>{item.name}</h2>
                </div>
            ))}
        </div>
    );
};

export default Gallery;