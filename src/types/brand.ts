/**
 * Generic branded type helper for nominal typing in TypeScript.
 */
export type Brand<T, TBrand extends string> = T & { readonly __brand: TBrand }

/**
 * Nominal type for User ID to prevent mixing with arbitrary strings.
 */
export type UserId = Brand<string, "UserId">

/**
 * Nominal type for Student ID.
 */
export type StudentId = Brand<string, "StudentId">

/**
 * Nominal type for Learning Topic ID.
 */
export type LearningTopicId = Brand<string, "LearningTopicId">

/**
 * Nominal type for Query Activity ID.
 */
export type QueryId = Brand<string, "QueryId">

/**
 * Nominal type for Query Execution ID.
 */
export type QueryExecutionId = Brand<string, "QueryExecutionId">

/**
 * Helpers to construct branded types from validated strings.
 */
export function toUserId(rawId: string): UserId {
  return rawId as UserId
}

export function toStudentId(rawId: string): StudentId {
  return rawId as StudentId
}

export function toLearningTopicId(rawId: string): LearningTopicId {
  return rawId as LearningTopicId
}

export function toQueryId(rawId: string): QueryId {
  return rawId as QueryId
}

export function toQueryExecutionId(rawId: string): QueryExecutionId {
  return rawId as QueryExecutionId
}
