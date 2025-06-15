export interface Template {
    _id: string;
    name: string;
    category: string;
    price: string;
    priceAmount: number;
    comparePrice: number;
    status: string;
    thumbnail: string;
    html: string;
    css: string;
    js: string;
    dynamicFields: Array<{
      id: string;
      name: string;
      type: string;
      defaultValue: string;
      description: string;
    }>;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }