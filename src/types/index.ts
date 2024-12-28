export type Guitar = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  stock: number;
};

export type CartItem = Guitar & {
  quantity: number;
};

export enum Sign {
  "+",
  "-",
}
