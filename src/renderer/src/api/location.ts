import http from "@utils/request";


export interface IGetAreaByParentId{
    id:string;
    areaName:string;
    parentId:string;
    shortName:string;
    lng:string;
    lat:string;
    level:number;
    sort:number;
    hasChildren:boolean;
}
export interface IGetAreaByParentIdData{
    code:string;
    msg:string;
    data:IGetAreaByParentId[]
}

//查询地区（通过上级ID）
export const getAreaByParentId = (data:{
    parentId:string;
}):Promise<IGetAreaByParentIdData>=>{
	return http.get<IGetAreaByParentIdData>('/system/area/getAreaByParentId',data)
}