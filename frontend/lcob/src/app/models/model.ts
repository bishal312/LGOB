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