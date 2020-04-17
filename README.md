<div align="center">
<img src="./public/images/logo.svg" width="100px"/> 
</div>

<p align="center">
Collector allows you to manage your 2€ commemorative coins collections without needs of internet connection (everything is saved on your browser local storage)
You can also share your collection and soon, see some statistics
</p>

## Requirements

In order to launch your own collector instance, you will need `nodejs` > 12 and `yarn`

## Project setup

```
yarn install
```

### Extract data from [Wikipedia](https://fr.wikipedia.org/wiki/Pi%C3%A8ce_comm%C3%A9morative_de_2_euros) and generate a `database.json` file

```
yarn extract
```

> To save the database into `src/assets/database.json`, you need to pass the `--write-database` (or `-w`) option

Option availables:

- `--download [ID]` To download a specific picture, replace `[ID]` with the ID of the coin in format `CC-YYYY-NN`
  where `CC` is the country code [ISO_3166-1 alpha 2](https://en.wikipedia.org/wiki/ISO_3166-1) (like `FR`)
  `YYYY` is the year (like `2019`) and `NN` is the order number (like `01`)
- `--download-missings` (or `-m`) To download all missing pictures
  > - You can use `--quality [QUALITY]` (or `-q [QUALITY]`) when using `--download [ID]` or `--download-all` or `--download-missings` for specifying the picture quality (possible values are `low`, `medium`, `fullsize`, `all` for `[QUALITY]`)
  > - You can use `--tiny-png` (or `-t`) option when using `--download [ID]` or `--download-all` or `--download-missings` to use [TinyPNG API](https://tinypng.com/) for reducing picture sizes
  >   You will need to specify your API key in `.env` file like `TINYPNG_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
- You can use `--download-all` (or `-a`) to download all pictures (not only missings) and overwrite existing ones.

### Compiles and hot-reloads for frontend development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn format
```

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
