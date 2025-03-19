// 工具函数
const parseNumberValue = (rawValue) => {
  return rawValue.startsWith('--') ? 
      -parseInt(rawValue.slice(2)) : 
      parseInt(rawValue);
};

const parseColorValue = (color, property, config) => {
  if (config.theme?.colors?.[color]) {
    return `${property}: ${config.theme.colors[color]};`;
  }
  if (color.startsWith('#')) {
    return `${property}: ${color};`;
  }
  if (/^[a-zA-Z]+$/.test(color)) {
    return `${property}: ${color};`;
  }
  return `${property}: #${color};`;
};

// 规则生成器
const createSimpleRule = (prefix, property, unit = 'default') => ({
  pattern: new RegExp(`^${prefix}-(-?\\d+|--\\d+)$`),
  generate: (match, config) => `${property}: ${parseNumberValue(match[1])}${config.units[unit]};`
});

const createDirectionalRule = (prefix, property, unit = 'spacing') => {
  const directions = [
    { short: 't', full: 'top' },
    { short: 'r', full: 'right' },
    { short: 'b', full: 'bottom' },
    { short: 'l', full: 'left' }
  ];
  
  return directions.map(({ short, full }) => ({
    pattern: new RegExp(`^${prefix}${short}-(-?\\d+|--\\d+)$`),
    generate: (match, config) => `${property}-${full}: ${parseNumberValue(match[1])}${config.units[unit]};`
  }));
};
/**
 * 创建枚举规则生成器
 * @param {string} prefix - CSS类名前缀
 * @param {string} property - CSS属性名
 * @param {string[]} values - 允许的枚举值数组
 * @param {Function|null} transform - 可选的值转换函数
 * @returns {Object} 返回包含pattern和generate方法的规则对象
 */
// 示例: 
// createEnumRule('display', 'display', ['block', 'flex']) 会生成一个规则
// 可以匹配 display-block 或 display-flex
// 并生成对应的 CSS: display: block; 或 display: flex;
const createEnumRule = (prefix, property, values, transform = null) => ({
  pattern: new RegExp(`^${prefix}-(${values.join('|')})$`),
  generate: (match) => `${property}: ${transform ? transform(match[1]) : match[1]};`
});
const rules = [
  // 基础尺寸规则
  createSimpleRule('w', 'width'),
  createSimpleRule('h', 'height'),
  createSimpleRule('m', 'margin', 'spacing'),
  createSimpleRule('p', 'padding', 'spacing'),
  
  // 方向性规则
  ...createDirectionalRule('m', 'margin'),
  ...createDirectionalRule('p', 'padding'),

  // Display 规则
  {
    pattern: /^(block|inline|inline-block|flex|grid|none)$/,
    generate: (match) => `display: ${match[1]};`
  },

  // Float 规则
  createEnumRule('float', 'float', ['left', 'right', 'none']),
    // Object-fit 规则
  createEnumRule('object','object-fit',['contain','cover','fill','none','scale-down']),

  // Object-position 规则
  createEnumRule('object','object-position',['top','bottom','center','left','right']),

  // Overflow 规则
  createEnumRule('overflow-x', 'overflow-x', ['auto', 'hidden', 'visible', 'scroll']),
  createEnumRule('overflow-y', 'overflow-y', ['auto', 'hidden', 'visible','scroll']),
  createEnumRule('overflow', 'overflow', ['auto', 'hidden', 'visible','scroll']),

  // Position 规则
  {
    pattern: /^(static|relative|absolute|fixed|sticky)$/,
    generate: (match) => `position: ${match[1]};`
  },

  // Visibility 规则
  {
    pattern: /^(visible|invisible|collapse)$/,
    generate: (match) => `visibility: ${match[1]};`
  },
  createEnumRule('flex','flex-wrap',['wrap','nowrap','wrap-reverse']),

  createEnumRule('items','align-items',['start','end','center','baseline','stretch']),
    // 文本对齐

  createEnumRule('text','text-align',['left','right','center','justify']),
  createEnumRule('border','border-style',['solid','dashed','dotted','none']),
    // Cursor 规则
  createEnumRule('cursor','cursor',['pointer','default','not-allowed','wait','text','move','grab']),
    // 文本转换
  {
    pattern: /^(uppercase|lowercase|capitalize)$/,
    generate: (match) => `text-transform: ${match[1]};`
  },
    // Word-break 规则
  createEnumRule('break','word-break',['normal','all','words']),


  // User-select 规则
  createEnumRule('select','user-select',['none','text','all','auto','contain']),

  // 滚动条行为
  createEnumRule('scroll','scroll-behavior',['auto','smooth']),
  {
    pattern: /^fs-(\d+)$/,
    generate: (match, config) => `font-size: ${match[1]}${config.units.fontSize};`
  },

  // margin规则
  {
    pattern: /^mt-(-?\d+)$/,
    generate: (match, config) => `margin-top: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  {
    pattern: /^mr-(-?\d+)$/,
    generate: (match, config) => `margin-right: ${parseNumberValue(match[1])}${config.units.spacing};`

  },
  {
    pattern: /^mb-(-?\d+)$/,
    generate: (match, config) => `margin-bottom: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  {
    pattern: /^ml-(-?\d+|--\d+)$/,
    generate: (match, config) => `margin-left: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  // my
  {
    pattern: /^my-(\d+)$/,
    generate: (match, config) => `margin-top: ${parseNumberValue(match[1])}${config.units.spacing};margin-bottom: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  // mx-auto
  {
    pattern: /^mx-auto$/,
    generate: () => `margin-left: auto;margin-right: auto;`
  },

  // padding规则
  {
    pattern: /^pt-(-?\d+|--\d+)$/,
    generate: (match, config) => `padding-top: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  {
    pattern: /^pr-(-?\d+|--\d+)$/,
    generate: (match, config) => `padding-right: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  {
    pattern: /^pb-(-?\d+|--\d+)$/,
    generate: (match, config) => `padding-bottom: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  {
    pattern: /^pl-(-?\d+|--\d+)$/,
    generate: (match, config) => `padding-left: ${parseNumberValue(match[1])}${config.units.spacing};`
  },
  // py
  {
    pattern: /^py-(\d+)$/,
    generate: (match, config) => `padding-top: ${parseNumberValue(match[1])}${config.units.spacing};padding-bottom: ${parseNumberValue(match[1])}${config.units.spacing};`
  },

  // 颜色规则，例如: c-red => color: red
  // 颜色规则
  {
    pattern: /^(c|color|text)-(.+)$/,
    generate: (match, config) => parseColorValue(match[2], 'color', config)
  },
  // 背景颜色规则
  {
    pattern: /^(bg|background)-(.+)$/,
    generate: (match, config) => parseColorValue(match[2], 'background-color', config)
  },


  // Top, Right, Bottom, Left 规则
  {
    pattern: /^(top|right|bottom|left)-(-?\d+|--\d+)$/,
    generate: (match, config) => `${match[1]}: ${parseNumberValue(match[2])}${config.units.default};`
  },

  // Z-index 规则
  {
    pattern: /^z-(-?\d+|--\d+)$/,
    generate: (match) => `z-index: ${match[1]};`
  },

  // Flex 相关规则
  {
    pattern: /^flex-(row|col|row-reverse|col-reverse)$/,
    generate: (match) => {
      const value = match[1].replace('col', 'column');
      return `flex-direction: ${value};`;
    }
  },
  {
    pattern: /^flex-(auto|\d+)$/,
    generate: (match) => `flex: ${match[1]};`
  },
  // gap相关规则
  {
    pattern: /^gap-(\d+)$/,
    generate: (match, config) => `gap: ${match[1]}${config.units.spacing};`
  },
  {
    pattern: /^gap-x-(\d+)$/,
    generate: (match, config) => `column-gap: ${match[1]}${config.units.spacing};`
  },
  {
    pattern: /^gap-y-(\d+)$/,
    generate: (match, config) => `row-gap: ${match[1]}${config.units.spacing};`
  },

// Justify & Align 规则
createEnumRule(
  'justify',
  'justify-content',
  ['start', 'end', 'center', 'between', 'around', 'evenly'],
  (value) => {
    const transforms = {
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly'
    };
    return transforms[value] || value;
  }
),

  // Width & Height 限制
  {
    pattern: /^min-w-(\d+)$/,
    generate: (match, config) => `min-width: ${match[1]}${config.units.default};`
  },
  {
    pattern: /^max-w-(\d+)$/,
    generate: (match, config) => `max-width: ${match[1]}${config.units.default};`
  },
  {
    pattern: /^min-h-(\d+)$/,
    generate: (match, config) => `min-height: ${match[1]}${config.units.default};`
  },
  {
    pattern: /^max-h-(\d+)$/,
    generate: (match, config) => `max-height: ${match[1]}${config.units.default};`
  },

  // 字体相关规则
  createEnumRule('fw','font-weight',['100','200','300','400','500','600','700','800','900','bold']),
  {
    pattern: /^line-(\d+)$/,
    generate: (match) => `line-height: ${match[1]};`
  },
  {
    pattern: /^clamp-(\d+)$/,
    generate: (match) => `display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: ${match[1]}; overflow: hidden;`
  },

  // Border 相关规则
  {
    pattern: /^rounded-(\d+)$/,
    generate: (match, config) => `border-radius: ${match[1]}${config.units.default};`
  },
  {
    pattern: /^border-(\d+)$/,
    generate: (match, config) => `border-width: ${match[1]}${config.units.borderWidth};`
  },

  {
    pattern: /^border-(.+)$/,
    generate: (match, config) => parseColorValue(match[1], 'border-color', config)
  },

  // Opacity 规则
  {
    pattern: /^opacity-(\d+)$/,
    generate: (match) => `opacity: ${parseInt(match[1]) / 100};`
  },

  // Width & Height full 规则
  {
    pattern: /^w-full$/,
    generate: () => `width: 100%;`
  },
  {
    pattern: /^h-full$/,
    generate: () => `height: 100%;`
  },

  // Viewport width & height rules
  {
    pattern: /^w-screen$/,
    generate: () => `width: 100vw;`
  },
  {
    pattern: /^h-screen$/,
    generate: () => `height: 100vh;`
  },
  {
    pattern: /^min-w-screen$/,
    generate: () => `min-width: 100vw;`
  },
  {
    pattern: /^min-h-screen$/,
    generate: () => `min-height: 100vh;`
  },
  {
    pattern: /^max-w-screen$/,
    generate: () => `max-width: 100vw;`
  },
  {
    pattern: /^max-h-screen$/,
    generate: () => `max-height: 100vh;`
  },

  // Border radius full (圆形)
  {
    pattern: /^rounded-full$/,
    generate: () => `border-radius: 9999px;`
  },


  // Transform 规则
  {
    pattern: /^rotate-(-?\d+)$/,
    generate: (match) => `transform: rotate(${match[1]}deg);`
  },
  {
    pattern: /^scale-(-?\d+)$/,
    generate: (match) => `transform: scale(${match[1]});`
  },

  // Box-shadow 规则
  {
    pattern: /^shadow-(sm|md|lg|xl|none)$/,
    generate: (match) => {
      const shadows = {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        none: 'none'
      };
      return `box-shadow: ${shadows[match[1]]};`;
    }
  },

  // Transition 规则
  {
    pattern: /^transition-(none|all|fast|slow)$/,
    generate: (match) => {
      const transitions = {
        none: 'none',
        all: 'all 0.3s ease',
        fast: 'all 0.15s ease',
        slow: 'all 0.5s ease'
      };
      return `transition: ${transitions[match[1]]};`;
    }
  },

  // 文本装饰
  {
    pattern: /^(underline|line-through|no-underline)$/,
    generate: (match) => `text-decoration: ${match[1] === 'no-underline' ? 'none' : match[1]};`
  },



  // White-space 规则
  {
    pattern: /^(whitespace|nowrap|pre|pre-line|pre-wrap)$/,
    generate: (match) => `white-space: ${match[1] === 'whitespace' ? 'normal' : match[1]};`
  },


  // Pointer-events 规则
  {
    pattern: /^pointer-(events|none|auto)$/,
    generate: (match) => `pointer-events: ${match[1] === 'events' ? 'auto' : match[1]};`
  },


  // 滚动条显示
  {
    pattern: /^scrollbar-(hide|show)$/,
    generate: (match) => match[1] === 'hide' ?
      `::-webkit-scrollbar { display: none; } scrollbar-width: none;` :
      `scrollbar-width: auto;`
  },
];

module.exports = rules;