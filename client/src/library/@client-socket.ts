import {
  ChangePacket,
  InitialData,
  SyncableRef,
  SyncingData,
} from '@syncable/core';

export interface ClientSocket extends SocketIOClient.Socket {
  on(event: 'syncable:reconnect', listener: (attempt: number) => void): this;
  on(event: 'syncable:initialize', listener: (data: InitialData) => void): this;
  on(event: 'syncable:sync', listener: (data: SyncingData) => void): this;

  emit(event: 'syncable:view-query', query: unknown): this;
  emit(event: 'syncable:change', packet: ChangePacket): this;
  emit(event: 'syncable:request', ref: SyncableRef): this;
}
