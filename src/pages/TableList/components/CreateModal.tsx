import {ProColumns, ProTable} from "@ant-design/pro-components";
import '@umijs/max';
import React from 'react';
import {Modal} from "antd";


//这里定义一些这个组件要接收什么参数、属性
export type Props = {
  columns:ProColumns<API.InterfaceInfo>[];
  //当用户点击取消按钮时触发
  onCancel: () => void;
  //当用户提交表单时，将用户输入的数据作为参数传递给后台
  onSubmit: (values:API.InterfaceInfo) => Promise<void>;
  //模态框是否可见
  visible: boolean;
  //values不用传递
  //values: Partial<API.RuleListItem>;
};
const CreateForm: React.FC<Props> = (props) => {
  //使用解构赋值获取props中的属性
  const {visible,columns,onCancel,onSubmit} =props;
  return (
    //创建一个Modal组件，通过visible属性控制其显示或隐藏，footer设置为null把表单项的‘取消’和‘确认’按钮去掉

    <Modal visible={visible} footer={null} onCancel={() => onCancel?.()}>
      <ProTable
        type="form"
        columns={columns}
        onSubmit={async (value)=>{onSubmit?.(value);}}
      />

    </Modal>
  );
};
export default CreateForm;


