import { EVENT_ANALYZE_CONFIG_PROP_SEPARATOR } from '../common/constants/config.constant';
import { ConfigType, ValueType } from '../common/types';
import { parseValue } from '../common/utils/string.util';
import { BaseSerializer } from './base.serializer';

class ConfigSerializer extends BaseSerializer {
  private ignoreSign = '#';

  parse(cfg: string): ConfigType {
    const newLineRegex = /\r?\n/;
    const rawProps = cfg.split(newLineRegex).filter(Boolean);
    const props = rawProps.reduce((total: Record<string, ValueType>, p: string) => {
      if (this.shouldIgnoreRow(p)) {
        return total;
      }

      const [prop, value] = p.split(EVENT_ANALYZE_CONFIG_PROP_SEPARATOR);
      const safeValue = parseValue(value);

      return {
        ...total,
        [prop]: safeValue
      };
    }, {});

    return props;
  }

  private shouldIgnoreRow(row: string) {
    return row.startsWith(this.ignoreSign);
  }

  stringify(data: Record<string, string | string[]>): string {
    return Object.entries(data).reduce(
      (total, [key, value]) =>
        `${total}${
          (Array.isArray(value) && value.length) || (!Array.isArray(value) && value)
            ? `${key}${EVENT_ANALYZE_CONFIG_PROP_SEPARATOR}${
                Array.isArray(value) ? value.join(',') : value
              }\n`
            : ''
        }`,
      ''
    );
  }
}

export const configSerializer = new ConfigSerializer();
