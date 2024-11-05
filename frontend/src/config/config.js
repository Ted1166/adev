import { Account, Contract, Provider,constants,RpcProvider } from "starknet"

const abi = [
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


export const CONTRACT_ADDRESS = "0x00bb037efef9704d0567c2139d75897d6f744594b4bd8518c17d79f6b745e014"
export const CONTRACT_ABI = abi

// export const CONTRACT_ADDRESS = "0x01e020b6fde09f00c338c243b3b2469c6556786c4448951f18537b24ddba9bbd"
// export const ACCOUNT_ADDRESS = "0x45387bf30f69b713c9777f9331f209216fec0cc262c0c3a05a22d34d9024706"
// export const PRIVATE_KEY = "0x6e0dedd76b71dee7398355169a7d3def"
// export const CONTRACT_ADDRESS = "0x00bb037efef9704d0567c2139d75897d6f744594b4bd8518c17d79f6b745e014"
// export const ACCOUNT_ADDRESS = "0x04B93FC07b2b6Da3520033D8f2BbeF9c42f9873837a4B3DE7a863EDC9e04B058"
// export const PRIVATE_KEY = "0x05812f784f4d484ebc280f21931296e83954925b379ecc3ec1c1501728f8b31e"

export const ETHTokenAddress =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7"

export const DAITokenAddress =
  "0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3"

export const ARGENT_DUMMY_CONTRACT_ADDRESS =
  "0x001c515f991f706039696a54f6f33730e9b0e8cc5d04187b13c2c714401acfd4"
  
const NODE_URL =
  import.meta.env.VITE_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? "https://starknet-mainnet.public.blastapi.io"
    : "https://starknet-sepolia.public.blastapi.io/rpc/v0_7"

const STARKNET_CHAIN_ID =
  import.meta.env.VITE_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.StarknetChainId.SN_MAIN
    : constants.StarknetChainId.SN_SEPOLIA

export const provider = new RpcProvider({
  nodeUrl: NODE_URL,
  chainId: STARKNET_CHAIN_ID,
})


const account = new Account(provider, ACCOUNT_ADDRESS, PRIVATE_KEY)
const contract = new Contract(abi, CONTRACT_ADDRESS, account)
contract.connect(account)

export { contract, account }



export const CHAIN_ID =
  import.meta.env.VITE_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? constants.NetworkName.SN_MAIN
    : constants.NetworkName.SN_SEPOLIA


export const ARGENT_SESSION_SERVICE_BASE_URL =
  import.meta.env.VITE_PUBLIC_ARGENT_SESSION_SERVICE_BASE_URL ||
  "https://cloud.argent-api.com/v1"

export const ARGENT_WEBWALLET_URL =
  import.meta.env.VITE_PUBLIC_ARGENT_WEBWALLET_URL || "https://web.argent.xyz"