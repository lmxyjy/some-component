/**
 * 复制文本
 * @param text 需要复制的字符串
 * @returns
 */
const copyToClipboard = (text: string | number): boolean => {
  if (!text) return false;

  let textArea = document.createElement('textarea');

  textArea.style.position = 'fixed';

  textArea.style.top = '0';

  textArea.style.left = '0';

  textArea.style.width = '2em';

  textArea.style.height = '2em';

  textArea.style.padding = '0';

  textArea.style.border = 'none';

  textArea.style.outline = 'none';

  textArea.style.boxShadow = 'none';

  textArea.style.background = 'transparent';

  textArea.value = text.toString();

  document.body.appendChild(textArea);

  textArea.select();

  let res = !!document.execCommand('copy');

  document.body.removeChild(textArea);

  return res;
};

export default copyToClipboard;
