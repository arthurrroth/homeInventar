# Einführung

## Zweck

Mit dieser App soll der User Gegenstände aus seinem Haushalt in einer Online-Datenbank aufnehmen können.

## Zielgruppe

Jeder der Gegnstände besitzt und diese dokumentieren möchte.

## Tech Stack

- MongoDB
- ExpressJS
- ReactJS
- NodeJS

### Grundlegende Architektur

#### Datenmodel

Wir benutzen die noSQL Dokumenten Datenbank MongoDB.

##### Database

Für unsere Zwecke haben wir die Database "Home-Inventar" erstellt.

##### Collections

In unserer Database haben wir drei Collections angelegt, um Gegenstände von verschiedener Größe
zu unterscheiden.

**Collection: big**
> Hier speichern wir Gegenstände die sehr groß sind.

**Collection: medium**
> Hier speichern wir Gegenstände die mittel groß sind.

**Collection: small**
> Hier speichern wir Gegenstände die klein sind.

##### Schema

```
dataObject = {

    _id: ObjectId(),
    title: string (utf8),
    room: string (utf8),
    description: string (utf8),
    img: string (base64)
};

```

# Erste Schritte

## Project Setup - Backend

### 1. Server Setup

**NodeJS Projekt initialisieren**
```
npm init -y
```

**Basic Dependencies installieren**
```
npm i express cors dotenv fs
```

**Basic imports @index.js**
```
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
```

### 2. Datenbank Setup

**Basic dependencies für MongoDB**
```
npm i mongodb 
```
**Basic imports @index.js**
```
import { MongoClient, ObjectId, Binary } from 'mongodb';
```


# Projektstruktur

Backend/index.js <=> Hier läuft unser gesamter backend code

Backend/cache <=> In diesem Ordener werden Bilder zwischengespeichert, die wir später als bas64 kodierte binary in unsere Datanbank legen.

# Konfiguration

In unserer .env Datei ist der **Connection String** (DB_URI) für unsere MongoDB hinterlegt.
´´´

DB_URI = 'mongodb+srv://rotharthur:******************@supercode-c0.kengjwp.mongodb.net/?retryWrites=true&w=majority'

´´´

# Abhängigkeiten

**dotenv**
> Zum Lesen der .env Datei für relevante Umgebungsvariablen

**express**
> Zum Aufsetzen und interagieren mit unserem web-server

**cors**
> Zum Ermöglichen von Cross-Origin.Resource-Sharing

**mongodb**
> Zum Verbinden und interagieren mit unserer Datanbank

# API Dokumentation

### POST /home-inventar/add/:collection
**Methode:** POST  
**Endpunkt:** /home-inventar/add/:collection  
**Beschreibung:** Fügt ein neues Element zur angegebenen Sammlung hinzu.  

**Anfrageparameter:**  
- `collection` (string): Der Name der Sammlung, zu der das Element hinzugefügt werden soll.  

**Anfragekörper:**  
```json
{
  "title": "Sofa",
  "room": "Wohnzimmer",
  "description": "Bequemes Sofa für das Wohnzimmer.",
  "jpegURL": "https://example.com/sofa.jpeg"
}
```

**Antwortkörper:** Das hinzugefügte Element-Objekt.  

**Beispiel Anfrage:**  
```http
POST /home-inventar/add/bigstuff
Content-Type: application/json

{
  "title": "Sofa",
  "room": "Wohnzimmer",
  "description": "Bequemes Sofa für das Wohnzimmer.",
  "jpegURL": "https://example.com/sofa.jpeg"
}
```

**Beispiel Antwort:**  
```json
{
  "_id": "6112e16c4c62cb451cacdd50",
  "title": "Sofa",
  "room": "Wohnzimmer",
  "description": "Bequemes Sofa für das Wohnzimmer.",
  "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
}
```

### GET /home-inventar/findAll/:collection
**Methode:** GET  
**Endpunkt:** /home-inventar/findAll/:collection  
**Beschreibung:** Ruft alle Elemente aus der angegebenen Sammlung ab.  

**Anfrageparameter:**  
- `collection` (string): Der Name der Sammlung, aus der die Elemente abgerufen werden sollen.  

**Antwortkörper:** Ein Array von Element-Objekten.  

**Beispiel Anfrage:**  
```http
GET /home-inventar/findAll/bigstuff
```

**Beispiel Antwort:**  
```json
[
  {
    "_id": "6112e16c4c62cb451cacdd50",
    "title": "Sofa",
    "room": "Wohnzimmer",
    "description": "Bequemes Sofa für das Wohnzimmer.",
    "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  },
  {
    "_id": "6112e16c4c62cb451cacdd51",
    "title": "Tisch",
    "room": "Esszimmer",
    "description": "Holztisch für das Esszimmer.",
    "img": "data:image/jpeg;base..."
  }
]
```

### GET /home-inventar/find/:collection
**Methode:** GET  
**Endpunkt:** /home-inventar/find/:collection  
**Beschreibung:** Ruft Artikel aus der angegebenen Sammlung basierend auf den angegebenen Abfrageparametern ab.  

**Anfrageparameter:**  
- `collection` (string): Der Name der Sammlung, aus der die Artikel abgerufen werden sollen.  

**Anfragekörper:** JSON-Objekt, das die Abfrage mit den folgenden optionalen Eigenschaften darstellt:
```json
{
  "_id": "6112e16c4c62cb451cacdd50",
  "title": "Sofa",
  "room": "Wohnzimmer",
  "description": "Bequemes Sofa für das Wohnzimmer."
}
```

**Antwortkörper:** Ein Array von Artikel-Objekten, die der Abfrage in der angegebenen Sammlung entsprechen.  

**Beispiel Anfrage:**  
```http
GET /home-inventar/find/bigstuff
Content-Type: application/json

{
  "title": "Sofa",
  "room": "Wohnzimmer"
}
```

**Beispiel Antwort:**  
```json
[
  {
    "_id": "6112e16c4c62cb451cacdd50",
    "title": "Sofa",
    "room": "Wohnzimmer",
    "description": "Bequemes Sofa für das Wohnzimmer.",
    "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
  }
]
```

### PUT /home-inventar/update/:collection/:item
**Methode:** PUT  
**Endpunkt:** /home-inventar/update/:collection/:item  
**Beschreibung:** Aktualisiert einen bestimmten Artikel in der angegebenen Sammlung.  

**Anfrageparameter:**  
- `collection` (string): Der Name der Sammlung, in der sich der Artikel befindet.  
- `item` (string): Die ID des zu aktualisierenden Artikels.  

**Anfragekörper:** JSON-Objekt, das die Aktualisierung mit den folgenden Eigenschaften darstellt:
```json
{
  "updateParameter": "title",
  "updateValue": "Bequemes Sofa"
}
```

**Antwortkörper:** Das aktualisierte Artikel-Objekt mit seinen Eigenschaften.  

**Beispiel Anfrage:**  
```http
PUT /home-inventar/update/bigstuff/6112e16c4c62cb451cacdd50
Content-Type: application/json

{
  "updateParameter": "title",
  "updateValue": "Bequemes Sofa"
}
```

**Beispiel Antwort:**  
```json
{
  "_id": "6112e16c4c62cb451cacdd50",
  "title": "Bequemes Sofa",
  "room": "Wohnzimmer",
  "description": "Bequemes Sofa für das Wohnzimmer.",
  "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
}
```

### DELETE /home-inventar/delete/:collection/:item
**Methode:** DELETE  
**Endpunkt:** /home-inventar/delete/:collection/:item  
**Beschreibung:** Löscht einen bestimmten Artikel aus der angegebenen Sammlung.  

**Anfrageparameter:**  
- `collection` (string): Der Name der Sammlung, aus der der Artikel gelöscht werden soll.  
- `item` (string): Die ID des zu löschenden Artikels.  

**Antwortkörper:** Das gelöschte Artikel-Objekt.  

**Beispiel Anfrage:**  
```http
DELETE /home-inventar/delete/bigstuff/6112e16c4c62cb451cacdd50
```

**Beispiel Antwort:**  
```json
{
  "_id": "6112e16c4c62cb451cacdd50",
  "title": "Bequemes Sofa",
  "room": "Wohnzimmer",
  "description": "Bequemes Sofa für das Wohnzimmer.",
  "img": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
}
```

Hinweis: Stellen Sie sicher, dass ein Server auf Port 3010 läuft, wie in der Server-Code-Snippet angegeben. Stellen Sie außerdem sicher, dass Sie angemessene Sicherheitsmechanismen wie Authentifizierung und Autorisierung implementieren, bevor Sie diese API in einer Produktionsumgebung bereitstellen.

Mit dieser API können Sie das Heim-Inventar effizient verwalten, indem Sie Artikel in den entsprechenden Sammlungen hinzufügen, abrufen, aktualisieren und löschen.
