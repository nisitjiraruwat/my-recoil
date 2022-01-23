import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios'
import { useState } from 'react'

interface IOptions<T> {
  onSuccess?: (data: T, response: AxiosResponse<T>) => void;
  onError?: (error: AxiosError) => void;
  immediate: boolean
}

const defaultObserverOptions = <T>(options?: IOptions<T>): IOptions<T> => {
  const defaultOptions: IOptions<T> = {
    immediate: false
  }

  if (options === undefined) {
    return defaultOptions
  }

  return {
    ...defaultOptions,
    ...options
  }
}

export default function useAxiosResponse<T = unknown>(
  requestFn: (cancelToken?: CancelTokenSource) => Promise<AxiosResponse<T>>,
  options?: IOptions<T>
) {
  const defaultedOptions = defaultObserverOptions(options)
  const [response, setResponse] = useState<AxiosResponse<T>>()
  const [data, setData] = useState<T>()
  const [isFinished, setIsFinished] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAborted, setIsAborted] = useState(false)
  const [error, setError] = useState<AxiosError>()
  const [cancelToken, setCancelToken] = useState<CancelTokenSource>()

  const abort = (message?: string) => {
    if (isFinished || !isLoading || cancelToken === undefined) {
      return
    }

    cancelToken.cancel(message)
    setIsAborted(true)
    setIsLoading(false)
    setIsFinished(false)
  }

  const execute = async () => {
    setIsFinished(false)
    setIsLoading(true)
    setIsAborted(false)
    setError(undefined)
    setCancelToken(axios.CancelToken.source())
    requestFn(cancelToken)
      .then((r: AxiosResponse<T>) => {
        defaultedOptions.onSuccess !== undefined && defaultedOptions.onSuccess(r.data, r)
        setResponse(r)
        setData(r.data)
      })
      .catch((e) => {
        setError(e)
        defaultedOptions.onError !== undefined && error && defaultedOptions.onError(error)
      })
      .finally(() => {
        setIsLoading(false)
        setIsFinished(true)
      })
  }

  if (defaultedOptions.immediate) {
    execute()
  }

  return {
    execute,
    response,
    data,
    error,
    isFinished,
    isLoading,
    abort,
    isAborted
  }
}
