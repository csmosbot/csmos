---
# DO NOT EDIT THIS FILE. This is automatically generated by the script in `scripts/docgen/commands.js`. To update these contents, update the information in `apps/bot/src/commands/systems/leaver.ts`.

title: leaver
description: Configure the leaver system.
editUrl: https://github.com/csmosspace/csmos/edit/main/apps/bot/src/commands/systems/leaver.ts
tableOfContents:
  maxHeadingLevel: 5
---

Configure the leaver system.

## Usage

```sh
/leaver setup
/leaver preview
/leaver update channel
/leaver update message
/leaver disable
```

## Subcommands

### setup

Setup the leaver system.

#### Options

|    Name   |                   Description                   | Required |
| :-------: | :---------------------------------------------: | :------: |
| `message` | The message to use for saying goodbye to users. |    Yes   |
| `channel` |    The channel to use as the goodbye channel.   |    No    |

### preview

Preview your goodbye message.

### update

#### channel

Update the goodbye channel.

##### Options

|    Name   |        Description       | Required |
| :-------: | :----------------------: | :------: |
| `channel` | The new goodbye channel. |    Yes   |
,
#### message

Update the goodbye message.

##### Options

|    Name   |        Description       | Required |
| :-------: | :----------------------: | :------: |
| `message` | The new goodbye message. |    Yes   |


### disable

Disable the leaver system.

## Required Permissions

:::note
Learn more about permissions in [Discord's FAQ](https://support.discord.com/hc/en-us/articles/206029707-Setting-Up-Permissions-FAQ).
:::

- Manage Server