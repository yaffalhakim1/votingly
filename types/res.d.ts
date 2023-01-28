interface Res<T> {
  success?: boolean;
  message?: string;
  status: number;
  data?: T;
}
