import React, { useEffect, useState } from 'react';
import { AnchorWallet, useWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, RpcResponseAndContext, AccountInfo, ParsedAccountData } from '@solana/web3.js';
import * as NFTs from '@primenums/solana-nft-tools';
import * as splToken from "@solana/spl-token";
import { sleep } from "../business/utils";

const pageSize = 10;
const cacheTtlMins = 1; // Will keep the mint tokens cached for 1 minute

const GalleryWithPagination = () => {

    let [indexes, setIndexes] = useState<Array<any>>([]);
    let [pageIndex, setPage] = useState(1);
    let [totalPage, setTotalPage] = useState(1);
    let [images, setImages] = useState<Array<{ name: string, image: string }>>([]);

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    useEffect(() => {

        (async () => {

            if (!publicKey) return;

            let parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: splToken.TOKEN_PROGRAM_ID });

            if (!parsedTokenAccounts) return;

            let total = 0;

            parsedTokenAccounts.value.forEach(
                (item) => item.account.data.parsed?.info?.tokenAmount?.uiAmount === 1 && (total++)
            );

            setTotalPage(total);

        })();

    }, [publicKey, connection]);

    useEffect(() => {

        let arr: Array<any> = [];

        let totalIndex = totalPage % pageSize === 0 ? (totalPage / pageSize) : (getNumberBeforeDecimal(totalPage / pageSize) + 1);

        for (let i = 0; i < totalIndex; i++) {
            arr.push(i + 1);
        }

        setIndexes(arr);

    }, [totalPage]);

    useEffect(() => {

        (async () => {

            if (!publicKey) return;

            setImages([]);

            let nfts: Array<any> = await NFTs.getNFTsByOwner(connection, publicKey.toBase58(), pageIndex, pageSize, cacheTtlMins);

            if (!nfts || !nfts.length) return;

            nfts.forEach((item) => setImages(oldArray => [
                ...oldArray,
                {
                    name: item.name,
                    image: item.image
                }
            ]));

        })();

    }, [publicKey, connection, pageIndex]);

    return (
        <div>
            <div className="gallery">
                {images.map((item, index) => (
                    <div key={index}>
                        <img src={item.image} alt="nft" />
                        <h2>{item.name}</h2>
                    </div>
                ))}
            </div>
            <div>
                {indexes.map((item) => <span key={item} className="index" onClick={() => { setPage(item) }}>{item}</span>)}
            </div>
        </div >
    );
};

function getNumberBeforeDecimal(num: number) {
    return parseInt(num.toString().split(".")[0]);
}

export default GalleryWithPagination;