import { Server } from "./server"

// export class Framework {
//     server: Server;

//     constructor() {
//         this.server = new Server();
//     }

// get(){}

// post(){}

// listen(port: number, cb?: () => void) {
//     this.server.listen(port, cb);
// }
// }

export const createApp = () => new Server();