<script setup lang="ts">
import { getCurrentInstance, reactive, watch } from 'vue'

const { proxy: $vm } = getCurrentInstance()

const props = defineProps({
  edition: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['event'])

const data = reactive({
  editionList: [{ name: '基础版' }, { name: '高级版' }, { name: '旗舰版' }],
  selectEdition: '',
})

watch(() => /* Warn: Unknown source: edition */ props.edition, () => {
  select()
})

function choseEdition(item) {
  if ( /* Warn: Unknown source: edition */ $vm.edition === '旗舰版' && item.name === '旗舰版') {
    data.selectEdition = item.name
    emit('event', item)
  } else if ( /* Warn: Unknown source: edition */ $vm.edition === '高级版' && item.name !== '基础版') {
    data.selectEdition = item.name
    emit('event', item)
  } else if ( /* Warn: Unknown source: edition */ $vm.edition === '基础版' || /* Warn: Unknown source: edition */ $vm.edition === '') {
    data.selectEdition = item.name
    emit('event', item)
  }
}

function select() {
  if ( /* Warn: Unknown source: edition */ $vm.edition !== '') {
    data.selectEdition = /* Warn: Unknown source: edition */ $vm.edition
    const item = {
      name: data.selectEdition,
    }
    emit('event', item)
  }
}
</script>

<template>
  <div class="edition">
    <div v-for="(item, index) in data.editionList" :key="index" class="renew-price-item" :class="data.selectEdition === item.name
      ? 'eaActive'
      : item.edition === '旗舰版' && item.name !== '旗舰版'
        ? 'disable-all'
        : edition === '高级版' && item.name === '基础版'
          ? 'disalbe'
          : ''
      " @click="choseEdition(item)">
      <strong>{{ item.name }}</strong>
      <div v-if="edition === item.name">
        (当前版本)
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.edition {
  width: 92%;
  display: flex;

  .eaActive {
    width: 216px;
    height: 100px;
    background-color: #ffffff;
    border-radius: 4px;
    border: solid 1px #1bc0d5 !important;
    position: relative;
  }

  .eaActive strong:before {
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

  .eaActive div {
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
      text-align: center;
      font-size: 18px;
      line-height: 100px;
      display: block;
      color: #323232;
    }

    div {
      text-align: center;
      margin-top: -38px;
      font-size: 14px;
    }

    &:hover {
      border: solid 1px #1bc0d5;
    }

    &:hover strong {
      color: #1cc0d5;
    }

    &:hover div {
      color: #1cc0d5;
    }

    &:first-child {
      margin-left: 0;
    }
  }

  .disable-all {
    cursor: not-allowed !important;

    &:hover strong {
      color: #333 !important;
    }

    &:hover div {
      color: #333 !important;
    }

    &:hover {
      border: solid 1px #dfdfdf !important;
    }
  }

  .disalbe {
    cursor: not-allowed !important;

    &:hover strong {
      color: #333 !important;
    }

    &:hover div {
      color: #333 !important;
    }

    &:hover {
      border: solid 1px #dfdfdf !important;
    }
  }
}
</style>
