# XSD Retrieval MCP Server

Un server Model Context Protocol (MCP) per il recupero e l'analisi di file XSD (XML Schema Definition).

## Descrizione

Questo server MCP fornisce strumenti per recuperare file XSD da URL o percorsi locali, validarli e analizzarne gli elementi. Integrabile con qualsiasi modello LLM.

## Funzionalità

Il server fornisce i seguenti strumenti MCP:

1. **retrieve_xsd** - Recupera un file XSD da un URL o percorso file
2. **validate_xsd** - Valida se il contenuto recuperato è un XSD valido
3. **list_xsd_elements** - Elenca gli elementi definiti in un XSD

## Installazione

```bash
npm install
npm run build
```

## Utilizzo

Per eseguire il server:

```bash
npm start
```

Il server comunica tramite stdio e può essere integrato con qualsiasi client MCP compatibile.

### Strumento retrieve_xsd

Recupera un file XSD da un URL o percorso locale.

Parametri:
- `source` (string, obbligatorio): URL o percorso file del file XSD
- `save_path` (string, opzionale): Percorso locale dove salvare il file XSD recuperato

### Strumento validate_xsd

Valida se il contenuto fornito è un XSD valido.

Parametri:
- `xsd_content` (string, obbligatorio): Contenuto XSD da validare

### Strumento list_xsd_elements

Elenca gli elementi definiti in un XSD.

Parametri:
- `xsd_content` (string, obbligatorio): Contenuto XSD da analizzare

## Contribuire

1. Fork del repository
2. Crea un branch per la tua feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## Licenza

Distribuito sotto la licenza MIT. Vedi `LICENSE` per ulteriori informazioni.