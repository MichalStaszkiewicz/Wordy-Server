import { Connection, createConnection, DataSource } from "typeorm";
import { connectionOptions } from "./const/database";
import { server } from "./server";
import { WordEntity } from "./entities/word_entity";
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import { Server, Socket } from 'socket.io';
import { UserCourseService } from "./services/user_course_service";
import { initSocket } from "./socket/socket";
import { secretToken } from "./const/config";
import { validateToken } from "./const/validation/validate_auth";

import { user_init } from "./routes/user_routes";
import { word_init } from './routes/word_routes'
import { user_achievements_init } from "./routes/user_achievements_routes"
import { langauge_init } from "./routes/language_routes"
import { image_init } from "./routes/image_routes"
import { settings_init } from "./routes/user_settings_routes"
import { profile_init } from "./routes/profile_routes"
import { achievement_init } from './routes/achievement_routes';
import { registeration_init } from "./routes/registeration_routes"
import { user_course_init } from "./routes/user_course_routes"
import { token_init } from "./routes/token_routes";
import { vocabulary_init } from "./routes/vocabulary_routes";
import { topics_init } from "./routes/topic_routes";
let dataSource: DataSource;
const Inert = require('@hapi/inert');

const init = async () => {
  await server.register([
    Inert,
    Vision,
    {

      plugin: HapiSwagger,
      options: {

        info: {
          title: 'Wordy API',


        },

        swaggerUI: true,
        documentationPage: true,
        documentationPath: '/docs',


      }

    },
  ]); await server.register(require('hapi-auth-jwt2'));


  server.auth.strategy('jwt', 'jwt', {
    key: secretToken,
    validate: validateToken,
    verifyOptions: { algorithms: ['HS256'] },
  });
  server.auth.default('jwt'); 
  topics_init(server);
  token_init(server);
  user_achievements_init(server);
  word_init(server);
  user_init(server);
  langauge_init(server);
  image_init(server);
  settings_init(server); profile_init(server); registeration_init(server);
  vocabulary_init(server); user_course_init(server);
  initSocket();

  achievement_init();
}



process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`);
});


process.on('unhandledRejection', (reason: any) => {
  console.error(`unhandledRejection ${reason}`);
});

const startServer = async () => {
  try {

    dataSource = await createConnection(connectionOptions);

    await init();
    await server.start();


    console.log(`Server running at: ${server.info.uri}`);
  } catch (error) {
    console.log('Error connecting to database:', error);
  }
};

startServer();
export { dataSource }