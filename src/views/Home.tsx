import React, { useEffect, useState } from 'react';
import { AnchorWallet, useWallet, useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ActionButton } from '../components/ActionButton';
import SendTokenButton from '../components/SendTokenButton';
import Gallery from '../components/Gallery';
import GalleryWithPagination from '../components/GalleryWithPagination';
import { Connection, PublicKey, Transaction, LAMPORTS_PER_SOL, RpcResponseAndContext, AccountInfo, ParsedAccountData, Keypair } from '@solana/web3.js';
import * as splToken from "@solana/spl-token";
import { web3 } from "@project-serum/anchor";
import { RECEIVING_ADDRESS, TOKEN_MINT_ADDRESS } from "../business/constants";
// import { Account, programs } from '@metaplex/js';
import * as meta from '@metaplex/js';
import * as anchor from '@project-serum/anchor';
import * as NFTs from '@primenums/solana-nft-tools';
import { FetchNFTClient } from '@audius/fetch-nft'


// const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, auction: { Auction }, vault: { Vault } } = programs;

// const TOKEN_PROGRAM_ID = new PublicKey(
//     "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
// );

function Home() {

    const [remaining, setRemaining] = useState(0);
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const wallet = useAnchorWallet();

    useEffect(() => {

        (async () => {

            if (!publicKey) return;

            // var transaction = new Transaction().add(
            //     splToken.Token.createTransferInstruction(
            //         splToken.TOKEN_PROGRAM_ID,
            //         new PublicKey('GkMEW7gb12Ge8t22rKqjsTSKtKsxTpp7JnRXQN7Hqi6H'),
            //         new PublicKey('CkV4VDyvtwPudc8qJCUx5C6fDHTjPz261kWsEQ7aBef8'),
            //         publicKey,
            //         [],
            //         1
            //     )
            // );

            // sendTransaction(transaction, connection)
            //     .then((signature) => console.log("SIGNATURE", signature));


            // console.log('connection', connection);
            // console.log('publicKey', publicKey);

            let parsedTokenAccounts: RpcResponseAndContext<
                Array<{
                    pubkey: PublicKey;
                    account: AccountInfo<ParsedAccountData>;
                }>
            >;


            parsedTokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: new PublicKey('Gx8xpDqE71WhAU95iLjLThScfcxngV88Nq9ENo3tvPfb') });
            let tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, { mint: new PublicKey('Gx8xpDqE71WhAU95iLjLThScfcxngV88Nq9ENo3tvPfb') });
            // let tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, { programId: splToken.TOKEN_PROGRAM_ID });
            // console.log('parsedTokenAccounts', parsedTokenAccounts);
            // console.log('tokenAccounts', tokenAccounts.value[0].pubkey.toBase58());

            let tokens: Array<{ mint: string, amount: number, info: any }>
            if (parsedTokenAccounts) {

                tokens = parsedTokenAccounts.value.map((item) => ({
                    mint: item.account.data.parsed?.info?.mint,
                    amount: item.account.data.parsed?.info?.tokenAmount?.uiAmount,
                    info: item.account.data
                }))

                // console.log('tokens', tokens);

                setRemaining(tokens.find((item) => item.mint === TOKEN_MINT_ADDRESS)?.amount || 0);

                // // Solana Config
                // const solanaConfig = { rpcEndpoint: 'https://api.devnet.solana.com' };

                // // Initialize fetch client with configs
                // const fetchClient = new FetchNFTClient({ solanaConfig });

                // // Fetching all collectibles for the given wallets
                // fetchClient
                //     .getSolanaCollectibles([publicKey.toBase58()])
                //     .then(res => console.log('getCollectibles', res));
                // console.log(tokens.find((item) => item.mint === TOKEN_MINT_ADDRESS));

                // let myNFT = await NFTs.getNFTByMintAddress(connection, 'Gx8xpDqE71WhAU95iLjLThScfcxngV88Nq9ENo3tvPfb');
                // console.log('myNFT', myNFT);

                // console.log('metadata', meta.programs.metadata);
                // const ownedMetadata = await programs.metadata.Metadata.load(connection, publicKey);
                // console.log(ownedMetadata);

                // try {
                //     const ownedMetadata = await programs.metadata.Metadata.load(connection, 'DxCzft7TwuPkKz9w7WbCwMC4qbaEev3BmNKd8RrFeZLC');
                //     console.log('ownedMetadata', ownedMetadata);
                // } catch {
                //     console.log('Failed to fetch metadata');
                // }
                
            }

            // let acc = await connection.getParsedAccountInfo(new PublicKey(TOKEN_MINT_ADDRESS));

            // console.log('getParsedAccountInfo', acc);


            // // Format: await <AccountType>.load(connection, pubkey);
            // const account = await Account.load(connection, publicKey);
            // console.log('account', account);
            // // Metadata
            // const metadata = await Metadata.load(connection, publicKey);
            // console.log('metadata', metadata);
            // // Auction
            // const auction = await Auction.load(connection, publicKey);
            // console.log('auction', auction);
            // // Vault
            // const vault = await Vault.load(connection, publicKey);
            // console.log('vault', vault);
            // // Metaplex
            // const auctionManager = await AuctionManager.load(connection, publicKey);
            // console.log('auctionManager', auctionManager);
            // const store = await Store.load(connection, publicKey);
            // console.log('store', store);

            // let account = await connection.getParsedProgramAccounts(splToken.TOKEN_PROGRAM_ID);

            // console.log(account);
            // transfer('CkV4VDyvtwPudc8qJCUx5C6fDHTjPz261kWsEQ7aBef8', wallet, 'GkMEW7gb12Ge8t22rKqjsTSKtKsxTpp7JnRXQN7Hqi6H', connection, 1);
        })();

    }, [wallet, publicKey, connection, sendTransaction]);

    return (
        <>
            <h2>Remaining: {remaining} VeeWoo Token</h2>
            <WalletModalProvider>
                <WalletMultiButton />
                <WalletDisconnectButton />
                <ActionButton />
                <SendTokenButton />
            </WalletModalProvider>
            {/* <Gallery /> */}
            <GalleryWithPagination />
        </>
    );
}

export default Home;
