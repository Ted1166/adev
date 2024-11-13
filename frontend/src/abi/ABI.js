[
    {
        "type": "impl",
        "name": "subscribeImpl",
        "interface_name": "adev::channel::subscribeTrait"
    },
    {
        "type": "struct",
        "name": "adev::channel::Packages",
        "members": [
            {
                "name": "sub_package",
                "type": "core::felt252"
            },
            {
                "name": "package_id",
                "type": "core::integer::u128"
            },
            {
                "name": "channels",
                "type": "core::felt252"
            },
            {
                "name": "price",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "type": "struct",
        "name": "adev::channel::Msg",
        "members": [
            {
                "name": "recipient",
                "type": "core::starknet::contract_address::ContractAddress"
            },
            {
                "name": "msg",
                "type": "core::felt252"
            }
        ]
    },
    {
        "type": "struct",
        "name": "adev::channel::Channel",
        "members": [
            {
                "name": "channel_id",
                "type": "core::integer::u128"
            },
            {
                "name": "channel_name",
                "type": "core::felt252"
            },
            {
                "name": "channel_owner",
                "type": "core::starknet::contract_address::ContractAddress"
            }
        ]
    },
    {
        "type": "struct",
        "name": "adev::channel::MediaFile",
        "members": [
            {
                "name": "media_id",
                "type": "core::integer::u128"
            },
            {
                "name": "cid",
                "type": "core::felt252"
            },
            {
                "name": "channel_id",
                "type": "core::integer::u128"
            }
        ]
    },
    {
        "type": "interface",
        "name": "adev::channel::subscribeTrait",
        "items": [
            {
                "type": "function",
                "name": "add_package",
                "inputs": [
                    {
                        "name": "sub_package",
                        "type": "core::felt252"
                    },
                    {
                        "name": "channels",
                        "type": "core::felt252"
                    },
                    {
                        "name": "price",
                        "type": "core::integer::u128"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_package",
                "inputs": [
                    {
                        "name": "key",
                        "type": "core::integer::u128"
                    }
                ],
                "outputs": [
                    {
                        "type": "adev::channel::Packages"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "subs_package",
                "inputs": [
                    {
                        "name": "package_id",
                        "type": "core::integer::u128"
                    },
                    {
                        "name": "user",
                        "type": "core::starknet::contract_address::ContractAddress"
                    },
                    {
                        "name": "key",
                        "type": "core::integer::u128"
                    },
                    {
                        "name": "message_key",
                        "type": "core::integer::u128"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_message",
                "inputs": [
                    {
                        "name": "key",
                        "type": "core::integer::u128"
                    }
                ],
                "outputs": [
                    {
                        "type": "adev::channel::Msg"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_packages",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::array::Array::<adev::channel::Packages>"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "create_channel",
                "inputs": [
                    {
                        "name": "channel_name",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            },
            {
                "type": "function",
                "name": "get_channel",
                "inputs": [
                    {
                        "name": "key",
                        "type": "core::integer::u128"
                    }
                ],
                "outputs": [
                    {
                        "type": "adev::channel::Channel"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_channels",
                "inputs": [],
                "outputs": [
                    {
                        "type": "core::array::Array::<adev::channel::Channel>"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_media_file",
                "inputs": [
                    {
                        "name": "key",
                        "type": "core::integer::u128"
                    }
                ],
                "outputs": [
                    {
                        "type": "adev::channel::MediaFile"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "get_media_by_channel",
                "inputs": [
                    {
                        "name": "channel_id",
                        "type": "core::integer::u128"
                    }
                ],
                "outputs": [
                    {
                        "type": "core::array::Array::<adev::channel::MediaFile>"
                    }
                ],
                "state_mutability": "view"
            },
            {
                "type": "function",
                "name": "create_media_file",
                "inputs": [
                    {
                        "name": "channel_id",
                        "type": "core::integer::u128"
                    },
                    {
                        "name": "cid",
                        "type": "core::felt252"
                    }
                ],
                "outputs": [],
                "state_mutability": "external"
            }
        ]
    },
    {
        "type": "constructor",
        "name": "constructor",
        "inputs": []
    },
    {
        "type": "event",
        "name": "adev::channel::Subscribe::Event",
        "kind": "enum",
        "variants": []
    }
]