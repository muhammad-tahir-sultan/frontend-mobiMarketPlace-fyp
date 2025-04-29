import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { MessageResponse } from "../types/api-types"
import { SerializedError } from "@reduxjs/toolkit"
import { NavigateFunction } from "react-router-dom"
import toast from "react-hot-toast"
import moment from "moment"

type ResType =
    | {
        data: MessageResponse
    }
    | {
        error: FetchBaseQueryError | SerializedError
    }


export const responseToast = (res: ResType, navigate: NavigateFunction | null, url: string) => {
    if ("data" in res) {
        toast.success(res.data!.message!)
        if (navigate && url) {
            navigate(url)
        }
    } else {
        const error = res.error as FetchBaseQueryError
        const message = (error.data as MessageResponse).message
        toast.error(message)
    }
}


export const getLastMonths = () => {
    const currentDate = moment()

    currentDate.date(1)

    const last6Months: string[] = []
    const last12Months: string[] = []

    for (let i = 0; i < 6; i++) {
        last6Months.unshift(currentDate.format("MMM"))
        currentDate.subtract(1, "month")
    }
    for (let i = 0; i < 12; i++) {
        last12Months.unshift(currentDate.format("MMM"))
        currentDate.subtract(1, "month")
    }

    return { last6Months, last12Months }
}