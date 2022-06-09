import { ipcMain } from 'electron';
import sqlite from 'sqlite3';

const sqlite3 = sqlite.verbose();
const db = new sqlite3.Database('./db.sqlite');

export default db;
