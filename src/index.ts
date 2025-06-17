import { createApp } from "./framework";

const app = createApp();

app.on('request:received', () => {
    console.log('Request Received.');

})

app.on('request:processed', () => {
    console.log('Request Processed.');

})

app.listen(4546, () => {
    console.log(`server is running on port 4546`)
})