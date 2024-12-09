# <img width="150" alt="Agridot_logo" src="https://github.com/user-attachments/assets/c906eba6-8122-4f3b-83f5-8ecb04f326ef"> Web3 Mobile dApp for Farmers 🧑‍🌾

[Official AgriDot documentation](https://kacena123.github.io/agridot-docs/)

## What is AgriDot?
AgriDot is a blockchain-based application that enables farmers to manage their fields, crops they grow on them, track pests, monitor weather in their fields, and share valuable insights through a decentralized, transparent system. By integrating agriculture into the Polkadot ecosystem, AgriDot introduces a pioneering use case for blockchain in farming. The platform is fully open-source and prioritizes user privacy, eliminating the need for centralized databases.

## What AgriDot allows you?
1. Field Management - Create Private or Public fields (Minted as Collections)
2. Crop Management - Create Private or Public crops on your fields (Minted as NFTs)
3. Field Weather monitoring - Monitor weather on your field.
4. Pest reporting - Report pest found on your crops and get rewarded by farmers that found your report helpful.
5. Guide creation - Create guides that help community and receive rewards from other farmers.
6. Crop origin proofs - Public fields and crops can generate crop origin proofs that can be used as evidence for business partners or for local markets.

## What are benefits of using AgriDot compared to standard Web2 application?
- None of your private data is ever sent to any servers or stored anywhere else than on your device.
- You can create your own encryption password for private fields and crops meaning noone other than you will be able to decrypt their details via AgriDot
- Everything done transparently. AgriDot is fully Open source and has MIT license allowing you to use it's code and modify it to your liking.
- No ADS or any premium memberships. You only pay for Blockchain tasks.
- Cheap minting (Only about 0.05$ to create a field or crop).

In AgriDot we believe, that Farmers can benefit from Blockchain usecase and we also believe, that the community of Farmers can be really strong together and save lots of crops per annum by pest reports.

For user guide please reffer to the [Official AgriDot documentation - User guide section](LINK)

For developer guide please reffer to [Official AgriDot documentation - Developer guide section](LINK)

## Building the application

### .env file
App uses .env file to pass some secret enviroment variables. Below is an example of .env:
```
EXPO_PUBLIC_PINATA_JWT=string
EXPO_PUBLIC_GATEWAY_URL=webside.mypinata.cloud
EXPO_PUBLIC_SERVER_URL=url
EXPO_PUBLIC_ENCRYPT_PHRASE=password
```

### Docker build
```bash
#Build Docker image
docker build -t agridot-fe .

#Start expo
docker run --env-file .env.local -it --rm agridot-fe
```

### Standard build
```bash
#1. Clone or fork the repository

#2. Install application
npm i

#3. Start the expo
npx expo start

#4. Scan the QR code on your device or select the a - android or i - ios for emulator start (You need to have emulators installed)
```

## Other commands
Here is the list of commands that can be used to perform other tasks with the codebase.

- `npm run test`: Run the unit tests
- `npm run lint`: Lint the application code
