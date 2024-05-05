import http from "@utils/request";

interface IOrderAdd{
   code:string;
   msg:string;
   data:string | null;
}

//报名
export const orderAdd = ( data ):Promise<IOrderAdd>=>{
	return http.post<IOrderAdd>('/crm/recruit/order/add',data)
}
