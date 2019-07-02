import { UserProfile, DateTimeFieldFormatType } from "@pnp/sp";

export interface ApproveListItem{
    Title:string; //标题
    Id:number;  //ID
    Content:string; //正文
    ApprovalUser:UserProfile;//当前审批人
    CCUser:UserProfile; //传阅人
    ApprovalState:string; //当前审批状态
    ApproveTime:DateTimeFieldFormatType; //审批时间
    Forwarder:UserProfile; //转发人
    ApprovalUsers:UserProfile;//审批人
    ReadUsers:UserProfile;//已阅人
    DeptId:string;//部门ID
    TypeId:string;//类型ID
    ProjectId:string;//项目编号
    ApproveID:number;//项目编码 和审批记录关联
    createTime:DateTimeFieldFormatType; //创建时间
    createUser:UserProfile; //创建者
}