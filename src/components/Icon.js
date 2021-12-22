import React, { useEffect, useState } from 'react';
import { TokenListProvider, TokenInfo, ENV } from '@solana/spl-token-registry';


export const Icon = (props) => {
    const [tokenMap, setTokenMap] = useState(new Map());
    useEffect(() => {
        new TokenListProvider().resolve().then(tokens => {
            const tokenList = tokens.filterByChainId(ENV.Devnet).getList();

            setTokenMap(tokenList.reduce((map, item) => {
                map.set(item.address, item);
                return map;
            }, new Map()));
        });
    }, [setTokenMap]);

    const token = tokenMap.get(props.mint);
    if (!token || !token.logoURI) return null;

    return (
        <>
            <img src={token.logoURI} alt="" />
        </>
    );
}

