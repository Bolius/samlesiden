# Bolius samleside

## To do

- [ ] ReadMe
- [ ] Mulighed for at overlaye kommuner
- [ ] Bedre input til DST-explorer
  - [x] Bedre valg af tidsperioder
  - [ ] Mulighed for at klik-vælge flere kommuner
- [ ] Links til predefinerede grafer
- [ ] Implementering af et Danmarkskort?

## Code structure

## Environment variables

Since the app [water_comes][water] is imported into this project, an access token for Google Maps has to be given en `.env`.

### Technical setup

```bash
$ docker pull mikkelbrs/dst-bolius
$ docker-compose up 
```

[water]: https://github.com/Bolius/water_comes