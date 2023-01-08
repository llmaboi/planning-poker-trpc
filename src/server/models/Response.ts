interface ResponseData<T> {
  data: T;
}

type PromiseData<T> = Promise<ResponseData<T>>;

export type { PromiseData, ResponseData };
