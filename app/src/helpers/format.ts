/* eslint-disable @typescript-eslint/no-explicit-any */

import dayjs from "dayjs"
import "dayjs/locale/fr"
dayjs.locale("fr")

const arrayEquals = <T>(a: Array<T>, b: Array<T>): boolean => {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  )
}

const findDuplicates = <T>(arr: Array<T>): Array<T> => {
  const uniqueSet: Set<T> = new Set()
  const duplicatesSet: Set<T> = new Set()

  for (let i = 0; i < arr.length; i++) {
    const element = arr[i]
    if (uniqueSet.has(element)) {
      duplicatesSet.add(element)
    } else {
      uniqueSet.add(element)
    }
  }

  return Array.from(duplicatesSet)
}

// keyToCamel code coming from https://matthiashager.com/converting-snake-case-to-camel-case-object-keys-with-javascript
const isObject = function (input: unknown) {
  return input === Object(input) && !Array.isArray(input) && typeof input !== "function"
}
const toCamel = (string: string) => {
  return string.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace("-", "").replace("_", "")
  })
}
const keysToCamel = (input: any): any => {
  if (isObject(input)) {
    const res: Record<string, string> = {}

    Object.keys(input).forEach((key) => {
      Object.assign(res, {
        [toCamel(key)]: keysToCamel(input[key]),
      })
    })

    return res
  } else if (Array.isArray(input)) {
    return input.map((index) => {
      return keysToCamel(index)
    })
  }

  return input
}

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const formatDate = (date: string | null, format = "DD/MM/YYYY") =>
  dayjs(date).isValid() ? dayjs(date).format(format) : ""

const today = dayjs().format("YYYY-MM-DD")
const oneYearAgo = dayjs().subtract(1, "year").format("YYYY-MM-DD")

const getQueryAsString = (searchParams: URLSearchParams, key: string) =>
  decodeURIComponent(searchParams.get(key) ?? "")

const getQueryAsArray = (searchParams: URLSearchParams, key: string) =>
  searchParams
    .getAll(key)
    .filter(Boolean)
    .map((value) => decodeURIComponent(value))

const getQueryAsNumberArray = (searchParams: URLSearchParams, key: string) =>
  searchParams
    .getAll(key)
    .map((value) => Number(decodeURIComponent(value)))
    .filter(Boolean)

const getQueryPage = (searchParams: URLSearchParams) =>
  parseInt(searchParams.get("page") || "1")

const createFiltersQuery = (
  startDate: string,
  endDate: string,
  motives: string[],
  natures: string[],
  jobs: number[]
) => {
  let query = ""
  // todo useful at all or use current location works fine ?
  // todo refacto with map english key <=> french query param
  if (startDate) query += "&debut=" + startDate
  if (endDate) query += "&fin=" + endDate
  if (motives) motives.forEach((motive) => (query += `&motif=${motive}`))
  if (natures) natures.forEach((nature) => (query += `&nature=${nature}`))
  if (jobs) jobs.forEach((job) => (query += `&poste=${job}`))

  return query
}

/* Format unknow data from localstorage */

export const formatLocalMerges = (data: unknown): number[][] | undefined => {
  let formattedMergesIds: number[][] | undefined
  if (Array.isArray(data)) {
    formattedMergesIds = [] as number[][]
    data.forEach((merge) => {
      if (Array.isArray(merge)) {
        Array.isArray(formattedMergesIds) &&
          formattedMergesIds.push(merge.map(Number).filter(Boolean))
      }
    })
    formattedMergesIds = formattedMergesIds.filter((merge) => merge.length > 0)
  } else formattedMergesIds = undefined

  return formattedMergesIds
}

type DayCode = "0" | "1" | "2" | "3" | "4" | "5" | "6"

export const formatLocalOpenDays = (
  dataFromLocalStorage: unknown
): DayCode[] | undefined => {
  let formattedOpenDaysCode: DayCode[] | undefined

  if (Array.isArray(dataFromLocalStorage)) {
    formattedOpenDaysCode = dataFromLocalStorage.filter((item) => {
      return (
        typeof item === "string" && ["0", "1", "2", "3", "4", "5", "6"].includes(item)
      )
    })
  }

  return formattedOpenDaysCode
}

export {
  arrayEquals,
  capitalize,
  createFiltersQuery,
  findDuplicates,
  formatDate,
  getQueryAsArray,
  getQueryAsNumberArray,
  getQueryAsString,
  getQueryPage,
  isObject,
  keysToCamel,
  oneYearAgo,
  toCamel,
  today,
}
