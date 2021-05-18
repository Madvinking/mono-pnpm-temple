import a from 'joi';
export const Joi = a;

import b from 'graphql';
export const graphql = b;

import c from 'apollo-server-express';
export const apolloServerExpress = c;

import d from '@apollo/federation';
export const apolloFederation = d;

import e from 'lodash';
export const _ = e;

import f from 'express';
export const express = f;

import g from 'fast-safe-stringify';
export const safeStringify = g;

import h from 'mongoose';
export const mongoose = h;

import i from 'dotenv';
export const dotenv = i;

import j from 'jsonwebtoken';
import util from 'util';
j.asyncVerify = util.promisify(j.verify, j);
export const jwt = j;

import k from 'axios';
export const axios = k;

import n from 'pg';
export const pg = n;
