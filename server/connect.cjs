const {MongoClient} = require('mongodb');
require('dotenv').config({path: './config.env'})

async function main() {
    const Db = process.env.ATLAS_URI;
    const client = new MongoClient(Db);

    await client.connect();

    try {
        await client.connect();
        const collections = await client.db('ProjectAssistantOA').collections();
        collections.forEach((collection) => console.log(collection.s.namespace.collection))

    } catch (error) {
        console.log(error);
    } finally {
        await client.close();
    }
}

main()

