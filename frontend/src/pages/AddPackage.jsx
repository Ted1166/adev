import React from 'react'
import { Box, Button, Card, Grid, Group, NumberInput, TextInput, Select, Title } from "@mantine/core"
import { useForm } from '@mantine/form';
import {useAppContext} from '../providers/AppProvider';
import { showNotification } from '@mantine/notifications';
import { IconAlertTriangle, IconPlus } from "@tabler/icons-react"
import {useNavigate} from 'react-router-dom';
// import { contract } from '../config/config';

const AddPackage = () => {

  const { contract } = useAppContext();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      title: "",
      price: "",
      channels: 0
    },
    validate: {
      title: value => value === "" ? "Title is required" : null,
      price: value => value === "" ? "Price is required" : null,
      channels: value => value === 0 ? "Enter the no. of channels" : null,
    }
  });

  // key:u128, sub_package : felt252, channels : felt252, price : u128
  const handleCreatePackage = async () => {
    if (contract) {
      const calldata = [form.values.title, form.values.channels, form.values.price];
      const mycall = contract.populate("add_package", calldata);

      console.log("Calldata Prepared:", calldata);
      console.log("Prepared contract call:", mycall);

      try {
        const res = await contract.add_package(mycall.calldata);

        console.log("Transaction response:", res);

        if (res && res.status === "success") {
          showNotification({
            title: "Success!",
            message: "Added package successfully",
            color: "green",
            icon: <IconAlertTriangle />
          });

          navigate('/subscription_channel');
        } else {
          console.log("Transaction failed or response not successful", res);
        }

      } catch (e) {
        console.error("Transaction error:", e);

        showNotification({
          title: "Failed!",
          message: "Could not add package",
          color: "red",
          icon: <IconAlertTriangle />
        });
      }
    } else {
      console.warn("Contract instance not available");
      showNotification({
        title: "Contract Not Available",
        message: "Please ensure your wallet is connected.",
        color: "red",
        icon: <IconAlertTriangle/>
      })
    }
  };

  return (
    <div>
      <Card radius={"lg"}>
        <Title fw={500} size={45}>Add new Package</Title>
        <form onSubmit={form.onSubmit(values => handleCreatePackage())}>
          <Grid>
            <Grid.Col span={{ xs: 12 }}>
              <Select label="Package Title" Placeholder="Select a Package" data={['Movies', 'Series', 'Gaming', 'Education', 'Trending']}
              {...form.getInputProps('title')} radius="md"/>
            </Grid.Col>
            <Grid.Col span={{ xs: 6 }}>
              <NumberInput hideControls label="Price" placeholder='2,500' {...form.getInputProps('price')} radius={'md'} />
            </Grid.Col>
            <Grid.Col span={{ xs: 6 }}>
              <NumberInput hideControls label="No. of Channels" placeholder='100' {...form.getInputProps('channels')} radius={'md'} />
            </Grid.Col>
          </Grid>
          <Box mt="lg">
            <Button leftSection={<IconPlus />} type='submit'>Add package</Button>
          </Box>
        </form>
      </Card>
    </div>
  );
};

export default AddPackage