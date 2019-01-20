import {Dict, Nominal} from 'tslang';

import {SyncableRef} from './syncable';
import {ISyncableObject} from './syncable-object';
import {NumericTimestamp} from './types';

export type ChangePacketId = Nominal<string, 'change-packet-id'>;

export interface SyncableCreationRef<
  T extends ISyncableObject = ISyncableObject
> {
  type: T['syncable']['_type'];
  create: {
    id: T['syncable']['_id'];
  };
}

export type GeneralSyncableRef = SyncableRef | SyncableCreationRef;

export interface IChange {
  type: string;
  refs: object;
  options: object | undefined;
}

export interface GeneralChange extends IChange {
  refs: Dict<SyncableRef | SyncableCreationRef>;
}

export interface ChangePacket extends GeneralChange {
  id: ChangePacketId;
  createdAt: NumericTimestamp;
}