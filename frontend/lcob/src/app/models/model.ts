export interface SellerLogin{
    fullName:string;
    phoneNumber:string;
    password:string,
    role:string
}

export interface IuserSignupObj{
    fullName:string;
    phoneNumber:string;
    password:string
    role:string
}


export interface IproductObj{
    name:string,
    price:number,
    stock:number,
    description:string,
    image:string,
    
}

export interface IproductGetObj{
    name:string,
    price:number,
    stock:number,
    description:string,
    image:string,
    _id:string
}


export interface IcartObj{
  _id: string;
  userId: string;
  items: any[]; 
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface OrderItem {
  productId: string; // product ID
  quantity: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}
export interface Order {
  
  items: OrderItem[];
  totalAmout: number;
  address: string;
  location: Location;
  

}
