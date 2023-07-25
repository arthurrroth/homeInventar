import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId, Binary } from 'mongodb';
import fs from 'fs';

dotenv.config();

const client = new MongoClient(process.env.DB_URI);
const server = express();
server.use(cors());
server.use(express.json())

const database = client.db('home-inventar');
const big = database.collection('big');
const medium = database.collection('medium');
const small = database.collection('small');


const convertIMGtoBSON = (jpegURL) => {

  const imageBuffer = fs.readFileSync(jpegURL);
  const imageBSON = new Binary(imageBuffer);

  return imageBSON;

};

const convertBSONtoIMGsrc = async (bson) => {
  const base64Image = bson.toString('base64');
  return `data:image/jpeg;base64,${base64Image}`
};

// use cache folder for img upload (implement redis later)

server.post('/home-inventar/add/:collection', async (req, res) => {

  try {

    const { collection } = req.params;
    const qData = req.body;
    let imgSRC;

    qData.jpegURL ?
      imgSRC = await convertBSONtoIMGsrc(convertIMGtoBSON(qData.jpegURL)) :
      imgSRC = 'none';

    const query = {
      title: qData.title,
      room: qData.room,
      description: qData.description,
      img: imgSRC
    };

    switch (collection) {
      case 'bigstuff':
        await big.insertOne(query);
        break;

      case 'mediumstuff':
        await medium.insertOne(query);
        break;

      case 'smallstuff':
        await small.insertOne(query);
        break;

      default:
        break;
    }

    res.json(query);

  } catch (err) {
    console.error(err.message);
  }
});

server.get('/home-inventar/findAll/:collection', async (req, res) => {

  try {
    console.log('Find All ⚡️')

    const { collection } = req.params;
    let allData = [];

    switch (collection) {
      case 'bigstuff':
        const cursorB = big.find();
        for await (const doc of cursorB) {
          allData.push(doc);
        };
        break;
      case 'mediumstuff':
        const cursorM = medium.find();
        for await (const doc of cursorM) {
          allData.push(doc);
        };
        break;
      case 'smallstuff':
        const cursorS = small.find();
        for await (const doc of cursorS) {
          allData.push(doc);
        };
        break;
      default:
        break;
    };

    res.json(allData);

  } catch (err) {
    console.error(err.message);
  }
});

server.get('/home-inventar/find/:collection', async (req, res) => {
  try {
    console.log('find data 🔍');
    const { collection } = req.params;
    const qData = req.body;

    const query = {
      $or: [
        { _id: new ObjectId(qData._id) },
        { title: qData.title },
        { room: qData.room },
        { description: qData.description }
      ]
    };

    let queryOutput = [];

    switch (collection) {
      case 'bigstuff':
        console.log({ query });
        const findResult_B = big.find(query);
        for await (const doc of findResult_B) {
          queryOutput.push(doc);
        };
        break;
      case 'mediumstuff':
        console.log({ query });
        const findResult_M = medium.find(query);
        for await (const doc of findResult_M) {
          console.dir(doc);
          queryOutput.push(doc);
        };
        break;
      case 'smallstuff':
        const findResult_S = small.find(query);
        for await (const doc of findResult_S) {
          queryOutput.push(doc);
        };
        break;
      default:
        break;
    };

    res.json(queryOutput);

  } catch (err) {
    console.error(err.message);
  }
});

server.put('/home-inventar/update/:collection/:item', async (req, res) => {
  try {

    const { collection } = req.params;
    const { item } = req.params;
    const { updateParameter } = req.body;
    const { updateValue } = req.body;
    let updateDocument;

    const filter = {
      _id: new ObjectId(item)

    };

    updateDocument = {
      $set: {
        [updateParameter]: updateValue
      }
    };

    console.log({ updateDocument });
    console.log({ filter });

    switch (collection) {
      case 'bigstuff':
        await big.updateOne(filter, updateDocument);
        const result_B = await big.findOne(filter);
        res.json(result_B);
        break;
      case 'mediumstuff':
        await medium.updateOne(filter, updateDocument);
        const result_M = await medium.findOne(filter);
        res.json(result_M);
        break;
      case 'smallstuff':
        await small.updateOne(filter, updateDocument);
        console.log('smallstuff')
        const result_S = await small.findOne(filter);
        console.log({ item });
        console.log({ result_S });
        res.json(result_S);
        break;
    }

  } catch (err) {
    console.error(err.message);
  };
});

server.delete('/home-inventar/delete/:collection/:item', async (req, res) => {
  try {

    const { collection } = req.params;
    const { item } = req.params;
    const filter = {
      _id: new ObjectId(item)
    };

    console.log(filter)
    switch (collection) {
      case 'bigstuff':
        await big.deleteOne(filter);
        const result_B = await big.findOne(filter);
        res.json(result_B);
        break;
      case 'mediumstuff':
        await medium.deleteOne(filter);
        const result_M = await medium.findOne(filter);
        res.json(result_M);
        break;
      case 'smallstuff':
        await small.deleteOne(filter);
        const result_S = await small.findOne(filter);
        res.json(result_S);
        break;
      default:
        break;
    };

  } catch (err) {
    console.error(err.message);
  };
});


server.listen(3010, () => {
  console.log(`Server is running faast @3010 🏎️💨`);
});


