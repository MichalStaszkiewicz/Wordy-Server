const Hapi = require('@hapi/hapi');



export const server = Hapi.server({
    port: 1344,

    routes: {
        cors: {
           origin:['*'],
        }

    }
});
