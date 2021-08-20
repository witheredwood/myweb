import { log } from '../../utils';

Component({
  // minxin 方便复用代码
  mixins: [],
  data: {},
  // 可给外部传入的属性添加默认值
  props: { 
    current: 0,
    data: []
   },
  didMount() {},
  didUpdate(){},
  didUnmount(){},
  methods: {
    onPreviousStep() {
      log.info('prev');
      const { data, current, onChange } = this.props;
      if (current > 0 && onChange) {
        onChange({ current: current - 1 });
      } 
    },
    onNextStep() {
      log.info('next');
      const { data, current, onChange } = this.props;
      if (current < data.length - 1 && onChange) {
        onChange({ current: current + 1 });
      } else {
        my.navigateBack({
          delta: 1
        })
      }
    }
  },
})
