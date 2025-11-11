# browserslist-plausible

## Overview

`browserslist-plausible` generates a `browserslist-stats.json` file from Plausible Analytics data. Ultimately, it's a tool that matches dimensions from your Plausible data to browsers and versions in the Can I Use database—then writes the marketshare of each browser and version combination to a file.

## Getting Started

### Installation

First, install `browserslist-plausible`.

You can install it globally with:

```sh
npx browserslist-plausible
```

Or as part of your projects dev dependencies with **_one_** of the following:

```sh
npm install --save-dev browserslist-plausible
yarn add --dev browserslist-plausible
pnpm add --save-dev browserslist-plausible
# etc. You get the idea! Do the equivalent for your package manager of choice.
```

### Get an API Key

Next, login to your Plausible Analytics instance and generate a new API key. Once logged in, you'll find it on the `/settings/api-keys` page. Follow the instructions on-screen.

It's recommended to save the API key to the `PLAUSIBLE_API_KEY` environment variable. However, if this is not set, `browserslist-plausible` will ask for you to input the API key at runtime.

### Example Usage

Get stats for `example.org` from your self-hosted Plausible server:

<details>
  <summary><code>browserslist-plausible --host https://plausible.example.org example.org</code></summary>

```
✔ What is your Plausible API Key? *********************************************…
✔ Browserslists stats written to …/browserslist-stats.json

Run the following command to see the Browserslist coverage for your stats:
npx browserslist --coverage --stats=browserslist-stats.json
```

</details>

Now that you have your stats, you can the `my stats` keywords in your Browserslist config, and pass the file location to the `--stats` argument for Browserslist.

**`.browserslistrc`**
```
> 0.5% in my stats
```

<details>
  <summary><code>npx browserslist --coverage --stats=browserslist-stats.json</code></summary>

```
These browsers account for 87.9% of all users in custom statistics
```

</details>

## Plausible Analytics API vs. CSV Data Export

`browserslist-plausible` only supports the Plausible Analytics API, not the CSV data exports.

CSV exports aren't as useful for this use case as it exports the browsers and devices separately, but a lot of the usage data depends on the combination of the two.

For example, we can know how many users were on Chrome in total, and how many users where on Android in total, but not how many Chrome for Android users there were.

The API supports this level of granularity very well, but the CSV export does not.

## Notes

* All browsers on Apple's mobile operating systems use Safari's WebKit as the underlying engine. So, all browsers on operatings systems like iOS and iPadOS are mapped to Safari.
