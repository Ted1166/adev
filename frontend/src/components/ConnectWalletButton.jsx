import React, { useState, useEffect } from 'react';
import { useConnect, useAccount, useDisconnect } from '@starknet-react/core';
import { Button, Modal, Text, Stack, Group, Avatar, Loader, UnstyledButton, Box } from '@mantine/core';
import { IconWallet, IconChevronRight, IconExternalLink } from '@tabler/icons-react';
import { shortenAddress } from '../utils';


const ConnectWalletButton = ({ className = '' }) => {
  const { connect, connectors } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connectingConnector, setConnectingConnector] = useState(null);

  useEffect(() => {
    if (isConnected && connectingConnector) {
      setConnectingConnector(null);
      setIsModalOpen(false);
    }
  }, [isConnected, connectingConnector]);

  const handleConnect = async (connector) => {
    try {
      setIsLoading(true);
      setConnectingConnector(connector);
      await connect({ connector });
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectingConnector(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setIsLoading(true);
      await disconnect();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        leftSection={<IconWallet size={20} />}
        className={className}
        variant="filled"
        color="green"
      >
        {isConnected ? shortenAddress(address) : 'Connect Wallet'}
      </Button>

      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isConnected ? 'Wallet Connected' : 'Connect Wallet'}
        size="md"
      >
        {isConnected ? (
          <Stack>
            <Text size="sm" color="dimmed">Connected Account</Text>
            <Text size="lg" weight={500} sx={(theme) => ({
              backgroundColor: theme.colors.gray[1],
              padding: theme.spacing.sm,
              borderRadius: theme.radius.sm,
            })}>
              {shortenAddress(address)}
            </Text>
            <Button
              onClick={handleDisconnect}
              disabled={isLoading}
              color="red"
              leftSection={isLoading ? <Loader size="sm" /> : null}
            >
              Disconnect
            </Button>
          </Stack>
        ) :(
          <Stack spacing="md">
            {connectors.map((connector) => (
              <UnstyledButton
                key={connector.id}
                onClick={() => handleConnect(connector)}
                disabled={!connector.available() || isLoading || connectingConnector !== null}
                sx={(theme) => ({
                  width: '100%',
                  padding: theme.spacing.md,
                  borderRadius: theme.radius.sm,
                  border: `1px solid ${theme.colors.gray[3]}`,
                  '&:hover': {
                    backgroundColor: theme.colors.gray[0],
                  },
                  '&:disabled': {
                    opacity: 0.5,
                    cursor: 'not-allowed',
                  },
                })}
              >
                <Group position="apart" spacing="xl">
                  <Group spacing="sm">
                    {connector.icon && (
                      <Avatar src={connector.icon.toString()} size="md" radius="xl" />
                    )}
                    <Text weight={500}>{connector.name}</Text>
                  </Group>
                  {connectingConnector === connector ? (
                    <Loader size="sm" />
                  ) : (
                    <IconChevronRight size={24} color="gray" />
                  )}
                </Group>
              </UnstyledButton>
            ))}
          </Stack>
        )}

        <Group position="center" mt="xl">
          <Button
            component="a"
            href="https://www.starknet.io/ecosystem/wallets"
            target="_blank"
            rel="noopener noreferrer"
            variant="subtle"
            rightSection={<IconExternalLink size={16} />}
          >
            Learn about Starknet wallets
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default ConnectWalletButton;