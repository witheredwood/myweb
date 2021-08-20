Component({
  mixins: [],
  data: {},
  props: {
    name: '',
    action: '',
    disabled: false,
    loading: false,
  },
  didMount() {},
  didUpdate() {},
  didUnmount() {},
  methods: {
    onClick() {
      const { onTry } = this.props;
      if(onTry) {
        onTry(this.props.action);
      }
    }
  },
});
