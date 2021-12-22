import { WalletNotConnectedError, WalletPublicKeyError } from '@solana/wallet-adapter-base';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Transaction, LAMPORTS_PER_SOL, PublicKey, RpcResponseAndContext, SignatureResult } from '@solana/web3.js';
import React, { useCallback } from 'react';
import * as splToken from "@solana/spl-token";
import { RECEIVING_ADDRESS, TOKEN_MINT_ADDRESS } from "../business/constants";

const SendTokenButton = () => {

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const handleClickEvent = useCallback(async () => {

        if (!publicKey) throw new WalletNotConnectedError();
z
        let result = await connection.getTokenAccountsByOwner(
            publicKey,
            { mint: new PublicKey(TOKEN_MINT_ADDRESS) }
        );

        let source = result?.value[0]?.pubkey;

        if (!source) throw new WalletPublicKeyError();

        let transaction = new Transaction().add(
            splToken.Token.createTransferInstruction(
                splToken.TOKEN_PROGRAM_ID,
                source,
                new PublicKey(RECEIVING_ADDRESS),
                publicKey,
                [],
                LAMPORTS_PER_SOL
            )
        );

        let signature = await sendTransaction(transaction, connection);

        let confirmResult: RpcResponseAndContext<SignatureResult>;

        confirmResult = await connection.confirmTransaction(signature, 'confirmed');

        console.log('confirmResult', confirmResult);

    }, [publicKey, sendTransaction, connection]);

    return (
        <button onClick={handleClickEvent} disabled={!publicKey}>
            Buy now
        </button>
    );
};

export default SendTokenButton;