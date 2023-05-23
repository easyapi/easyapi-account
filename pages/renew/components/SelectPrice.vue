<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps({
  priceList:[]
})

const emit = defineEmits(['event'])

const data = reactive({
  selectMoney: props.priceList,
})

watch(() => props.priceList, (v) => {
  return (data.selectMoney = v)
})

/**
* 选择服务价格
*/
function selectMoneyFn() {
  // data.selectMoney = item.num
  emit('event')
}

function reset() {
  data.selectMoney = props.priceList
}
reset()

</script>

<template>
  <div class="renew-price">
    <div v-for="(item, index) in props.priceList" :key="index" class="renew-price-item"
      :class="{ eaActive: data.selectMoney === item.num }" @click="selectMoneyFn(item)">
      <strong>{{ item.num }}{{ item.type === 2 ? '次' : '个月' }}&nbsp;&nbsp;￥{{ item.price.toFixed(2) }}</strong>
      <p>￥{{ item.unitPrice }}/{{ item.type === 2 ? '次' : '月' }}</p>
    </div>
  </div>
</template>
  
<style lang="scss" scoped>
.renew-price {
  width: 92%;
  height: auto;
  display: flex;

  .eaActive {
    width: 216px;
    height: 100px;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #1bc0d5 !important;
    position: relative;
  }

  .eaActive p:before {
    position: absolute;
    left: 195px;
    top: 79px;
    content: ' ';
    width: 20px;
    height: 20px;
    background-image: url('../../../assets/images/checked.png');
    background-size: cover;
  }

  .eaActive strong {
    color: #1cc0d5 !important;
  }

  .renew-price-item {
    width: 216px;
    height: 100px;
    text-align: center;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #dfdfdf;
    margin-left: 18px;
    cursor: pointer;

    strong {
      font-size: 18px;
      line-height: 30px;
      padding-top: 20px;
      display: block;
      color: #323232;
    }

    p {
      font-size: 14px;
      color: #888888;
    }

    &:hover {
      border: solid 1px #1bc0d5;
    }

    &:hover strong {
      color: #1cc0d5;
    }

    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
