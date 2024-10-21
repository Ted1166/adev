import React,{useState,useEffect} from 'react'
import { AppShell, Button, Container, Group, Image, MantineProvider, Title, createTheme } from '@mantine/core';
import { Link } from 'react-router-dom';
import { useAppContext } from '../providers/AppProvider';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useAccount } from '@starknet-react/core';
import { connect,disconnect } from 'starknetkit';
import {  ARGENT_WEBWALLET_URL, CHAIN_ID,provider } from '../config/config';
import ConnectWalletButton from '../components/ConnectWalletButton';

const theme = createTheme({
    /** Put your mantine theme override here */
});

const MantineLayout = (props) => {
    const { children } = props
    const { address, connection, handleConnetWalletBtnClick, contract,wallet } = useAppContext()
    const {account, isConnected} = useAccount();

    console.log(account)
   
    const [chainId, setChainId] = useState(undefined,)
    
      useEffect(() => {
        const getChainId = async () => {
          setChainId(await account?.getChainId())
        }
    
        if (account) {
            console.log(account)
          getChainId()
        }
      }, [account])


    return (
        <MantineProvider defaultColorScheme='dark' theme={theme} forceColorScheme='dark'>
            <Notifications />
            <ModalsProvider>
                <AppShell header={{ height: 80 }}>
                    <AppShell.Header >
                        <Group px={"lg"} className='h-100' justify='space-between'>
                            <Group>
                                <Image src={'/ui/Ade.png'} mah={'40px'} radius={'md'} />
                                <Title fw={400}>ADEV</Title>
                            </Group>
                            <Group className='h-100' justify='right'>
                                <Button variant='light' component={Link} to={'/'} radius={"md"} size='md'>Home</Button>
                                <Button variant='light' component={Link} to={'/subscription_channel'} radius={"md"} size='md'>Subscription Channel</Button>
                                <Button variant='light' component={Link} to={'/add-package'} radius={"md"} size='md'>Add Package</Button>
                                {
                                    isConnected ?
                                        <Button radius={"xl"} onClick={handleConnetWalletBtnClick}>LOGOUT</Button>
                                        :
                                        <ConnectWalletButton />
                                }
                            </Group>
                        </Group>
                    </AppShell.Header>
                    <AppShell.Main>
                        {
                            !isConnected ? "Connect wallet to proceed" : (
                                <Container size={'xl'} py={'lg'} justify='center'>
                                    {children}
                                </Container>
                            )
                        }
                    </AppShell.Main>
                </AppShell>
            </ModalsProvider>
        </MantineProvider>
    )
}

export default MantineLayout