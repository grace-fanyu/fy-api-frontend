import { addRule, removeRule, rule, updateRule } from '@/services/ant-design-pro/api';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProDescriptionsItemProps } from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import {
  addInterfaceInfoUsingPOST,
  deleteInterfaceInfoUsingPOST,
  listInterfaceInfoByPageUsingGET,
  offlineInterfaceInfoUsingPOST,
  onlineInterfaceInfoUsingPOST,
  updateInterfaceInfoUsingPOST
} from "@/services/fanyui-backend/interfaceInfoController";
import '@umijs/max';
import { Button, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import UpdateForm from './components/UpdateForm';
import {SortOrder} from "antd/lib/table/interface";
import CreateModal from "@/pages/TableList/components/CreateModal";

/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.InterfaceInfo) => {
  const hide = message.loading('正在添加');
  try {
    await addInterfaceInfoUsingPOST({
      ...fields,
    });
    hide();
    //如果调用成功会提示‘操作成功’
    message.success('操作成功');
    return true;
  } catch (error:any) {
    hide();
    //否则提示‘操作失败’+报错信息
    message.error('操作失败'+ error.message);
    return false;
  }
};

/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */
//参数的类型要改成对应的接口
const handleUpdate = async (fields:API.InterfaceInfo) => {
  //
  const hide = message.loading('修改中');
  try {
    //改成对应的接口
    await updateInterfaceInfoUsingPOST({
      ...fields,
    });
    hide();
    //如果调用成功会提示‘操作成功’
    message.success('操作成功');
    return true;
  } catch (error:any) {
    hide();
    //否则提示‘操作失败’+报错信息
    message.error('操作失败'+ error.message);
    return false;
  }
};

/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param fields
 */
const handleRemove = async (fields:API.InterfaceInfo) => {
  const hide = message.loading('正在删除');

  try {
    await deleteInterfaceInfoUsingPOST({
     ...fields,
    });
    hide();
    //如果调用成功会提示‘操作成功’
    message.success('操作成功');
    return true;
  } catch (error:any) {
    hide();
    //否则提示‘操作失败’+报错信息
    message.error('操作失败'+ error.message);
    return false;
  }
};
const TableList: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalOpen, handleModalOpen] = useState<boolean>(false);
  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalOpen, handleUpdateModalOpen] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.InterfaceInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.InterfaceInfo[]>([]);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */

  const columns: ProColumns<API.InterfaceInfo>[] = [
    {
      title: '接口名称',
      //对应后端的字段名
      dataIndex: 'name',
      //展示文本
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
        }]
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      //展示的文本为富文本编辑器
      valueType: 'textarea',
    },
    {
      title: '请求方法',
      dataIndex: 'method',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
        }]
      }
    },
    {
      title: 'url',
      dataIndex: 'url',
      valueType: 'text',
      formItemProps: {
        rules: [{
          required: true,
        }]
      }
    },
    {
      title: '请求参数',
      dataIndex: 'requestParams',
      valueType: 'jsonCode',
    },
    {
      title: '请求头',
      dataIndex: 'requestHeader',
      valueType: 'jsonCode',
    },
    {
      title: '响应头',
      dataIndex: 'responseHeader',
      valueType: 'jsonCode',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '开启',
          status: 'Processing',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        record.status === 0 ? <a
          key="config"
          onClick={() => {
            handleOnline(record);
          }}
        >
          发布
        </a> : null,
        record.status === 1 ? <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleOffline(record);
          }}
        >
          下线
        </Button> : null,
        <Button
          type="text"
          key="config"
          danger
          onClick={() => {
            handleRemove(record);
          }}
        >
          删除
        </Button>,
      ],
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalOpen(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params,
                        sort: Record<string, SortOrder>,
                        filter: Record<string, React.ReactText[] | null>) =>{
          const res = await listInterfaceInfoByPageUsingGET({
          ...params
          })
          //如果后端请求给你返回了接口信息
          if(res?.data) {
            //返回一个包含数据、成功状态和总数的对象
            return {
              data:res?.data.records || [],
              success: true,
              total: res?.data.total || 0,
            };


          }else {
            //如果数据不存在，返回一个空数组，失败状态和零总数
            return {
              data:[],
              success:false,
              tatal:0,
            }

          }
        }}

        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalOpen(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalOpen(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalOpen={updateModalOpen}
        values={currentRow || {}}
      />

      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
      {/*创建一个CreateModal 组件 ，用于在点击新增按钮时弹出*/}
      <CreateModal
        columns={columns}
        //当取消按钮被点击时，设置更新模态框为false以隐藏模态窗口
        onCancel={()=>{
          handleModalOpen(false);
        }}
        //当取消用户点击提交按钮后，调用handleAdd函数处理提交的数据，
        //去请求后端添加数据
        onSubmit={(values)=>{
          handleAdd(values);
        }}
        //根据更新窗口的值决定模态窗口是否显示
        visible = {createModalOpen}/>
    </PageContainer>
  );
};
export default TableList;
