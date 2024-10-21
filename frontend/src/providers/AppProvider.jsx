"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Contract } from 'starknet';
import { connect, disconnect } from 'starknetkit';
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { sepolia, mainnet } from "@starknet-react/chains";
import { StarknetConfig, publicProvider, argent, braavos, useInjectedConnectors, voyager } from "@starknet-react/core";
import { CONTRACT_ABI, CONTRACT_ADDRESS, ARGENT_WEBWALLET_URL, CHAIN_ID,provider } from '../config/config';

const initialData = {
  contract: null,
  account: null,
  address: null,
  connection: null,
  handleConnectWalletBtnClick: null,
  wallet: null
};

export const AppContext = createContext(initialData);

export const useAppContext = () => useContext(AppContext);

export function CombinedProvider({ children }) {
  const [contract, setContract] = useState();
  const [connection, setConnection] = useState();
  const [account, setAccount] = useState();
  const [address, setAddress] = useState("");
  const [wallet, setWallet] = useState();

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random"
  });

  const connectWallet = async () => {
    try {
      const { wallet } = await connect({
        provider,
        modalMode: "alwaysAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Starknetkit example dapp",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      });

      console.log("dfds",wallet)

      setWallet(wallet);
      setConnection(wallet);
      setAccount(wallet.account);
      setAddress(wallet.selectedAddress);
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

  const disconnectWallet = async () => {
    await disconnect();
    setConnection(undefined);
    setAccount(undefined);
    setAddress('');
    setWallet(undefined);
  };

  const openConfirmDisconnectModal = () => modals.openConfirmModal({
    title: 'Please confirm your action',
    centered: true,
    radius: "md",
    children: (
      <Text size="sm">
        Are you sure you want to disconnect your account?
      </Text>
    ),
    labels: { confirm: 'Disconnect', cancel: 'Cancel' },
    confirmProps: { radius: "md", variant: "light" },
    cancelProps: { radius: "md", variant: "light" },
    onCancel: () => { },
    onConfirm: () => disconnectWallet(),
  });

  const makeContractConnection = () => {
    if (account) {
      const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
      setContract(contract);
    }
  };

  const handleConnectWalletBtnClick = () => {
    console.log("clicked connect wallet");
    if (!account) {
      connectWallet();
    } else {
        console.log("..............")
      openConfirmDisconnectModal();
    }
  };

  const contextValue = useMemo(() => ({
    contract,
    account,
    address,
    connection,
    handleConnectWalletBtnClick,
    wallet
  }), [account, contract, address, connection, wallet]);



  useEffect(() => {
    makeContractConnection();
  }, [account, address]);

  return (
    <StarknetConfig 
      chains={[mainnet, sepolia]} 
      provider={publicProvider()} 
      connectors={connectors} 
      explorer={voyager}
    >
      <AppContext.Provider value={contextValue}>
        {children}
      </AppContext.Provider>
    </StarknetConfig>
  );
}

export default CombinedProvider;