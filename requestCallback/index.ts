import { message } from "antd";
import _ from "lodash";

// 处理请求以及请求的回调结果
interface IRequestCallbackArgs {
  /**
   * 请求函数
   */
  reqFn: () => Promise<any>;
  /**
   * 成功后的回调
   */
  onSuccess?: (result: any) => void;
  /**
   * 异常or不成功回调
   */
  onFailed?: (error: any) => void;
  /**
   *
   */
  onFinally?: () => void;
  /**
   * 成功后的提示
   */
  sTip?: string;
  /**
   * 失败后的提示
   */
  fTip?: string;
  /**
   * 异常提示
   */
  eTip?: string;
}

const requestCallback = async (args: IRequestCallbackArgs) => {
  const { reqFn, onSuccess, onFailed, onFinally, sTip, fTip, eTip } = args;

  try {
    const res = await reqFn();
    const result = res?.data?.data || res?.data?.value;
    if (
      (typeof result === "number" && result >= 1) ||
      (typeof result === "object" && !_.isEmpty(result))
    ) {
      // 获取值得操作是不用提示成功的
      typeof result === "number" && message.success(sTip || "操作成功");
      onSuccess && onSuccess(result);
    } else {
      message.error(fTip || "操作失败");
      onFailed && onFailed(res?.data);
    }
  } catch (error: any) {
    message.error(eTip || error.message || "系统繁忙，请稍后重试");
    onFailed && onFailed(error);
  } finally {
    onFinally && onFinally();
  }
};

export default requestCallback;
