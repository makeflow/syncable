import {ISyncable} from './syncable';
import {SyncableContainer} from './syncable-container';
import {ISyncableObject} from './syncable-object';

export interface ISyncableAdapter {
  instantiate(
    syncable: ISyncable,
    container: SyncableContainer,
  ): ISyncableObject;
}