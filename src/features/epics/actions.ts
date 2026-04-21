"use server"

import {
  getEpics,
  type GetEpicsOptions,
  type EpicsQueryResult,
} from "@/features/epics/queries"

export async function getEpicsAction(
  projectId: string,
  options: GetEpicsOptions = {}
): Promise<EpicsQueryResult> {
  return getEpics(projectId, options)
}
