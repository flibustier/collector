# Collector

## Requirements

In order to launch your own collector, you need to install `nodejs` and `yarn`

## Project setup
```
yarn install
```

### Extract data from [Wikipedia](https://fr.wikipedia.org/wiki/Pi%C3%A8ce_comm%C3%A9morative_de_2_euros) and generate a `database.json` file
```
yarn extract
```
> To save the database into `src/public/database.json`, you need to pass the `--write-database` option

Option availables:
- `--download [ID]` To download a specific picture, replace `[ID]` with the ID of the coin in format `CC-YYYY-NN`
where `CC` is the country code [ISO_3166-1 alpha 2](https://en.wikipedia.org/wiki/ISO_3166-1) (like `FR`)
`YYYY` is the year (like `2019`) and `NN` is the order number (like `01`)
- `--download-all` To download all missing pictures
> - You can use `--quality [QUALITY]` when using `--download [ID]` or `--download-all` for specifying the picture quality (possible values are `low`, `medium`, `fullsize`, `all` for `[QUALITY]`)
> - You can use `--tiny-png` option when using `--download [ID]` or `--download-all` to use [TinyPNG API](https://tinypng.com/) for reducing picture sizes
> You will need to specify your API key in `.env` file like `TINYPNG_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
> - You can use `--overwrite` option when using `--download-all` to overwritting existing pictures and downloading every pictures (not only missings)

- If don’t want to fetch Wikipedia data and just want to read the local database, you can use `--offline` option (you cannot using this option with any `download` option)

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
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
