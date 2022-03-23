# HaloDAO Interface

[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for HaloDAO -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [halodao.com](https://halodao.com/)
- Interface: [dev.app.halodao.com](https://dev.app.halodao.com)
- Twitter: [@HaloDAOOfficial](https://twitter.com/HaloDAOFinance)
- Discord: [HaloDAO](https://discord.com/invite/halodao)

## Accessing the HaloDAO Interface

To access the development app, visit [dev.app.halodao.com](https://dev.app.halodao.com).

Production app can be accessed at [app.halodao.com](https://app.halodao.com)

## Development

### Environment variables

A list of all env vars are available in `.env.example`, simply copy and rename to `.env`

But for simplicity, you can just copy the `halodao-interface .env` entry from the 1password vault

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

Supported networks:
- Ethereum Kovan
- Ethereum Mainnet
- Polygon Mainnet
- Arbitrum Rinkeby
- Arbitrum One/Mainnet

## Testing

### Run unit tests

```bash
yarn test
```
### Integration tests

Please refer to `INTEGRATION_TESTS.md`

## Deployment

```bash
yarn build
yarn deploy:<target>
```

`<target>` can either be:

- `dev` (dev.app.halodao.com)
- `dev-beta` (dev.beta.app.halodao.com)
- `beta` (beta.app.halodao.com)
- `prod` (app.halodao.com)
## Contributions

**Please open all pull requests against the `develop` branch.**
CI checks will run against all PRs.
