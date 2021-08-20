import parse from 'mini-html-parser2';
import { getJsonDom } from '../../utils';

/**
 * 解析 json，按格式渲染，目前支持最简单的 json，有环状的暂时不考虑，现在也不会出现
 */
Component({
  mixins: [],
  data: {
    sourceCode: []
  },
  props: {
    value: {},
    className: '',
    copyVisible: false
  },
  didMount() {
    this.render();
  },
  didUpdate() {
    this.render();
  },
  didUnmount() {},
  methods: {
    render() {
      const { value } = this.props;
      const dom = getJsonDom(value);

      if (dom.length > 0) {
        // 将 html 字符串解析成 mini node
        parse(dom, (err, nodes) => {
          if (!err) {
            this.setData({
              sourceCode: nodes,
            });
          } else {
            this.setData({
              sourceCode: [],
            });
          }
        });
      }
    }
  },
});
