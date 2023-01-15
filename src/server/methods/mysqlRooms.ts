import { MySQLPromisePool } from '@fastify/mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Room, PromiseData, RoomRaw, ZodRoomRaw, DisplayRaw } from '../models';

import { getDisplaysForRoom } from './mysqlDisplays';

async function createRoom(
  connection: MySQLPromisePool,
  roomData: Omit<Room, 'id'>
): PromiseData<RoomRaw> {
  let queryString = 'INSERT INTO Rooms (name';
  if (roomData.label) {
    queryString += ', label';
  }
  queryString += ') ';

  queryString += 'VALUES ("' + roomData.name;
  if (roomData.label) {
    queryString += '", "' + roomData.label;
  }
  queryString += '")';

  const [result] = await connection.query<ResultSetHeader>(queryString);

  if (result.warningStatus === 0 && result.serverStatus === 2) {
    return getRoom(connection, result.insertId.toString());
  }

  throw new Error('There was an error creating your room');
}

async function getRoom(
  connection: MySQLPromisePool,
  id: string
): PromiseData<RoomRaw> {
  let queryString = 'SELECT * FROM Rooms WHERE ID = "';
  queryString += id + '"';

  const [rows] = await connection.query<RowDataPacket[]>(queryString);
  if (Array.isArray(rows) && rows.length === 1) {
    const row = rows[0];

    return { data: ZodRoomRaw.parse(row) };
  }

  throw new Error('There was an error finding your room');
}

async function getRooms(connection: MySQLPromisePool): PromiseData<RoomRaw[]> {
  const queryString = 'SELECT * FROM Rooms';

  const [rows] = await connection.query<RowDataPacket[]>(queryString);
  const data = rows.map((row) => ZodRoomRaw.parse(row));

  return { data };
}

async function updateRoom(
  connection: MySQLPromisePool,
  roomData: Room
): PromiseData<RoomRaw> {
  let queryString = 'UPDATE Rooms ';
  queryString += `SET name = "${roomData.name}"`;
  if (roomData.label) {
    queryString += `, label = "${roomData.label}"`;
  }
  queryString += ' WHERE id = ' + roomData.id.toString();

  const [result] = await connection.query<ResultSetHeader>(queryString);

  if (result.warningStatus === 0 && result.serverStatus === 2) {
    return getRoom(connection, roomData.id.toString());
  }

  throw new Error('There was an error updating your room');
}

async function updateRoomDisplayCards(
  connection: MySQLPromisePool,
  roomId: string
): PromiseData<DisplayRaw[]> {
  let queryString = 'UPDATE Displays ';
  queryString += 'SET card_value = 0';
  queryString += ' WHERE room_id = ' + roomId + ';';

  const [result] = await connection.query<ResultSetHeader>(queryString);

  if (
    result.warningStatus === 0
    // Unsure about serverStatus...
    // && result.serverStatus === 2
  ) {
    return getDisplaysForRoom(connection, roomId);
  }

  return { data: [] };
}

export { createRoom, getRoom, getRooms, updateRoom, updateRoomDisplayCards };
