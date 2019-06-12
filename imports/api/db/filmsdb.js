/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-unresolved */
import { Mongo } from 'meteor/mongo';

export const Films = new Mongo.Collection('films');
