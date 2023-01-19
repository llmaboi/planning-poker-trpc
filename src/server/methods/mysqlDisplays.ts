import { MySQLPromisePool } from '@fastify/mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Display, PromiseData, DisplayRaw, ZodDisplayRaw } from '../models/index.js';

async function createDisplay(connection: MySQLPromisePool, displayData: Omit<Display, 'id'>): PromiseData<DisplayRaw> {
  let queryString = 'INSERT INTO Displays (name';
  queryString += ', room_id';
  queryString += ') ';

  queryString += 'VALUES ("' + displayData.name;
  queryString += '", ' + displayData.roomId.toString();
  queryString += ');';

  const [result] = await connection.query<ResultSetHeader>(queryString);

  if (result.warningStatus === 0 && result.serverStatus === 2) {
    return getDisplay(connection, result.insertId.toString());
  }

  throw new Error('There was an error creating your display');
}

/**
 * Get single display information.
 * @param id - display ID
 */
async function getDisplay(connection: MySQLPromisePool, id: string): PromiseData<DisplayRaw> {
  let queryString = 'SELECT * FROM Displays WHERE ID = "';
  queryString += id + '";';

  const [rows] = await connection.query<RowDataPacket[]>(queryString);
  if (Array.isArray(rows) && rows.length === 1) {
    const row = rows[0];

    return { data: ZodDisplayRaw.parse(row) };
  }

  throw new Error('There was an error finding your display');
}

/**
 * Get single display information.
 * @param name - display name
 */
async function getDisplayByName(connection: MySQLPromisePool, name: string, roomId: number): PromiseData<DisplayRaw> {
  let queryString = 'SELECT * FROM Displays WHERE NAME = "';
  queryString += name + '" ';
  queryString += ` AND room_id = ${roomId};`;

  const [rows] = await connection.query<RowDataPacket[]>(queryString);
  if (Array.isArray(rows) && rows.length === 1) {
    const row = rows[0];

    return { data: ZodDisplayRaw.parse(row) };
  }

  throw new Error('There was an error finding your display');
}

/**
 * Get all displays for a given room.
 * @param id - room ID
 */
async function getDisplaysForRoom(connection: MySQLPromisePool, id: string): PromiseData<DisplayRaw[]> {
  let queryString = 'SELECT * FROM Displays WHERE room_id = ';
  queryString += id + '';

  const [rows] = await connection.query<RowDataPacket[]>(queryString);
  const data = rows.map((row) => ZodDisplayRaw.parse(row));

  return { data };
}

async function updateDisplay(connection: MySQLPromisePool, displayData: Display): PromiseData<DisplayRaw> {
  let queryString = 'UPDATE Displays ';
  queryString += `SET name = "${displayData.name}", `;
  queryString += 'room_id = ' + displayData.roomId.toString() + ', ';
  queryString += 'card_value = ' + displayData.cardValue.toString() + ', ';
  queryString += 'is_host = ' + displayData.isHost.toString() + ' ';
  queryString += 'WHERE id = ' + displayData.id.toString();

  const [result] = await connection.query<ResultSetHeader>(queryString);

  if (result.warningStatus === 0 && result.serverStatus === 2) {
    return getDisplay(connection, displayData.id.toString());
  }

  throw new Error('There was an error updating your display');
}

export { createDisplay, getDisplay, getDisplayByName, getDisplaysForRoom, updateDisplay };
