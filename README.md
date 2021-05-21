# Bolius samleside

## The Great Plan
 - Vælg kommune ud fra indtastet adresse
 - Lav modul til graf-widget
  - Skal give en graf baseret på url
 - Lav platform til at customize url
  - Vælg område
  - Vælg data
  - Vælg vælg graf type

## To do:


- [x] Find kommune via DAWA inputfeldt
 - [ ] Autocomplete kan være meget pænere, men funktionen er der
- Mulighed for API kald for at hente en graf
- Mulighed for at overlaye kommuner
- Landing page til graf-generation


## Afprøv samlesiden lokalt

### Hent, byg og kør:
```bash
$ docker pull mikkelbrs/dst-bolius
$ docker-compose up -d --build  
```

### Stop
```bash
docker-compose stop
```

# Yarn
Vi bruger `yarn`, da `npm` ikke kunne løse dependencies.