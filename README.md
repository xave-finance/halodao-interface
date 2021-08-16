# HaloDAO Interface

[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for HaloDAO -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [halodao.com](https://halodao.com/)
- Interface: [dev.app.halodao.com](https://dev.app.halodao.com)
- Twitter: [@HaloDAOOfficial](https://twitter.com/HaloDAOFinance)
- Discord: [HaloDAO](https://discord.com/invite/halodao)

## Accessing the HaloDAO Interface

To access the HaloDAO Interface, visit [dev.app.halodao.com](https://dev.app.halodao.com).

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

Note that the interface only works on **Kovan**.
The interface will not work on other networks.

## Deployment

```bash
yarn build
yarn deploy:<target>
```

`<target>` can either be:

- `dev` (dev.app.halodao.com)
- `dev-beta` (dev.beta.app.halodao.com)
- `prod` (app.halodao.com)
- `beta` (beta.app.halodao.com)

## Contributions

**Please open all pull requests against the `master` branch.**
CI checks will run against all PRs.
