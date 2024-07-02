import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Request, Response } from "express";
// const express = require('express')
import "dotenv/config";
import {
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { resolve } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.setGlobalPrefix("api/v1");

  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });

  app.useStaticAssets(resolve("./public"));
  // app.use(express.static("public"));

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new UnprocessableEntityException(result);
      },
      stopAtFirstError: true,
    })
  );

  /*********Server Configuration ************/
  await app.listen(process.env.PORT);
}
bootstrap();
