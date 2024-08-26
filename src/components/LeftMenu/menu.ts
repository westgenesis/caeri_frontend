import { VueElement, h } from 'vue';
import { MailOutlined, AppstoreOutlined, SettingOutlined, HomeOutlined} from '@ant-design/icons-vue';

export function getItem(
    label: VueElement | string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
  ): ItemType {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as ItemType;
  }

  