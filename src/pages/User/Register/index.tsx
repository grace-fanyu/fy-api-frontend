import { Footer } from '@/components';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';
import {
  LockOutlined, MailOutlined, RedditOutlined,
  UserOutlined,

} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { Helmet, history, useModel } from '@umijs/max';
import {Alert, Tabs, message, Form} from 'antd';
import React, {useEffect, useState} from 'react';
import Settings from '../../../../config/defaultSettings';
import {sendEmailUsingPOST, userLoginUsingPOST, userRegisterUsingPOST} from "@/services/fanyui-backend/userController";
import {useParams} from "@@/exports";
//at.alicdn.com/t/c/font_4208041_quv2j85xnbq.js
const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};
const Register: React.FC = () => {
  const [type, setType] = useState<string>('email');
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [form] = Form.useForm();
  const params = useParams()

  useEffect(() => {
    if (params.id) {
      setInvitationCode(params.id);
      form.setFieldsValue(invitationCode)
    }
  }, [params.id]);

  useEffect(() => {
    form.setFieldsValue({invitationCode});
  }, [invitationCode]);
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });

  const doRegister = (res: any) => {
    if (res.data && res.code === 0) {
      message.success('注册成功');
      setTimeout(() => {
        history.push('/user/login');
      }, 100);
    }
  }

  const handleSubmit = async (values: API.UserRegisterRequest) => {
    try {
      // 登录
      const res = await userRegisterUsingPOST({
        ...values,
      });
      doRegister(res)
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  const handleEmailSubmit = async (values: API.UserRegisterRequest) => {
    try {
      // 登录
      const res = await userRegisterUsingPOST({
        ...values,
      });
      doRegister(res)
    } catch (error) {
      const defaultLoginFailureMessage = '注册失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'注册'}- {Settings.title}
        </title>
      </Helmet>

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          submitter={
            {
              searchConfig: {
                submitText: "注册"
              }
            }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="Fy-API 接口开放平台"
          subTitle={'Fy-API 接口开放平台致力于提供稳定、安全、高效的接口调用服务'}
          initialValues={{
            autoLogin: true,
          }}
          // actions={['其他登录方式 :', <ActionIcons key="icons" />]}
          onFinish={async (values) => {
            if (type === "account") {
              await handleSubmit(values as API.UserRegisterRequest);
            } else {
              await handleEmailSubmit(values as API.UserRegisterRequest);
            }
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账号密码注册',
              },
              {
                key: 'email',
                label: '邮箱注册',
              },
            ]}
          />

          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <RedditOutlined/>,
                }}
                placeholder={'请输入昵称'}
              />
              <ProFormText
                name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder={'用户名: admin or user'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请填入不小于 8 位的密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={'请确认密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}


          {type === 'email' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <RedditOutlined/>,
                }}
                placeholder={'请输入昵称'}
              />
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined />,
                }}
                name="email"
                placeholder={'请输入邮箱！'}
                rules={[
                  {
                    required: true,
                    message: '邮箱是必填项！',
                  },
                  {
                    pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
                    message: '不合法的邮箱！',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码！'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} 秒后重新获取`;
                  }
                  return '获取验证码';
                }}
                name="code"
                rules={[
                  {
                    required: true,
                    message: '验证码是必填项！',
                  },
                ]}
                onGetCaptcha={async (email) => {
                  const res = await sendEmailUsingPOST({email})
                  if (res.data && res.code === 0) {
                    message.success("验证码发送成功")
                    return
                  }
                }}

              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox
              initialValue={true}
              name="agreeToAnAgreement"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error("同意协议后才可以注册"));
                    }
                    return Promise.resolve();
                  },
                  required: true,
                })]}
            >
              同意并接受《<a
              target={"_blank"}
              href={"https://gitee.com/qimu6/statement/blob/master/%E9%9A%90%E7%A7%81%E5%8D%8F%E8%AE%AE.md#%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3-%E9%9A%90%E7%A7%81%E6%9D%A1%E6%AC%BE"}
              rel="noreferrer">隐私协议</a>》《<a
              target={"_blank"}
              href={"https://gitee.com/qimu6/statement/blob/master/%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE.md#%E6%9F%92%E6%9C%A8%E6%8E%A5%E5%8F%A3%E7%94%A8%E6%88%B7%E5%8D%8F%E8%AE%AE"}
              rel="noreferrer">用户协议</a>》
            </ProFormCheckbox>
            <a
              onClick={ () =>{
                history.push("/user/login")
              }
              }
              style={{
                float: 'right',
              }}
            >
              已有账号?来登录吧
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};
export default Register;
