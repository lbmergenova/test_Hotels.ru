import { DataSource } from "typeorm";
import * as path from "path";
import { User } from "./User";
require('dotenv').config();

const databasePath = path.join(__dirname, "..", `${process.env.DATABASE_NAME}`);

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: databasePath,
    synchronize: true,
    entities: [User],
});

AppDataSource.initialize()
    .then(() => {console.log("Data Source has been initialized!")})
    .catch((err) => {console.error("Error during Data Source initialization", err)});