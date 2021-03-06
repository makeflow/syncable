import {SyncableRef} from '@syncable/core';
import {BroadcastChangeResult, Connection} from '@syncable/server';
import _ from 'lodash';
import Lolex, {Clock} from 'lolex';
import {Subject} from 'rxjs';

import {
  Kanban,
  KanbanId,
  ServerGenericParams,
  TaskId,
  UserId,
  createClientConnectionPair,
  createServer,
} from './@setup';

let lolexClock: Clock;

beforeEach(() => {
  lolexClock = Lolex.install({
    now: 1500000000000,
    shouldAdvanceTime: true,
  });
});

afterEach(() => {
  lolexClock.uninstall();
});

let connection$ = new Subject<Connection<ServerGenericParams>>();
let broadcastSource$ = new Subject<BroadcastChangeResult>();

let server = createServer(connection$, broadcastSource$);

test('should initialize client with syncables and context data', async () => {
  let [client, connection, close] = createClientConnectionPair(
    server,
    'group-1',
    'user-1' as UserId,
  );

  connection$.next(connection);

  await client.ready;

  expect(_.cloneDeep(client.container.getSyncables())).toMatchSnapshot();
  expect(client.context.object.id).toBe('user-1');

  close();
});

test('should query tasks', async () => {
  let [client, connection, close] = createClientConnectionPair(
    server,
    'group-1',
    'user-1' as UserId,
  );

  connection$.next(connection);

  await client.query({
    task: {
      refs: {},
      options: {},
    },
  });

  expect(_.cloneDeep(client.container.getSyncables('task'))).toMatchSnapshot();

  close();
});

test('should query by kanban', async () => {
  let [client, connection, close] = createClientConnectionPair(
    server,
    'group-1',
    'user-1' as UserId,
  );

  connection$.next(connection);

  let kanbanRef: SyncableRef<Kanban> = {
    type: 'kanban',
    id: 'kanban-1' as KanbanId,
  };

  await client.requestObject(kanbanRef);

  await client.query({
    kanban: {
      refs: {
        kanban: kanbanRef,
      },
      options: {},
    },
  });

  expect(_.cloneDeep(client.container.getSyncables('task'))).toMatchSnapshot();

  close();
});

test('should request tasks', async () => {
  let [client, connection, close] = createClientConnectionPair(
    server,
    'group-1',
    'user-1' as UserId,
  );

  connection$.next(connection);

  let tasks = await client.requestObjects([
    {type: 'task', id: 'task-1' as TaskId},
    {type: 'task', id: 'task-2' as TaskId},
  ]);

  expect(
    _.cloneDeep(tasks.map(task => task && task.syncable)),
  ).toMatchSnapshot();

  close();
});

test('should request single task', async () => {
  let [client, connection, close] = createClientConnectionPair(
    server,
    'group-1',
    'user-1' as UserId,
  );

  connection$.next(connection);

  let task = await client.requestObject({type: 'task', id: 'task-1' as TaskId});

  expect(_.cloneDeep(task && task.syncable)).toMatchSnapshot();

  close();
});

test('should update task brief', async () => {
  let [client, connection, close] = createClientConnectionPair(
    server,
    'group-1',
    'user-1' as UserId,
  );

  connection$.next(connection);

  await client.query({
    task: {
      refs: {},
      options: {},
    },
  });

  let task = client.requireObject({type: 'task', id: 'task-2' as TaskId});

  let {promise} = client.applyChange({
    type: 'task:update-task-brief',
    refs: {
      task: task.ref,
    },
    options: {
      brief: 'New brief for task 2',
    },
  });

  expect(_.cloneDeep(task && task.syncable)).toMatchSnapshot('local-update');

  await promise;

  expect(_.cloneDeep(task && task.syncable)).toMatchSnapshot(
    'confirmed-update',
  );

  close();
});
