import { APIMethod } from "../enums/common.enum"

export interface APIResponseDetails {
  url: string
  method: APIMethod
  status: number
  alternateStatus?: number
  hasStatusContains?: boolean
}
