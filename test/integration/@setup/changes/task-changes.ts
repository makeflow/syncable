import {ChangePlantBlueprint, SyncableRef} from '@syncable/core';

import {Context} from '../context';
import {SyncableObject, Task} from '../syncables';

export type TaskChange = TaskUpdateTaskBriefChange;

export interface TaskUpdateTaskBriefChange {
  type: 'task:update-task-brief';
  refs: {
    task: SyncableRef<Task>;
  };
  options: {
    brief: string;
  };
}

export interface ChangePlantTaskBlueprintGenericParams {
  context: Context;
  syncableObject: SyncableObject;
  change: TaskChange;
  notification: never;
}

export const taskBlueprint: ChangePlantBlueprint<ChangePlantTaskBlueprintGenericParams> = {
  'task:update-task-brief'({task}, {}, {options: {brief}}) {
    task.brief = brief;
  },
};
