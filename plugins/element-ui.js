import Vue from 'vue'

import {
  Input,
  Checkbox,
  Select,
  Option,
  Button,
  Form,
  FormItem,
  Row,
  Col,
  Message
} from 'element-ui'

Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Row)
Vue.use(Col)

Vue.prototype.$message = Message
