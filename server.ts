const logger = require('pino')({ level: 'info' })
import cors from '@fastify/cors'

import dotenv from 'dotenv';
dotenv.config();

import fastify from 'fastify';
import axios from 'axios';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ResponseData } from './interfaces';

const port: number = Number(process.env.PORT) || 3001;
const host: string = process.env.HOST || 'localhost';

const btoa = (str: string): string => Buffer.from(str).toString('base64');

const server = fastify({ logger });

server.register(cors, {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});

const projectID: string = process.env.PROJECT_ID!;
const apiSecret: string = process.env.SECRET_KEY!;

const axiosInstance = axios.create({
  baseURL: process.env.REMOTE_URL,
  headers: {
    'Authorization': 'Basic ' + btoa(`${projectID}:${apiSecret}`)
  }
});

server.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const params = request.query;
    const response = await axiosInstance.get<ResponseData>('/users', { params });
    if (response.status !== 200) {
      throw new Error('Failed to fetch data from server');
    }
    reply.send(response.data);
  } catch (error) {
    throw error
  }
});

const start = async (): Promise<void> => {
  try {
    console.log(port, host);
    await server.listen({ host, port });
    server.log.info(`Server is running on http://${host}:${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();