import Vue from "vue";

import {
  Dialog,
  Input,
  InputNumber,
  Checkbox,
  Select,
  Option,
  Button,
  Form,
  FormItem,
  Row,
  Col,
  MessageBox,
  Message,
} from "element-ui";

Vue.use(Dialog);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(Select);
Vue.use(Option);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Row);
Vue.use(Col);

Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
